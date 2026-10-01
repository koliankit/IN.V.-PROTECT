"""
Vector Index Schema.
Defines schemas for vector index items, strong metadata filtering
(publisher, source type, date range, topic), and similarity search results.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class VectorMetadata(BaseModel):
    publisher: str = Field(..., min_length=2, description="Statutory publisher authority (e.g. SEBI, I4C, RBI)")
    source_type: str = Field(..., description="Classification (e.g. official_advisory, official_portal)")
    publication_date: Optional[str] = Field(None, description="ISO publication date (YYYY-MM-DD)")
    topic: Optional[str] = Field(None, description="Scam topic or category vector (e.g. telegram_vip, fake_apps)")
    title: str = Field(..., description="Document or section title")
    source_url: str = Field(..., description="Authoritative origin URL")
    page_or_section: str = Field(..., description="Page or section citation descriptor")
    extra: Dict[str, Any] = Field(default_factory=dict)


class VectorIndexItem(BaseModel):
    id: str = Field(..., description="Unique chunk or passage identifier")
    vector: List[float] = Field(..., min_length=1, description="Normalized dense embedding vector")
    text: str = Field(..., min_length=10, description="Passage text payload")
    metadata: VectorMetadata


class VectorQueryFilter(BaseModel):
    publisher: Optional[str] = Field(None, description="Case-insensitive substring or exact match for publisher")
    source_type: Optional[str] = Field(None, description="Exact or case-insensitive match for source type")
    topic: Optional[str] = Field(None, description="Exact or case-insensitive match for topic")
    date_after: Optional[str] = Field(None, description="Include documents published on or after (YYYY-MM-DD)")
    date_before: Optional[str] = Field(None, description="Include documents published on or before (YYYY-MM-DD)")


class VectorSearchResult(BaseModel):
    id: str
    score: float = Field(..., ge=-1.0, le=1.0, description="Cosine similarity score")
    text: str
    metadata: VectorMetadata
