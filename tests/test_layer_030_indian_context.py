"""
Validation Test for Layer 030: Indian-context dataset selection.
Verifies evaluation of Indian-context and Hinglish scam datasets, ensuring strict
differentiation between community-created datasets and official government/regulator sources.
"""
import json
import os
import unittest
from backend.schemas.indian_context import (
    IndianContextDatasetRecord,
    SourceTier,
    IndianScamPatternType,
)


class TestLayer030IndianContext(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.doc_path = os.path.join(self.root_dir, "docs", "INDIAN_CONTEXT_DATASETS.md")
        self.manifest_path = os.path.join(
            self.root_dir, "data", "manifests", "indian_context_datasets.json"
        )

    def test_documentation_exists(self):
        self.assertTrue(os.path.isfile(self.doc_path))
        with open(self.doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Hinglish", content)
        self.assertIn("Official Regulator Sources", content)
        self.assertIn("Community Research Datasets", content)

    def test_manifest_loads_and_enforces_tier_separation(self):
        self.assertTrue(os.path.isfile(self.manifest_path))
        with open(self.manifest_path, "r", encoding="utf-8") as f:
            raw_entries = json.load(f)

        records = [IndianContextDatasetRecord(**item) for item in raw_entries]
        self.assertGreaterEqual(len(records), 3)

        community_count = 0
        official_count = 0

        for r in records:
            if r.source_tier == SourceTier.COMMUNITY_RESEARCH:
                community_count += 1
                self.assertFalse(
                    r.is_official_government,
                    f"Community dataset {r.dataset_id} must NOT be marked as official government.",
                )
            elif r.source_tier == SourceTier.REGULATOR_OFFICIAL:
                official_count += 1
                self.assertTrue(
                    r.is_official_government,
                    f"Regulator dataset {r.dataset_id} MUST be marked as official government.",
                )

        self.assertGreaterEqual(community_count, 1)
        self.assertGreaterEqual(official_count, 1)

    def test_pydantic_validator_blocks_cross_tier_spoofing(self):
        # Attempting to label a community dataset as official government must raise ValueError
        with self.assertRaises(ValueError):
            IndianContextDatasetRecord(
                dataset_id="TEST_SPOOF",
                title="Fake Official Set",
                source_tier=SourceTier.COMMUNITY_RESEARCH,
                publisher_organization="Unknown User",
                is_official_government=True,  # Violation!
                language_mix=["Hinglish"],
                covered_patterns=[IndianScamPatternType.PART_TIME_TASK_FRAUD],
                license="MIT",
                provenance_url="https://example.com",
                evaluation_notes="Test",
            )


if __name__ == "__main__":
    unittest.main()
