"""
Validation Test for Layer 013: Create linting.
Verifies ESLint/Prettier configuration for frontend and pyproject.toml / scripts/lint.py for Python.
"""
import os
import unittest
from scripts.lint import check_python_files


class TestLayer013Linting(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    def test_frontend_linting_configs_exist(self):
        eslint_path = os.path.join(self.root_dir, "frontend", ".eslintrc.cjs")
        prettier_path = os.path.join(self.root_dir, "frontend", ".prettierrc")
        self.assertTrue(os.path.isfile(eslint_path))
        self.assertTrue(os.path.isfile(prettier_path))

    def test_python_pyproject_toml_exists(self):
        pyproject_path = os.path.join(self.root_dir, "pyproject.toml")
        self.assertTrue(os.path.isfile(pyproject_path))
        with open(pyproject_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("[tool.black]", content)
        self.assertIn("[tool.ruff]", content)

    def test_python_codebase_ast_and_bytecode_lint(self):
        self.assertTrue(check_python_files(self.root_dir))


if __name__ == "__main__":
    unittest.main()
