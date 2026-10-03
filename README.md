# IN V PROTECT — Personal Digital Security Layer for Investors

> **Sangyan AI Investor Shield** — **SANGYAN 2026 Hackathon**  
> *Primary Track*: **Track A: Digital Fraud & Scam Resilience**  
> *Supporting Capability*: **Track E: Misinformation & Content Literacy**  
> *Platform*: Windows Native Desktop Application (PyInstaller + FastAPI + React/TypeScript)

### Monorepo Architecture
- `frontend/`: Responsive Dark Cybersecurity UI (React 18 + TypeScript + Vite)
- `backend/`: Core security engine and local API service (FastAPI + Uvicorn + SQLite)
- `ml/`: Calibrated classification pipelines and feature extractors
- `data/`: Official statutory regulatory corpora (SEBI, RBI, I4C, CERT-In)
- `tests/`: 215 comprehensive test suites across 53 test specifications

---

## Executive Summary

**IN V PROTECT** is an evidence-backed personal digital security layer for Indian retail investors. Operating across PCs, mobile devices, and wearable alerts, the platform continuously analyzes incoming financial communications (messages, emails, SMS, screenshots, APK links, and documents), detects scam indicators, verifies claims against trusted official regulatory repositories (SEBI, RBI, I4C, CERT-In, data.gov.in), explains underlying risks in plain English and Hindi, and guides users to safely respond.

### Core Architecture Principle
```
DETECT ──► VERIFY ──► PROTECT ──► EXPLAIN ──► RESPOND
```

---

## 1. Problem Statement

India's retail investment landscape has expanded dramatically, bringing tens of millions of first-time investors into capital markets. Simultaneously, sophisticated cyber-enabled financial fraud has proliferated, causing thousands of crores in preventable retail losses:
- **VIP Telegram & WhatsApp Pump-and-Dump Groups**: Luring retail traders with fake institutional allocations and promises of guaranteed returns.
- **Credential Harvesting & Account Takeover**: Phishing for Demat credentials, broker trading passwords, and banking OTPs under false threats of account deactivation.
- **Malicious APK Sideloading**: Directing users to download clone trading terminals outside official app stores that simulate upper-circuit profits while routing deposits into mule accounts.
- **Payment-Before-Withdrawal Extortion**: Locking victims' funds and demanding upfront "processing fees," "taxes," or "margin fees" to release fictional profits.
- **Regulatory Impersonation**: Forging official circulars, logos, and signatures of SEBI, RBI, and police authorities to coerce victims.

Retail participants need an automated, transparent, evidence-first shield that operates on their primary computing workstation to neutralize these threats before funds are transferred.

---

## 2. Target Users & Personas

IN V PROTECT is engineered specifically for:
1. **First-Time Retail Investors**: Novice market entrants requiring clear signals to distinguish genuine market risk from impossible scam promises.
2. **Social-Media Active Investors**: Users targeted by algorithmic influencer marketing, sponsored scam channels, and fake investment seminars.
3. **Regional-Language Investors**: Citizens communicating in Hindi and Hinglish targeted with localized social engineering scripts.
4. **Senior Citizens & Retirees**: Vulnerable individuals targeted by urgent account-blocking notices and digital arrest schemes.
5. **Everyday Mobile & Desktop Users**: Investors who need instant desktop interception, OCR analysis, and 1-click reporting to the National Cyber Crime Helpline (1930) and SEBI SCORES portal.

---

## 3. Product Solution & Non-Goals

IN V PROTECT provides multi-channel scanning of financial communications, extracts factual claims and entities, evaluates scam heuristics alongside machine learning classification, and cites statutory regulatory advisories.

### Explicit Product Non-Goals
To uphold ethical integrity and statutory compliance:
- **NO Buy/Sell/Hold Recommendations**: The system never advises on buying, selling, or holding any security.
- **NO Price Predictions**: The system never forecasts stock prices, indices, or financial returns.
- **NO Portfolio Allocation**: The system never manages capital or provides portfolio advisory.
- **NO Collection of Sensitive Credentials**: The system NEVER asks for bank passwords, UPI PINs, ATM PINs, broker passwords, or OTPs from other services. OTPs are treated as sensitive content that may be detected inside incoming scam messages.
- **NO Automated Reporting or Message Deletion**: The system never deletes messages or files reports automatically; all actions are user-confirmed.

---

## 4. End-to-End Architecture & User Journey

### A. First Launch Owner Activation
```
Open IN V PROTECT.exe
       │
       ▼
Owner Registration (Name, Email, Activation Code)
       │
       ▼
Real Email OTP Verification (Salted HMAC-SHA256, 5-min TTL)
       │
       ▼
Identity / Liveness (Configured Provider or Honest NOT CONFIGURED state)
       │
       ▼
Hardware Passkey / Platform Authenticator (W3C WebAuthn)
       │
       ▼
Account Activated ──► Security Operations Dashboard
```

### B. Returning User Flow
```
Open IN V PROTECT.exe ──► Multi-Factor Login (Passkey / Email OTP) ──► Dashboard
```

### C. Core AI Detection Pipeline
```
Incoming Communication (Text / Image / URL)
       │
       ▼
Read & Normalize (PII Masking)
       │
       ▼
OCR / Text Extraction (Preserves Confidence & Bounding Boxes)
       │
       ▼
Language Detection (EN / HI / Hinglish)
       │
       ▼
Claim & Entity Extraction (SEBI Registration, Yield Claims, Urgency)
       │
       ▼
Multi-Signal Scam Detection (12 Deterministic Rules + Calibrated ML)
       │
       ▼
Official Regulatory Verification (SEBI, RBI, I4C, CERT-In, data.gov.in)
       │
       ▼
Risk Engine & Protection Tier Assignment
       │
       ├── 🔴 QUARANTINE / HIGH RISK (Evidence Package + Safe Next Steps)
       ├── 🟡 REVIEW / VERIFY (Source Check Required)
       └── 🟢 TRUSTED / IMPORTANT (Official Awareness / Low Concern)
```

---

## 5. Technology Stack

- **Desktop Shell**: PyInstaller 6.22 on Windows x64, PyWebView GUI with automatic browser fallback.
- **Backend Core**: Python 3.14+, FastAPI, Pydantic v2, Uvicorn (bound to 127.0.0.1 with dynamic port allocation).
- **Frontend SPA**: React 18, TypeScript (Strict Mode), Vite 5, Lucide Icons, responsive Dark Cybersecurity theme.
- **Machine Learning**: Scikit-Learn TF-IDF vectorizer + Multinomial Naive Bayes calibrated on financial fraud datasets.
- **Official RAG / Knowledge Base**: SQLite databases (`knowledge_base.db` and `sangyan_auth.db`), semantic retrieval over statutory advisories.
- **Security & Crypto**: PBKDF2 password derivation, HMAC-SHA256 OTP hashing, constant-time comparison, W3C WebAuthn platform passkeys, HttpOnly secure cookies.

---

## 6. Data Provenance & Ethical Guardrails

Every finding and advisory quote in IN V PROTECT originates from verified statutory sources:
1. **SEBI Investor Advisory**: Modus operandi of fake trading apps and Telegram VIP stock groups.
2. **I4C (Indian Cyber Crime Coordination Centre)**: Threat Analytics Unit advisory on fake stock market investment portals.
3. **SEBI Investor Education**: Statutory notices confirming no registered intermediary promises guaranteed profits.
4. **SEBI Grievance Portal**: Official grievance redressal via SCORES.
5. **RBI Financial Awareness (FAME)**: Banking and digital payment fraud prevention circulars.
6. **CERT-In Advisory CIAD-2024-0050**: Online scam and phishing awareness guidelines.
7. **NCRB / data.gov.in**: Statutory crime classification catalog and fraud terminology index.

*Truthfulness Rule*: The platform never fabricates citations or quotes government agencies without an authentic source ID and content hash.

---

## 7. Setup & Installation

### Option 1: Run Pre-Packaged Desktop Executable (Recommended)
1. Navigate to the `dist/IN V PROTECT/` folder (or unzip `dist/IN_V_PROTECT_Windows_x64.zip`).
2. Double-click `Run_IN_V_PROTECT.bat` or directly run `IN V PROTECT.exe`.
3. The application will launch the local backend on `127.0.0.1`, verify backend health, and open the native desktop window.

### Option 2: Development Mode
```bash
# 1. Activate Python virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Build frontend
cd frontend
npm install
npm run build
cd ..

# 4. Launch Desktop Application
python desktop_app.py
```

### Option 3: Compile Desktop Executable with PyInstaller
```bash
# 1. Build frontend distribution
cd frontend && npm run build && cd ..

# 2. Compile standalone Windows executable
python -m PyInstaller in_v_protect.spec --noconfirm

# Output is generated in: dist/IN V PROTECT/IN V PROTECT.exe
```

---

## 8. Evaluation & Metrics

| Module / Pipeline Step | Measured Metric | Actual Result |
|---|---|---|
| **Text Analysis Pipeline** | Latency (10 runs avg) | **16.14 ms** |
| **URL Analysis Pipeline** | Latency (10 runs avg) | **3.96 ms** |
| **Screenshot Upload / OCR** | Latency (10 runs avg) | **5.71 ms** |
| **Evidence Retrieval / Source Lookup** | Latency (24 runs avg) | **0.0022 ms** |
| **Unit & Integration Test Suite** | 215 tests across 53 test files | **215 passed (100%) in 7.12s** |
| **Frontend Production Build** | TypeScript Strict + Vite | **Success (zero errors) in 2.14s** |
| **Desktop Executable Size** | PyInstaller ONEDIR package | **28.6 MB EXE / 107.5 MB Portable ZIP** |
| **Demo Scenario Verification** | 6 Canonical Test Cases | **6 / 6 Correct Risk & Protection Tiers** |

---

## 9. Known Limitations & Safe Fallbacks

1. **OCR Engine**: Image optical character extraction integrates with Tesseract OCR. When the local binary is unavailable on Windows, the system transparently prompts the investor with a safe uncertainty disclaimer and suggests pasting text, without fabricating fake OCR output.
2. **Transactional Email OTP Delivery**: Requires SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`) or Resend API key in `.env`. When unconfigured, the system truthfully displays `NOT CONFIGURED` and explains how to add credentials.
3. **Enterprise Biometrics**: Face liveness verification requires an enterprise identity verification provider adapter. In the absence of API credentials, the UI displays `STATUS: NOT CONFIGURED` and permits hardware passkey authentication.
4. **Regulatory Advice Boundary**: IN V PROTECT detects fraud and explains risk indicators. It is not a financial advisor, broker, or substitute for filing formal police FIRs.

---

## 10. Demonstration Instructions

Test all six canonical scenarios directly from the dashboard:

| # | Demo Case | Content Sample | Expected Result | Protection Tier |
|---|---|---|---|---|
| **1** | Guaranteed Return Scam | *"Invest ₹10,000 today and earn guaranteed returns of ₹50,000 within 7 days. SEBI approved."* | High Concern (3 signals, 3 citations) | 🔴 Quarantined / High Risk |
| **2** | Demat Credential Harvesting | *"URGENT: Demat verification pending. Share password and 6-digit OTP immediately."* | High Concern (3 signals, 3 citations) | 🔴 Quarantined / High Risk |
| **3** | Fake Trading App / APK | *"Download official VIP trading app from http://fake-terminal.com/app.apk for upper circuit."* | High Concern (2 signals, 2 citations) | 🔴 Quarantined / High Risk |
| **4** | Payment-Before-Withdrawal | *"Balance is ₹4,50,000. Pay ₹25,000 processing fee and 10% margin deposit to withdraw."* | High Concern (2 signals, 1 citation) | 🔴 Quarantined / High Risk |
| **5** | Legitimate Investor Message | *"Mutual fund investments are subject to market risks. Read all scheme documents carefully."* | Low Concern (0 signals, 1 citation) | 🟢 Trusted / Important |
| **6** | Ambiguous Financial Message | *"Alpha Research (claiming SEBI RA Reg INH000099999) providing technical intraday levels."* | Needs Verification (0 signals, 1 citation) | 🟡 Review / Verify |

---

## 11. Feature Truthfulness Classification

| Capability | Classification | Ground Truth & Evidence |
|---|---|---|
| **Scam Indicator Detection (Rules + ML)** | IMPLEMENTED + TESTED | 12 heuristic rules + Scikit-Learn TF-IDF classifier tested across 215 unit tests. |
| **Regulatory Evidence Retrieval (RAG)** | IMPLEMENTED + TESTED | Cites authenticated SEBI, RBI, I4C, and CERT-In advisories from `data/official/`. |
| **Multi-Tier Risk Decision Engine** | IMPLEMENTED + TESTED | Maps to Quarantine / Review / Trusted with explainable factor breakdown. |
| **W3C WebAuthn Passkeys** | IMPLEMENTED + TESTED | Hardware authenticator registration and challenge-assertion verification. |
| **Local Desktop Server & Shell** | IMPLEMENTED + TESTED | Uvicorn FastAPI backend on 127.0.0.1 + PyWebView desktop window. |
| **PyInstaller Desktop Executable** | IMPLEMENTED + TESTED | Bundled in `dist/IN V PROTECT/IN V PROTECT.exe` (tested independently). |
| **Email OTP Delivery (SMTP)** | CONFIGURED | Full SMTP adapter implemented in `backend/core/email_provider.py`. |
| **Enterprise Face / Liveness Provider** | NOT CONFIGURED | Adapter interface exists; truthfully shows `NOT CONFIGURED` banner in UI. |
| **Live Device Bluetooth Mesh Pairing** | DEMO / SIMULATED | Companion pairing protocol exists; UI shows Honest SIMULATED state. |
| **Stock Price Forecasting** | NOT IMPLEMENTED | Explicit product non-goal. The platform never predicts market prices. |
| **Investment Recommendations** | NOT IMPLEMENTED | Explicit product non-goal. The platform never gives Buy/Sell advice. |

---

## 12. Key Documentation

- [Full Architectural Audit](file:///d:/sangyam%20ai/docs/FINAL_AUDIT.md) (`docs/FINAL_AUDIT.md`)
- [Official Judge Demonstration Guide](file:///d:/sangyam%20ai/docs/DEMO.md) (`docs/DEMO.md`)
- [Model Card (Baseline Classifier)](file:///d:/sangyam%20ai/docs/MODEL_CARD.md) (`docs/MODEL_CARD.md`)
- [Data Card & Provenance](file:///d:/sangyam%20ai/docs/DATA_CARD.md) (`docs/DATA_CARD.md`)
- [Release Acceptance Checklist](file:///d:/sangyam%20ai/docs/RELEASE_CHECKLIST.md) (`docs/RELEASE_CHECKLIST.md`)
- [Data Source Registry CSV](file:///d:/sangyam%20ai/data/source_registry.csv) (`data/source_registry.csv`)
