"""
Validation Test for Layer 007: Define user journey.
Verifies the complete 7-stage user journey:
input → extraction → detection → evidence retrieval → explanation → safety guidance → official verification/reporting.
"""
import os
import unittest
from backend.core.constants import USER_JOURNEY_STAGES


class TestLayer007UserJourney(unittest.TestCase):
    def test_user_journey_stages_sequence(self):
        self.assertEqual(len(USER_JOURNEY_STAGES), 7)
        keys = [s["key"] for s in USER_JOURNEY_STAGES]
        expected_keys = [
            "user_input",
            "extraction",
            "detection",
            "evidence_retrieval",
            "explanation",
            "safety_guidance",
            "official_reporting",
        ]
        self.assertEqual(keys, expected_keys)

    def test_user_journey_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "USER_JOURNEY.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("1. User Input", content)
        self.assertIn("2. Extraction", content)
        self.assertIn("3. Scam Detection", content)
        self.assertIn("4. Authoritative Evidence Retrieval", content)
        self.assertIn("5. Evidence-First Explanation", content)
        self.assertIn("6. Safety Guidance", content)
        self.assertIn("7. Official Verification & Reporting", content)


if __name__ == "__main__":
    unittest.main()
