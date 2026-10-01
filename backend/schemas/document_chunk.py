"""
Document Chunking Schema.
Defines schemas for retrieval-friendly document passages.
Strictly requires every chunk to retain source_id, document_id, page/section, and text.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    chunk_id: str = Field(..., description="Unique deterministic chunk identifier")
    source_id: str = Field(..., min_length=2, description="Canonical source ID (e.g. SRC001)")
    document_id: str = Field(..., min_length=2, description="Parent document identifier")
    page_or_section: str = Field(..., min_length=1, description="Page number and/or section descriptor")
    page_number: Optional[int] = Field(None, ge=1, description="Physical 1-indexed page number if known")
    section_title: str = Field(..., min_length=1, description="Associated section or heading title")
    text: str = Field(..., min_length=10, description="Retrieval-friendly passage text")
    token_count_approx: int = Field(..., ge=1, description="Approximate word/token count in passage")
    chunk_index: int = Field(..., ge=0, description="Sequential 0-indexed position within document")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Provenance metadata (publisher, URL, etc.)")


class ChunkingConfig(BaseModel):
    max_chunk_size_chars: int = Field(600, ge=100, le=2000)
    min_chunk_size_chars: int = Field(80, ge=20, le=500)
    chunk_overlap_chars: int = Field(80, ge=0, le=300)


class ChunkingResult(BaseModel):
    document_id: str = Field(..., description="Parent document ID")
    source_id: str = Field(..., description="Parent source ID")
    total_chunks: int = Field(..., ge=0)
    chunks: List[DocumentChunk] = Field(default_factory=list)
    average_chunk_size: float = Field(..., ge=0.0)
