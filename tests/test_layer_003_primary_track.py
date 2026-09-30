"""
Validation Test for Layer 003: Define primary track.
Verifies Track A: Digital Fraud & Scam Resilience configuration and documentation.
"""
import os
import unittest
from backend.core.constants import PRIMARY_TRACK_CODE, PRIMARY_TRACK_NAME


class TestLayer003PrimaryTrack(unittest.TestCase):
    def test_primary_track_constants(self):
        self.assertEqual(PRIMARY_TRACK_CODE, "Track A")
        self.assertEqual(PRIMARY_TRACK_NAME, "Digital Fraud & Scam Resilience")

    def test_track_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "TRACK_ALIGNMENT.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Track A", content)
        self.assertIn("Digital Fraud & Scam Resilience", content)


if __name__ == "__main__":
    unittest.main()
