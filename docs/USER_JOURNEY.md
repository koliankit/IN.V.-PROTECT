# End-to-End User Journey Specification

The Sangyan AI Investor Shield executes a deterministic, 7-stage user journey designed for transparency, safety, and evidence attribution:

```
[1. User Input]
       │
       ▼
[2. Extraction] ── (OCR, PII Masking, Entity & Claim Extraction)
       │
       ▼
[3. Detection] ── (Rule Engine + Calibrated ML Model)
       │
       ▼
[4. Evidence Retrieval] ── (Authoritative RAG: SEBI, RBI, I4C, CERT-In)
       │
       ▼
[5. Explanation] ── (Plain-Language Risk Synthesis & Citations)
       │
       ▼
[6. Safety Guidance] ── (Defensive Actions: Don't Pay, Don't Share OTP)
       │
       ▼
[7. Official Verification & Reporting] ── (SEBI Intermediary Portal, 1930 Helpline)
```

## Detailed Stages

### 1. User Input
User submits a suspicious investment advertisement, message, APK offer, profit claim, or screenshot. Text input is the primary and fastest pathway.

### 2. Extraction & Preprocessing
- OCR is applied to image/screenshot inputs with confidence tracking.
- Sensitive user credentials (passwords, OTPs, full bank account numbers) are masked immediately.
- Semantic entities (regulator names, phone numbers, UPI handles, claimed returns) are isolated.

### 3. Scam Detection & Signal Analysis
- Pattern matching rules evaluate specific red flags (unrealistic guarantees, urgency, suspicious payment requests).
- Calibrated ML models estimate fraud likelihood without assigning unverified legal guilt.

### 4. Authoritative Evidence Retrieval (RAG)
- Semantic vector search matches extracted claims against immutable snapshots of regulatory circulars and advisories (SEBI, RBI, I4C, CERT-In).

### 5. Evidence-First Explanation
- Results synthesise findings into an accessible summary.
- Every major risk point is backed by an exact quote and link to the relevant official publication.

### 6. Safety Guidance
- Immediate actionable precautions tailored to detected risks: e.g., "Do not send funds to personal UPI accounts", "Never install unknown third-party APKs".

### 7. Official Verification & Reporting
- Direct links to statutory portals: SEBI Intermediary Search, SEBI SCORES, RBI Sachet, and National Cyber Crime Reporting Portal (cybercrime.gov.in / Dial 1930).
