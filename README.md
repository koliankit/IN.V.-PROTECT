# Sangyan AI Investor Shield

> **Evidence-Backed Investor Protection and Fraud Resilience Platform**  
> *Primary Track*: **Track A: Digital Fraud & Scam Resilience**  
> *Secondary Capability*: **Track E: Misinformation & Content Literacy**  
> *Platform*: Responsive Web Application (FastAPI + React/TypeScript)

---

## Project Structure
This repository is organized as a clean monorepo:
```
sangyam-ai/
├── frontend/          # Responsive web application interface
├── backend/           # Core API services and business logic
├── ml/                # Feature extraction, heuristic rules, and classification pipelines
├── data/
│   ├── raw/           # Raw uncurated data from approved sources
│   ├── processed/     # Processed and normalized datasets
│   ├── external/      # Verified external resources and public benchmark data
│   ├── synthetic/     # Controlled synthetic examples for stress-testing and augmentation
│   ├── official/      # Authoritative regulatory advisories, circulars, and notices
│   ├── splits/        # Stratified train, validation, and test splits
│   └── manifests/     # Provenance records, hashes, and licensing manifests
├── docs/              # Architectural, specifications, and governance documentation
├── scripts/           # Automation scripts for data fetching, verification, and tooling
├── tests/             # End-to-end, integration, unit, and adversarial test suites
└── infra/             # Deployment and infrastructure configurations
```

---

## 1. Problem Statement

The retail investment landscape in India is witnessing an unprecedented influx of first-time investors, accompanied by a surge in cyber-enabled financial scams. Vulnerable citizens are systematically targeted via:
- WhatsApp and Telegram "VIP" pump-and-dump groups promising guaranteed returns.
- Malicious APKs and clone trading platforms impersonating SEBI-registered brokers.
- Digital arrest schemes and fake regulatory circulars using forged logos of SEBI, RBI, and law enforcement agencies.
- Manipulated screenshots and misleading influencer marketing exploiting financial literacy gaps.

Retail participants need a zero-friction, trustworthy shield that instantly deconstructs suspicious solicitations, checks claims against authoritative statutory publications, and provides verifiable safety guidance.

---

## 2. Target Users & Personas
Sangyan AI Investor Shield is specifically tailored to protect:
1. **First-Time Investors**: Retail entrants requiring jargon-free guidance to differentiate normal market fluctuations from impossible guarantees.
2. **Young Social-Media Users**: Consumers of algorithmic feeds exposed to viral profit claims and speculative trading channels.
3. **Regional-Language Users**: Citizens communicating in Hindi, Marathi, and Hinglish who are targeted with localized social engineering.
4. **Elderly Users & Retirees**: Senior citizens targeted by high-pressure impersonation, digital arrest threats, and fake KYC updates.
5. **Limited Digital/Financial Literacy**: Everyday smartphone users requiring clear visual red flags, plain warnings, and direct official helplines (1930).

---

## 3. Product Solution & Non-Goals
Sangyan AI Investor Shield provides multi-modal scanning of user text, chat transcripts, screenshots, and links to deliver immediate, transparent, evidence-first assessments.

### Explicit Product Non-Goals
To uphold ethical integrity and regulatory compliance:
- **NO Buy/Sell/Hold Recommendations**: Never recommends or rates specific securities.
- **NO Price Predictions**: Never forecasts stock prices or market movements.
- **NO Portfolio Allocation**: Never manages capital or suggests asset distribution.
- **NO Speculative Assistance**: Never issues day-trading signals or margin tips.
- **NO Broker Promotion**: Maintains complete vendor neutrality with zero affiliate links.
- **NO Product Upselling**: Operates free from commercial loans, insurance, or premium advisory upsells.

---

## 4. End-to-End Architecture & User Journey
The platform operates across 7 deterministic, auditable stages:
1. **User Input**: Accepts plain text, pasted multi-line messages, screenshot uploads, or optional URLs.
2. **Extraction & Normalization**: Executes OCR with confidence scoring, masks PII (OTPs, passwords, bank credentials), and extracts claims/entities.
3. **Multi-Signal Detection**: Combines deterministic heuristic rules with a calibrated ML classification model.
4. **Authoritative Evidence Retrieval (RAG)**: Queries immutable vector embeddings of official SEBI, RBI, I4C, and CERT-In advisories.
5. **Evidence-First Explanation**: Explains why indicators represent risk, directly quoting regulatory circulars.
6. **Safety Guidance**: Supplies contextual defensive advice (e.g. "Do not transfer funds to personal UPI handles").
7. **Official Verification & Reporting**: Routes users directly to statutory registers (SEBI Intermediaries, SCORES) and the 1930 Cybercrime Reporting Portal.

---

## 5. Technology Stack
- **Backend**: Python 3.14+, FastAPI, Pydantic v2, Scikit-learn, Uvicorn.
- **Evidence & Vector Storage**: ChromaDB / pgvector, Sentence Transformers for semantic retrieval.
- **Vision & Preprocessing**: Tesseract OCR, Pillow, OpenCV image preprocessing.
- **Frontend**: React 18+, TypeScript, Vite, Responsive Vanilla CSS adhering to accessible design tokens.
- **Testing & Quality Assurance**: Pytest, Unittest, ESLint, TypeScript Strict Mode.

---

## 6. Data Provenance & Ethical Guardrails
- **Official Regulatory Sources**: Built upon authentic advisories from SEBI Investor, I4C, RBI, and CERT-In.
- **No Fabricated Facts**: Every factual assertion and regulatory quote is strictly linked to verified source URLs and content hashes.
- **Strict Separation of Synthetic Data**: Synthetic records used for stress-testing and augmentation are explicitly tagged (`synthetic=true`) and strictly isolated from the real-world evaluation test split.

---

## 7. Setup & Installation

### Backend Setup
```bash
# Navigate to workspace root
python -m venv venv
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend development server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 8. Evaluation & Metrics
Performance is benchmarked against real-world and verified datasets using:
- **Precision, Recall, and F1 Score** on scam and phishing detection.
- **False Positive Rate (FPR)** to prevent flagging legitimate financial discourse.
- **Source Retrieval Hit Rate** measuring authoritative regulatory coverage for flagged claims.
- **OCR Success Rate & Confidence** on user-submitted screenshot evidence.

*(Note: In accordance with project integrity constraints, all published model metrics represent measured evaluation results from benchmark test runs; no placeholder or fabricated numbers are committed).*

---

## 9. Known Limitations & Safe Fallbacks
- **Regulatory Registry Real-Time Lookups**: Full real-time broker licensing requires live regulatory portal queries; the platform routes users directly to the official SEBI Intermediaries portal for definitive checks.
- **OCR Quality Dependencies**: Low-resolution or heavily blurred images trigger an explicit uncertainty warning asking the user for a clearer image rather than guessing.
- **No Legal Verdict**: The platform identifies risk indicators and provides defensive guidance; it does not replace statutory dispute resolution or formal law enforcement investigation.

---

## 10. Demonstration Instructions
1. **Scenario A (Guaranteed Return Scam)**: Paste a WhatsApp message promising "50% guaranteed weekly returns on institutional trading". Observe High Concern risk level, SEBI advisory citations, and immediate safety checklist.
2. **Scenario B (Fake Broker APK)**: Submit a screenshot or link directing users to download an APK file outside the official app store. Observe unauthorized app warnings and safe verification steps.
3. **Scenario C (Legitimate Bank Communication)**: Paste a routine transactional SMS. Observe Low Concern output demonstrating positive control resilience without false positives.
