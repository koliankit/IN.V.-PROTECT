# Retrieval Evaluation Benchmark

To verify that Sangyan AI Investor Shield retrieves authoritative regulatory passages when confronted with realistic fraud scenarios, we maintain a benchmark evaluation suite.

## 1. Benchmark Query Dataset

The evaluation suite (`data/manifests/retrieval_evaluation_set.json`) tests core Indian digital scam vectors:
- **Telegram VIP Trading Groups**: Promises of 500-1000% returns, fake SEBI analyst claims.
- **Mule Account Payment Routing**: Requests to deposit funds into individual UPI IDs or personal savings accounts.
- **Malicious APK Distribution**: Screen sharing and untrusted APK links sent over messaging apps.
- **Withdrawal Fee Traps**: Fictitious profit displays coupled with advance tax demands.
- **Grievance Redressal**: Identifying official dispute resolution channels (SEBI SCORES).
- **Demat KYC Phishing**: Fraudulent suspension alerts and panic-inducing links.
- **Upper Circuit Breakout Guarantees**: Misleading stock tip promotions.
- **Intermediary Verification**: Checking broker and research analyst registration on `sebi.gov.in`.

## 2. Evaluation Metrics

| Metric | Target Goal | Description |
|---|---|---|
| **Hit Rate @ 1** | ≥ 60% | Target regulatory source retrieved as top-ranked result. |
| **Hit Rate @ 3** | ≥ 85% | Target regulatory source present in top 3 retrieved passages. |
| **Hit Rate @ 5** | ≥ 95% | Target regulatory source present in top 5 retrieved passages. |
| **Mean Reciprocal Rank (MRR)** | ≥ 0.70 | Measures ranking precision across the query set ($MRR = \frac{1}{|Q|}\sum \frac{1}{\text{rank}_i}$). |
| **Recall @ 5** | ≥ 80% | Fraction of all relevant authoritative sources successfully retrieved. |

## 3. CLI Usage

### Check evaluation set in dry-run mode:
```bash
python scripts/evaluate_retrieval.py --dry-run
```

### Run complete retrieval evaluation benchmark:
```bash
python scripts/evaluate_retrieval.py --top-k 5
```
