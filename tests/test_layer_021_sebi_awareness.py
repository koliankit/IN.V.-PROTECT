"""
Validation Test for Layer 021: SEBI investor-awareness evidence.
Verifies collection and ingestion of official SEBI material on fake apps,
guaranteed returns, social-media fraud, deepfakes, OTP scams, and unregistered advice.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore


class TestLayer021SebiAwareness(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC003_sebi_investor_awareness.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))

    def test_sebi_awareness_metadata(self) -> None:
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC003")
        self.assertEqual(doc["publisher"], "SEBI Investor")
        self.assertIn("inv_aware_edu_videos.html", doc["url"])
        self.assertTrue(doc["content_hash"].startswith("sha256:"))
        self.assertGreaterEqual(len(doc["sections"]), 4)

    def test_sections_cover_topics(self) -> None:
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        all_text = " ".join([s["content"] for s in doc["sections"]]).lower()
        self.assertIn("deepfake", all_text)
        self.assertIn("telegram", all_text)
        self.assertIn("otp", all_text)
        self.assertIn("guaranteed", all_text)
        self.assertIn("regulations", all_text)

    def test_evidence_retrieval_finds_deepfake_evidence(self) -> None:
        results = self.evidence_store.find_evidence_by_keyword("deepfake")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC003")
        self.assertIn("deepfake", results[0].passage.lower())


if __name__ == "__main__":
    unittest.main()
