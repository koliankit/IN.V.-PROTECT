"""
Test script to verify that retrieved evidence changes dynamically across inputs.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.main import analyze_submission, AnalyzeRequest

cases = [
    {
        "name": "OTP / Password Scam",
        "text": "Dear user, share your Demat login password and 6-digit OTP to complete KYC or your account will be suspended.",
    },
    {
        "name": "Guaranteed Returns Scam",
        "text": "Join our VIP Telegram group for 100% guaranteed 50% daily profit on BankNifty jackpot options. Paisa double in 7 days!",
    },
    {
        "name": "Fake Trading App Scam",
        "text": "Download our exclusive institutional trading APK from http://broker-secure.apk to trade with 100x leverage.",
    },
    {
        "name": "Legitimate Awareness Message",
        "text": "Always invest in diversified mutual funds through SEBI-registered brokers. Past returns do not guarantee future performance.",
    },
]

for c in cases:
    resp = analyze_submission(AnalyzeRequest(text=c["text"]))
    print(f"=== {c['name']} ===")
    print(f"Risk: {resp.risk_level.value}")
    print(f"Evidence count: {len(resp.evidence)}")
    for ev in resp.evidence:
        print(f"  -> [{ev.source_id}] {ev.publisher} | {ev.title}")
    print()
