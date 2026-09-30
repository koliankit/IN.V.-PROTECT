# Data Directory Specification

| Directory | Scope & Purpose | Permitted Data Types | Retention & Provenance |
|---|---|---|---|
| `data/raw/` | Direct downloads from source origins before processing | HTML, raw JSON, CSV | Retained for reproducibility |
| `data/processed/` | Sanitized, tokenized, and verified datasets for model consumption | Parquet, JSONL, embeddings | Full PII scrub required |
| `data/external/` | Public research datasets (e.g. UCI SMS Spam) | CSV, TSV, text | Strict license verification |
| `data/synthetic/` | Synthetic stress-testing records | JSONL (`synthetic=true`) | Never mixed into real evaluation split |
| `data/official/` | Regulatory circulars & threat intelligence (SEBI, RBI, I4C, CERT-In) | PDF, HTML, official text | SHA-256 hash registered |
| `data/splits/` | Stratified splits (train, validation, test) | Parquet, JSONL | Fixed random seeds |
| `data/manifests/` | Metadata registry, source provenance, hashes | JSON, CSV | Auditable version history |
