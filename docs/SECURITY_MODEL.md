# ReleaseVerdict security model

## Threats addressed

- A caller cannot claim that an arbitrary host is an official publisher: the URI must match the registered HTTPS origin and path boundary, and the record signature must verify against the publisher's registered Ed25519 public key.
- A caller cannot silently replace a record after submission: the exact response body is pinned by SHA-256.
- A record cannot be relabeled as another source or time period: publisher ID, source group, record ID, version, timestamps, key ID, payload hash, and Ed25519 signature are checked.
- One source cannot satisfy both independent roles: artifact and security records require different source groups and distinct references.
- An appeal cannot recycle either original authority: it requires a third source group.
- A leader cannot unilaterally choose a verdict: a validator independently reruns the evidence fetch, signature verification, and evaluation, and the contract compares a canonical tuple.
- A reviewed release cannot be changed without a new appeal/review cycle: submitting an appeal clears the old consensus binding and decision.
- A caller cannot finalize early: finalization requires a reviewed, consensus-bound release and an expired challenge window.

## Cryptographic control

Publisher registration stores a validated Ed25519 public key. Each fetched record is verified inside GenVM against canonical payload bytes, with strict point decoding, small-order rejection, and scalar-range checks. The validator repeats the same verification during independent re-evaluation. A signature string or self-computed hash without a valid registered-key signature is rejected.

## Trust boundaries

External web records remain untrusted data. Prompt text treats records as data and ignores embedded instructions. The owner controls registered publishers and policies; the publisher controls its signing key and the content served under its registered HTTPS path. Key rotation requires registering a new publisher identity or a versioned key identifier before using new records.

## Operational conditions

HTTPS endpoints must remain available and serve immutable or content-addressed records during review. Network capacity and validator liveness are GenLayer operational conditions; they can delay a transaction but cannot make an invalid signature valid.
