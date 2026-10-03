"""
Validation Test for Layer 031: Dataset quality gate.
Verifies rejection of datasets with unclear provenance, unclear licensing,
excessive duplication, unverifiable labels, or suspicious records, and confirms
structured logging of rejection reasons.
"""
import os
import shutil
import tempfile
import unittest

from backend.core.dataset_quality_gate import DatasetQualityGate
from backend.schemas.dataset_quality import (
    DatasetCandidate,
    QualityGateDecision,
    RejectionReasonCode,
)


class TestLayer031DatasetQualityGate(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.mkdtemp()
        self.audit_log_path = os.path.join(self.temp_dir, "dataset_rejections.json")
        self.gate = DatasetQualityGate(
            audit_log_path=self.audit_log_path,
            max_duplicate_ratio=0.20,
            unverifiable_label_tolerance=0.0,
        )

    def tearDown(self) -> None:
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _create_valid_candidate(self) -> DatasetCandidate:
        records = [
            {"id": "rec_1", "text": "Claim guaranteed 1000% crypto returns via Telegram VIP group", "label": "scam"},
            {"id": "rec_2", "text": "Urgent Demat KYC deactivation notice, click here to renew", "label": "scam"},
            {"id": "rec_3", "text": "Quarterly financial results disclosed by statutory filing", "label": "legitimate"},
            {"id": "rec_4", "text": "SEBI registered research analyst weekly technical outlook", "label": "legitimate"},
            {"id": "rec_5", "text": "Part time task earn 5000 rs daily by liking video links", "label": "scam"},
        ]
        return DatasetCandidate(
            dataset_id="VALID_CORPUS_001",
            dataset_name="Verified Academic Scam Telemetry",
            provenance_url="https://archive.example-research.org/dataset/scam-corpus",
            license_type="CC-BY-4.0",
            license_verified=True,
            records=records,
            label_field="label",
            text_field="text",
        )

    def test_clean_dataset_passes_quality_gate(self) -> None:
        candidate = self._create_valid_candidate()
        report = self.gate.evaluate_dataset(candidate)

        self.assertEqual(report.decision, QualityGateDecision.PASSED)
        self.assertEqual(len(report.rejection_reasons), 0)
        self.assertEqual(report.duplicate_count, 0)
        self.assertEqual(report.suspicious_record_count, 0)
        self.assertEqual(report.unverifiable_label_count, 0)

    def test_rejection_unclear_provenance(self) -> None:
        candidate = self._create_valid_candidate()
        candidate.provenance_url = None

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNCLEAR_PROVENANCE, report.rejection_reasons)
        self.assertTrue(any("missing" in d.lower() for d in report.rejection_details))

        # Test placeholder domain
        candidate.provenance_url = "http://example.com/dump.csv"
        report2 = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report2.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNCLEAR_PROVENANCE, report2.rejection_reasons)

    def test_rejection_unclear_licensing(self) -> None:
        candidate = self._create_valid_candidate()
        candidate.license_verified = False

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNCLEAR_LICENSING, report.rejection_reasons)

        # Disallowed/ambiguous license type
        candidate.license_verified = True
        candidate.license_type = "unknown"
        report2 = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report2.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNCLEAR_LICENSING, report2.rejection_reasons)

    def test_rejection_excessive_duplication(self) -> None:
        candidate = self._create_valid_candidate()
        # Add duplicate records exceeding 20% threshold
        duplicate_record = {
            "id": "rec_dup",
            "text": "Claim guaranteed 1000% crypto returns via Telegram VIP group",
            "label": "scam",
        }
        # 5 original + 3 duplicates = 8 total, 3 duplicates = 37.5% > 20%
        candidate.records.extend([duplicate_record, duplicate_record, duplicate_record])

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.EXCESSIVE_DUPLICATION, report.rejection_reasons)
        self.assertGreater(report.duplication_rate, 0.20)
        self.assertEqual(report.duplicate_count, 3)

    def test_rejection_unverifiable_labels(self) -> None:
        candidate = self._create_valid_candidate()
        # Inject records with missing or ambiguous labels
        candidate.records.append({"id": "rec_unv1", "text": "Message with missing label"})
        candidate.records.append({"id": "rec_unv2", "text": "Message with question mark label", "label": "?"})
        candidate.records.append({"id": "rec_unv3", "text": "Message with null label", "label": None})

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNVERIFIABLE_LABELS, report.rejection_reasons)
        self.assertEqual(report.unverifiable_label_count, 3)

    def test_rejection_suspicious_records(self) -> None:
        candidate = self._create_valid_candidate()
        # Inject corrupted or malicious payloads
        candidate.records.append({"id": "rec_sus1", "text": "Corrupted text with null byte \x00 in payload", "label": "scam"})
        candidate.records.append({"id": "rec_sus2", "text": "   ", "label": "legitimate"})
        candidate.records.append({"id": "rec_sus3", "text": "<script>alert('steal-tokens')</script>", "label": "scam"})
        candidate.records.append({"id": "rec_sus4", "text": "Garbage with unicode replacement \ufffd character", "label": "scam"})

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.SUSPICIOUS_RECORDS, report.rejection_reasons)
        self.assertEqual(report.suspicious_record_count, 4)

    def test_multi_failure_captures_all_reasons(self) -> None:
        candidate = self._create_valid_candidate()
        candidate.provenance_url = "invalid-url"
        candidate.license_verified = False
        candidate.records.append({"id": "bad_rec", "text": "Payload with \x00 byte", "label": "unknown"})

        report = self.gate.evaluate_dataset(candidate)
        self.assertEqual(report.decision, QualityGateDecision.REJECTED)
        self.assertIn(RejectionReasonCode.UNCLEAR_PROVENANCE, report.rejection_reasons)
        self.assertIn(RejectionReasonCode.UNCLEAR_LICENSING, report.rejection_reasons)
        self.assertIn(RejectionReasonCode.SUSPICIOUS_RECORDS, report.rejection_reasons)
        self.assertIn(RejectionReasonCode.UNVERIFIABLE_LABELS, report.rejection_reasons)

    def test_audit_log_persistence(self) -> None:
        candidate = self._create_valid_candidate()
        candidate.license_verified = False
        report = self.gate.evaluate_dataset(candidate)

        self.assertTrue(os.path.isfile(self.audit_log_path))
        rejections = self.gate.get_rejected_datasets()
        self.assertEqual(len(rejections), 1)
        self.assertEqual(rejections[0].dataset_id, candidate.dataset_id)
        self.assertIn(RejectionReasonCode.UNCLEAR_LICENSING, rejections[0].rejection_reasons)


if __name__ == "__main__":
    unittest.main()
