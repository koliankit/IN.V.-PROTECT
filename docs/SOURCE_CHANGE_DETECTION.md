# Official Source Change Detection & Version Retention

To ensure that regulatory compliance and ML reasoning operate on verifiable evidence histories, Sangyan AI Investor Shield tracks all modifications to official regulator documents.

## 1. Zero Overwrite & Retention Rule

When an upstream official document is updated by a regulator (e.g. SEBI issuing an amended advisory, or RBI revising circular text):
1. **Change Detection**: The SHA-256 hash of the incoming content is compared with the latest active snapshot.
2. **Version Incrementation**: If the hash differs, a new snapshot version (`v2`, `v3`, etc.) is generated.
3. **Lineage Retention**: Previous versions (`v1`) are **never deleted or overwritten**. They remain accessible on disk and in the ledger for historical backtesting and evidentiary provenance.
4. **Audit Trail**: Every change event is logged with byte deltas, previous and current hashes, and timestamps in `data/manifests/source_change_log.json`.

## 2. CLI Usage

### Check sources in dry-run mode:
```bash
python scripts/detect_source_changes.py --all --dry-run
```

### Run change detection on a specific source:
```bash
python scripts/detect_source_changes.py --source-id SRC001
```

### Run change detection across all official sources:
```bash
python scripts/detect_source_changes.py --all
```
