"""
OCR Execution Script.
Runs OCR on scanned PDFs or image artifacts while strictly preserving
OCR confidence metrics, physical page numbers, and source provenance.

Usage:
    python scripts/run_ocr.py --file-path path/to/image.png --source-id SRC001
    python scripts/run_ocr.py --file-path path/to/scan.pdf --source-id SRC002 --dry-run
"""
import argparse
import os
import sys

from backend.core.ocr_pipeline import OCRPipeline


def run_ocr_tool(
    file_path: str,
    source_id: str,
    dry_run: bool,
) -> int:
    if not os.path.isfile(file_path):
        print(f"[ERROR] Target file does not exist: {file_path}")
        return 1

    fn = os.path.basename(file_path)
    ext = fn.split(".")[-1].lower()

    print(f"=== Sangyan AI OCR Pipeline (Dry Run: {dry_run}) ===")
    print(f"Target: {file_path}")
    print(f"  Source ID: {source_id}")
    print(f"  Extension: {ext.upper()}")

    if dry_run:
        print("  [DRY-RUN] File verified. OCR execution skipped.")
        return 0

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    pipeline = OCRPipeline()

    if ext == "pdf":
        result = pipeline.process_scanned_pdf_bytes(
            pdf_bytes=file_bytes,
            source_id=source_id,
            filename=fn,
        )
    else:
        result = pipeline.process_image_bytes(
            image_bytes=file_bytes,
            source_id=source_id,
            filename=fn,
        )

    print(f"\n[SUCCESS] OCR Completed")
    print(f"  Engine Used: {result.engine_used.value}")
    print(f"  Total Pages: {result.total_pages}")
    print(f"  Average Confidence: {result.average_confidence:.2%}")
    print(f"  Blocks Extracted: {len(result.blocks)}")
    if result.fallback_applied and result.limitations_noted:
        print(f"  Note: {result.limitations_noted}")

    print("\nSample Extracted Text:")
    for b in result.blocks[:2]:
        print(f"  [Page {b.page_number} | Conf: {b.confidence:.2%}] {b.text[:120]}...")

    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Run OCR on scanned PDFs and images.")
    parser.add_argument("--file-path", type=str, required=True, help="Path to input image or scanned PDF")
    parser.add_argument("--source-id", type=str, default="SRC_UNSPECIFIED", help="Canonical source identifier")
    parser.add_argument("--dry-run", action="store_true", help="Simulate OCR execution without processing")

    args = parser.parse_args()
    code = run_ocr_tool(
        file_path=args.file_path,
        source_id=args.source_id,
        dry_run=args.dry_run,
    )
    sys.exit(code)


if __name__ == "__main__":
    main()
