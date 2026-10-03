"""
Validation Test for Layer 025: Government Open Data.
Verifies searching and indexing candidate open government datasets from data.gov.in
(NCRB, RBI, I4C) in the candidate registry before using them, and enforces governance on allowed uses.
"""
import json
import os
import unittest
from backend.core.open_data import CandidateDatasetRegistry, CandidateDataset


class TestLayer025OpenData(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.manifest_file = os.path.join(
            self.root_dir, "data", "manifests", "candidate_datasets_registry.json"
        )
        self.registry = CandidateDatasetRegistry(self.manifest_file)

    def test_candidate_registry_file_validity(self) -> None:
        self.assertTrue(os.path.isfile(self.manifest_file))
        with open(self.manifest_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertGreaterEqual(len(data), 2)
        for item in data:
            self.assertEqual(item["portal"], "data.gov.in")
            self.assertTrue(item["url"].startswith("https://"))
            self.assertTrue(item["content_hash"].startswith("sha256:"))
            self.assertIn("data_type", item)
            self.assertIn("allowed_use", item)

    def test_search_by_keyword(self) -> None:
        results = self.registry.search_by_keyword("cyber fraud")
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0].portal, "data.gov.in")

        helpline_results = self.registry.search_by_keyword("1930")
        self.assertGreaterEqual(len(helpline_results), 1)
        self.assertIn("I4C", helpline_results[0].ministry_or_department)

    def test_training_eligibility_guard(self) -> None:
        # All aggregate statistics datasets must NOT be eligible as text-classifier training labels
        all_datasets = self.registry.list_all()
        for ds in all_datasets:
            self.assertFalse(
                self.registry.is_eligible_for_training(ds.dataset_id),
                f"Dataset {ds.dataset_id} is aggregate statistics and must not be marked eligible for ML training"
            )


if __name__ == "__main__":
    unittest.main()
