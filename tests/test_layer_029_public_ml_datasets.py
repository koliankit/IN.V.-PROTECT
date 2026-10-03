"""
Validation Test for Layer 029: Public ML dataset selection.
Verifies evaluation of public ML datasets (UCI SMS Spam, Enron Financial, Nazario Phishing,
unverified dumps) and validates documentation of why each is or is not suitable.
"""
import os
import unittest
from backend.ml.dataset_selector import MLDatasetSelector, DatasetSuitability


class TestLayer029PublicMLDatasets(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.doc_path = os.path.join(self.root_dir, "docs", "ML_DATASET_EVALUATION.md")
        self.manifest_path = os.path.join(
            self.root_dir, "data", "manifests", "ml_datasets_evaluation.json"
        )
        self.selector = MLDatasetSelector(self.manifest_path)

    def test_evaluation_documentation_exists_and_covers_datasets(self) -> None:
        self.assertTrue(os.path.isfile(self.doc_path))
        with open(self.doc_path, "r", encoding="utf-8") as f:
            content = f.read()

        self.assertIn("UCI SMS Spam Collection", content)
        self.assertIn("Enron Financial Email Spam Corpus", content)
        self.assertIn("RECOMMENDED FOR BASELINE", content)
        self.assertIn("REJECTED", content)

    def test_selector_loads_and_verifies_recommendations(self) -> None:
        self.assertTrue(os.path.isfile(self.manifest_path))
        recommended = self.selector.get_recommended_for_baseline()
        self.assertEqual(len(recommended), 1)
        self.assertEqual(recommended[0].dataset_id, "DATASET_UCI_SPAM")
        self.assertGreaterEqual(recommended[0].suitability_score, 0.8)

        rejected = self.selector.get_rejected_datasets()
        self.assertEqual(len(rejected), 1)
        self.assertEqual(rejected[0].dataset_id, "DATASET_UNVERIFIED_SCRAPED")
        self.assertIn("Missing", rejected[0].license)

    def test_all_evaluations_have_pros_cons_and_recommendation(self) -> None:
        evals = self.selector.list_all()
        self.assertGreaterEqual(len(evals), 3)
        for e in evals:
            self.assertTrue(len(e.recommendation) > 10)
            self.assertTrue(0.0 <= e.suitability_score <= 1.0)


if __name__ == "__main__":
    unittest.main()
