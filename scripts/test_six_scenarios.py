"""
Comprehensive verification of the 6 mandatory UI test scenarios.
"""
import json
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.main import analyze_submission, AnalyzeRequest

scenarios = [
    {
        "id": "SCENARIO_1_GUARANTEED_RETURN",
        "name": "Guaranteed Return Scam",
        "text": "Join our VIP Telegram group for 100% guaranteed 50% daily profit on BankNifty jackpot calls. Double your investment in 7 days!",
        "expected_risk": "High Concern",
    },
    {
        "id": "SCENARIO_2_OTP_PASSWORD",
        "name": "OTP/Password Scam",
        "text": "URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. Please share your Demat login password and 6-digit OTP to complete verification immediately or your account will be suspended.",
        "expected_risk": "High Concern",
    },
    {
        "id": "SCENARIO_3_FAKE_TRADING_APP",
        "name": "Fake Trading App",
        "text": "Exclusive institutional trading platform available now! Download our custom APK from http://pro-investor-trade.apk to trade pre-IPO shares with zero brokerage.",
        "expected_risk": "High Concern",
    },
    {
        "id": "SCENARIO_4_PAYMENT_BEFORE_WITHDRAWAL",
        "name": "Payment-Before-Withdrawal",
        "text": "Your trading account profits of Rs 1,50,000 are ready. To withdraw funds, please pay Rs 15,000 regulatory tax clearance margin fee immediately.",
        "expected_risk": "High Concern",
    },
    {
        "id": "SCENARIO_5_LEGITIMATE_AWARENESS",
        "name": "Legitimate Awareness Message",
        "text": "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Always verify intermediaries on SEBI directory.",
        "expected_risk": "Low Concern",
    },
    {
        "id": "SCENARIO_6_AMBIGUOUS_MESSAGE",
        "name": "Ambiguous Message",
        "text": "Mr. Sharma mentioned a registered advisor INA00012345 who discussed portfolio rebalancing for equity holdings.",
        "expected_risk": "Needs Verification",
    },
]

print("==================================================================")
print("           6 MANDATORY TEST SCENARIOS VERIFICATION               ")
print("==================================================================")

all_passed = True
for idx, sc in enumerate(scenarios, 1):
    resp = analyze_submission(AnalyzeRequest(text=sc["text"]))
    risk = resp.risk_level.value
    passed = (risk == sc["expected_risk"])
    if not passed:
        all_passed = False

    print(f"[{idx}/6] {sc['name']}")
    print(f"  Input: \"{sc['text'][:80]}...\"")
    print(f"  Risk Level: {risk} (Expected: {sc['expected_risk']}) -> {'PASS' if passed else 'FAIL'}")
    print(f"  Signals ({len(resp.detected_signals)}): {[s.name for s in resp.detected_signals]}")
    print(f"  Claims ({len(resp.extracted_claims)}): {[c.claim_text[:40] for c in resp.extracted_claims]}")
    print(f"  Evidence ({len(resp.evidence)}): {[f'{e.publisher}: {e.title}' for e in resp.evidence]}")
    print(f"  Safe Next Steps ({len(resp.safe_next_steps)}):")
    for step in resp.safe_next_steps[:2]:
        print(f"    - {step}")
    print("-" * 66)

print("OVERALL STATUS:", "ALL 6 SCENARIOS PASSED DYNAMICALLY" if all_passed else "SOME SCENARIOS FAILED")
