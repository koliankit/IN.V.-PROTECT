"""
Validation Test for Layer 038: Document chunking.
Verifies chunking of official documents into retrieval-friendly passages,
ensuring every chunk strictly retains source_id, document_id, page/section, and text.
"""
import os
import shutil
import tempfile
import unittest

from backend.core.document_chunker import DocumentChunker
from backend.schemas.document_chunk import ChunkingConfig
from backend.schemas.document_parser import (
    ParsedDocument,
    ParsedDocumentBlock,
    ParsedDocumentMetadata,
)
from scripts.chunk_documents import run_chunking_process


class TestLayer038DocumentChunking(unittest.TestCase):
    def setUp(self):
        self.chunker = DocumentChunker(
            config=ChunkingConfig(
                max_chunk_size_chars=300,
                min_chunk_size_chars=50,
                chunk_overlap_chars=40,
            )
        )

    def _create_sample_parsed_document(self) -> ParsedDocument:
        meta = ParsedDocumentMetadata(
            source_id="SRC001",
            title="Fake Trading App Scam Landscape",
            publisher="SEBI Investor",
            publication_date="2024-02-26",
            retrieved_at="2026-09-30T12:00:00Z",
            source_url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
            source_reference="SEBI Investor / SRC001",
            document_format="pdf",
            content_hash="sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
        )

        b1 = ParsedDocumentBlock(
            block_id="BLK_001",
            page_number=1,
            heading="Modus Operandi: Social Media Investment Groups",
            heading_level=2,
            text=(
                "Fraudsters create groups on WhatsApp and Telegram using names of SEBI registered entities. "
                "Unsuspecting investors are lured with claims of high guaranteed returns and exclusive institutional access. "
                "Simulated profit screenshots are shared constantly to induce larger margin deposits."
            ),
            bullet_points=["Fake WhatsApp groups", "Guaranteed return promises"],
            source_reference=meta.source_reference,
        )

        b2 = ParsedDocumentBlock(
            block_id="BLK_002",
            page_number=2,
            heading="Payment Routing: Third-Party Mule Accounts",
            heading_level=2,
            text=(
                "Payments for trading deposits are solicited into personal bank accounts and individual UPI handles. "
                "Registered brokers never solicit funds into personal or third-party bank accounts. "
                "Always verify client designated accounts before transferring any capital."
            ),
            bullet_points=["Personal account routing", "Verify registered accounts"],
            source_reference=meta.source_reference,
        )

        return ParsedDocument(
            document_id="DOC_SRC001_d8c525f2",
            metadata=meta,
            total_pages=2,
            total_blocks=2,
            blocks=[b1, b2],
            full_text=f"{b1.text}\n\n{b2.text}",
        )

    def test_every_chunk_retains_required_fields(self):
        doc = self._create_sample_parsed_document()
        result = self.chunker.chunk_parsed_document(doc)

        self.assertGreaterEqual(result.total_chunks, 2)
        self.assertEqual(result.source_id, "SRC001")
        self.assertEqual(result.document_id, doc.document_id)

        for chunk in result.chunks:
            # 1. source_id strictly retained
            self.assertEqual(chunk.source_id, "SRC001")
            # 2. document_id strictly retained
            self.assertEqual(chunk.document_id, doc.document_id)
            # 3. page_or_section strictly retained
            self.assertTrue(len(chunk.page_or_section) > 5)
            self.assertTrue("Page" in chunk.page_or_section or "Section" in chunk.page_or_section)
            # 4. text strictly retained and non-empty
            self.assertGreaterEqual(len(chunk.text), 10)
            # 5. Token approximation and indexing
            self.assertGreaterEqual(chunk.token_count_approx, 2)
            self.assertGreaterEqual(chunk.chunk_index, 0)

    def test_page_and_section_attribution_accuracy(self):
        doc = self._create_sample_parsed_document()
        result = self.chunker.chunk_parsed_document(doc)

        page1_chunks = [c for c in result.chunks if c.page_number == 1]
        page2_chunks = [c for c in result.chunks if c.page_number == 2]

        self.assertGreaterEqual(len(page1_chunks), 1)
        self.assertGreaterEqual(len(page2_chunks), 1)

        for c in page1_chunks:
            self.assertIn("Page 1", c.page_or_section)
            self.assertIn("Modus Operandi", c.section_title)

        for c in page2_chunks:
            self.assertIn("Page 2", c.page_or_section)
            self.assertIn("Payment Routing", c.section_title)

    def test_short_block_produces_single_chunk(self):
        chunks = self.chunker.chunk_block(
            source_id="SRC004",
            document_id="DOC_SRC004_12345678",
            section_title="Grievance Redressal",
            text="Investors can lodge complaints through the official SEBI SCORES portal.",
            page_number=1,
        )

        self.assertEqual(len(chunks), 1)
        c = chunks[0]
        self.assertEqual(c.source_id, "SRC004")
        self.assertEqual(c.document_id, "DOC_SRC004_12345678")
        self.assertEqual(c.page_or_section, "Page 1 / Grievance Redressal")
        self.assertIn("SCORES portal", c.text)

    def test_cli_dry_run_executes_cleanly(self):
        code = run_chunking_process(
            source_id=None,
            all_sources=True,
            dry_run=True,
        )
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
