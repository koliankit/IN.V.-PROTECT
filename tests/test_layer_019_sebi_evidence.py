"""
Validation Test for Layer 019: SEBI fake-trading-app evidence.
Verifies ingestion of official SEBI Investor fake-trading-app material,
preserving title, URL, retrieval date, document hash, and page/section metadata.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore


class TestLayer019SebiEvidence(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC001_sebi_fake_trading_apps.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))

    def test_sebi_file_metadata(self):
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC001")
        self.assertEqual(doc["publisher"], "SEBI Investor")
        self.assertEqual(doc["title"], "Fake Trading App Scam Landscape")
        self.assertEqual(
            doc["url"],
            "https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
        )
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertIn("retrieved_at", doc)
        self.assertGreaterEqual(len(doc["sections"]), 4)

    def test_sebi_sections_have_page_and_content(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        for sec in doc["sections"]:
            self.assertIn("section_id", sec)
            self.assertIn("section_title", sec)
            self.assertIn("page_number", sec)
            self.assertIn("content", sec)
            self.assertIn("key_takeaways", sec)
            self.assertGreater(len(sec["content"]), 20)

    def test_evidence_retrieval_finds_guaranteed_return_evidence(self):
        results = self.evidence_store.find_evidence_by_keyword("guaranteed")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC001")
        self.assertEqual(results[0].publisher, "SEBI Investor")
        self.assertIn("guaranteed", results[0].passage.lower())


if __name__ == "__main__":
    unittest.main()
