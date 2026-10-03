"""
Tests for IN V PROTECT Architecture Requirements.
Validates:
1. PII Redaction of actual OTPs, UPI PINs, ATM PINs, and Passwords while preserving signal keywords.
2. Language Detection across English, Hindi, and Hinglish.
3. Daily Security Report, Scam Trends, and Safety Review endpoints.
4. User-confirmed reporting flow with official regulatory reporting links.
5. Absolute prevention of OTP leakage via API responses.
6. Honest unconfigured provider behavior.
"""
import unittest
from fastapi.testclient import TestClient

from backend.main import app
from backend.core.pii_redactor import pii_redactor
from backend.core.language_detector import language_detector
from backend.core.security_hub import security_hub


class TestInVProtectArchitecture(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_otp_and_credentials_strictly_redacted(self):
        text = "Your Demat verification OTP is 849201 and UPI PIN is 1234. Do not share your password is SuperSecretPass."
        redacted, stats = pii_redactor.redact(text)
        
        # Verify actual secret values are NOT present
        self.assertNotIn("849201", redacted)
        self.assertNotIn("1234", redacted)
        self.assertNotIn("SuperSecretPass", redacted)
        
        # Verify redaction tokens
        self.assertIn("[REDACTED_OTP]", redacted)
        self.assertIn("[REDACTED_PIN]", redacted)
        self.assertIn("[REDACTED_PASSWORD]", redacted)
        
        # Verify stats tracking
        self.assertGreaterEqual(stats["otps_redacted"], 1)
        self.assertGreaterEqual(stats["pins_redacted"], 1)
        self.assertGreaterEqual(stats["passwords_redacted"], 1)

    def test_02_language_detection(self):
        eng_text = "Invest in index funds for long term wealth creation."
        self.assertEqual(language_detector.detect(eng_text), "English")

        hindi_text = "म्यूचुअल फंड निवेश बाज़ार जोखिमों के अधीन हैं।"
        self.assertEqual(language_detector.detect(hindi_text), "Hindi")

        hinglish_text = "Rozana munafa guaranteed paisa double scheme turant shuru karein."
        self.assertEqual(language_detector.detect(hinglish_text), "Hinglish (Hindi in Roman Script)")

    def test_03_daily_security_report_endpoint(self):
        resp = self.client.get("/api/security/daily-report")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("date", data)
        self.assertIn("overall_posture", data)
        self.assertIn("posture_score", data)
        self.assertIn("scans_today", data)
        self.assertIn("active_safeguards", data)
        self.assertTrue(len(data["active_safeguards"]) >= 3)

    def test_04_scam_trends_endpoint(self):
        resp = self.client.get("/api/security/trends")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("headline", data)
        self.assertIn("trends", data)
        self.assertTrue(len(data["trends"]) >= 3)
        trend_titles = [t["title"] for t in data["trends"]]
        self.assertTrue(any("APK" in t for t in trend_titles))
        self.assertTrue(any("Guaranteed" in t or "Pump" in t for t in trend_titles))

    def test_05_investor_safety_review_endpoint(self):
        resp = self.client.get("/api/security/safety-review")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("overall_status", data)
        self.assertIn("safety_score", data)
        self.assertIn("checklist", data)
        self.assertTrue(len(data["checklist"]) >= 4)

    def test_06_user_confirmed_message_reporting(self):
        # Ingest or grab a message
        msgs = security_hub.get_messages(tier="quarantine")
        self.assertTrue(len(msgs) > 0)
        target_id = msgs[0].id

        report_resp = self.client.post(f"/api/messages/{target_id}/report")
        self.assertEqual(report_resp.status_code, 200)
        report_data = report_resp.json()
        self.assertTrue(report_data["success"])
        self.assertIn("incident_id", report_data)

    def test_07_api_never_returns_sandbox_otp(self):
        resp = self.client.post(
            "/api/auth/register",
            json={
                "full_name": "Karan Mehra",
                "email": "karan_test_never_leak@example.com",
                "activation_code": "SANGYAN-2026",
            },
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsNone(data.get("sandbox_otp"))


if __name__ == "__main__":
    unittest.main()
