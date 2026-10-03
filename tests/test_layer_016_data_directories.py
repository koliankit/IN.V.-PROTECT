"""
Validation Test for Layer 016: Define data directories.
Verifies raw, processed, external, synthetic, official, splits, and manifests directories and documentation.
"""
import os
import unittest


class TestLayer016DataDirectories(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.data_dirs = [
            "data/raw",
            "data/processed",
            "data/external",
            "data/synthetic",
            "data/official",
            "data/splits",
            "data/manifests",
        ]

    def test_all_data_directories_exist_with_gitkeep(self) -> None:
        for d in self.data_dirs:
            dir_path = os.path.join(self.root_dir, *d.split("/"))
            self.assertTrue(os.path.isdir(dir_path), f"Directory {d} does not exist")
            gitkeep_path = os.path.join(dir_path, ".gitkeep")
            self.assertTrue(os.path.isfile(gitkeep_path), f".gitkeep missing in {d}")

    def test_data_documentation_exists(self) -> None:
        readme_path = os.path.join(self.root_dir, "data", "README.md")
        spec_path = os.path.join(self.root_dir, "docs", "DATA_DIRECTORIES.md")
        self.assertTrue(os.path.isfile(readme_path))
        self.assertTrue(os.path.isfile(spec_path))
        with open(readme_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("synthetic/", content)
        self.assertIn("official/", content)
        self.assertIn("PII Sanitization", content)


if __name__ == "__main__":
    unittest.main()
