# Immutable Source Snapshots & Anti-Overwrite Governance

To ensure evidentiary auditability and prevent silent contamination of regulatory ground truth, Sangyan AI Investor Shield implements immutable source snapshots.

## 1. Principles of Immutability

1. **Content Addressing**: Every snapshot is fingerprinted using cryptographic SHA-256 digests.
2. **Prohibition of Silent Overwrites**:
   - If an official document changes at its upstream government URL, it is strictly forbidden to overwrite the existing file on disk.
   - Any attempt to overwrite an existing snapshot with modified bytes triggers a `SnapshotCollisionError`.
3. **Partitioned Version Storage**:
   - Files are stored under `data/snapshots/{source_id}/v{version}_{hash_prefix}.{ext}`.
   - Storage files are marked read-only on the filesystem.
4. **Audit Ledger**:
   - All snapshot events are permanently recorded in `data/manifests/source_snapshots_ledger.json`.
   - Each entry contains `snapshot_id`, `version`, `content_hash`, `storage_path`, `byte_size`, and ISO 8601 UTC timestamp.
5. **Integrity Auditing**:
   - The snapshot manager can audit snapshots against their recorded SHA-256 hash to detect any unauthorized out-of-band disk mutations (`TAMPER_DETECTED`).
