# Evidence record specification

Each evidence URL must be HTTPS, must be under the exact registered publisher origin/path prefix, and must have no query, fragment, userinfo, backslash, percent encoding, ambiguous dot segment, or unsafe authority form. The on-chain hash is SHA-256 of the exact response body bytes decoded as UTF-8.

The decoded JSON record must contain:

```json
{
  "publisher_id": "registry",
  "source_group": "package-registry",
  "record_id": "release-example-1",
  "version": 1,
  "published_at": 1788730000,
  "valid_until": 1788730900,
  "publisher_key_id": "registry-key-1",
  "signature": "128-lowercase-hex-characters-ed25519-signature",
  "signed_payload_hash": "sha256-of-record-without-signature-fields",
  "project_id": "example/project",
  "release_version": "1.4.0",
  "release_status": "published",
  "security_status": "clear",
  "facts": ["untrusted factual content"]
}
```

`signature` is a 64-byte Ed25519 signature encoded as 128 lowercase hexadecimal characters. It signs the canonical UTF-8 JSON payload after removing `signature` and `signed_payload_hash`; objects use recursively sorted keys and compact separators. `signed_payload_hash` is recomputed over those exact canonical bytes. The registered publisher public key is a 32-byte Ed25519 key encoded as 64 lowercase hexadecimal characters. The body hash is computed over the complete response body before JSON parsing. Metadata mismatches, missing fields, publisher mismatches, body changes, invalid payload hashes, malformed keys, and invalid signatures fail closed.

Use different registered `source_group` values for artifact and security evidence. An appeal must use a third group. Evidence should be immutable or content-addressed and have a validity window longer than the review window.
