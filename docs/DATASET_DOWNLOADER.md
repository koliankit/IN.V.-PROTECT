# Dataset Downloader & Checksum Auditing

Sangyan AI Investor Shield uses a controlled, reproducible dataset downloader for acquiring approved public research datasets.

## 1. Core Principles

- **Approved Datasets Only**: Downloads are gated by `backend/core/dataset_license.py`. Unregistered datasets or datasets with unverified licenses are rejected immediately.
- **Separate Raw Storage**: All downloaded payloads are saved under `data/raw/` in their original form (e.g. `.zip`, `.json`, `.csv`) and never modified in-place.
- **Incremental SHA-256 Checksums**: As files are downloaded in 64KB streams, SHA-256 checksums are calculated on the fly.
- **Atomic Persistence**: Files are written to temporary files and atomically renamed to their final destination only upon successful download and checksum validation.
- **Download Manifest**: Every download, cache hit, or failure is logged in `data/manifests/dataset_downloads.json`.

## 2. CLI Usage

### Dry run (safe validation without network requests):
```bash
python scripts/download_datasets.py --all --dry-run
```

### Download a specific approved dataset:
```bash
python scripts/download_datasets.py --dataset-id DATASET_UCI_SPAM
```

### Download all approved datasets:
```bash
python scripts/download_datasets.py --all
```

## 3. Fallback & Offline Resilience

If an external source URL is temporarily unreachable or network access is restricted, the downloader gracefully records a `DownloadStatus.FAILED` audit record with the exact error, without polluting the repository or throwing unhandled exceptions.
