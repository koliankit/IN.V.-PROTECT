-- Knowledge Base Database Schema
-- Provides relational grounding and cryptographic provenance for regulatory evidence,
-- covering sources, documents, chunks, claims, and citations.

PRAGMA foreign_keys = ON;

-- 1. Authoritative Statutory & Verified Sources
CREATE TABLE IF NOT EXISTS sources (
    source_id VARCHAR(64) PRIMARY KEY,
    publisher VARCHAR(255) NOT NULL,
    title VARCHAR(512) NOT NULL,
    url TEXT NOT NULL,
    license VARCHAR(255) NOT NULL,
    source_type VARCHAR(64) NOT NULL,
    allowed_use VARCHAR(64) NOT NULL,
    publication_date VARCHAR(32),
    content_hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- 2. Ingested Regulatory Documents
CREATE TABLE IF NOT EXISTS documents (
    document_id VARCHAR(128) PRIMARY KEY,
    source_id VARCHAR(64) NOT NULL,
    title VARCHAR(512) NOT NULL,
    format VARCHAR(32) NOT NULL,
    raw_file_path TEXT NOT NULL,
    content_hash VARCHAR(128) NOT NULL,
    total_pages INTEGER DEFAULT 1,
    total_blocks INTEGER DEFAULT 0,
    ingested_at TIMESTAMP NOT NULL,
    FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_documents_source_id ON documents(source_id);

-- 3. Retrieval-Friendly Passage Chunks
CREATE TABLE IF NOT EXISTS chunks (
    chunk_id VARCHAR(128) PRIMARY KEY,
    document_id VARCHAR(128) NOT NULL,
    source_id VARCHAR(64) NOT NULL,
    page_or_section VARCHAR(255) NOT NULL,
    page_number INTEGER,
    section_title VARCHAR(512) NOT NULL,
    text TEXT NOT NULL,
    token_count_approx INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding_json TEXT,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_source_id ON chunks(source_id);

-- 4. Extracted Statutory Claims & Stances
CREATE TABLE IF NOT EXISTS claims (
    claim_id VARCHAR(64) PRIMARY KEY,
    claim_text TEXT NOT NULL,
    claim_category VARCHAR(128) NOT NULL,
    verdict_sentiment VARCHAR(64) NOT NULL,
    chunk_id VARCHAR(128),
    source_id VARCHAR(64) NOT NULL,
    regulatory_reference TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (chunk_id) REFERENCES chunks(chunk_id) ON DELETE SET NULL,
    FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_claims_source_id ON claims(source_id);
CREATE INDEX IF NOT EXISTS idx_claims_chunk_id ON claims(chunk_id);

-- 5. Auditable Citations Linked to Analyses and Chunks
CREATE TABLE IF NOT EXISTS citations (
    citation_id VARCHAR(128) PRIMARY KEY,
    analysis_id VARCHAR(128),
    chunk_id VARCHAR(128) NOT NULL,
    claim_id VARCHAR(64),
    source_id VARCHAR(64) NOT NULL,
    relevance_score REAL NOT NULL,
    citation_quote TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (chunk_id) REFERENCES chunks(chunk_id) ON DELETE CASCADE,
    FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE SET NULL,
    FOREIGN KEY (source_id) REFERENCES sources(source_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_citations_chunk_id ON citations(chunk_id);
CREATE INDEX IF NOT EXISTS idx_citations_source_id ON citations(source_id);
CREATE INDEX IF NOT EXISTS idx_citations_analysis_id ON citations(analysis_id);

-- 6. Audit Trail for All Inbound Analysis Invocations
CREATE TABLE IF NOT EXISTS analysis_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id VARCHAR(64) NOT NULL,
    channel VARCHAR(64),
    risk_level VARCHAR(64) NOT NULL,
    confidence REAL,
    signals_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_log_submission ON analysis_audit_log(submission_id);

