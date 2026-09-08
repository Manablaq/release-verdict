# Live Bradbury demo

Network: GenLayer Bradbury

Contract: [`0x26BA1d035bB88e0c58630DCABB6d13F0359c3FE3`](https://explorer-bradbury.genlayer.com/address/0x26BA1d035bB88e0c58630DCABB6d13F0359c3FE3)

Fixtures: [`Manablaq/release-verdict-fixtures`](https://github.com/Manablaq/release-verdict-fixtures), commit `da10c0c`

## Reproduce the live flow

```bash
export GENLAYER_CONTRACT=0x26BA1d035bB88e0c58630DCABB6d13F0359c3FE3
export RELEASE_VERDICT_FIXTURE_BASE=https://raw.githubusercontent.com/Manablaq/release-verdict-fixtures/main
GENLAYER_CONFIG_HOME=/private/tmp/agentlease-config.PX3N1l npm run smoke:bradbury
```

The smoke script is resumable and idempotent. It reads the existing publisher, policy, and release records before writing. It never creates a second release for the same demonstration, and it never resubmits an appeal already stored on-chain.

## Observed path

1. Three authorities were registered: artifact registry, security advisory, and independent review.
2. Policy `release-policy-v1` was registered.
3. Release `1` for `release-verdict/demo` version `1.0.0` was opened.
4. Artifact and security evidence were attached from different source groups.
5. Initial consensus resolved to `PROMOTE`.
6. A third-source appeal reset the old binding and incremented evidence revision to `2`.
7. The appealed review resolved again to `PROMOTE`, confidence `9500`, resolution count `2`.
8. Finalization is intentionally delayed until the appeal deadline; `is_final` must remain false before then.

The final verification step is `finalize_release(1)` after the displayed `challenge_deadline`, followed by `is_final(1) == true` and `is_promoted(1) == true`.
