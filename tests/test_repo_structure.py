"""
Layer 001 Validation Test: Repository Structure & Core Monorepo Setup.
Verifies that all required folders, configuration files, and git tracking elements exist.
"""
import os
import unittest


class TestRepoStructure(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.expected_dirs = [
            "frontend",
            "backend",
            "ml",
            "data/raw",
            "data/processed",
            "data/external",
            "data/synthetic",
            "data/official",
            "data/splits",
            "data/manifests",
            "docs",
            "scripts",
            "tests",
            "infra",
        ]

    def test_required_directories_exist(self):
        for d in self.expected_dirs:
            path = os.path.join(self.root_dir, *d.split("/"))
            self.assertTrue(
                os.path.isdir(path),
                f"Required directory '{d}' is missing at {path}",
            )

    def test_root_readme_exists(self):
        readme_path = os.path.join(self.root_dir, "README.md")
        self.assertTrue(os.path.isfile(readme_path), "Root README.md is missing")
        with open(readme_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Sangyan AI Investor Shield", content)
        self.assertIn("frontend/", content)
        self.assertIn("backend/", content)

    def test_root_gitignore_exists(self):
        gitignore_path = os.path.join(self.root_dir, ".gitignore")
        self.assertTrue(os.path.isfile(gitignore_path), "Root .gitignore is missing")
        with open(gitignore_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn(".env", content)
        self.assertIn("node_modules/", content)
        self.assertIn("__pycache__/", content)


if __name__ == "__main__":
    unittest.main()
