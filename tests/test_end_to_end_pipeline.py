"""
End-to-End System Tests for Sangyan AI Investor Shield.
Validates the integrated pipeline: Claim Extraction -> Rule Engine -> Risk Engine -> FastAPI Endpoints.
"""
import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas.analysis import RiskLevel


class TestEndToEndPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_health_check(self) -> None:
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")
        self.assertGreaterEqual(data["registered_sources_count"], 1)

    def test_demo_examples_available(self) -> None:
        res = self.client.get("/api/demo-examples")
        self.assertEqual(res.status_code, 200)
        demos = res.json()
        self.assertGreaterEqual(len(demos), 4)

    def test_high_concern_telegram_scam(self) -> None:
        payload = {
            "text": "Join VIP group! Guaranteed 200% return in 24 hours. Download our APK app and deposit 5,000 INR before withdrawal.",
            "channel": "telegram",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)
        self.assertGreaterEqual(len(data["detected_signals"]), 1)
        self.assertGreaterEqual(len(data["evidence"]), 1)
        self.assertGreaterEqual(len(data["safe_next_steps"]), 1)

    def test_demat_kyc_freeze_phishing(self) -> None:
        payload = {
            "text": "URGENT: Demat Account suspended within 2 hours. Click link to verify KYC and pay 3,000 INR release charge.",
            "channel": "sms",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["risk_level"], RiskLevel.HIGH_CONCERN.value)

    def test_low_concern_legitimate_investment(self) -> None:
        payload = {
            "text": "Investing in diversified index funds through SEBI registered brokers is suitable for long term wealth creation. Mutual funds are subject to market risks.",
            "channel": "web",
        }
        res = self.client.post("/api/analyze", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["risk_level"], RiskLevel.LOW_CONCERN.value)

    def test_entity_verification_endpoint(self) -> None:
        res = self.client.post("/api/verify-entity", json={"query": "INH000012345"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_valid_format"])


if __name__ == "__main__":
    unittest.main()
