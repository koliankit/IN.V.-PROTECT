"""
Validation Test for Layer 017: Define provenance registry.
Verifies schema fields: source_id, publisher, title, URL, license, publication date,
retrieved_at, content_hash, source_type, and allowed_use.
"""
import json
import os
import unittest
from backend.schemas.provenance import ProvenanceRecord, SourceType, AllowedUse


class TestLayer017ProvenanceRegistry(unittest.TestCase):
    def setUp(self) -> None:
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    def test_json_schema_file_exists_and_has_required_fields(self) -> None:
        schema_path = os.path.join(self.root_dir, "data", "manifests", "provenance_schema.json")
        self.assertTrue(os.path.isfile(schema_path))
        with open(schema_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        expected_fields = [
            "source_id",
            "publisher",
            "title",
            "url",
            "license",
            "publication_date",
            "retrieved_at",
            "content_hash",
            "source_type",
            "allowed_use",
        ]
        self.assertEqual(data["required"], expected_fields)

    def test_valid_provenance_record_instantiation(self) -> None:
        valid_record = ProvenanceRecord(
            source_id="SRC001",
            publisher="SEBI Investor",
            title="Fake Trading App Scam Landscape",
            url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
            license="Government Public Advisory / Open Access",
            publication_date="2024-02-26",
            retrieved_at="2026-09-30T10:00:00Z",
            content_hash="sha256:" + "a" * 64,
            source_type=SourceType.OFFICIAL_ADVISORY,
            allowed_use=AllowedUse.RAG_EVIDENCE_RULES,
        )
        self.assertEqual(valid_record.source_id, "SRC001")
        self.assertEqual(valid_record.allowed_use, AllowedUse.RAG_EVIDENCE_RULES)

    def test_invalid_hash_format_raises(self) -> None:
        with self.assertRaises(ValueError):
            ProvenanceRecord(
                source_id="SRC001",
                publisher="SEBI Investor",
                title="Fake Trading App Scam Landscape",
                url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                license="Government Public Advisory",
                publication_date="2024-02-26",
                retrieved_at="2026-09-30T10:00:00Z",
                content_hash="invalid_hash_without_sha256_prefix",
                source_type=SourceType.OFFICIAL_ADVISORY,
                allowed_use=AllowedUse.RAG_EVIDENCE_RULES,
            )


if __name__ == "__main__":
    unittest.main()
