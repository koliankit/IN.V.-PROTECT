"""
Knowledge Base Database Schemas.
Defines Pydantic entity models for sources, documents, chunks, claims, and citations,
enforcing relational integrity and provenance bindings.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SourceEntity(BaseModel):
    source_id: str = Field(..., min_length=2, description="Unique primary key (e.g. SRC001)")
    publisher: str = Field(..., min_length=2, description="Statutory publisher authority")
    title: str = Field(..., min_length=2, description="Official title of circular or advisory")
    url: str = Field(..., min_length=5, description="Authoritative portal or advisory URL")
    license: str = Field(..., min_length=2, description="Applicable public open-data or statutory license")
    source_type: str = Field(..., description="Classification (e.g. official_advisory, official_portal)")
    allowed_use: str = Field(..., description="Permitted use policy (e.g. RAG_evidence_rules)")
    publication_date: Optional[str] = Field(None, description="ISO publication date (YYYY-MM-DD)")
    content_hash: str = Field(..., description="Cryptographic SHA-256 hash")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class DocumentEntity(BaseModel):
    document_id: str = Field(..., min_length=2, description="Unique document primary key")
    source_id: str = Field(..., min_length=2, description="Foreign key referencing sources.source_id")
    title: str = Field(..., min_length=2, description="Parsed document title")
    format: str = Field(..., description="Format: html, pdf, json")
    raw_file_path: str = Field(..., description="Path to raw persisted artifact")
    content_hash: str = Field(..., description="SHA-256 hash of original document")
    total_pages: Optional[int] = Field(1, ge=1)
    total_blocks: int = Field(0, ge=0)
    ingested_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChunkEntity(BaseModel):
    chunk_id: str = Field(..., min_length=2, description="Unique chunk primary key")
    document_id: str = Field(..., min_length=2, description="Foreign key referencing documents.document_id")
    source_id: str = Field(..., min_length=2, description="Foreign key referencing sources.source_id")
    page_or_section: str = Field(..., min_length=1, description="Page number and/or section heading")
    page_number: Optional[int] = Field(None, ge=1)
    section_title: str = Field(..., min_length=1)
    text: str = Field(..., min_length=10, description="Passage text")
    token_count_approx: int = Field(1, ge=1)
    chunk_index: int = Field(0, ge=0)
    embedding_json: Optional[str] = Field(None, description="Serialized embedding vector if generated")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ClaimEntity(BaseModel):
    claim_id: str = Field(..., min_length=2, description="Unique claim primary key (e.g. CLM001)")
    claim_text: str = Field(..., min_length=5, description="Core regulatory claim or scam proposition statement")
    claim_category: str = Field(..., description="Scam taxonomy vector (e.g. guaranteed_returns, telegram_vip)")
    verdict_sentiment: str = Field(..., description="Regulatory stance: refutes, warns_against, mandates")
    chunk_id: Optional[str] = Field(None, description="Foreign key referencing chunks.chunk_id")
    source_id: str = Field(..., min_length=2, description="Foreign key referencing sources.source_id")
    regulatory_reference: str = Field(..., min_length=3, description="Statutory citation")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CitationEntity(BaseModel):
    citation_id: str = Field(..., min_length=2, description="Unique citation primary key")
    analysis_id: Optional[str] = Field(None, description="Associated user analysis execution ID if applicable")
    chunk_id: str = Field(..., min_length=2, description="Foreign key referencing chunks.chunk_id")
    claim_id: Optional[str] = Field(None, description="Foreign key referencing claims.claim_id")
    source_id: str = Field(..., min_length=2, description="Foreign key referencing sources.source_id")
    relevance_score: float = Field(..., ge=0.0, le=1.0, description="Retrieval similarity or relevance confidence")
    citation_quote: str = Field(..., min_length=5, description="Verbatim or summarized passage cited as evidence")
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
