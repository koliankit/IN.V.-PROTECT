"""
Validation Test for Layer 005: Define target users.
Verifies target personas (first-time, young social-media, regional-language, elderly, limited literacy).
"""
import os
import unittest
from backend.core.constants import TARGET_USER_PERSONAS


class TestLayer005TargetUsers(unittest.TestCase):
    def test_target_user_personas_count_and_keys(self):
        self.assertEqual(len(TARGET_USER_PERSONAS), 5)
        ids = {p["id"] for p in TARGET_USER_PERSONAS}
        expected_ids = {
            "first_time_investor",
            "young_social_media",
            "regional_language",
            "elderly_investors",
            "limited_literacy",
        }
        self.assertEqual(ids, expected_ids)

    def test_target_users_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "TARGET_USERS.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("First-Time Investors", content)
        self.assertIn("Young Social-Media Users", content)
        self.assertIn("Regional-Language Users", content)
        self.assertIn("Elderly Users", content)
        self.assertIn("Limited Digital/Financial Literacy", content)


if __name__ == "__main__":
    unittest.main()
