# Dataset Quality Gate & Rejection Governance

Sangyan AI Investor Shield maintains strict data intake standards to prevent model degradation, data pollution, license violations, and biased or ungrounded outputs.

Candidate datasets submitted for ingestion or ML training must pass all 5 verification gates before being accepted into the pipeline.

## 1. The Five Quality Gates

| Gate ID | Check | Rejection Reason Code | Rejection Criteria |
|---|---|---|---|
| **Gate 1** | **Provenance Integrity** | `unclear_provenance` | Missing provenance URL, non-HTTP(S) scheme, unresolvable source, or placeholder domains (`example.com`, `dummy.org`, etc.). |
| **Gate 2** | **Licensing Clarity** | `unclear_licensing` | Unverified license flag, missing license type, or ambiguous/proprietary licenses (`unknown`, `proprietary`, `all rights reserved`). |
| **Gate 3** | **Duplication Threshold** | `excessive_duplication` | Duplication rate across normalized record texts exceeding threshold (default 20%). Prevents benchmark memorization and skewed distributions. |
| **Gate 4** | **Label Verifiability** | `unverifiable_labels` | Missing label fields, null values, ambiguous placeholders (`?`, `null`, `unlabeled`), or conflicting label taxonomies. |
| **Gate 5** | **Suspicious Records** | `suspicious_records` | Null bytes (`\x00`), corrupted UTF-8 replacement characters (`\ufffd`), empty payloads, injection attempts (`<script`), or unflagged synthetic placeholders. |

## 2. Rejection Audit Logging

When any candidate dataset fails one or more checks:
1. It is marked with `decision: "rejected"`.
2. All distinct failure codes are recorded in `rejection_reasons`.
3. Actionable remediation details are captured in `rejection_details`.
4. The audit entry is appended to `data/manifests/dataset_rejections.json`.
5. Ingestion of the rejected dataset into downstream training or RAG indexing is strictly halted.

## 3. Safe Fallback & Ethical Guardrails

- **Zero Tolerance for Contaminated Provenance**: Data cannot enter the pipeline without verifiable origin.
- **Lineage Preservation**: As enforced in Layer 028, accepted records retain original identifiers and licenses.
- **Audit Immutability**: Quality logs preserve timestamped evaluations for reproducibility and transparency.
