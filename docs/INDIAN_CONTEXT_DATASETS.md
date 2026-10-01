# Indian-Context & Hinglish Scam Dataset Evaluation

This document outlines the evaluation criteria, linguistic considerations, and governance boundaries for Indian-context and Hinglish scam datasets in Sangyan AI Investor Shield.

## 1. Governance Boundary: Government vs. Community Sources

To prevent model hallucinations, false authority attributions, and contaminated reasoning, Sangyan AI strictly partitions sources into two distinct tiers:

| Attribute | Official Regulator Sources (`regulator_official`) | Community Research Datasets (`community_research`) |
|---|---|---|
| **Examples** | SEBI Circulars, I4C Threat Advisories, RBI FAME, CERT-In | GitHub Scam Repos, Academic Corpus, Community Submissions |
| **Authority** | Statutory, legally enforceable ground truth | Empirical, informational observation |
| **Pipeline Role** | Authoritative RAG evidence retrieval, deterministic rule enforcement, official reporting routing | Testing NLP linguistic resilience, Hinglish colloquial tokenization, baseline text classification |
| **Labeling** | Explicitly flagged as `is_official_government: true` | Explicitly flagged as `is_official_government: false` |

## 2. Indian Scam Vectors & Linguistic Nuances

Scams in the Indian digital investment sphere present unique vernacular and behavioral patterns:

### A. Telegram/WhatsApp VIP Investment Groups (`telegram_vip_trading`)
- **Language**: English + Romanized Hindi (Hinglish).
- **Markers**: "Institutional account", "1000% upper circuit calls", "SEBI registered analysts (fake)", "FII trading window".
- **Bait**: Screenshot sharing of simulated profits, urgency to deposit margin into personal accounts or arbitrary UPI handles.

### B. Part-Time Work / YouTube Task Scams (`part_time_task_fraud`)
- **Language**: "Daily 2000-5000 Rs ghar baithe kamao", "YouTube video like karo aur screenshot bhejo".
- **Modus Operandi**: Small token payouts (Rs 150-500) to build trust, followed by mandatory "pre-paid investment tasks" where funds are frozen.

### C. Demat & KYC Suspension Threats (`demat_kyc_suspension`)
- **Language**: Urgent warnings alleging Demat account deactivation or electricity disconnection if an APK is not installed immediately.

### D. Malicious APK & Screen Sharing (`apk_screen_sharing`)
- **Modus Operandi**: Sending direct links to `.apk` files or requesting installation of AnyDesk/QuickSupport to "assist" in trading execution.
