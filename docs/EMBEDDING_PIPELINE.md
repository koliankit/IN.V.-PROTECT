# Knowledge Base Embedding Pipeline

Sangyan AI Investor Shield generates vector embeddings for dense semantic retrieval and RAG grounding.

## 1. Approved Content Gating Mandate

To prevent vector pollution and unauthorized training on unvetted or copyrighted materials:
- **Strict Pre-Ingestion Filter**: Embeddings can only be generated for sources affirmatively registered in `data/manifests/official_source_registry.json` or approved datasets in `data/manifests/dataset_licenses.json`.
- **Rejection of Unvetted Sources**: Any request to embed content from unregistered URLs or unapproved IDs immediately raises an `UnapprovedContentError`.

## 2. Model & Version Tracking

Every generated vector record (`EmbeddingRecord`) explicitly captures:
- `model_name`: Canonical embedding model (e.g. `sangyan-semantic-embedder-v1`).
- `model_version`: Exact checkpoint version (e.g. `1.0.0`).
- `dimensions`: Vector dimensionality (e.g. `128`).
- `is_normalized`: Verified unit length (`||v|| = 1.0`) ensuring fast inner-product cosine similarity.
- `source_metadata`: Complete provenance chain, including publisher, statutory reference, content hash, and license.

## 3. CLI Usage

### Check sources in dry-run mode:
```bash
python scripts/generate_embeddings.py --all --dry-run
```

### Generate embeddings for a specific source:
```bash
python scripts/generate_embeddings.py --source-id SRC001
```

### Generate embeddings for all approved sources:
```bash
python scripts/generate_embeddings.py --all
```
