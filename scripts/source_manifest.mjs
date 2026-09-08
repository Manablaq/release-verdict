import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync("contracts/release_verdict.py");
const studio = readFileSync("studio_bradbury/release_verdict.py");
const digest = (value) => createHash("sha256").update(value).digest("hex");
if (digest(source) !== digest(studio)) {
  throw new Error("canonical and Studio contract sources differ");
}
const manifest = {
  contract: "ReleaseVerdict",
  source_sha256: digest(source),
  studio_sha256: digest(studio),
  generated_at: new Date().toISOString(),
};
writeFileSync("SOURCE_MANIFEST.json", `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
