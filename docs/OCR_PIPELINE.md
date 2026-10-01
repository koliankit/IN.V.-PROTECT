# Optical Character Recognition (OCR) Pipeline

Sangyan AI Investor Shield supports the ingestion of scanned regulatory circulars, screenshot submissions, and infographic advisories.

## 1. Governance & Provenance Constraints

1. **OCR Confidence Preservation**:
   - Every extracted textual block retains a normalized confidence score between `0.0` and `1.0`.
   - The overall document report records `average_confidence`.
   - Confidence metrics prevent low-fidelity or hallucinatory text from entering downstream reasoning without explicit uncertainty weighting.
2. **Page & Source Provenance**:
   - Multi-page scanned documents preserve 1-indexed `page_number` on every block.
   - Blocks are immutably tied to `source_id` and `source_filename`.
3. **Safe Environment Fallback & Limitation Reporting**:
   - When external OCR binaries (such as `tesseract-ocr`) are not present in the runtime environment, the pipeline gracefully executes a non-blocking heuristic image analysis fallback.
   - It marks `fallback_applied=True` and clearly documents the environmental limitation in `limitations_noted` without fabricating text or crashing.

## 2. CLI Usage

### Check file in dry-run mode:
```bash
python scripts/run_ocr.py --file-path path/to/document.png --dry-run
```

### Run OCR on an image:
```bash
python scripts/run_ocr.py --file-path path/to/advisory.png --source-id SRC001
```

### Run OCR on a scanned multi-page PDF:
```bash
python scripts/run_ocr.py --file-path path/to/scanned_circular.pdf --source-id SRC002
```
