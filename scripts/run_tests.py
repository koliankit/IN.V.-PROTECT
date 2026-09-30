"""
Monorepo Test Runner.
Executes all test files in the tests/ directory and reports results cleanly.
"""
import os
import sys
import unittest


def run_all_tests():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    if repo_root not in sys.path:
        sys.path.insert(0, repo_root)

    test_dir = os.path.join(repo_root, "tests")
    loader = unittest.TestLoader()

    suite = unittest.TestSuite()

    # Walk tests directory
    for root, _, files in os.walk(test_dir):
        for f in files:
            if f.startswith("test_") and f.endswith(".py"):
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, os.path.join(test_dir, ".."))
                module_name = os.path.splitext(rel_path)[0].replace(os.sep, ".")
                try:
                    mod_suite = loader.loadTestsFromName(module_name)
                    suite.addTests(mod_suite)
                except Exception as e:
                    print(f"Error loading {module_name}: {e}")

    runner = unittest.TextTestRunner(verbosity=1)
    result = runner.run(suite)
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
