"""
Validation Test for Layer 026: NCRB data.
Verifies evaluation of NCRB/data.gov.in cybercrime datasets for aggregate impact/context,
ensuring aggregate statistics are strictly restricted to impact_context and barred from
being used as text-classification training labels.
"""
import json
import os
import unittest
from backend.core.evidence import EvidenceStore
from backend.core.open_data import CandidateDatasetRegistry


class TestLayer026NcrbData(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.file_path = os.path.join(
            self.root_dir, "data", "official", "SRC007_ncrb_cybercrime_context.json"
        )
        self.evidence_store = EvidenceStore(os.path.join(self.root_dir, "data", "official"))
        self.candidate_registry = CandidateDatasetRegistry(
            os.path.join(self.root_dir, "data", "manifests", "candidate_datasets_registry.json")
        )

    def test_ncrb_metadata_and_hash(self):
        self.assertTrue(os.path.isfile(self.file_path))
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        self.assertEqual(doc["source_id"], "SRC007")
        self.assertIn("NCRB", doc["publisher"])
        self.assertEqual(doc["allowed_use"], "impact_context")
        self.assertTrue(doc["content_hash"].startswith("sha256:"))

    def test_governance_training_eligibility(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        evaluation = doc.get("evaluation", {})
        self.assertFalse(evaluation.get("is_text_classification_training_eligible"))
        self.assertFalse(evaluation.get("has_labeled_text_samples"))
        self.assertEqual(evaluation.get("primary_utility"), "macro_risk_context_and_impact_metrics")

    def test_content_and_retrieval(self):
        with open(self.file_path, "r", encoding="utf-8") as f:
            doc = json.load(f)

        all_text = " ".join([s["content"] for s in doc["sections"]]).lower()
        self.assertIn("financial fraud", all_text)
        self.assertIn("golden hours", all_text)

        # Keyword retrieval
        results = self.evidence_store.find_evidence_by_keyword("motive")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].source_id, "SRC007")


if __name__ == "__main__":
    unittest.main()
