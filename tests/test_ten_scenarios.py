"""
Comprehensive 10-Scenario Test Suite for Sangyan AI Investor Shield.
Covers Section 28 of the Product Specification:
- Case 1: Guaranteed return scam
- Case 2: OTP + password request
- Case 3: Fake trading app/APK
- Case 4: Payment-before-withdrawal
- Case 5: Legitimate investor awareness message
- Case 6: Ambiguous financial message
- Case 7: Fake SEBI identity + suspicious link
- Case 8: Unknown sender but harmless message
- Case 9: Verified/legitimate financial notification
- Case 10: Multilingual/Hinglish scam message
"""
import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas.analysis import RiskLevel
from backend.schemas.security_hub import ProtectionTier


class TestTenScenarios(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_case_1_guaranteed_return_scam(self) -> None:
        """Case 1: Guaranteed return scam with unrealistic profits."""
        payload = {
            "text": "Exclusive WhatsApp Stock Advisory: Invest ₹10,000 today and get 100% guaranteed return of ₹50,000 every week risk-free! Limited slots remaining.",
            "channel": "whatsapp",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Risk and Protection Tier
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)

        # Signals
        signal_names = [s["name"] for s in data["detected_signals"]]
        self.assertTrue(any("Guaranteed" in s or "Return" in s or "Unrealistic" in s for s in signal_names))

        # Evidence & Action
        self.assertGreaterEqual(len(data["evidence"]), 1)
        self.assertGreaterEqual(len(data["safe_next_steps"]), 1)
        self.assertIn("guaranteed", data["explanation"].lower())

    def test_case_2_otp_password_theft(self) -> None:
        """Case 2: Demat/Bank OTP and password harvesting."""
        payload = {
            "text": "URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. Please share your Demat login password and 6-digit OTP to complete verification immediately or your account will be suspended.",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)

        signal_names = [s["name"] for s in data["detected_signals"]]
        self.assertTrue(any("OTP" in s or "Password" in s or "Credential" in s for s in signal_names))
        self.assertTrue(any("Urgency" in s or "Suspension" in s for s in signal_names))

    def test_case_3_fake_trading_app_apk(self) -> None:
        """Case 3: Fake institutional trading application / sideloaded APK."""
        payload = {
            "text": "Download our institutional VIP trading app from http://vip-trade-pro.apk to trade pre-market institutional IPO quotas directly with zero brokerage.",
            "channel": "telegram",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)

        signal_names = [s["name"] for s in data["detected_signals"]]
        self.assertTrue(any("APK" in s or "Application" in s or "URL" in s or "Link" in s for s in signal_names))

    def test_case_4_payment_before_withdrawal(self) -> None:
        """Case 4: Advance fee / tax before profit withdrawal scam."""
        payload = {
            "text": "Your account has accumulated ₹2,80,000 profit. To release your fund withdrawal, kindly deposit 15% activation fee and government processing tax of ₹42,000 to our verification account.",
            "channel": "email",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)

        signal_names = [s["name"] for s in data["detected_signals"]]
        self.assertTrue(any("Fee" in s or "Withdrawal" in s or "Tax" in s or "Deposit" in s for s in signal_names))

    def test_case_5_legitimate_investor_awareness(self) -> None:
        """Case 5: Official investor education / awareness message."""
        payload = {
            "text": "SEBI Investor Education Note: Mutual fund investments are subject to market risks. Always read scheme-related documents carefully before investing. Verify intermediary registration on sebi.gov.in.",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.LOW_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.IMPORTANT.value)
        self.assertEqual(len(data["detected_signals"]), 0)

    def test_case_6_ambiguous_financial_message(self) -> None:
        """Case 6: Ambiguous stock recommendation requiring verification."""
        payload = {
            "text": "Heavy delivery buying noticed in ABC Infotech stock today. Technical breakout expected tomorrow morning.",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        # Should NOT be high concern since no fraud/OTP/guarantee signals
        self.assertIn(data["risk_level"], [RiskLevel.NEEDS_VERIFICATION.value, RiskLevel.LOW_CONCERN.value])
        self.assertIn(data["protection_tier"], [ProtectionTier.REVIEW.value, ProtectionTier.IMPORTANT.value])

    def test_case_7_fake_sebi_identity_suspicious_link(self) -> None:
        """Case 7: Impersonating SEBI with an unofficial domain link."""
        payload = {
            "text": "OFFICIAL SEBI NOTICE: The Securities and Exchange Board of India has approved this scheme. Visit http://sebi-verification-portal.xyz/login to claim your investor recovery settlement immediately.",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertGreaterEqual(len(data["claim_verifications"]), 1)
        # SEBI claim verification status check
        self.assertIn(data["claim_verifications"][0]["verification_status"], ["Contradicted", "Unverified", "Partially Supported"])

    def test_case_8_unknown_sender_harmless_message(self) -> None:
        """Case 8: Harmless message from unknown sender."""
        payload = {
            "text": "Hi Rahul, are we meeting for lunch at 1 PM today near Connaught Place?",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.LOW_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.IMPORTANT.value)
        self.assertEqual(len(data["detected_signals"]), 0)

    def test_case_9_verified_legitimate_financial_notification(self) -> None:
        """Case 9: Standard legitimate bank / broker transaction notification."""
        payload = {
            "text": "Your account ending with XX1234 has been debited by INR 1,500.00 on 02-Oct-2026 at POS STORE. Available balance INR 45,210.50. Call 1800-000-000 if not done by you.",
            "channel": "bank_notification",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.LOW_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.IMPORTANT.value)

    def test_case_10_multilingual_hinglish_scam(self) -> None:
        """Case 10: Multilingual / Hinglish high-return investment scam."""
        payload = {
            "text": "Sir, WhatsApp pe join karo. Daily guaranteed 50% profit milega bina kisi risk ke. Abhi 5000 deposit karo aur turant withdraw karo.",
            "channel": "whatsapp",
            "language": "hi",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertEqual(data["protection_tier"], ProtectionTier.QUARANTINE.value)
        self.assertGreaterEqual(len(data["detected_signals"]), 1)


if __name__ == "__main__":
    unittest.main()
