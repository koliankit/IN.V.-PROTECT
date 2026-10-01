"""
Official Document Downloader & Parser Schema.
Defines schemas for statutory regulatory document ingestion (SEBI, I4C, RBI, CERT-In),
section extraction, raw file preservation, and snapshot metadata.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class OfficialDocumentFormat(str, Enum):
    HTML = "html"
    PDF = "pdf"
    JSON = "json"


class OfficialParsedSection(BaseModel):
    section_id: str = Field(..., description="Unique section identifier within document")
    section_title: str = Field(..., min_length=1, description="Section heading or descriptive title")
    page_or_heading: Optional[str] = Field(None, description="Page number or DOM heading level")
    content: str = Field(..., min_length=1, description="Sanitized textual content of section")
    key_takeaways: List[str] = Field(default_factory=list, description="Extracted advisory bullet points")


class OfficialDocumentSnapshot(BaseModel):
    source_id: str = Field(..., description="Canonical source ID matching official registry (e.g. SRC001)")
    title: str = Field(..., description="Title of official circular or advisory")
    publisher: str = Field(..., description="Authoritative statutory publisher")
    source_url: str = Field(..., description="Official government / regulatory URL")
    format: OfficialDocumentFormat = Field(..., description="Document format (html, pdf, json)")
    raw_file_path: str = Field(..., description="Local path to preserved raw document")
    content_hash: str = Field(..., description="Cryptographic SHA-256 hash of raw document bytes")
    downloaded_at: str = Field(..., description="ISO 8601 UTC timestamp of ingestion")
    parsed_sections_count: int = Field(..., ge=0)
    sections: List[OfficialParsedSection] = Field(default_factory=list)
    parser_used: str = Field(..., description="Identifier of parser used (e.g. controlled_html, controlled_pdf)")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Supplementary provenance metadata")
