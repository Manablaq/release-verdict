# ReleaseVerdict submission brief

## Contribution type

Intelligent Contracts

## Name

ReleaseVerdict

## Project overview (under 1000 characters)

ReleaseVerdict is a standalone GenLayer Intelligent Contract that turns independently published software-release and security records into a reusable, machine-readable release gate. An owner registers a policy and publisher authorities with Ed25519 public keys; a proposer opens a release and attaches two distinct evidence records. GenLayer consensus fetches and evaluates the live records, while a validator independently repeats the evaluation and must match the canonical decision, confidence, reason, and evidence hashes. Evidence URLs are restricted to registered HTTPS origin/path prefixes, exact response bodies are SHA-256 pinned, record metadata and signed-payload hashes are checked, and each signature is verified against its registered issuer key. An appeal requires a third source group. The latest consensus-bound result is PROMOTE, BLOCK, NEEDS_REVIEW, or ERROR and can only become final after the challenge window. The repository contains the deployable source, identical Studio copy, tests, evidence schema, security model, and Bradbury runbook.

## One-liner (under 180 characters)

Consensus-backed release gate that verifies publisher-bound artifact and security evidence, supports a third-source appeal, and finalizes a machine-readable promote/block verdict.

## Expected verification outcome (under 500 characters)

Open a release, attach artifact and security records from two registered source groups, start review, and resolve it on Bradbury. The explorer should show consensus execution and a stored PROMOTE/BLOCK/NEEDS_REVIEW result with matching evidence hashes. Submit a third-source appeal, resolve again, then finalize after the challenge window; `is_final` becomes true and `is_promoted` matches the final decision.

## Evidence URLs to provide after deployment

1. Public GitHub repository root.
2. Bradbury Explorer contract address: https://explorer-bradbury.genlayer.com/address/0x12099eDc750360aE0321eff33c90E9D84cE772B2

Repository: https://github.com/Manablaq/release-verdict

The source committed to GitHub and the deployed source must match byte-for-byte. Do not submit until `docs/DEPLOYMENT_LOG_BRADBURY.md` contains the new v2 live address, source hash, and accepted transaction results.
