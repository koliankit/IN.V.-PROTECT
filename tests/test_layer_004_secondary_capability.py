"""
Validation Test for Layer 004: Define secondary capability.
Verifies Track E: Misinformation & Content Literacy integration as a supporting capability.
"""
import os
import unittest
from backend.core.constants import (
    PRIMARY_TRACK_CODE,
    SECONDARY_TRACK_CODE,
    SECONDARY_TRACK_NAME,
)


class TestLayer004SecondaryCapability(unittest.TestCase):
    def test_secondary_track_constants(self):
        self.assertEqual(SECONDARY_TRACK_CODE, "Track E")
        self.assertEqual(SECONDARY_TRACK_NAME, "Misinformation & Content Literacy")
        self.assertNotEqual(PRIMARY_TRACK_CODE, SECONDARY_TRACK_CODE)

    def test_track_documentation_integration(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "TRACK_ALIGNMENT.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Track E", content)
        self.assertIn("Misinformation & Content Literacy", content)
        self.assertIn("No Split Products", content)


if __name__ == "__main__":
    unittest.main()
