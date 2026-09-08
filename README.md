# ReleaseVerdict

ReleaseVerdict is a standalone GenLayer Intelligent Contract for deciding whether a software release satisfies a registered release policy. It is designed as a reusable release-governance primitive: a maintainer opens a release, attaches two independently published records, requests a GenLayer consensus evaluation, optionally submits one appeal record from a third source group, and finalizes the canonical verdict after the appeal window.

The contract does not custody funds. The owner registers each publisher with a safe HTTPS origin/path prefix, an Ed25519 public key, and a key identifier. Every evidence URI must remain under its registered authority, every body is pinned by SHA-256, record metadata must match the on-chain reference, the signed payload hash is recomputed, and the detached Ed25519 signature is verified against the registered key. This makes provenance and issuer authenticity reviewable before nondeterministic evaluation.

## Why GenLayer consensus matters

The release and security records are live public data. `resolve_release` snapshots the registered policy, release version, evidence references, publisher authorities, and appeal evidence. A leader fetches and evaluates those records through GenLayer nondeterminism. The validator independently repeats the fetch and evaluation, and only a canonical result with matching decision, confidence, reason, and evidence hashes is accepted. The contract stores only the canonical result; finalization is deterministic and blocked while the challenge window is open.

## Contract lifecycle

`register_policy` and `register_publisher` are owner-controlled registries. A user calls `open_release`, `attach_evidence`, and `start_review`. `resolve_release` stores `PROMOTE`, `BLOCK`, `NEEDS_REVIEW`, or `ERROR`. `submit_appeal` requires a third source group and invalidates the previous consensus result. The proposer starts a fresh review, and `finalize_release` marks the latest consensus-bound verdict final after expiry.

## Layout

- `contracts/release_verdict.py` — canonical deployable source.
- `studio_bradbury/release_verdict.py` — byte-for-byte Studio copy.
- `tests/` — AST, lifecycle, consensus, and authority-boundary tests.
- `docs/` — evidence schema, security model, test matrix, and Bradbury runbook.
- `examples/` — safe example evidence records and call-shape guidance.
- `SUBMISSION_BRIEF.md` — portal-ready text and evidence checklist.

## Verify locally

```bash
npm run verify
```

The deployment source and Studio source must remain identical. Generate the source manifest immediately before deployment and record the resulting SHA-256 in the deployment log.

## Bradbury deployment

The v2 Bradbury deployment is [`0x12099eDc750360aE0321eff33c90E9D84cE772B2`](https://explorer-bradbury.genlayer.com/address/0x12099eDc750360aE0321eff33c90E9D84cE772B2). Its complete live verification record is maintained in [`docs/DEPLOYMENT_LOG_BRADBURY.md`](docs/DEPLOYMENT_LOG_BRADBURY.md). The deployed source and Studio source are byte-for-byte identical. The live smoke path covers publisher-key registration, signed evidence verification, two consensus resolutions with a third-source appeal, and delayed finalization.

## Cryptographic verification boundary

The contract uses a self-contained Ed25519 verifier implemented with the Python standard library available inside GenVM. Publishers register a 32-byte public key as lowercase hexadecimal. Evidence signatures are 64-byte Ed25519 signatures, also lowercase hexadecimal, over the canonical JSON record after removing `signature` and `signed_payload_hash`. Invalid keys, malformed points, small-order points, non-canonical scalars, wrong signatures, and tampered payloads fail closed. HTTPS authority binding and exact body hashes remain additional controls; neither is used as a substitute for signature verification.
