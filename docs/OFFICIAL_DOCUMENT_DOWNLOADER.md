# Official Document Downloader & Controlled Parser

Sangyan AI Investor Shield ingests regulatory advisories and statutory warnings from verified official Indian authorities (SEBI, I4C, RBI, CERT-In, NCRB).

To maintain legal defensibility, non-hallucinatory grounding, and reproducibility, all official materials pass through the controlled official document downloader.

## 1. Governance & Storage Isolation

1. **Registry Gating**: Only sources documented in `data/manifests/official_source_registry.json` can be fetched. Any unvetted URL is rejected.
2. **Raw File Preservation**: Downloaded documents (HTML or PDF) are stored immutably in `data/raw/official/{source_id}.{pdf|html}`.
3. **Cryptographic Fingerprinting**: Every raw payload is fingerprinted with SHA-256 upon reception.
4. **Structured Parsed Sections**:
   - HTML documents are parsed using a controlled DOM parser that drops scripts, navigation, and advertising noise, extracting clean headings and paragraphs.
   - PDF documents have their text streams decompressed and extracted, segmenting core guidance and advisory takeaways.
5. **Snapshot Registry**: Execution details and extracted sections are logged in `data/manifests/official_document_snapshots.json`.

## 2. CLI Usage

### Dry-run validation (checks sources and domains without network requests):
```bash
python scripts/download_official_documents.py --all --dry-run
```

### Download and parse a specific official source:
```bash
python scripts/download_official_documents.py --source-id SRC001
```

### Download and parse all official sources:
```bash
python scripts/download_official_documents.py --all
```
