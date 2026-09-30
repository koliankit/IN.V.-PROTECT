"""
Validation Test for Layer 023: RBI awareness evidence.
Verifies collection and ingestion of official RBI material on digital fraud,
suspicious apps, sensitive information, screen sharing apps, and safe digital finance.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore


class TestLayer023RbiAwareness(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC005_rbi_financial_awareness.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))

    def test_rbi_awareness_metadata(self):
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC005")
        self.assertEqual(doc["publisher"], "RBI")
        self.assertIn("FAME202426022024.pdf", doc["url"])
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertGreaterEqual(len(doc["sections"]), 5)

    def test_topics_covered(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        all_text = " ".join([s["content"] for s in doc["sections"]]).lower()
        self.assertIn("otp", all_text)
        self.assertIn("upi pin", all_text)
        self.assertIn("screen sharing", all_text)
        self.assertIn("sachet", all_text)
        self.assertIn("qr code", all_text)

    def test_evidence_retrieval(self):
        results = self.evidence_store.find_evidence_by_keyword("screen sharing")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC005")
        self.assertIn("screen sharing", results[0].passage.lower())


if __name__ == "__main__":
    unittest.main()
