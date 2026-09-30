"""
Validation Test for Layer 028: Dataset provenance.
Verifies that datasets are NEVER merged without retaining original dataset name,
source URL, original record ID, label definition, and license information.
"""
import unittest
from backend.core.dataset_merger import DatasetMerger, ProvenanceIntegrityError
from backend.schemas.merged_record import MergedDatasetRecord


class TestLayer028DatasetProvenance(unittest.TestCase):
    def setUp(self):
        self.merger = DatasetMerger()

    def test_merge_rejects_missing_dataset_name(self):
        records = [[{
            "text": "Win free stocks now",
            "canonical_label": "scam",
            "source_url": "https://archive.ics.uci.edu/dataset/228/sms+spam+collection",
            "original_record_id": "rec_001",
            "original_label_definition": "spam: unsolicited advertising message",
            "license_type": "CC-BY-4.0",
        }]]
        with self.assertRaises(ProvenanceIntegrityError) as ctx:
            self.merger.merge_datasets(records)
        self.assertIn("original_dataset_name", str(ctx.exception))

    def test_merge_rejects_missing_license_information(self):
        records = [[{
            "text": "Win free stocks now",
            "canonical_label": "scam",
            "original_dataset_name": "UCI SMS Spam Collection",
            "source_url": "https://archive.ics.uci.edu/dataset/228/sms+spam+collection",
            "original_record_id": "rec_001",
            "original_label_definition": "spam: unsolicited advertising message",
            # missing license_type
        }]]
        with self.assertRaises(ProvenanceIntegrityError) as ctx:
            self.merger.merge_datasets(records)
        self.assertIn("license_type", str(ctx.exception))

    def test_merge_rejects_missing_original_label_definition(self):
        records = [[{
            "text": "Win free stocks now",
            "canonical_label": "scam",
            "original_dataset_name": "UCI SMS Spam Collection",
            "source_url": "https://archive.ics.uci.edu/dataset/228/sms+spam+collection",
            "original_record_id": "rec_001",
            "license_type": "CC-BY-4.0",
        }]]
        with self.assertRaises(ProvenanceIntegrityError) as ctx:
            self.merger.merge_datasets(records)
        self.assertIn("original_label_definition", str(ctx.exception))

    def test_successful_merge_preserves_full_lineage(self):
        ds1 = [
            {
                "text": "Claim guaranteed 500% trading profit via VIP group",
                "canonical_label": "scam",
                "original_dataset_name": "UCI SMS Spam Collection",
                "source_url": "https://archive.ics.uci.edu/dataset/228/sms+spam+collection",
                "original_record_id": "uci_1001",
                "original_label_definition": "spam: fraudulent or unsolicited message",
                "license_type": "CC-BY-4.0",
                "attribution": "Almeida et al., 2011",
            }
        ]
        ds2 = [
            {
                "text": "Dear customer, your demat account statement is ready.",
                "canonical_label": "benign",
                "original_dataset_name": "Enron Financial Corpus",
                "source_url": "https://www.cs.cmu.edu/~enron/",
                "original_record_id": "enron_2004",
                "original_label_definition": "ham: legitimate transactional communication",
                "license_type": "Public Domain",
            }
        ]

        merged = self.merger.merge_datasets([ds1, ds2])
        self.assertEqual(len(merged), 2)

        rec1 = merged[0]
        self.assertEqual(rec1.original_dataset_name, "UCI SMS Spam Collection")
        self.assertEqual(rec1.original_record_id, "uci_1001")
        self.assertEqual(rec1.license_type, "CC-BY-4.0")
        self.assertEqual(rec1.attribution, "Almeida et al., 2011")
        self.assertEqual(rec1.canonical_label, "scam")

        rec2 = merged[1]
        self.assertEqual(rec2.original_dataset_name, "Enron Financial Corpus")
        self.assertEqual(rec2.original_record_id, "enron_2004")
        self.assertEqual(rec2.license_type, "Public Domain")
        self.assertEqual(rec2.canonical_label, "benign")


if __name__ == "__main__":
    unittest.main()
