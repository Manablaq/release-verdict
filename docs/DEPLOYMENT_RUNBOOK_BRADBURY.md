# Bradbury deployment runbook

1. Run `npm run verify` from the repository root.
2. Generate `SOURCE_MANIFEST.json` with `npm run source:manifest`; commit the source and Studio copy before deployment.
3. Deploy the exact contents of `contracts/release_verdict.py` to Bradbury using the installed GenLayer CLI. Record the contract address and deploy transaction.
4. Register one policy and at least three publisher authorities with distinct source groups. Authority prefixes must point to immutable public fixture records.
5. Open a release with a short test TTL, attach artifact and security records, and start review.
6. Resolve the release and inspect `get_release`. Confirm the decision, evidence revision, resolution count, and consensus binding.
7. Submit an appeal from the third authority, start a fresh review, and resolve again. Confirm the old decision was cleared before the new consensus result.
8. After the challenge deadline, finalize and confirm `is_final` and `is_promoted`.
9. Record every accepted transaction, execution status, source hash, and final read result in `DEPLOYMENT_LOG_BRADBURY.md`.

Do not submit the portal entry until the explorer contract source, repository source, and manifest hash all match. Accepted transaction submission is not the same as final execution; inspect execution status and returned state for each live operation.
