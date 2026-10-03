"""
Validation Test for Layer 024: CERT-In evidence.
Verifies collection and ingestion of official CERT-In guidance on phishing,
typosquatting, malicious APK distribution, social engineering urgency, and incident reporting.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore


class TestLayer024CertInEvidence(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC006_cert_in_online_scams.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))

    def test_cert_in_metadata(self) -> None:
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC006")
        self.assertEqual(doc["publisher"], "CERT-In")
        self.assertIn("CIAD-2024-0050", doc["url"])
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertGreaterEqual(len(doc["sections"]), 4)

    def test_topics_covered(self) -> None:
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        all_text = " ".join([s["content"] for s in doc["sections"]]).lower()
        self.assertIn("typosquatting", all_text)
        self.assertIn("apk", all_text)
        self.assertIn("urgent", all_text)
        self.assertIn("incident@cert-in.org.in", all_text)

    def test_evidence_retrieval(self) -> None:
        results = self.evidence_store.find_evidence_by_keyword("typosquatting")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC006")
        self.assertIn("typosquatting", results[0].passage.lower())


if __name__ == "__main__":
    unittest.main()
