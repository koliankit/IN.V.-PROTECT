# Public ML Dataset Evaluation for Baseline Training

This document records the evaluation of public machine learning datasets for training and benchmarking Sangyan AI Investor Shield baseline classifiers.

## Evaluated Datasets

### 1. UCI SMS Spam Collection
- **Dataset ID**: `DATASET_UCI_SPAM`
- **Origin / Authors**: Tiago A. Almeida, José María Gómez Hidalgo, Akebo Yamakami (DocEng 2011)
- **License**: Creative Commons Attribution 4.0 International (CC-BY-4.0)
- **Volume**: 5,574 labeled SMS messages (747 spam, 4,827 ham)
- **Evaluation Status**: **RECOMMENDED FOR BASELINE**
- **Pros**:
  - Globally recognized benchmark for text spam detection.
  - Clean ground-truth labeling and clear CC-BY-4.0 open license.
  - Captures deceptive messaging tactics: artificial urgency, prize claims, and suspicious URL links.
- **Limitations**:
  - Predominantly British English and mobile carrier promo idioms from the 2010s.
  - Lacks Indian financial terminology (e.g., Demat, pre-IPO, Upper Circuit, SEBI, FII quota).
  - Must be augmented with India-specific scam corpora and official regulatory advisories.

### 2. Enron Financial Email Spam Corpus
- **Dataset ID**: `DATASET_ENRON_FIN_SPAM`
- **Origin**: CMU / FERC Public Records (Klimt & Yang)
- **License**: Public Domain
- **Volume**: ~30,000 email messages
- **Evaluation Status**: **SUITABLE WITH LIMITATIONS**
- **Pros**:
  - Strong representation of genuine corporate financial discussions and investment jargon.
  - Provides rich negative examples (ham) of lawful market discourse.
- **Limitations**:
  - Email format differs drastically from modern chat/SMS/social media screenshots.
  - Dated early 2000s; does not reflect modern instant payment or app-based fraud.

### 3. Jose Nazario Phishing Email Corpus
- **Dataset ID**: `DATASET_NAZARIO_PHISH`
- **Origin**: Phishing archive / IEEE security research
- **License**: Open Research Access
- **Evaluation Status**: **SUITABLE WITH LIMITATIONS**
- **Pros**:
  - High fidelity phishing lures, credential theft links, and impersonation attempts.
- **Limitations**:
  - Focuses on traditional web banking and webmail; lacks mobile APK and social messenger dynamics.

### 4. Unverified Scraped Social Media Dumps (Kaggle / Random GitHub Repos)
- **Dataset ID**: `DATASET_UNVERIFIED_SCRAPED`
- **Origin**: Anonymous scrapers
- **License**: Missing / Unspecified
- **Evaluation Status**: **REJECTED**
- **Rationale for Rejection**:
  - Absence of verifiable provenance or author consent.
  - Unaudited synthetic or corrupted records.
  - High risk of label leakage or copyright infringement.

---
## Summary of Baseline Strategy
Sangyan AI adopts the **UCI SMS Spam Collection** for cold-start baseline feature extraction, complemented by Indian-context community research datasets (Layer 030) and anchored strictly by authoritative regulatory advisories (SEBI, RBI, I4C, CERT-In) for fact-grounded RAG reasoning.
