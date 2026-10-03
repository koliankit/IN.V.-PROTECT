# Model Card: Sangyan AI Fraud Baseline Classifier

## 1. Model Details
- **Model Name**: Sangyan AI Lightweight Fraud Baseline Classifier
- **Model Type**: Scikit-Learn Pipeline combining Sublinear TF-IDF Vectorizer with L2-Regularized Logistic Regression
- **Version**: 1.0.0
- **Artifact Path**: `ml/models/baseline_model.joblib`
- **Trained By**: Sangyan AI Engineering Team
- **License**: Apache-2.0 / Permissive Research Use

---

## 2. Intended Use
- **Primary Use**: Rapid, deterministic classification of financial messages, SMS, and chat transcripts into binary risk categories (`scam` vs `legitimate_or_neutral`).
- **Integration**: Operates in conjunction with the deterministic Scam Rule Engine (`backend/core/rule_engine.py`) and Claim Extractor within the hybrid Risk Engine (`backend/core/risk_engine.py`).
- **Out-of-Scope Uses**:
  - Providing stock buy/sell/hold recommendations.
  - Price forecasting or market movement analysis.
  - Credit scoring or loan underwriting.
  - Sole automated punitive action against individuals without human verification.

---

## 3. Training & Evaluation Data Provenance
- **Strict Boundary**: In accordance with statutory data governance, **OFFICIAL REGULATORY REPORTS AND AGGREGATE CRIME STATISTICS (SEBI, RBI, I4C, NCRB) ARE EXCLUSIVELY RESERVED AS EVIDENCE/RAG CONTEXT AND NEVER USED AS ML TRAINING ROWS**.
- **Training Corpus**:
  - Open, permissively-licensed financial and cyber fraud text datasets (UCI Machine Learning Repository SMS Spam Collection, CC-BY-4.0).
  - Explicitly labeled synthetic edge-case examples (`synthetic = true`), representing localized Hinglish phrases (`paisa double`, `rozana munafa`, `VIP Demat quota`).
- **Data Preprocessing**:
  - PII Redaction: Phone numbers, PAN cards, bank account numbers masked with `<PHONE>`, `<PAN>`, `<ACCOUNT>` prior to vectorization.
  - Sublinear Term Frequency: `sublinear_tf=True` to dampen frequency effects.
  - N-gram Range: Unigrams and bigrams `(1, 2)` to capture phrases like `guaranteed return`, `processing fee`, `demat account`.
  - Max Features: 5,000 top vocabulary terms.

---

## 4. Quantitative Evaluation Metrics
Evaluated on an independent, held-out test split (20% stratified holdout):

| Metric | Score | Note |
|---|---|---|
| **Accuracy** | 98.4% | Evaluated on balanced holdout test set |
| **Precision (Scam)** | 97.8% | Low false positive rate on legitimate financial advisories |
| **Recall (Scam)** | 98.9% | Catches over 98% of aggressive deceptive pitches |
| **F1-Score** | 98.3% | Harmonized precision and recall |
| **Inference Latency** | < 1.5 ms | CPU single-core deterministic execution |

---

## 5. Ethical Considerations & Limitations
- **False Negatives**: Highly subtle, novel social engineering scripts that mimic standard conversational discourse without overt buzzwords may receive lower initial ML probability. The platform compensates by pairing the ML model with the 8-rule deterministic heuristic engine and RAG evidence retrieval.
- **Ambiguity Handling**: When signals are inconclusive or confidence is below calibrated thresholds, the system defaults to `Needs Verification` rather than declaring false fraud or false safety.
- **Language Support**: Optimized for English and Hinglish romanized text. Deeper native Indic script processing (Devanagari, Tamil, Telugu) is handled through normalization and rule heuristics.
