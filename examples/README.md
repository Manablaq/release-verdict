# Example flow

The live flow is intentionally contract-only:

1. Register an artifact publisher, a security publisher, and a third appeal publisher.
2. Register a policy such as: “Promote only a published release whose independent security record reports clear status and zero unresolved critical advisories.”
3. Open `example/project` version `1.4.0`.
4. Attach the artifact and security records, then start and resolve review.
5. Optionally attach an appeal record from the third source group and repeat review.
6. Finalize after the challenge window.

The records in this directory are shape examples only. Before a live test, replace their timestamps and hashes with the exact immutable fixture response bodies and register matching authority prefixes.
