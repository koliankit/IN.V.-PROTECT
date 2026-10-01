"""
OCR Pipeline Schema.
Defines schemas for Optical Character Recognition (OCR) on scanned PDFs and images,
strictly preserving OCR confidence scores, physical page numbers, and source provenance.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class OCREngineType(str, Enum):
    TESSERACT_OCR = "tesseract_ocr"
    HEURISTIC_FALLBACK = "heuristic_fallback"
    MOCK_EVALUATION = "mock_evaluation"


class OCRBlock(BaseModel):
    block_id: str = Field(..., description="Unique block or line identifier")
    page_number: int = Field(1, ge=1, description="1-indexed physical page number")
    text: str = Field(..., min_length=1, description="Recognized textual content")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Normalized OCR confidence score between 0.0 and 1.0")
    bounding_box: Optional[Dict[str, int]] = Field(None, description="Bounding coordinates: x, y, width, height")
    source_id: Optional[str] = Field(None, description="Associated official source ID")
    source_filename: str = Field(..., description="Original filename of processed image or scanned PDF")


class OCRResult(BaseModel):
    source_id: str = Field(..., description="Canonical source ID")
    source_filename: str = Field(..., description="Filename of processed artifact")
    engine_used: OCREngineType = Field(..., description="Underlying OCR engine or fallback used")
    total_pages: int = Field(..., ge=1, description="Total physical pages scanned")
    average_confidence: float = Field(..., ge=0.0, le=1.0, description="Average OCR confidence across all recognized blocks")
    blocks: List[OCRBlock] = Field(default_factory=list, description="Extracted textual blocks with per-block confidence")
    full_extracted_text: str = Field(..., description="Consolidated recognized text")
    processed_at: str = Field(..., description="ISO 8601 UTC timestamp")
    fallback_applied: bool = Field(False, description="Flag indicating if safe heuristic fallback was used")
    limitations_noted: Optional[str] = Field(None, description="Explicit report of environmental or engine limitations")
