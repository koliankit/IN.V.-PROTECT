"""
Database Manager for Knowledge Base.
Manages SQLite/Relational database operations for sources, documents, chunks, claims, and citations,
strictly enforcing relational foreign keys and provenance bindings.
"""
from contextlib import contextmanager
import os
import sqlite3
from typing import Any, Dict, Generator, List, Optional

from backend.schemas.knowledge_base import (
    ChunkEntity,
    CitationEntity,
    ClaimEntity,
    DocumentEntity,
    SourceEntity,
)


class DatabaseManager:
    def __init__(self, db_path: Optional[str] = None):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        source_db = os.path.join(base_dir, "data", "knowledge_base.db")
        if os.getenv("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
            default_db_dir = "/tmp"
            tmp_db = os.path.join(default_db_dir, "knowledge_base.db")
            if not os.path.exists(tmp_db) and os.path.exists(source_db):
                import shutil
                try:
                    shutil.copy2(source_db, tmp_db)
                except Exception:
                    pass
            self.db_path = db_path or os.getenv("SANGYAN_DB_PATH") or tmp_db
        else:
            self.db_path = db_path or os.getenv("SANGYAN_DB_PATH") or source_db
        self.schema_path = os.path.join(base_dir, "backend", "db", "schema.sql")
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    @contextmanager
    def get_connection(self) -> Generator[sqlite3.Connection, None, None]:
        conn = sqlite3.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def init_db(self) -> None:
        if os.path.isfile(self.schema_path):
            with open(self.schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            with self.get_connection() as conn:
                conn.executescript(schema_sql)

    # 1. Sources CRUD
    def insert_source(self, source: SourceEntity) -> None:
        query = """
        INSERT OR REPLACE INTO sources (
            source_id, publisher, title, url, license, source_type,
            allowed_use, publication_date, content_hash, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            conn.execute(
                query,
                (
                    source.source_id,
                    source.publisher,
                    source.title,
                    source.url,
                    source.license,
                    source.source_type,
                    source.allowed_use,
                    source.publication_date,
                    source.content_hash,
                    source.created_at,
                ),
            )

    def get_source(self, source_id: str) -> Optional[SourceEntity]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM sources WHERE source_id = ?", (source_id,)).fetchone()
            if row:
                return SourceEntity(**dict(row))
        return None

    def list_sources(self) -> List[SourceEntity]:
        with self.get_connection() as conn:
            rows = conn.execute("SELECT * FROM sources ORDER BY source_id").fetchall()
            return [SourceEntity(**dict(r)) for r in rows]

    # 2. Documents CRUD
    def insert_document(self, doc: DocumentEntity) -> None:
        query = """
        INSERT OR REPLACE INTO documents (
            document_id, source_id, title, format, raw_file_path,
            content_hash, total_pages, total_blocks, ingested_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            conn.execute(
                query,
                (
                    doc.document_id,
                    doc.source_id,
                    doc.title,
                    doc.format,
                    doc.raw_file_path,
                    doc.content_hash,
                    doc.total_pages,
                    doc.total_blocks,
                    doc.ingested_at,
                ),
            )

    def get_document(self, document_id: str) -> Optional[DocumentEntity]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM documents WHERE document_id = ?", (document_id,)).fetchone()
            if row:
                return DocumentEntity(**dict(row))
        return None

    # 3. Chunks CRUD
    def insert_chunk(self, chunk: ChunkEntity) -> None:
        query = """
        INSERT OR REPLACE INTO chunks (
            chunk_id, document_id, source_id, page_or_section, page_number,
            section_title, text, token_count_approx, chunk_index, embedding_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            conn.execute(
                query,
                (
                    chunk.chunk_id,
                    chunk.document_id,
                    chunk.source_id,
                    chunk.page_or_section,
                    chunk.page_number,
                    chunk.section_title,
                    chunk.text,
                    chunk.token_count_approx,
                    chunk.chunk_index,
                    chunk.embedding_json,
                    chunk.created_at,
                ),
            )

    def get_chunk(self, chunk_id: str) -> Optional[ChunkEntity]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM chunks WHERE chunk_id = ?", (chunk_id,)).fetchone()
            if row:
                return ChunkEntity(**dict(row))
        return None

    def get_chunks_by_document(self, document_id: str) -> List[ChunkEntity]:
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM chunks WHERE document_id = ? ORDER BY chunk_index",
                (document_id,),
            ).fetchall()
            return [ChunkEntity(**dict(r)) for r in rows]

    # 4. Claims CRUD
    def insert_claim(self, claim: ClaimEntity) -> None:
        query = """
        INSERT OR REPLACE INTO claims (
            claim_id, claim_text, claim_category, verdict_sentiment,
            chunk_id, source_id, regulatory_reference, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            conn.execute(
                query,
                (
                    claim.claim_id,
                    claim.claim_text,
                    claim.claim_category,
                    claim.verdict_sentiment,
                    claim.chunk_id,
                    claim.source_id,
                    claim.regulatory_reference,
                    claim.created_at,
                ),
            )

    def get_claim(self, claim_id: str) -> Optional[ClaimEntity]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM claims WHERE claim_id = ?", (claim_id,)).fetchone()
            if row:
                return ClaimEntity(**dict(row))
        return None

    # 5. Citations CRUD
    def insert_citation(self, citation: CitationEntity) -> None:
        query = """
        INSERT OR REPLACE INTO citations (
            citation_id, analysis_id, chunk_id, claim_id, source_id,
            relevance_score, citation_quote, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            conn.execute(
                query,
                (
                    citation.citation_id,
                    citation.analysis_id,
                    citation.chunk_id,
                    citation.claim_id,
                    citation.source_id,
                    citation.relevance_score,
                    citation.citation_quote,
                    citation.created_at,
                ),
            )

    def get_citation(self, citation_id: str) -> Optional[CitationEntity]:
        with self.get_connection() as conn:
            row = conn.execute("SELECT * FROM citations WHERE citation_id = ?", (citation_id,)).fetchone()
            if row:
                return CitationEntity(**dict(row))
        return None

    def get_citations_for_chunk(self, chunk_id: str) -> List[CitationEntity]:
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM citations WHERE chunk_id = ? ORDER BY relevance_score DESC",
                (chunk_id,),
            ).fetchall()
            return [CitationEntity(**dict(r)) for r in rows]


db_manager = DatabaseManager()


def get_db_connection() -> sqlite3.Connection:
    return sqlite3.connect(db_manager.db_path)

