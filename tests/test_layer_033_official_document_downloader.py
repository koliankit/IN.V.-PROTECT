"""
Validation Test for Layer 033: Official document downloader.
Verifies controlled downloading and parsing of approved official HTML/PDF sources,
raw file preservation, SHA-256 hash generation, and section extraction.
"""
import hashlib
import json
import os
import shutil
import tempfile
import unittest

from backend.core.official_downloader import (
    ControlledHTMLParser,
    ControlledPDFParser,
    OfficialDocumentDownloader,
)
from backend.core.sources import SourceRegistry
from backend.schemas.official_downloader import OfficialDocumentFormat
from scripts.download_official_documents import run_official_downloader


class TestLayer033OfficialDocumentDownloader(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.raw_dir = os.path.join(self.temp_dir, "raw", "official")
        self.manifest_path = os.path.join(self.temp_dir, "official_document_snapshots.json")
        self.registry_manifest = os.path.join(self.temp_dir, "official_source_registry.json")

        # Mock official registry
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
        self.downloader = OfficialDocumentDownloader(
            raw_official_dir=self.raw_dir,
            manifest_path=self.manifest_path,
            registry=self.registry,
        )

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_html_parser_cleans_tags_and_extracts_headings(self):
        sample_html = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>body { font-size: 14px; }</style>
            <script>function track() { console.log('tracking'); }</script>
        </head>
        <body>
            <nav><a href="/home">Home</a></nav>
            <h1>SEBI Statutory Investor Protection Notice</h1>
            <p>Investors are advised that no SEBI registered intermediary promises guaranteed returns.</p>
            <h2>Modus Operandi of Fake Trading Apps</h2>
            <p>Perpetrators create WhatsApp groups luring victims with simulated profit dashboards.</p>
            <p>Funds are routed into personal accounts and arbitrary UPI handles.</p>
            <footer>Copyright SEBI 2024</footer>
        </body>
        </html>
        """
        parser = ControlledHTMLParser()
        parser.feed(sample_html)
        sections = parser.get_parsed_sections("Default Title")

        self.assertGreaterEqual(len(sections), 2)
        titles = [s.section_title for s in sections]
        self.assertTrue(any("Modus Operandi" in t for t in titles))

        # Check script / style contents are dropped
        all_content = " ".join(s.content for s in sections)
        self.assertNotIn("console.log", all_content)
        self.assertNotIn("font-size", all_content)
        self.assertIn("guaranteed returns", all_content)

    def test_pdf_parser_extracts_text_streams(self):
        mock_pdf_stream = (
            b"%PDF-1.4\n"
            b"1 0 obj\n"
            b"<< /Length 85 >>\n"
            b"stream\n"
            b"BT\n"
            b"/F1 12 Tf\n"
            b"(Fraudulent apps simulate market prices and display fake profits on dashboards.) Tj\n"
            b"ET\n"
            b"endstream\n"
            b"endobj\n"
        )
        sections = ControlledPDFParser.extract_text_from_pdf_bytes(
            mock_pdf_stream, "SEBI Fake Trading Apps"
        )
        self.assertGreaterEqual(len(sections), 1)
        self.assertIn("Fraudulent apps simulate market prices", sections[0].content)

    def test_reject_unregistered_source(self):
        with self.assertRaises(ValueError):
            self.downloader.fetch_and_parse("SRC_UNREGISTERED_999")

    def test_fetch_and_parse_preserves_raw_file_and_hash(self):
        mock_html_bytes = b"<h1>Official Portal</h1><p>Grievance lodging steps via SCORES portal.</p>"
        expected_hash = hashlib.sha256(mock_html_bytes).hexdigest()

        snapshot = self.downloader.fetch_and_parse(
            source_id="SRC004",
            mock_bytes=mock_html_bytes,
        )

        self.assertEqual(snapshot.source_id, "SRC004")
        self.assertEqual(snapshot.format, OfficialDocumentFormat.HTML)
        self.assertEqual(snapshot.content_hash, f"sha256:{expected_hash}")
        self.assertEqual(snapshot.parser_used, "controlled_html")
        self.assertGreaterEqual(snapshot.parsed_sections_count, 1)

        # Raw file is saved under data/raw/official/
        raw_file = os.path.join(self.raw_dir, "SRC004.html")
        self.assertTrue(os.path.isfile(raw_file))
        with open(raw_file, "rb") as f:
            self.assertEqual(f.read(), mock_html_bytes)

        # Manifest is recorded
        manifest_snapshots = self.downloader.get_snapshots()
        self.assertEqual(len(manifest_snapshots), 1)
        self.assertEqual(manifest_snapshots[0].source_id, "SRC004")

    def test_cli_dry_run_executes_cleanly(self):
        exit_code = run_official_downloader(
            source_id=None,
            all_sources=True,
            dry_run=True,
            force=False,
        )
        self.assertEqual(exit_code, 0)


if __name__ == "__main__":
    unittest.main()
