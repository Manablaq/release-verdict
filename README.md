# ReleaseVerdict

ReleaseVerdict is a standalone GenLayer Intelligent Contract for deciding whether a software release satisfies a registered release policy. It is designed as a reusable release-governance primitive: a maintainer opens a release, attaches two independently published records, requests a GenLayer consensus evaluation, optionally submits one appeal record from a third source group, and finalizes the canonical verdict after the appeal window.

The contract does not custody funds and does not pretend that a caller-provided signature string proves issuer identity. The owner registers publisher authorities with safe HTTPS origin/path prefixes. Every evidence URI must remain under its registered authority, every body is pinned by SHA-256, record metadata must match the on-chain reference, and the signed payload hash is recomputed. This makes provenance and evidence integrity reviewable before nondeterministic evaluation.

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

## Important limitation

The contract uses authority-bound HTTPS paths plus exact body hashes and signed-payload consistency. `signature` is deliberately required as a record field, but it is not treated as cryptographic proof by itself. A deployment that needs cryptographic issuer identity should extend the publisher registry with a supported public-key/signature primitive and verify it inside the contract before acceptance.
