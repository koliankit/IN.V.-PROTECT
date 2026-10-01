"""
Vector Index Engine.
Provides vector similarity indexing with strong metadata filtering by publisher,
source type, date range, and topic, supporting standalone local operation and pgvector DDL generation.
"""
import json
import math
import os
import re
from typing import Any, Dict, List, Optional

from backend.schemas.vector_index import (
    VectorIndexItem,
    VectorMetadata,
    VectorQueryFilter,
    VectorSearchResult,
)


class VectorIndex:
    def __init__(self, index_path: Optional[str] = None):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.index_path = index_path or os.path.join(base_dir, "data", "indexes", "vector_index.json")
        self._items: Dict[str, VectorIndexItem] = {}
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        self.load_index()

    def add_item(self, item: VectorIndexItem) -> None:
        self._items[item.id] = item

    def add_batch(self, items: List[VectorIndexItem]) -> None:
        for it in items:
            self._items[it.id] = it

    def get_item(self, item_id: str) -> Optional[VectorIndexItem]:
        return self._items.get(item_id)

    def total_count(self) -> int:
        return len(self._items)

    def save_index(self) -> None:
        serializable = [it.model_dump() for it in self._items.values()]
        with open(self.index_path, "w", encoding="utf-8") as f:
            json.dump(serializable, f, indent=2)

    def load_index(self) -> None:
        if not os.path.isfile(self.index_path):
            return
        try:
            with open(self.index_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            for raw in data:
                item = VectorIndexItem(**raw)
                self._items[item.id] = item
        except Exception:
            pass

    @staticmethod
    def _cosine_similarity(v1: List[float], v2: List[float]) -> float:
        if len(v1) != len(v2):
            return 0.0
        dot = sum(a * b for a, b in zip(v1, v2))
        return round(float(dot), 6)

    def _matches_filter(self, meta: VectorMetadata, q_filter: Optional[VectorQueryFilter]) -> bool:
        if q_filter is None:
            return True

        # 1. Filter by publisher (case-insensitive substring, alias, or acronym)
        if q_filter.publisher:
            req_pub = q_filter.publisher.strip().lower()
            pub_lower = meta.publisher.lower()
            words = [w for w in re.split(r"[\s/]+", pub_lower) if w]
            acronym_all = "".join(w[0] for w in words)
            acronym_nostop = "".join(w[0] for w in words if w not in {"of", "and", "the", "for", "in"})
            matches_acronym = req_pub in (acronym_all, acronym_nostop)
            if req_pub not in pub_lower and not matches_acronym and pub_lower not in req_pub:
                return False

        # 2. Filter by source_type (case-insensitive match)
        if q_filter.source_type:
            req_type = q_filter.source_type.strip().lower()
            if req_type != meta.source_type.strip().lower():
                return False

        # 3. Filter by topic (case-insensitive match)
        if q_filter.topic:
            req_topic = q_filter.topic.strip().lower()
            item_topic = (meta.topic or "").strip().lower()
            if req_topic not in item_topic:
                return False

        # 4. Filter by date_after (YYYY-MM-DD)
        if q_filter.date_after:
            if not meta.publication_date or meta.publication_date < q_filter.date_after:
                return False

        # 5. Filter by date_before (YYYY-MM-DD)
        if q_filter.date_before:
            if not meta.publication_date or meta.publication_date > q_filter.date_before:
                return False

        return True

    def query(
        self,
        query_vector: List[float],
        top_k: int = 5,
        filters: Optional[VectorQueryFilter] = None,
    ) -> List[VectorSearchResult]:
        """
        Executes vector similarity search with strong metadata filtering.
        """
        candidates: List[VectorSearchResult] = []

        for item in self._items.values():
            if not self._matches_filter(item.metadata, filters):
                continue

            score = self._cosine_similarity(query_vector, item.vector)
            candidates.append(
                VectorSearchResult(
                    id=item.id,
                    score=score,
                    text=item.text,
                    metadata=item.metadata,
                )
            )

        # Sort descending by score
        candidates.sort(key=lambda x: x.score, reverse=True)
        return candidates[:top_k]

    @staticmethod
    def generate_pgvector_sql(dimensions: int = 128) -> str:
        """
        Generates production pgvector PostgreSQL DDL with strong metadata columns and HNSW index.
        """
        return f"""-- Production pgvector DDL for Sangyan AI Knowledge Base
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_vector_index (
    id VARCHAR(128) PRIMARY KEY,
    vector vector({dimensions}) NOT NULL,
    text TEXT NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    publication_date VARCHAR(32),
    topic VARCHAR(128),
    title VARCHAR(512) NOT NULL,
    source_url TEXT NOT NULL,
    page_or_section VARCHAR(255) NOT NULL,
    extra_metadata JSONB DEFAULT '{{}}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HNSW Vector Index for fast cosine search
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_hnsw 
ON knowledge_vector_index 
USING hnsw (vector vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Metadata Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_vector_publisher ON knowledge_vector_index(publisher);
CREATE INDEX IF NOT EXISTS idx_vector_source_type ON knowledge_vector_index(source_type);
CREATE INDEX IF NOT EXISTS idx_vector_topic ON knowledge_vector_index(topic);
CREATE INDEX IF NOT EXISTS idx_vector_pub_date ON knowledge_vector_index(publication_date);
"""
