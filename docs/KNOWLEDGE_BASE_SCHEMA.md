# Knowledge Base Relational Database Schema

Sangyan AI Investor Shield provides a relational and vector-ready database schema for authoritative evidence, statutory grounding, and auditability.

## 1. Entity-Relationship Overview

```
[ sources ] (1)
     │
     ├──< (N) [ documents ] (1)
     │             │
     │             └──< (N) [ chunks ] (1)
     │                           │
     ├──< (N) [ claims ] (1) <───┘
     │             │
     └──< (N) [ citations ] (N)
```

## 2. Table Specifications

### 1. `sources`
Primary table of verified regulatory publishers and public data sources (e.g. SEBI, I4C, RBI, CERT-In).
- `source_id`: Primary key (e.g. `SRC001`).
- `publisher`, `title`, `url`, `license`, `source_type`, `allowed_use`.
- `content_hash`: Cryptographic SHA-256 fingerprint.

### 2. `documents`
Ingested circulars, advisories, portals, and threat notices.
- `document_id`: Primary key.
- `source_id`: Foreign key referencing `sources.source_id` (Cascading delete).
- `title`, `format`, `raw_file_path`, `content_hash`, `total_pages`, `total_blocks`.

### 3. `chunks`
Retrieval-friendly passages indexed for RAG and semantic vector search.
- `chunk_id`: Primary key.
- `document_id`: Foreign key referencing `documents.document_id`.
- `source_id`: Foreign key referencing `sources.source_id`.
- `page_or_section`: Page number and/or section heading.
- `text`: Passage text respecting sentence boundaries.
- `embedding_json`: Vector representation (Layer 040).

### 4. `claims`
Extracted statutory principles, mandatory guidelines, or verified scam propositions.
- `claim_id`: Primary key.
- `claim_text`: Factual regulatory statement.
- `claim_category`: Scam taxonomy mapping (e.g. `guaranteed_returns`, `telegram_vip`).
- `verdict_sentiment`: Regulatory stance (`refutes`, `warns_against`).
- `chunk_id`: Reference to supporting chunk.
- `source_id`: Reference to originating source.

### 5. `citations`
Auditable citations generated during analysis and bound to specific chunks and claims.
- `citation_id`: Primary key.
- `analysis_id`: Execution reference.
- `chunk_id`, `claim_id`, `source_id`: Relational foreign keys.
- `relevance_score`: Retrieval confidence.
- `citation_quote`: Evidentiary quotation.

## 3. Foreign Key & Integrity Guarantees

All tables enforce `PRAGMA foreign_keys = ON;`. Ingesting a document, chunk, claim, or citation without a valid parent source or document violates relational integrity and is rejected at the database engine level.
