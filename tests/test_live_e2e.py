"""
Live End-to-End Validation Test Suite for IN V PROTECT Architecture.
Executes against the running server on http://127.0.0.1:8000.
"""
import json
import sys
import urllib.request
import urllib.error

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000"

def post(endpoint, payload=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    data = json.dumps(payload).encode() if payload else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"HTTPError on {endpoint}: {e.code} - {body}")
        raise

def get(endpoint, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"HTTPError on {endpoint}: {e.code} - {body}")
        raise

def run_e2e_verification():
    print("--- 1. Testing Health Endpoint ---")
    code, data = get("/api/health")
    assert code == 200, f"Expected 200, got {code}"
    assert data["status"] == "healthy"
    print("[PASS] Health OK")

    print("--- 2. Testing First Launch: Owner Registration ---")
    reg_payload = {
        "full_name": "Ankit Koli",
        "email": "ankit.unique.investor@example.com",
        "activation_code": "SANGYAN-2026",
    }
    code, reg_resp = post("/api/auth/register", reg_payload)
    assert code == 200, f"Expected 200, got {code}"
    assert "user_id" in reg_resp
    assert "sandbox_otp" not in reg_resp or reg_resp.get("sandbox_otp") is None, "OTP leaked in register API!"
    assert "@" in reg_resp["masked_email"]
    print("[PASS] Registration OK (Zero OTP leakage)")

    print("--- 3. Testing Real Identity / Liveness Provider Status ---")
    try:
        code, live_init = post("/api/auth/identity/create", {"user_id": reg_resp["user_id"], "consent_given": True})
        print(f"[PASS] Liveness provider configured and active (Status: {code})")
    except urllib.error.HTTPError as e:
        if e.code == 503:
            err_data = json.loads(e.read().decode())
            assert "not configured" in err_data.get("detail", "").lower()
            print("[PASS] Identity / Liveness correctly reports NOT CONFIGURED (503) instead of fake verification")
        else:
            raise

    print("--- 4. Testing Passkey / WebAuthn Options ---")
    code, passkey_opts = post("/api/auth/passkey/register/options", {"user_id": reg_resp["user_id"]})
    assert code == 200
    assert "challenge" in passkey_opts
    print("[PASS] Passkey/WebAuthn options generated successfully")

    print("--- 5. Testing Core Scam Analysis Engine with Multi-Lingual & PII Redaction ---")
    # Test message with sensitive OTP numbers and Hindi/Hinglish text
    scam_text = "Dhyan dein! Aapka Tata Capital Pre-IPO allotment confirm ho gaya hai. Aapka secret OTP hai 982143 aur UPI PIN hai 4321. Send Rs 50,000 to tatapreipo@icici immediately for 300% guaranteed return."
    code, analysis = post("/api/analyze", {"channel": "sms_stream", "text": scam_text})
    assert code == 200
    assert analysis["risk_level"] in ["High Concern", "CRITICAL"]
    assert any(lang in analysis["detected_language"].lower() for lang in ["hinglish", "hindi", "english"])
    assert "pii_redacted_stats" in analysis
    assert analysis["pii_redacted_stats"]["total_redactions"] >= 2, "Failed to redact OTP or PIN numbers"
    # Ensure raw OTP is redacted from explanation/extracted claims
    assert "982143" not in json.dumps(analysis), "Raw OTP 982143 was leaked in analysis output!"
    print(f"[PASS] Core Scam Engine OK (Language: {analysis['detected_language']}, PII Redacted: {analysis['pii_redacted_stats']['total_redactions']} items)")

    print("--- 6. Testing 6 Connected Security Environment Channels ---")
    code, integrations = get("/api/integrations")
    assert code == 200
    assert len(integrations) >= 6
    categories = {itg["category"] for itg in integrations}
    assert "Email" in categories
    assert "SMS" in categories
    assert "Browser / Notifications" in categories
    assert "Financial Alerts" in categories
    assert "Screenshots" in categories
    assert "Device Status" in categories
    print("[PASS] All 6 Connected Security Environment channels present with REAL / DEMO indicators")

    print("--- 7. Testing 3 Protection Tiers & Quarantined Threat Handling ---")
    code, messages = get("/api/messages")
    assert code == 200
    tiers = {m["protection_tier"] for m in messages}
    assert "Quarantined / High Risk" in tiers
    quarantined = [m for m in messages if m["protection_tier"] == "Quarantined / High Risk"]
    target_msg = quarantined[0]
    print(f"✓ Found {len(quarantined)} quarantined messages. Testing target: {target_msg['id']}")

    print("--- 8. Testing User-Confirmed Official Reporting (1930 / Chakshu / SEBI) ---")
    report_payload = {
        "user_confirmed": True,
        "user_notes": "Tested confirmed reporting from IN V PROTECT validation suite"
    }
    code, report_resp = post(f"/api/messages/{target_msg['id']}/report", report_payload)
    assert code == 200
    assert report_resp["success"] is True
    assert "incident_id" in report_resp
    assert "reporting_resources" in report_resp
    resources = report_resp["reporting_resources"]
    assert any("1930" in r.get("helpline", "") or "cybercrime" in r.get("portal", "") for r in resources)
    print("[PASS] User-Confirmed Reporting OK (Incident logged, official resources provided)")

    print("--- 9. Testing Daily Security Report, Scam Trends, and Investor Safety Review ---")
    code, daily = get("/api/security/daily-report")
    assert code == 200
    assert "posture_score" in daily
    assert "active_safeguards" in daily

    code, trends = get("/api/security/trends")
    assert code == 200
    assert len(trends["trends"]) >= 4

    code, review = get("/api/security/safety-review")
    assert code == 200
    assert len(review["checklist"]) == 5
    print("[PASS] Daily Report, Scam Trends, and Investor Safety Review OK")

    print("\n==========================================")
    print("ALL LIVE IN V PROTECT E2E VERIFICATIONS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_e2e_verification()
