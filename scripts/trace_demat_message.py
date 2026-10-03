import json
import sys
from pathlib import Path

# Add root directory to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.main import analyze_submission, AnalyzeRequest

def main():
    msg = (
        "URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. "
        "Please share your Demat login password and 6-digit OTP to complete verification immediately "
        "or your account will be suspended."
    )
    req = AnalyzeRequest(text=msg)
    resp = analyze_submission(req)

    print("=== TRACE RESULT FOR DEMAT TEST MESSAGE ===")
    print(f"Risk Level: {resp.risk_level.value}")
    print(f"Confidence Level: {resp.confidence_or_uncertainty.level.value}")
    print(f"Confidence Score: {resp.confidence_or_uncertainty.score}")
    print(f"Uncertainty Note: {resp.confidence_or_uncertainty.uncertainty_note}")
    print(f"Signals Count: {len(resp.detected_signals)}")
    for s in resp.detected_signals:
        print(f"  Signal: [{s.id}] {s.name} ({s.severity}) -> {s.rule_id}")
    print(f"Claims Count: {len(resp.extracted_claims)}")
    for c in resp.extracted_claims:
        print(f"  Claim: [{c.claim_type}] {c.claim_text}")
    print(f"Evidence Count: {len(resp.evidence)}")
    for e in resp.evidence:
        print(f"  Evidence: [{e.source_id}] {e.publisher} - '{e.title}'")
        print(f"    Canonical URL: {e.url}")
        print(f"    Passage: {e.passage[:130]}...")
    print(f"Safe Next Steps Count: {len(resp.safe_next_steps)}")
    for step in resp.safe_next_steps:
        print(f"  Action: {step}")
    print("Explanation:")
    print(resp.explanation)

if __name__ == "__main__":
    main()
