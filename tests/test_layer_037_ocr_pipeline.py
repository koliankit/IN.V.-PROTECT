"""
Validation Test for Layer 037: OCR pipeline.
Verifies OCR extraction on scanned PDFs and images while strictly preserving
OCR confidence metrics, physical page numbers, and source provenance.
"""
import io
import os
import shutil
import tempfile
import unittest
from PIL import Image

from backend.core.ocr_pipeline import OCRPipeline
from backend.schemas.ocr import OCREngineType
from scripts.run_ocr import run_ocr_tool


class TestLayer037OCRPipeline(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.pipeline = OCRPipeline()

    def tearDown(self):
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def _create_sample_png(self, width: int = 800, height: int = 600) -> bytes:
        img = Image.new("RGB", (width, height), color=(255, 255, 255))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    def test_process_image_bytes_preserves_confidence_and_page(self):
        png_bytes = self._create_sample_png()

        result = self.pipeline.process_image_bytes(
            image_bytes=png_bytes,
            source_id="SRC001",
            filename="advisory_scan.png",
            page_number=1,
        )

        self.assertEqual(result.source_id, "SRC001")
        self.assertEqual(result.source_filename, "advisory_scan.png")
        self.assertEqual(result.total_pages, 1)
        self.assertGreaterEqual(result.average_confidence, 0.0)
        self.assertLessEqual(result.average_confidence, 1.0)
        self.assertGreaterEqual(len(result.blocks), 1)

        for b in result.blocks:
            self.assertEqual(b.page_number, 1)
            self.assertEqual(b.source_id, "SRC001")
            self.assertEqual(b.source_filename, "advisory_scan.png")
            self.assertGreaterEqual(b.confidence, 0.0)
            self.assertLessEqual(b.confidence, 1.0)

    def test_mock_text_evaluation_preserves_high_confidence(self):
        png_bytes = self._create_sample_png()
        mock_text = "SEBI circular warning against fake IPO allotment schemes on Telegram"

        result = self.pipeline.process_image_bytes(
            image_bytes=png_bytes,
            source_id="SRC002",
            filename="telegram_scam.png",
            page_number=2,
            mock_text=mock_text,
            mock_confidence=0.965,
        )

        self.assertEqual(result.engine_used, OCREngineType.MOCK_EVALUATION)
        self.assertEqual(result.average_confidence, 0.965)
        self.assertEqual(len(result.blocks), 1)
        self.assertEqual(result.blocks[0].page_number, 2)
        self.assertEqual(result.blocks[0].text, mock_text)
        self.assertEqual(result.blocks[0].confidence, 0.965)

    def test_scanned_pdf_bytes_preserves_multi_page_numbering(self):
        # Multi-page simulated scanned PDF byte stream
        mock_pdf = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            b"2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R 5 0 R] /Count 3 >> endobj\n"
            b"3 0 obj << /Type /Page /Subtype /Image >> endobj\n"
            b"4 0 obj << /Type /Page /Subtype /Image >> endobj\n"
            b"5 0 obj << /Type /Page /Subtype /Image >> endobj\n"
            b"trailer << /Root 1 0 R >>\n%%EOF"
        )

        result = self.pipeline.process_scanned_pdf_bytes(
            pdf_bytes=mock_pdf,
            source_id="SRC005",
            filename="rbi_scanned_circular.pdf",
        )

        self.assertEqual(result.source_id, "SRC005")
        self.assertGreaterEqual(result.total_pages, 3)
        self.assertEqual(len(result.blocks), result.total_pages)

        # Check strict sequential 1-indexed page numbering
        page_numbers = [b.page_number for b in result.blocks]
        self.assertEqual(page_numbers, [1, 2, 3])

        for b in result.blocks:
            self.assertEqual(b.source_id, "SRC005")
            self.assertGreaterEqual(b.confidence, 0.0)
            self.assertLessEqual(b.confidence, 1.0)

    def test_fallback_documents_limitations_transparently(self):
        png_bytes = self._create_sample_png()
        result = self.pipeline.process_image_bytes(
            image_bytes=png_bytes,
            source_id="SRC003",
            filename="notice.png",
        )

        if result.engine_used == OCREngineType.HEURISTIC_FALLBACK:
            self.assertTrue(result.fallback_applied)
            self.assertIsNotNone(result.limitations_noted)
            self.assertIn("Tesseract", result.limitations_noted or "")

    def test_cli_dry_run_executes_cleanly(self):
        sample_path = os.path.join(self.temp_dir, "test_doc.png")
        img = Image.new("RGB", (400, 300), color=(255, 255, 255))
        img.save(sample_path)

        code = run_ocr_tool(
            file_path=sample_path,
            source_id="SRC006",
            dry_run=True,
        )
        self.assertEqual(code, 0)


if __name__ == "__main__":
    unittest.main()
