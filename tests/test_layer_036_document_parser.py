"""
Validation Test for Layer 036: Document parser.
Verifies extraction of text from official HTML and PDF sources while strictly preserving
title, publisher, dates, page numbers, headings, and statutory source references.
"""
import json
import os
import shutil
import tempfile
import unittest

from backend.core.document_parser import UnifiedDocumentParser
from backend.core.sources import SourceRegistry
from scripts.parse_official_documents import run_document_parsing


class TestLayer036DocumentParser(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.registry_manifest = os.path.join(self.temp_dir, "official_source_registry.json")

        mock_registry_data = [
            {
                "source_id": "SRC001",
                "publisher": "SEBI Investor",
                "title": "Fake Trading App Scam Landscape",
                "url": "https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                "license": "Government Public Advisory",
                "publication_date": "2024-02-26",
                "retrieved_at": "2026-09-30T12:00:00Z",
                "content_hash": "sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
                "source_type": "official_advisory",
                "allowed_use": "RAG_evidence_rules",
            },
            {
                "source_id": "SRC004",
                "publisher": "SEBI Investor",
                "title": "Investor Support",
                "url": "https://investor.sebi.gov.in/Investor-support.html",
                "license": "Government Public Service Portal",
                "publication_date": None,
                "retrieved_at": "2026-09-30T12:00:00Z",
                "content_hash": "sha256:d8c525f25bf6034177d468087ab2ebf2a74c2e64ca620b784f1faee31cf64739",
                "source_type": "official_portal",
                "allowed_use": "verification_grievance",
            },
        ]
        with open(self.registry_manifest, "w", encoding="utf-8") as f:
            json.dump(mock_registry_data, f)

        self.registry = SourceRegistry(self.registry_manifest)
        self.parser = UnifiedDocumentParser(registry=self.registry)

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_html_parsing_preserves_all_required_attributes(self):
        sample_html = """
        <html>
        <head><title>Official SEBI Advisory on Cyber Scams</title></head>
        <body>
            <h1>Statutory Investor Advisory</h1>
            <p>SEBI cautions investors against fraudulent schemes promising guaranteed profits.</p>
            <h2>Modus Operandi</h2>
            <p>Perpetrators create fake VIP WhatsApp groups offering institutional trading access.</p>
            <ul>
                <li>Never share Demat credentials</li>
                <li>Verify broker registration on sebi.gov.in</li>
            </ul>
        </body>
        </html>
        """.encode("utf-8")

        doc = self.parser.parse_document(
            source_id="SRC004",
            content_bytes=sample_html,
            file_format="html",
        )

        # 1. Title preserved
        self.assertEqual(doc.metadata.title, "Official SEBI Advisory on Cyber Scams")
        # 2. Publisher preserved
        self.assertEqual(doc.metadata.publisher, "SEBI Investor")
        # 3. Source reference preserved
        self.assertIn("SEBI Investor / SRC004", doc.metadata.source_reference)
        # 4. Total pages defined
        self.assertEqual(doc.total_pages, 1)

        # 5. Headings and levels preserved in blocks
        headings = [b.heading for b in doc.blocks]
        self.assertTrue(any("Statutory Investor Advisory" in h for h in headings))
        self.assertTrue(any("Modus Operandi" in h for h in headings))

        for b in doc.blocks:
            # 6. Page numbers preserved
            self.assertEqual(b.page_number, 1)
            # 7. Source reference bound to block
            self.assertEqual(b.source_reference, doc.metadata.source_reference)
            self.assertGreater(len(b.text), 5)

    def test_pdf_parsing_preserves_page_numbers_and_headings(self):
        # Multi-page simulated PDF byte stream with /Type /Page
        mock_pdf = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            b"2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj\n"
            b"3 0 obj << /Type /Page /Contents 5 0 R >> endobj\n"
            b"5 0 obj << /Length 70 >> stream\n"
            b"BT /F1 12 Tf (Modus Operandi of Fake Trading Apps on Telegram.) Tj ET\n"
            b"endstream endobj\n"
            b"4 0 obj << /Type /Page /Contents 6 0 R >> endobj\n"
            b"6 0 obj << /Length 70 >> stream\n"
            b"BT /F1 12 Tf (Routing funds to unauthorized personal mule accounts.) Tj ET\n"
            b"endstream endobj\n"
            b"xref\ntrailer << /Root 1 0 R >>\nstartxref\n%%EOF"
        )

        doc = self.parser.parse_document(
            source_id="SRC001",
            content_bytes=mock_pdf,
            file_format="pdf",
        )

        # 1. Title preserved
        self.assertEqual(doc.metadata.title, "Fake Trading App Scam Landscape")
        # 2. Publisher preserved
        self.assertEqual(doc.metadata.publisher, "SEBI Investor")
        # 3. Publication date preserved
        self.assertEqual(doc.metadata.publication_date, "2024-02-26")
        # 4. Multi-page pagination preserved
        self.assertGreaterEqual(doc.total_pages or 0, 2)

        # 5. Page numbers preserved on blocks
        page_numbers = {b.page_number for b in doc.blocks}
        self.assertIn(1, page_numbers)
        self.assertIn(2, page_numbers)

        # 6. Headings and source references preserved
        for b in doc.blocks:
            self.assertIsNotNone(b.heading)
            self.assertIn("SRC001", b.source_reference)

    def test_json_evidence_parsing(self):
        sample_json = json.dumps({
            "title": "SEBI Fake Trading Apps",
            "publication_date": "2024-02-26",
            "sections": [
                {
                    "section_title": "Telegram VIP Fraud",
                    "page_number": 1,
                    "content": "Fraudsters create fake groups promising guaranteed profits.",
                    "key_takeaways": ["Guaranteed return claims are fraudulent"]
                },
                {
                    "section_title": "Mule Accounts",
                    "page_number": 2,
                    "content": "Funds directed to personal bank accounts.",
                    "key_takeaways": ["Mule bank account routing"]
                }
            ]
        }).encode("utf-8")

        doc = self.parser.parse_document("SRC001", sample_json, "json")

        self.assertEqual(doc.total_pages, 2)
        self.assertEqual(len(doc.blocks), 2)
        self.assertEqual(doc.blocks[0].page_number, 1)
        self.assertEqual(doc.blocks[1].page_number, 2)
        self.assertEqual(doc.blocks[0].heading, "Telegram VIP Fraud")
        self.assertEqual(len(doc.blocks[0].bullet_points), 1)

    def test_cli_dry_run_executes_cleanly(self):
        code = run_document_parsing(
            source_id=None,
            all_sources=True,
            dry_run=True,
        )
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
