"""
Validation Test for Layer 010: Create repository README.
Verifies that README.md covers: problem, target users, solution, architecture, technology stack,
tracks, data provenance, setup, limitations, evaluation, and demo instructions.
"""
import os
import unittest


class TestLayer010Readme(unittest.TestCase):
    def setUp(self):
        self.readme_path = os.path.join(os.path.dirname(__file__), "..", "README.md")
        self.assertTrue(os.path.isfile(self.readme_path), "Root README.md must exist")
        with open(self.readme_path, "r", encoding="utf-8") as f:
            self.content = f.read()

    def test_required_sections_present(self):
        required_sections = [
            "Problem Statement",
            "Target Users & Personas",
            "Product Solution & Non-Goals",
            "End-to-End Architecture & User Journey",
            "Technology Stack",
            "Data Provenance & Ethical Guardrails",
            "Setup & Installation",
            "Evaluation & Metrics",
            "Known Limitations & Safe Fallbacks",
            "Demonstration Instructions",
        ]
        for section in required_sections:
            self.assertIn(section, self.content, f"Section '{section}' missing from README.md")

    def test_tracks_and_non_goals_mentioned(self):
        self.assertIn("Track A: Digital Fraud & Scam Resilience", self.content)
        self.assertIn("Track E: Misinformation & Content Literacy", self.content)
        self.assertIn("NO Buy/Sell/Hold Recommendations", self.content)
        self.assertIn("NO Price Predictions", self.content)


if __name__ == "__main__":
    unittest.main()
