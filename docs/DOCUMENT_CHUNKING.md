# Document Chunking for Retrieval & RAG

Sangyan AI Investor Shield chunks authoritative regulatory documents into retrieval-friendly passages designed for vector embeddings and hybrid search.

## 1. Mandatory Chunk Invariants

To avoid ungrounded citations and guarantee source attribution during retrieval, **every single chunk** must retain four non-negotiable attributes:

| Required Field | Type | Description | Example |
|---|---|---|---|
| `source_id` | `str` | Official canonical source identifier | `SRC001` |
| `document_id` | `str` | Unique parent parsed document identifier | `DOC_SRC001_d8c525f2` |
| `page_or_section` | `str` | Physical page number and/or section heading | `Page 1 / Modus Operandi of Fake Trading Apps` |
| `text` | `str` | Clean, retrieval-friendly passage text | Passage text respecting sentence boundaries |

## 2. Chunking Logic & Windowing

- **Sentence-Boundary Preservation**: Texts are split on sentence boundaries rather than arbitrary character cuts, preventing truncated concepts.
- **Configurable Sizes**:
  - `max_chunk_size_chars`: 600 characters (approx. 80-120 words).
  - `min_chunk_size_chars`: 80 characters.
  - `chunk_overlap_chars`: 80 characters of sentence-level overlap to ensure semantic continuity across chunk transitions.
- **Deterministic Identifiers**: Formatted as `CHK_{source_id}_{doc_id[:8]}_{index:03d}`.

## 3. CLI Usage

### Check chunking in dry-run mode:
```bash
python scripts/chunk_documents.py --all --dry-run
```

### Chunk a specific official source:
```bash
python scripts/chunk_documents.py --source-id SRC001
```

### Chunk all registered official sources:
```bash
python scripts/chunk_documents.py --all
```
