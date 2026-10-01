# Unified Document Parser

Sangyan AI Investor Shield parses official statutory regulatory sources (HTML, PDF, JSON) into structured evidentiary units for downstream RAG indexing and verification rules.

## 1. Provenance Preservation Mandate

Every parsed block must explicitly retain its full provenance chain:
- **Title**: Document title extracted from the document header, `<title>` tag, or official registry.
- **Publisher**: Authoritative regulatory body (e.g., SEBI, I4C, RBI, CERT-In).
- **Publication Date**: Verifiable official date of issuance.
- **Page Numbers**: 1-indexed physical page numbering for multi-page circulars and PDF advisories.
- **Headings & Hierarchy**: Logical headings (`h1` through `h6`) captured to contextualize paragraphs and bullet lists.
- **Source Reference**: Statutory citation string (e.g. `SEBI Investor / SRC001 (Fake Trading App Scam Landscape)`) directly bound to each block.

## 2. Supported Document Types

| Format | Parsing Engine | Heading & Structure Capture | Page Handling |
|---|---|---|---|
| **HTML** | `StructuredHTMLParser` | Extracts `<title>`, `<h1>`-`<h6>`, `<p>`, and `<li>` bullet points; discards navigation and scripts. | Single logical page (Page 1) |
| **PDF** | `StructuredPDFParser` | Decompresses content streams, parses text objects, and identifies section breaks. | Multipage 1-indexed pagination |
| **JSON** | Native Structured Evidence | Directly ingests audited regulatory circular sections and key takeaways. | Retains section page metadata |

## 3. CLI Usage

### Dry-run validation:
```bash
python scripts/parse_official_documents.py --all --dry-run
```

### Parse a specific document:
```bash
python scripts/parse_official_documents.py --source-id SRC001
```

### Parse all registered documents:
```bash
python scripts/parse_official_documents.py --all
```
