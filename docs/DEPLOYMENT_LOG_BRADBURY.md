# Bradbury deployment log

This file is updated only after the live deployment and smoke test. It records the exact source hash, contract address, fixture commit, transaction IDs, execution statuses, and final read-back values. Empty fields are intentional until deployment is complete.

## Identity

- Network: GenLayer Bradbury
- Contract: `ReleaseVerdict`
- Contract address: `0x26BA1d035bB88e0c58630DCABB6d13F0359c3FE3`
- Deployment transaction: `0x4faab19df01e852493bc68fb81e4f8bcc7cf3e2f222bed5229d5e5b23ce7d2a9`
- Canonical source SHA-256: `747a30a83ce3dd353ee6f4980ce01c31d48d4705ef25258c6279aaef0b0ccafc`
- Studio source SHA-256: `747a30a83ce3dd353ee6f4980ce01c31d48d4705ef25258c6279aaef0b0ccafc`
- Fixture repository/commit: `https://github.com/Manablaq/release-verdict-fixtures` / `da10c0c`

## Accepted operations

| Operation | Transaction | Consensus | Execution | Read-back |
| --- | --- | --- | --- | --- |
| deploy | `0x4faab19df01e852493bc68fb81e4f8bcc7cf3e2f222bed5229d5e5b23ce7d2a9` | ACCEPTED | FINISHED_WITH_RETURN | `0x26BA1d035bB88e0c58630DCABB6d13F0359c3FE3` |
| register policy | `0xddb6cc4a6808b4e7f8e910365c8c89c8575654d6c611e7a10439dad52f429e2a` | ACCEPTED | FINISHED_WITH_RETURN | `release-policy-v1` registered |
| register artifact publisher | prior smoke transaction | ACCEPTED | FINISHED_WITH_RETURN | `artifact-fixtures` registered |
| register security publisher | prior smoke transaction | ACCEPTED | FINISHED_WITH_RETURN | `security-fixtures` registered |
| register appeal publisher | `0xf7cdefbf9d32f5a999094559e3b2d2e0ac0760f4c67340c966c08eb1be0ca7ea` | ACCEPTED | FINISHED_WITH_RETURN | `appeal-fixtures` registered |
| open release | `0xfee311f72d45820c52f51e7abd0da5faba72684801a510d7368001192447ebe5` | ACCEPTED | FINISHED_WITH_RETURN | release `1` opened |
| attach evidence | `0xfdaff4cbaee2d0301efc3b9ae4e084f8a315e937ef3bb514dd266e636d91fa3e` | ACCEPTED | FINISHED_WITH_RETURN | artifact + security evidence attached |
| start review | `0xee91981ba5889d096e9013ddf4d2623abaac84a600c61c031168a83591730701` | ACCEPTED | FINISHED_WITH_RETURN | release `1` reviewing |
| resolve release | `0x418c37ad05e1fa291eb033dde4b9b0cd8a3e80700420d054ae88496044a17d98`; retry `0x930ecb3984750343e226cbfb59d1688cf867648b19e937972c34342fa457763d` | leader timeout in receipt; state later became reviewed | pending explorer verification | initial consensus eventually observed before appeal |
| submit appeal | `0x60e3fc54e97fa04b6b65dfcda758db40f5ba30efede4a4d6a3c015e141fad7a3` | ACCEPTED | FINISHED_WITH_RETURN | appeal recorded; revision `2` |
| fresh start review | `0x7e7daa26cc5973df7e198512504da2bd54dff975344b02062b4bbef42b5b365f` | ACCEPTED | FINISHED_WITH_RETURN | release `1` reviewing again |
| fresh resolve | pending | pending | pending | pending |
| finalize release | pending | pending | pending | pending |

## Result

- Current status: `REVIEWING` after the third-source appeal and fresh review-start transaction.
- Remaining live test: fresh resolve, then finalization after the new challenge deadline.
- Final status: pending until the worker account is refilled.
- Final decision: pending
- Final evidence revision: `2` after appeal
- Final resolution count: `1` before appealed resolve
