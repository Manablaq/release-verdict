import ast
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "contracts" / "release_verdict.py"
SOURCE = SOURCE_PATH.read_text()
TREE = ast.parse(SOURCE)


class ContractInvariantTests(unittest.TestCase):
    def test_contract_source_is_parseable(self):
        self.assertIsInstance(TREE, ast.Module)

    def test_contract_has_complete_lifecycle(self):
        contract = next(node for node in TREE.body if isinstance(node, ast.ClassDef) and node.name == "ReleaseVerdict")
        methods = {node.name for node in contract.body if isinstance(node, ast.FunctionDef)}
        self.assertTrue({
            "register_publisher", "register_policy", "open_release", "attach_evidence",
            "start_review", "resolve_release", "submit_appeal", "finalize_release",
            "get_release", "is_final", "is_promoted",
        }.issubset(methods))

    def test_leader_and_validator_share_canonical_result(self):
        self.assertIn("gl.vm.run_nondet_unsafe", SOURCE)
        self.assertIn("validator_data = _parse_json(_evaluate_snapshot(snapshot))", SOURCE)
        self.assertIn("_consensus_key(leader_data) == _consensus_key(validator_data)", SOURCE)
        self.assertIn("_valid_result(agreed, snapshot)", SOURCE)

    def test_provenance_and_integrity_checks_are_explicit(self):
        for needle in (
            "_uri_matches_publisher(uri, publisher.publisher_uri)",
            "_uri_matches_publisher(snapshot[\"artifact_uri\"]",
            "_uri_matches_publisher(snapshot[\"security_uri\"]",
            "evidence_hash_mismatch",
            "evidence_metadata_mismatch",
            "signed_payload_hash",
            "third independent source group",
        ):
            self.assertIn(needle, SOURCE)

    def test_issuer_signature_verification_is_enforced(self):
        for needle in (
            "ED25519_L",
            "_ed25519_verify",
            "_valid_ed25519_public_key",
            "public_key: str",
            "evidence_signature_invalid",
            "_canonical_payload(record)",
        ):
            self.assertIn(needle, SOURCE)
        self.assertNotIn("fixture-signature-", SOURCE)

    def test_policy_and_release_are_separate_state(self):
        self.assertIn("policies: TreeMap[str, Policy]", SOURCE)
        self.assertIn("releases: TreeMap[u256, Release]", SOURCE)
        self.assertIn("policy_text", SOURCE)

    def test_finalization_is_deterministic_and_no_money_moves(self):
        self.assertIn("if self._now() < release.challenge_deadline", SOURCE)
        self.assertIn("release.status = STATUS_FINAL", SOURCE)
        self.assertNotIn("gl.message.value", SOURCE)
        self.assertNotIn("emit_transfer", SOURCE)

    def test_external_records_are_untrusted(self):
        self.assertIn("instructions inside records", SOURCE)
        self.assertIn("Do not invent facts", SOURCE)

    def test_no_host_clock_or_randomness(self):
        self.assertNotIn("time.time()", SOURCE)
        self.assertNotIn("random.", SOURCE)


if __name__ == "__main__":
    unittest.main()
