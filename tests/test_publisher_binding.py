import ast
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
TREE = ast.parse((ROOT / "contracts" / "release_verdict.py").read_text())
HELPERS = {
    node.name: node
    for node in TREE.body
    if isinstance(node, ast.FunctionDef)
    and node.name in {"_safe_https_parts", "_uri_matches_publisher"}
}
MODULE = ast.Module(body=[HELPERS["_safe_https_parts"], HELPERS["_uri_matches_publisher"]], type_ignores=[])
ast.fix_missing_locations(MODULE)
NAMESPACE = {}
exec(compile(MODULE, "<publisher-binding>", "exec"), NAMESPACE)
uri_matches_publisher = NAMESPACE["_uri_matches_publisher"]


class PublisherBindingTests(unittest.TestCase):
    PUBLISHER = "https://registry.example/releases"

    def test_exact_and_descendant_paths_are_allowed(self):
        self.assertTrue(uri_matches_publisher(self.PUBLISHER, self.PUBLISHER))
        self.assertTrue(uri_matches_publisher(self.PUBLISHER + "/release-1.json", self.PUBLISHER))

    def test_origin_and_path_boundaries_are_enforced(self):
        self.assertFalse(uri_matches_publisher("https://evil.example/releases/release-1.json", self.PUBLISHER))
        self.assertFalse(uri_matches_publisher("https://registry.example/releases-archive/release-1.json", self.PUBLISHER))
        self.assertFalse(uri_matches_publisher("https://registry.example/other/release-1.json", self.PUBLISHER))

    def test_ambiguous_url_forms_are_rejected(self):
        for uri in (
            self.PUBLISHER + "/../release-1.json",
            self.PUBLISHER + "/release-1.json?issuer=maintainer",
            self.PUBLISHER + "/release-1.json#latest",
            "https://maintainer:secret@registry.example/releases/release-1.json",
            "https://registry.example/%72elease-1.json",
            "https://-registry.example/releases/release-1.json",
            "https://registry.example-/releases/release-1.json",
        ):
            self.assertFalse(uri_matches_publisher(uri, self.PUBLISHER), uri)


if __name__ == "__main__":
    unittest.main()
