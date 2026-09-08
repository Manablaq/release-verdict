# Bradbury deployment log

This file records the corrected ReleaseVerdict v2 source, immutable signed fixtures, accepted Bradbury transactions, and final read-back. The previous authority-only deployment is historical and is not the deployment for review.

## Identity

- Network: GenLayer Bradbury
- Contract: `ReleaseVerdict v2`
- Contract address: `0x12099eDc750360aE0321eff33c90E9D84cE772B2`
- Explorer: `https://explorer-bradbury.genlayer.com/address/0x12099eDc750360aE0321eff33c90E9D84cE772B2`
- Deployment transaction: `0x6c72044f9db13b1419fb501524f543234c28169e31f8e53f50f99877f47b6be1`
- Canonical source SHA-256: `b02df2ad9868cbd0fe64c917bc017b0719ae5d16d4615b0289e9b14dcab23f48`
- Studio source SHA-256: `b02df2ad9868cbd0fe64c917bc017b0719ae5d16d4615b0289e9b14dcab23f48`
- Fixture repository/commit: `https://github.com/Manablaq/release-verdict-fixtures` / `1cc8082`
- Fixture body SHA-256: artifact `34ff80dc42856acaf6dd376a1050158ce3432787f97c878c4661f597fe92f9c1`; security `71b349a786ed6326364727dbbb8e1701fb60dd87f96256aa616e5aa2dc30c1c9`; appeal `33f2fa03f0ed732428904837932e904fc2f7cd1f25de55527c7837505538ae1e`

## Accepted operations

| Operation | Transaction | Consensus | Execution | Read-back |
| --- | --- | --- | --- | --- |
| deploy | `0x6c72044f9db13b1419fb501524f543234c28169e31f8e53f50f99877f47b6be1` | ACCEPTED | FINISHED_WITH_RETURN | v2 address deployed |
| register policy | `0xddb6cc4a6808b4e7f8e910365c8c89c8575654d6c611e7a10439dad52f429e2a` | ACCEPTED | FINISHED_WITH_RETURN | `release-policy-v1` registered |
| register artifact publisher | `0x53c0ee91d0f5ffdefe29c730e0489aed4079cb3d7773fdeab9f14284b0074d88` | ACCEPTED | FINISHED_WITH_RETURN | Ed25519 key registered |
| register security publisher | `0xc05261a91aa37f914eb419e50699edae7fea77774d2c69021b207b3980d1d6e4` | ACCEPTED | FINISHED_WITH_RETURN | Ed25519 key registered |
| register appeal publisher | `0x45a52fb3511afe9c311f0840da93bb40cae64452d8373a8a63e5d02be60c51e7` | ACCEPTED | FINISHED_WITH_RETURN | Ed25519 key registered |
| register policy | `0x7bbcbf583c3e193c7dd2ad1e7d0ce78095c731d88307035c81f6bd983dba68cf` | ACCEPTED | FINISHED_WITH_RETURN | policy registered |
| open release | `0x579255740d16b50c66484a0bf3ae11a4f07a708a09a782b045a23989539f464a` | ACCEPTED | FINISHED_WITH_RETURN | release `1` opened |
| attach evidence | `0xcee3a2cb759c88ab7da3c0ba18d0ca57ce7fc894327c6813b72c44a3fc735725` | ACCEPTED | FINISHED_WITH_RETURN | signed artifact + security evidence attached |
| start initial review | `0x44ac4de83f59589341dae50933949d106e9c4cf9b6981afed731d0ab96ca1be6` | ACCEPTED | FINISHED_WITH_RETURN | review started |
| resolve initial review | `0x1386d10a1123050db3fe2de9b93c2e9fc2240ae6cf892d424e786c2c6539db1a` | ACCEPTED | FINISHED_WITH_RETURN | `PROMOTE`, confidence `9500` |
| submit third-source appeal | `0xcb1c6cd4600c4123c75214853b0bb4c6ecdf0eab80e43a9499e34512056e5801` | ACCEPTED | FINISHED_WITH_RETURN | old consensus cleared; revision `2` |
| start appealed review | `0xaf7e3170d729780ae4b87a48d008ff002fa46ac27ed968f9772a81d70f4e7758` | ACCEPTED | FINISHED_WITH_RETURN | appealed review started |
| resolve appealed review | `0xb17223e5da0fa536897577a0289a6fa968562470b421e9d72f5f412805ffc086` | ACCEPTED | FINISHED_WITH_RETURN | `PROMOTE`, confidence `9500`, resolution `2` |
| finalize release | `0x402b4f9514d639bb20b7b6e455421190e157b26d8394eac70ef4d63361c5e089` | ACCEPTED | FINISHED_WITH_RETURN | status `FINAL` |

## Result

- Current status at final read: `FINAL` (`6`)
- Decision: `PROMOTE` (`1`)
- Confidence: `9500`
- Consensus bound: `true`
- Evidence revision: `2`
- Resolution count: `2`
- Challenge deadline: `1788886319`
- `is_final(1)`: `true`
- `is_promoted(1)`: `true`
- Finalization transaction: `0x402b4f9514d639bb20b7b6e455421190e157b26d8394eac70ef4d63361c5e089`
