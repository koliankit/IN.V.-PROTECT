"""
Document Parser Schema.
Defines schemas for extracting text from official HTML and PDF sources
while strictly preserving title, publisher, dates, page numbers, headings,
and statutory source references.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ParsedDocumentMetadata(BaseModel):
    source_id: str = Field(..., description="Canonical source ID (e.g. SRC001)")
    title: str = Field(..., min_length=2, description="Official title of document")
    publisher: str = Field(..., min_length=2, description="Statutory authority or ministry")
    publication_date: Optional[str] = Field(None, description="ISO publication date (YYYY-MM-DD)")
    retrieved_at: str = Field(..., description="ISO 8601 UTC timestamp of retrieval/parsing")
    source_url: str = Field(..., description="Authoritative origin URL")
    source_reference: str = Field(..., description="Official circular/advisory reference or citation")
    document_format: str = Field(..., description="Format: html, pdf, json")
    content_hash: str = Field(..., description="SHA-256 digest of original raw document")
    extra_metadata: Dict[str, Any] = Field(default_factory=dict)


class ParsedDocumentBlock(BaseModel):
    block_id: str = Field(..., description="Unique block identifier within document")
    page_number: Optional[int] = Field(None, ge=1, description="1-indexed physical page number (for PDFs)")
    heading: str = Field(..., min_length=1, description="Associated section or DOM heading")
    heading_level: int = Field(1, ge=1, le=6, description="Heading level hierarchy (1-6)")
    text: str = Field(..., min_length=1, description="Extracted clean textual content")
    bullet_points: List[str] = Field(default_factory=list, description="Extracted individual key takeaway points")
    source_reference: str = Field(..., description="Statutory citation reference bound to this block")


class ParsedDocument(BaseModel):
    document_id: str = Field(..., description="Unique parsed document identifier")
    metadata: ParsedDocumentMetadata
    total_pages: Optional[int] = Field(None, ge=1, description="Total page count if multi-page")
    total_blocks: int = Field(..., ge=0, description="Total number of structured blocks extracted")
    blocks: List[ParsedDocumentBlock] = Field(default_factory=list)
    full_text: str = Field(..., min_length=1, description="Consolidated document text")
