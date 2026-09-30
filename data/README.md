# Data Directory Architecture & Governance

This directory hierarchy implements the strict provenance and privacy controls required for Sangyan AI Investor Shield:

```
data/
├── raw/         # Unmodified raw downloads directly from source servers
├── processed/   # Normalized, tokenized, and PII-sanitized datasets
├── external/    # Third-party benchmark datasets with verified public licenses
├── synthetic/   # Clearly labeled synthetic edge cases for augmentation/stress-testing
├── official/    # Official regulatory advisories, circulars, and notices (SEBI, RBI, I4C)
├── splits/      # Deterministic train/validation/test partitions (stratified)
└── manifests/   # Cryptographic hashes (SHA-256), license records, and provenance metadata
```

## Governance Policies
1. **Official vs. Synthetic Isolation**: Synthetic records are strictly forbidden from entering `official/` or the primary real-world test split in `splits/`.
2. **PII Sanitization**: No raw personal identifying information (real phone numbers, OTPs, Aadhaar numbers, personal bank accounts) may be retained in `processed/`.
3. **Immutability**: All source snapshots in `official/` and `external/` are registered in `manifests/` with SHA-256 content hashes.
