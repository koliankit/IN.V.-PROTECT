"""
Validation Test for Layer 027: Dataset license verification.
Verifies license check, attribution requirements, provenance URL,
record structure, and permitted use validation for every public dataset before inclusion.
"""
import json
import os
import unittest
from backend.core.dataset_license import DatasetLicenseVerifier
from backend.schemas.dataset_license import DatasetLicenseRecord


class TestLayer027DatasetLicense(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.manifest_file = os.path.join(
            self.root_dir, "data", "manifests", "dataset_licenses.json"
        )
        self.verifier = DatasetLicenseVerifier(self.manifest_file)

    def test_manifest_loads_and_validates(self) -> None:
        self.assertTrue(os.path.isfile(self.manifest_file))
        records = self.verifier.list_all()
        self.assertGreaterEqual(len(records), 2)

        for rec in records:
            self.assertTrue(rec.license_verified)
            self.assertTrue(rec.provenance_url.startswith("http"))
            self.assertGreaterEqual(len(rec.record_structure), 2)
            self.assertGreaterEqual(len(rec.permitted_uses), 1)

    def test_uci_spam_license_verification(self) -> None:
        uci = self.verifier.get_record("DATASET_UCI_SPAM")
        self.assertIsNotNone(uci)
        assert uci is not None and uci.attribution_text is not None
        self.assertEqual(uci.license_type, "CC-BY-4.0")
        self.assertTrue(uci.attribution_required)
        self.assertIn("Almeida", uci.attribution_text)

        valid, msg = self.verifier.verify_dataset_inclusion(uci, "baseline_classifier")
        self.assertTrue(valid)
        self.assertIn("verified", msg.lower())

    def test_reject_unverified_or_forbidden_use(self) -> None:
        uci = self.verifier.get_record("DATASET_UCI_SPAM")
        assert uci is not None
        # Attempting unpermitted use
        valid, msg = self.verifier.verify_dataset_inclusion(uci, "unauthorized_commercial_resale")
        self.assertFalse(valid)
        self.assertIn("not permitted", msg.lower())

        # Unverified candidate
        fake_candidate = DatasetLicenseRecord(
            dataset_id="UNVERIFIED_DUMP",
            dataset_name="Scraped Unverified Chats",
            license_type="Unknown",
            is_commercial_use_allowed=False,
            is_research_allowed=False,
            attribution_required=False,
            provenance_url="https://unknown-source.xyz/data",
            record_structure={"text": "string"},
            permitted_uses=["evaluation_only"],
            license_verified=False,
            verification_notes="Unclear copyright and lack of consent"
        )
        valid, msg = self.verifier.verify_dataset_inclusion(fake_candidate, "evaluation_only")
        self.assertFalse(valid)
        self.assertIn("unverified", msg.lower())


if __name__ == "__main__":
    unittest.main()
