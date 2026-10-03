"""
IN V PROTECT - Desktop Application Packaging & 6-Scenario Validation Suite.
Tests:
1. Health endpoint (/health and /api/health)
2. Frontend bundle static delivery (/)
3. Authentication routes & zero OTP leakage
4. 6 Core Scam Scenarios:
   - Scenario 1: Guaranteed Return Scam (High Concern / Quarantined)
   - Scenario 2: OTP/Demat Credential Harvesting (High Concern / Quarantined + PII Redaction)
   - Scenario 3: Fake Trading App/APK (High Concern / Quarantined)
   - Scenario 4: Payment-Before-Withdrawal (High Concern / Quarantined)
   - Scenario 5: Legitimate Investor Awareness (Low Concern / Trusted)
   - Scenario 6: Ambiguous Financial Message (Needs Verification / Review)
5. User-confirmed reporting (1930 / Chakshu / SEBI SCORES)
"""
import unittest
import uuid
import os
import sys

# Ensure root is in path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas.analysis import RiskLevel
from backend.schemas.security_hub import ProtectionTier


class TestDesktopPackagingAndScenarios(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_root_health_endpoint(self):
        """Verifies root /health endpoint returns status: ok and service: in-v-protect."""
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertEqual(data.get("service"), "in-v-protect")
        self.assertIn("version", data)

    def test_02_api_health_endpoint(self):
        """Verifies /api/health endpoint is backwards-compatible."""
        resp = self.client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("service"), "in-v-protect")

    def test_03_frontend_static_serving(self):
        """Verifies that root URL / serves the compiled React production index.html."""
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("<!doctype html>", resp.text.lower())
        self.assertIn("in v protect", resp.text.lower())

    def test_04_auth_register_zero_otp_leak(self):
        """Verifies owner registration never leaks raw OTP in API response."""
        unique_email = f"karan.desktop.{uuid.uuid4().hex[:6]}@example.com"
        payload = {
            "full_name": "Karan Security Test",
            "email": unique_email,
            "activation_code": "SANGYAN-2026",
            "device_name": "Windows Desktop Station",
            "device_type": "DESKTOP",
        }
        resp = self.client.post("/api/auth/register", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsNone(data.get("sandbox_otp"))
        self.assertNotIn("otp", data)
        self.assertIn("user_id", data)
        self.assertIn("@", data.get("masked_email", ""))

    # =========================================================================
    # THE 6 CORE INVESTOR SCENARIOS
    # =========================================================================

    def test_05_scenario_1_guaranteed_return_scam(self):
        """Scenario 1: Guaranteed Return Scam -> High Risk / Quarantine."""
        text = "Exclusive WhatsApp Stock Advisory: Invest ₹10,000 today and get 100% guaranteed return of ₹50,000 every week risk-free! Limited slots remaining."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "whatsapp"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        signal_names = [s["name"] for s in data.get("detected_signals", [])]
        self.assertTrue(any("Guaranteed" in s or "Return" in s for s in signal_names))

    def test_06_scenario_2_credential_harvesting_and_pii_redaction(self):
        """Scenario 2: OTP / Demat Credential Harvesting -> High Risk / Quarantine + PII Redacted."""
        text = "URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. Please share your Demat login password and 6-digit OTP to complete verification immediately."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "sms"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        signal_names = [s["name"] for s in data.get("detected_signals", [])]
        self.assertTrue(any("OTP" in s or "Password" in s or "Credential" in s for s in signal_names))

    def test_07_scenario_3_fake_trading_app_apk(self):
        """Scenario 3: Fake Trading App / APK Sideload -> High Risk / Quarantine."""
        text = "Download our institutional VIP trading app from http://vip-trade-pro.apk to trade pre-market institutional IPO quotas directly with zero brokerage."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "telegram"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        signal_names = [s["name"] for s in data.get("detected_signals", [])]
        self.assertTrue(any("APK" in s or "Application" in s or "URL" in s or "Link" in s for s in signal_names))

    def test_08_scenario_4_payment_before_withdrawal(self):
        """Scenario 4: Payment-Before-Withdrawal Extortion -> High Risk / Quarantine."""
        text = "Your account has accumulated ₹2,80,000 profit. To release your fund withdrawal, kindly deposit 15% activation fee and government processing tax of ₹42,000 to our verification account."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "whatsapp"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        signal_names = [s["name"] for s in data.get("detected_signals", [])]
        self.assertTrue(any("Fee" in s or "Withdrawal" in s or "Tax" in s or "Deposit" in s for s in signal_names))

    def test_09_scenario_5_legitimate_investor_awareness(self):
        """Scenario 5: Legitimate Investor Awareness -> Low Risk / Trusted."""
        text = "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Verify all broker and research analyst registration details on the official SEBI portal."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "web"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.IMPORTANT.value)
        self.assertEqual(data["risk_level"], RiskLevel.LOW_CONCERN.value)

    def test_10_scenario_6_ambiguous_financial_message(self):
        """Scenario 6: Ambiguous Financial Message -> Medium Risk / Review."""
        text = "Alpha Research (claiming SEBI RA Reg INH000099999) providing technical intraday levels for Nifty 50 and Bank Nifty. Please verify trading setup and risk-reward ratio before taking positions."
        resp = self.client.post("/api/analyze", json={"text": text, "channel": "telegram"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["protection_tier"], ProtectionTier.REVIEW.value)
        self.assertEqual(data["risk_level"], RiskLevel.NEEDS_VERIFICATION.value)

    def test_11_user_confirmed_reporting(self):
        """Verifies user-confirmed statutory reporting records the incident and returns official resources."""
        # Get messages to find quarantined message
        res = self.client.get("/api/messages")
        self.assertEqual(res.status_code, 200)
        messages = res.json()
        quarantined = [m for m in messages if m["protection_tier"] == "Quarantined / High Risk"]
        self.assertGreater(len(quarantined), 0)
        target_id = quarantined[0]["id"]

        # Trigger user-confirmed report
        report_res = self.client.post(f"/api/messages/{target_id}/report", json={
            "user_confirmed": True,
            "user_notes": "Tested confirmed reporting from IN V PROTECT validation suite"
        })
        self.assertEqual(report_res.status_code, 200)
        r_data = report_res.json()
        self.assertTrue(r_data.get("success"))
        self.assertIn("incident_id", r_data)
        self.assertIn("reporting_resources", r_data)
        resources = r_data["reporting_resources"]
        self.assertTrue(any("1930" in r.get("helpline", "") or "cybercrime" in r.get("portal", "") for r in resources))


if __name__ == "__main__":
    unittest.main()
