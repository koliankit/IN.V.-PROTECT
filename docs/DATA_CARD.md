# Data Card: Sangyan AI Investor Shield Knowledge Base & Datasets

## 1. Dataset Overview & Core Governance Rule

Sangyan AI enforces strict data provenance and governance:

> **CRITICAL RULE**: OFFICIAL GOVERNMENT AND REGULATORY PUBLICATIONS (SEBI, RBI, I4C, CERT-In, NCRB) MUST NOT AUTOMATICALLY BECOME ML TRAINING ROWS. THEY ARE EXCLUSIVELY SANCTIONED AS EVIDENCE, RETRIEVAL AUGMENTATION (RAG), AND AGGREGATE IMPACT CONTEXT.

This separation prevents model hallucination, respects copyright and terms of service, and guarantees that regulatory citations in user explanations reflect authentic, unmutated statutory text.

---

## 2. Source Registry & Data Provenance

All datasets and authoritative documents are cataloged in `data/source_registry.csv`:

| Source ID | Publisher | Title | License | Intended Use | Official Evidence? | ML Training? |
|---|---|---|---|---|---|---|
| **SRC001** | SEBI | Fake Trading App Scam Landscape (PR No. 04/2024) | Government Public Advisory | RAG Evidence & Heuristics | **YES** | **NO** |
| **SRC002** | I4C / MHA | Advisory: Fake Stock Market Investment Apps (TAU-ADV-001) | Government Public Advisory | RAG Evidence & Heuristics | **YES** | **NO** |
| **SRC003** | SEBI | Investor Awareness Video Modules & FAQs | Government Public Portal | RAG Evidence & Education | **YES** | **NO** |
| **SRC004** | SEBI | Investor Support & Intermediary Directory | Government Public Portal | Statutory Entity Verification | **YES** | **NO** |
| **SRC005** | RBI | Financial Awareness Messages (FAME 2024) | Government Public Advisory | RAG Evidence & Banking Safety | **YES** | **NO** |
| **SRC006** | CERT-In | Advisory on Preventing Online Financial Scams | Government Public Advisory | RAG Evidence & Cyber Hygiene | **YES** | **NO** |
| **SRC007** | NCRB / data.gov.in | Crime in India (Cyber Fraud Statistics) | GODL-India | Contextual Impact Metrics | **YES** | **NO** |
| **SRC008** | data.gov.in | Open Government Fraud Keyword Catalog | GODL-India | Impact Context & Taxonomy | **YES** | **NO** |
| **SRC009** | UCI ML Repository | SMS Spam Collection Dataset | CC-BY-4.0 | ML Baseline Classifier | **NO** | **YES** |
| **SRC010** | Academic Research | Curated Indian Cyber Fraud Messages | CC-BY-NC-4.0 | Research Evaluation Benchmark | **NO** | **NO** |
| **SRC011** | Anti-Fraud Community | Hinglish Task & Investment Telemetry | MIT License | Research Evaluation Benchmark | **NO** | **NO** |

---

## 3. Synthetic Data Policy
- Any synthetic sample generated for testing edge cases (e.g. Romanized Hindi/Hinglish phrase combinations like `"paisa double in 24 hours"`, `"Demat verification OTP"`) is explicitly marked with metadata:
  ```json
  {
    "synthetic": true,
    "generation_method": "deterministic_template",
    "rationale": "Edge case boundary testing for regional terminology"
  }
  ```
- **Synthetic examples are NEVER mixed into primary real-world benchmark evaluations without explicit tagging.**

---

## 4. Privacy, PII Protection & Retention
- **No Demat Credentials Retained**: Passwords, OTPs, PINs, and MPINs entered in user submissions are never persisted in the database.
- **Client-Side Redaction**: The system applies regex-based masking (`<PHONE>`, `<PAN>`, `<AADHAAR>`, `<BANK_ACCOUNT>`) prior to downstream logging or reasoning.
- **Audit Log Scope**: The database audit log (`analysis_audit_log` in SQLite) only records:
  - `submission_id` (anonymized UUID)
  - `channel` (e.g. `telegram`, `sms`)
  - `risk_level` (e.g. `High Concern`)
  - `confidence` (float score)
  - `signals_count` (integer)
  - `created_at` (ISO timestamp)
  - **Zero user-identifiable plaintext is stored.**
