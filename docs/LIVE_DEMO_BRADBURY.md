# Live Bradbury demo

Network: GenLayer Bradbury

Contract: [`0x12099eDc750360aE0321eff33c90E9D84cE772B2`](https://explorer-bradbury.genlayer.com/address/0x12099eDc750360aE0321eff33c90E9D84cE772B2)

Fixtures: [`Manablaq/release-verdict-fixtures`](https://github.com/Manablaq/release-verdict-fixtures), commit `1cc8082`

## Reproduce the live flow

```bash
export GENLAYER_CONTRACT=0x12099eDc750360aE0321eff33c90E9D84cE772B2
export RELEASE_VERDICT_FIXTURE_BASE=https://raw.githubusercontent.com/Manablaq/release-verdict-fixtures/1cc8082
npm run smoke:bradbury
```

The smoke script is resumable and idempotent. It reads the existing publisher, policy, and release records before writing. It never creates a second release for the same demonstration, and it never resubmits an appeal already stored on-chain.

## Observed path

1. Three authorities were registered with Ed25519 public keys: artifact registry, security advisory, and independent review.
2. Policy `release-policy-v1` was registered.
3. Release `1` for `release-verdict/demo` version `1.0.0` was opened.
4. Artifact and security evidence were attached from different source groups.
5. Initial consensus resolved to `PROMOTE`.
6. A third-source appeal reset the old binding and incremented evidence revision to `2`.
7. The appealed review resolved again to `PROMOTE`, confidence `9500`, resolution count `2`.
8. Finalization was intentionally delayed until the appeal deadline and completed in transaction `0x402b4f9514d639bb20b7b6e455421190e157b26d8394eac70ef4d63361c5e089`.

The corrected v2 run verified both reviews with valid Ed25519 signatures. The final verification returned `is_final(1) == true` and `is_promoted(1) == true`; `get_release(1)` returned status `6` (`FINAL`) and decision `1` (`PROMOTE`).
