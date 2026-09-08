import ast
import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "contracts" / "release_verdict.py").read_text()
TREE = ast.parse(SOURCE)
HELPER_NAMES = {
    "_canonical_payload", "_signed_payload_hash", "_hex_bytes",
    "_ed25519_point_add", "_ed25519_point_double", "_ed25519_scalar_mult",
    "_ed25519_decode_point", "_ed25519_is_identity", "_ed25519_verify",
    "_valid_ed25519_public_key", "_ed25519_base_point",
}
CRYPTO_CONSTANTS = {
    "ED25519_Q", "ED25519_L", "ED25519_D", "ED25519_I", "ED25519_Y",
    "ED25519_IDENTITY",
}
MODULE = ast.Module(
    body=[
        node for node in TREE.body
        if (isinstance(node, ast.Import) and any(alias.name in ("hashlib", "json") for alias in node.names))
        or (isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id in CRYPTO_CONSTANTS for target in node.targets))
        or (isinstance(node, ast.FunctionDef) and node.name in HELPER_NAMES)
    ],
    type_ignores=[],
)
ast.fix_missing_locations(MODULE)
NAMESPACE = {}
exec(compile(MODULE, "<ed25519-test>", "exec"), NAMESPACE)


class Ed25519Tests(unittest.TestCase):
    RECORDS = {
        "artifact-v1.json": "e43dd54f532cfa97718a4570c75267cf3ce79aba574aef800346825bce5581d0",
        "security-v1.json": "e918dad3ca0a54848aed18017ae320d219b5a4f15edf7d13d75aa1222957c2c1",
        "appeal-v1.json": "d43b4db58daa8132beafb181480e94ff2bdd946d5ca9fc76d734332168a260b2",
    }

    def test_signed_fixtures_verify(self):
        fixture_root = ROOT.parent / "release-verdict-fixtures"
        for name, public_key in self.RECORDS.items():
            record = json.loads((fixture_root / name).read_text())
            payload = NAMESPACE["_canonical_payload"](record)
            self.assertEqual(NAMESPACE["_signed_payload_hash"](record), record["signed_payload_hash"])
            self.assertTrue(NAMESPACE["_valid_ed25519_public_key"](public_key))
            self.assertTrue(NAMESPACE["_ed25519_verify"](public_key, record["signature"], payload), name)

    def test_tampering_and_wrong_key_fail(self):
        fixture_root = ROOT.parent / "release-verdict-fixtures"
        record = json.loads((fixture_root / "artifact-v1.json").read_text())
        public_key = self.RECORDS["artifact-v1.json"]
        payload = NAMESPACE["_canonical_payload"](record)
        self.assertFalse(NAMESPACE["_ed25519_verify"](public_key, record["signature"], payload + "x"))
        self.assertFalse(NAMESPACE["_ed25519_verify"](self.RECORDS["security-v1.json"], record["signature"], payload))
        self.assertFalse(NAMESPACE["_ed25519_verify"]("00" * 32, record["signature"], payload))


if __name__ == "__main__":
    unittest.main()
