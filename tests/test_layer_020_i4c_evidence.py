"""
Validation Test for Layer 020: I4C fake-investment evidence.
Verifies ingestion of the official I4C/National Cyber Crime Threat Analytics Unit advisory
on fake stock-market investment websites/apps, preserving full provenance and source passages.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore


class TestLayer020I4CEvidence(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC002_i4c_fake_investment_advisory.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))

    def test_i4c_file_metadata(self) -> None:
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC002")
        self.assertIn("I4C", doc["publisher"])
        self.assertIn("National Cyber Crime Threat Analytics Unit", doc["publisher"])
        self.assertEqual(
            doc["url"],
            "https://cybercrime.gov.in/pdf/Advisories/ADVISORY%20TAU-ADV-001%20%2822.04.2024%29.pdf",
        )
        self.assertEqual(doc["publication_date"], "2024-04-22")
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertGreaterEqual(len(doc["sections"]), 4)

    def test_i4c_sections_contain_reporting_helpline(self) -> None:
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        content_full = " ".join([s["content"] for s in doc["sections"]])
        self.assertIn("1930", content_full)
        self.assertIn("cybercrime.gov.in", content_full)
        self.assertIn("mule", content_full.lower())

    def test_evidence_retrieval_finds_i4c_by_helpline(self) -> None:
        results = self.evidence_store.find_evidence_by_keyword("1930")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC002")
        self.assertIn("cybercrime.gov.in", results[0].url)


if __name__ == "__main__":
    unittest.main()
