"""
Validation Test for Layer 039: Knowledge-base schema.
Verifies database schemas for sources, documents, chunks, claims, and citations,
testing table creation, foreign-key integrity constraints, and relational provenance queries.
"""
import os
import shutil
import sqlite3
import tempfile
import unittest

from backend.db.database import DatabaseManager
from backend.schemas.knowledge_base import (
    ChunkEntity,
    CitationEntity,
    ClaimEntity,
    DocumentEntity,
    SourceEntity,
)


class TestLayer039KnowledgeBaseSchema(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.db_path = os.path.join(self.temp_dir, "test_kb.db")
        self.db = DatabaseManager(db_path=self.db_path)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_schema_creates_all_five_tables(self):
        with self.db.get_connection() as conn:
            tables = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
            ).fetchall()
            table_names = {t["name"] for t in tables}

        expected = {"sources", "documents", "chunks", "claims", "citations"}
        for exp in expected:
            self.assertIn(exp, table_names)

    def test_foreign_key_enforcement_blocks_orphaned_document(self):
        # Attempting to insert a document with non-existent source_id must fail
        doc = DocumentEntity(
            document_id="DOC_ORPHAN",
            source_id="SRC_NON_EXISTENT",
            title="Orphan Document",
            format="pdf",
            raw_file_path="data/raw/orphan.pdf",
            content_hash="sha256:0000000000000000000000000000000000000000000000000000000000000000",
        )
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.insert_document(doc)

    def test_foreign_key_enforcement_blocks_orphaned_chunk(self):
        # Insert source first
        src = SourceEntity(
            source_id="SRC001",
            publisher="SEBI Investor",
            title="Fake Trading Apps",
            url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
            license="Government Open Data",
            source_type="official_advisory",
            allowed_use="RAG_evidence_rules",
            content_hash="sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
        )
        self.db.insert_source(src)

        # Attempt to insert chunk referencing non-existent document
        chunk = ChunkEntity(
            chunk_id="CHK_ORPHAN",
            document_id="DOC_NON_EXISTENT",
            source_id="SRC001",
            page_or_section="Page 1 / Modus Operandi",
            section_title="Modus Operandi",
            text="Text passage for orphaned chunk without document parent.",
        )
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.insert_chunk(chunk)

    def test_end_to_end_relational_chain(self):
        # 1. Source
        src = SourceEntity(
            source_id="SRC001",
            publisher="SEBI Investor",
            title="Fake Trading Apps Landscape",
            url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
            license="Government Open Data",
            source_type="official_advisory",
            allowed_use="RAG_evidence_rules",
            publication_date="2024-02-26",
            content_hash="sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
        )
        self.db.insert_source(src)

        # 2. Document
        doc = DocumentEntity(
            document_id="DOC_SRC001_d8c525",
            source_id="SRC001",
            title="Fake Trading Apps Landscape",
            format="pdf",
            raw_file_path="data/raw/official/SRC001.pdf",
            content_hash="sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
            total_pages=3,
            total_blocks=5,
        )
        self.db.insert_document(doc)

        # 3. Chunk
        chunk = ChunkEntity(
            chunk_id="CHK_SRC001_001",
            document_id="DOC_SRC001_d8c525",
            source_id="SRC001",
            page_or_section="Page 1 / Telegram VIP Groups",
            page_number=1,
            section_title="Telegram VIP Groups",
            text="Fraudsters create fake groups promising guaranteed returns on stock market calls.",
            token_count_approx=12,
            chunk_index=0,
        )
        self.db.insert_chunk(chunk)

        # 4. Claim
        claim = ClaimEntity(
            claim_id="CLM_SRC001_01",
            claim_text="No SEBI registered intermediary promises guaranteed returns on trading calls.",
            claim_category="guaranteed_returns",
            verdict_sentiment="refutes",
            chunk_id="CHK_SRC001_001",
            source_id="SRC001",
            regulatory_reference="SEBI Fake Trading App Scam Landscape (2024)",
        )
        self.db.insert_claim(claim)

        # 5. Citation
        citation = CitationEntity(
            citation_id="CIT_001",
            analysis_id="ANL_REQ_789",
            chunk_id="CHK_SRC001_001",
            claim_id="CLM_SRC001_01",
            source_id="SRC001",
            relevance_score=0.94,
            citation_quote="Fraudsters create fake groups promising guaranteed returns on stock market calls.",
        )
        self.db.insert_citation(citation)

        # Verify retrieval of all 5 entities
        retrieved_src = self.db.get_source("SRC001")
        self.assertIsNotNone(retrieved_src)
        self.assertEqual(retrieved_src.publisher, "SEBI Investor")

        retrieved_doc = self.db.get_document("DOC_SRC001_d8c525")
        self.assertIsNotNone(retrieved_doc)
        self.assertEqual(retrieved_doc.source_id, "SRC001")

        retrieved_chunks = self.db.get_chunks_by_document("DOC_SRC001_d8c525")
        self.assertEqual(len(retrieved_chunks), 1)
        self.assertEqual(retrieved_chunks[0].chunk_id, "CHK_SRC001_001")

        retrieved_claim = self.db.get_claim("CLM_SRC001_01")
        self.assertIsNotNone(retrieved_claim)
        self.assertEqual(retrieved_claim.claim_category, "guaranteed_returns")

        retrieved_citations = self.db.get_citations_for_chunk("CHK_SRC001_001")
        self.assertEqual(len(retrieved_citations), 1)
        self.assertEqual(retrieved_citations[0].relevance_score, 0.94)

    def test_cascading_delete(self):
        # Insert source, doc, and chunk
        src = SourceEntity(
            source_id="SRC002",
            publisher="I4C",
            title="TAU Advisory",
            url="https://cybercrime.gov.in/pdf/Advisories/ADVISORY%20TAU-ADV-001.pdf",
            license="Government Open Data",
            source_type="official_advisory",
            allowed_use="RAG_evidence_rules",
            content_hash="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        )
        self.db.insert_source(src)

        doc = DocumentEntity(
            document_id="DOC_SRC002",
            source_id="SRC002",
            title="TAU Advisory",
            format="pdf",
            raw_file_path="data/raw/official/SRC002.pdf",
            content_hash="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        )
        self.db.insert_document(doc)

        # Delete source -> doc should be cascaded
        with self.db.get_connection() as conn:
            conn.execute("DELETE FROM sources WHERE source_id = 'SRC002'")

        self.assertIsNone(self.db.get_source("SRC002"))
        self.assertIsNone(self.db.get_document("DOC_SRC002"))


if __name__ == "__main__":
    unittest.main()
