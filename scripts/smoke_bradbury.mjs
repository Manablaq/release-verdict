import keytar from "keytar";
import { createAccount, createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const RPC = process.env.GENLAYER_RPC || "https://rpc-bradbury.genlayer.com";
const CONTRACT = process.env.GENLAYER_CONTRACT;
const ACCOUNT_NAME = process.env.GENLAYER_ACCOUNT || "worker";
const FIXTURE_BASE = process.env.RELEASE_VERDICT_FIXTURE_BASE;
if (!CONTRACT) throw new Error("Set GENLAYER_CONTRACT to the deployed ReleaseVerdict address");
if (!FIXTURE_BASE) throw new Error("Set RELEASE_VERDICT_FIXTURE_BASE to the public raw fixture directory");

const privateKey = await keytar.getPassword("genlayer-cli", `account:${ACCOUNT_NAME}`);
if (!privateKey) throw new Error(`No cached key for '${ACCOUNT_NAME}'. Unlock it with the GenLayer CLI first.`);
const account = createAccount(privateKey);
const client = createClient({ chain: testnetBradbury, endpoint: RPC, account });
const feeValue = BigInt(process.env.GENLAYER_FEE_VALUE_WEI || "1000000000000000000");
const gasMargin = BigInt(process.env.GENLAYER_GAS_MARGIN || "200000");
const gasLimit = process.env.GENLAYER_GAS_LIMIT ? BigInt(process.env.GENLAYER_GAS_LIMIT) : null;
const originalEstimate = client.estimateTransactionGas.bind(client);
client.estimateTransactionGas = async (request) => {
  const estimate = await originalEstimate(request);
  return gasLimit ?? estimate + gasMargin;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const errorText = (error) => [error?.message, error?.details, error?.cause?.message, error?.cause?.details].filter(Boolean).join(" ");
const retryAfterMs = (error) => Number(error?.cause?.data?.retryAfterMs ?? error?.data?.retryAfterMs) || 1000;

async function write(functionName, args) {
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      return await client.writeContract({ address: CONTRACT, functionName, args, value: feeValue });
    } catch (error) {
      const message = errorText(error).toLowerCase();
      if (!(message.includes("capacity") || message.includes("rate limit")) || attempt === 10) throw error;
      const delay = Math.min(Math.max(retryAfterMs(error) + 250, 750), 10000);
      console.warn(`Bradbury capacity reached; retrying ${functionName} in ${delay}ms.`);
      await sleep(delay);
    }
  }
  throw new Error(`Unable to write ${functionName}`);
}

async function accepted(label, functionName, args) {
  const hash = await write(functionName, args);
  console.log(`${label}: ${hash}`);
  const receipt = await client.waitForTransactionReceipt({ hash, status: "ACCEPTED", retries: 120, interval: 5000 });
  const transaction = await client.getTransaction({ hash });
  const status = transaction.statusName || receipt.status_name || receipt.status || "ACCEPTED";
  const execution = transaction.txExecutionResultName || receipt.txExecutionResultName || "UNKNOWN";
  console.log(`${label} accepted: ${status} / ${execution}`);
  if (execution === "FINISHED_WITH_ERROR") throw new Error(`${label} failed at contract execution: ${hash}`);
  return { label, functionName, hash, status, execution };
}

async function read(functionName, args) {
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const originalConsoleError = console.error;
    try {
      console.error = () => {};
      return await client.readContract({ address: CONTRACT, functionName, args });
    }
    catch (error) {
      if (attempt === 12) throw error;
      await sleep(1500);
    } finally {
      console.error = originalConsoleError;
    }
  }
}

async function fetchFixture(name) {
  const uri = `${FIXTURE_BASE.replace(/\/$/, "")}/${name}`;
  const response = await fetch(uri);
  if (!response.ok) throw new Error(`Fixture fetch failed ${response.status}: ${uri}`);
  const body = await response.text();
  return { uri, hash: createHash("sha256").update(body).digest("hex"), record: JSON.parse(body) };
}

const artifact = await fetchFixture("artifact-v1.json");
const security = await fetchFixture("security-v1.json");
const appeal = await fetchFixture("appeal-v1.json");
const publishedAt = 1789000000n;
const validUntil = 1792000000n;
const transactions = [];
const report = { contract: CONTRACT, account: account.address, transactions, checks: [] };

for (const [label, args] of [
  ["register artifact publisher", ["artifact-fixtures", "artifact-registry", new URL(".", artifact.uri).toString(), "artifact-fixtures-key-1"]],
  ["register security publisher", ["security-fixtures", "security-advisory", new URL(".", security.uri).toString(), "security-fixtures-key-1"]],
  ["register appeal publisher", ["appeal-fixtures", "independent-review", new URL(".", appeal.uri).toString(), "appeal-fixtures-key-1"]],
]) {
  const publisherId = args[0];
  try { await read("get_publisher", [publisherId]); console.log(`${label}: already registered`); }
  catch { transactions.push(await accepted(label, "register_publisher", args)); }
}

try { await read("get_policy", ["release-policy-v1"]); console.log("register release policy: already registered"); }
catch {
  transactions.push(await accepted("register release policy", "register_policy", [
    "release-policy-v1",
    "Promote only when the artifact is published for the requested project and version, independent security evidence reports clear status and zero unresolved critical advisories, and the sources corroborate the same release. Block a clearly violated criterion; otherwise use needs_review.",
  ]));
}

let releaseId;
try {
  const existing = await read("get_release", [1n]);
  releaseId = 1n;
  console.log("release 1: already opened");
  if (Number(existing.status) === 6) throw new Error("release 1 is already final; deploy a fresh contract for a clean smoke test");
} catch {
  const opened = await accepted("open demo release", "open_release", ["release-verdict/demo", "1.0.0", "release-policy-v1", 900n]);
  releaseId = 1n;
  report.open_transaction = opened.hash;
}

const artifactBase = new URL(".", artifact.uri).toString();
const securityBase = new URL(".", security.uri).toString();
const appealBase = new URL(".", appeal.uri).toString();
let release = await read("get_release", [releaseId]);
if (Number(release.status) === 1) {
  transactions.push(await accepted("attach release evidence", "attach_evidence", [
    releaseId, artifact.uri, artifact.hash, "artifact-fixtures", artifact.record.record_id, 1n, publishedAt, validUntil,
    security.uri, security.hash, "security-fixtures", security.record.record_id, 1n, publishedAt, validUntil,
  ]));
  release = await read("get_release", [releaseId]);
}
report.checks.push({ check: "evidence-attached", pass: [2, 3, 4, 5].includes(Number(release.status)), status: String(release.status), revision: String(release.evidence_revision) });
if (Number(release.status) === 2) {
  transactions.push(await accepted("start release review", "start_review", [releaseId]));
  release = await read("get_release", [releaseId]);
}
if (Number(release.status) === 3 || Number(release.status) === 7) {
  transactions.push(await accepted("resolve initial release", "resolve_release", [releaseId]));
  release = await read("get_release", [releaseId]);
}
report.checks.push({ check: "initial-consensus", pass: Number(release.status) === 4 && Boolean(release.consensus_bound), status: String(release.status), decision: String(release.decision), consensus_bound: Boolean(release.consensus_bound) });
if (Number(release.status) === 4) {
  transactions.push(await accepted("submit third-source appeal", "submit_appeal", [
    releaseId, appeal.uri, appeal.hash, "appeal-fixtures", appeal.record.record_id, 1n, publishedAt, validUntil,
    "Third-source corroboration requested for the release record.",
  ]));
  release = await read("get_release", [releaseId]);
}
report.checks.push({ check: "appeal-reset", pass: Number(release.status) === 5 && !Boolean(release.consensus_bound), status: String(release.status), revision: String(release.evidence_revision) });
if (Number(release.status) === 5) {
  transactions.push(await accepted("start appealed review", "start_review", [releaseId]));
  transactions.push(await accepted("resolve appealed release", "resolve_release", [releaseId]));
  release = await read("get_release", [releaseId]);
}
report.checks.push({ check: "appeal-consensus", pass: Number(release.status) === 4 && Boolean(release.consensus_bound) && Number(release.resolution_count) >= 2, status: String(release.status), decision: String(release.decision), resolutions: String(release.resolution_count) });

console.log(JSON.stringify({ ...report, final_read: release }, null, 2));
