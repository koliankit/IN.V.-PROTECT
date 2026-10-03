"""
Validation Test for Layer 014: Create type checking.
Verifies TypeScript strict mode configuration, types definition file, and Python strict type checking settings.
"""
import json
import os
import unittest


class TestLayer014TypeChecking(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    def test_frontend_tsconfig_strict_mode(self) -> None:
        tsconfig_path = os.path.join(self.root_dir, "frontend", "tsconfig.json")
        self.assertTrue(os.path.isfile(tsconfig_path))
        with open(tsconfig_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn('"strict": true', content)
        self.assertIn('"noImplicitAny": true', content)
        self.assertIn('"strictNullChecks": true', content)

    def test_frontend_typescript_types_file(self) -> None:
        types_path = os.path.join(self.root_dir, "frontend", "src", "types", "index.ts")
        self.assertTrue(os.path.isfile(types_path))
        with open(types_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("RiskLevel", content)
        self.assertIn("ConfidenceOrUncertainty", content)
        self.assertIn("AnalysisResponse", content)
        self.assertIn("Low Concern", content)

    def test_python_mypy_strict_config(self) -> None:
        pyproject_path = os.path.join(self.root_dir, "pyproject.toml")
        self.assertTrue(os.path.isfile(pyproject_path))
        with open(pyproject_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("[tool.mypy]", content)
        self.assertIn("strict = true", content)
        self.assertIn("disallow_untyped_defs = true", content)


if __name__ == "__main__":
    unittest.main()
