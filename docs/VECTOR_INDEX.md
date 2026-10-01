# Vector Index & Metadata Filtering

Sangyan AI Investor Shield combines vector embeddings with strict metadata filtering to retrieve authoritative regulatory evidence.

## 1. Supported Metadata Filters

Vector search queries can be filtered independently or compositely across four dimensions:

| Filter Parameter | Matching Logic | Example |
|---|---|---|
| `publisher` | Case-insensitive substring match | `"SEBI"`, `"RBI"`, `"I4C"`, `"CERT-In"` |
| `source_type` | Case-insensitive exact match | `"official_advisory"`, `"official_portal"` |
| `date_after` / `date_before` | ISO date range comparison (`YYYY-MM-DD`) | `date_after="2024-01-01"` |
| `topic` | Case-insensitive category match | `"telegram_vip"`, `"apk_screen_sharing"`, `"demat_kyc"` |

## 2. PostgreSQL / pgvector Production Compatibility

The vector index provides native ANSI SQL pgvector DDL for production environments (`VectorIndex.generate_pgvector_sql()`):
- Creates `vector(128)` column on `knowledge_vector_index`.
- Builds an `HNSW` index using cosine distance operators (`vector_cosine_ops`) with tuned `m = 16` and `ef_construction = 64`.
- Indexes metadata columns (`publisher`, `source_type`, `topic`, `publication_date`) for fast composite query execution.

## 3. CLI Usage

### Check index in dry-run mode:
```bash
python scripts/query_vector_index.py --dry-run
```

### Search with publisher and topic filters:
```bash
python scripts/query_vector_index.py --query "Telegram VIP stock calls" --publisher "SEBI" --topic "telegram_vip"
```

### Filter by date range:
```bash
python scripts/query_vector_index.py --query "fake trading app" --date-after "2024-01-01" --top-k 3
```
