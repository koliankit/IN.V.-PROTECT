"""
Validation Test for Layer 002: Define product name.
Verifies canonical product name, trustworthy academic branding, and exclusion of speculative/crypto aesthetics.
"""
import os
import unittest
from backend.core.constants import PRODUCT_NAME, PRODUCT_SLUG, FORBIDDEN_THEMES


class TestLayer002ProductName(unittest.TestCase):
    def test_canonical_product_name(self):
        self.assertEqual(PRODUCT_NAME, "Sangyan AI Investor Shield")
        self.assertEqual(PRODUCT_SLUG, "sangyan-ai-investor-shield")

    def test_documentation_contains_product_name(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "PRODUCT_DEFINITION.md")
        self.assertTrue(os.path.isfile(doc_path), "docs/PRODUCT_DEFINITION.md must exist")
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Sangyan AI Investor Shield", content)
        self.assertIn("Academic, trustworthy, minimalist", content)
        self.assertIn("No crypto", content)

    def test_forbidden_themes_defined(self):
        self.assertIsInstance(FORBIDDEN_THEMES, list)
        self.assertTrue(len(FORBIDDEN_THEMES) > 0)
        self.assertIn("crypto rocket", FORBIDDEN_THEMES)


if __name__ == "__main__":
    unittest.main()
