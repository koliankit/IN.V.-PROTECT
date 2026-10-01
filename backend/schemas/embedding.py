"""
Embedding Pipeline Schema.
Defines schemas for vector embeddings generated exclusively from approved knowledge-base content,
recording embedding model, version, dimensions, and complete source metadata.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EmbeddingRecord(BaseModel):
    embedding_id: str = Field(..., description="Unique embedding identifier (e.g. EMB_SRC001_001)")
    chunk_id: str = Field(..., min_length=2, description="Target chunk ID referencing chunks.chunk_id")
    source_id: str = Field(..., min_length=2, description="Parent source ID referencing sources.source_id")
    document_id: str = Field(..., min_length=2, description="Parent document ID referencing documents.document_id")
    model_name: str = Field(..., description="Canonical embedding model identifier")
    model_version: str = Field(..., description="Model version tag or checkpoint")
    dimensions: int = Field(..., ge=1, description="Dimensionality of embedding vector")
    vector: List[float] = Field(..., min_length=1, description="Dense floating-point embedding vector")
    is_normalized: bool = Field(True, description="Whether vector is normalized to unit Euclidean length (L2 norm = 1.0)")
    source_metadata: Dict[str, Any] = Field(..., description="Provenance metadata (publisher, title, content_hash, license)")
    generated_at: str = Field(..., description="ISO 8601 UTC timestamp of embedding generation")


class EmbeddingBatchResult(BaseModel):
    source_id: str
    total_chunks_processed: int
    embeddings_generated: int
    model_name: str
    model_version: str
    dimensions: int
    is_fallback: bool
    limitations_noted: Optional[str] = None
    records: List[EmbeddingRecord] = Field(default_factory=list)
