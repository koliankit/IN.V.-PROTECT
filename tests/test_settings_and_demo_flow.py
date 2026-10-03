"""
Tests for Settings, Onboarding, 9-Stage Demo Attack Interception, and Expanded Claim Verifications.
"""
import unittest
from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas.security_hub import ProtectionLevel, ProtectionTier, ClaimVerificationStatus
from backend.core.security_hub import security_hub
from backend.core.rule_engine import rule_engine


class TestSettingsAndDemoFlow(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_get_settings_default(self) -> None:
        res = self.client.get("/api/settings")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("protection_level", data)
        self.assertIn("no_auto_delete_guarantee", data)
        self.assertIn("ENFORCED", data["no_auto_delete_guarantee"])

    def test_update_settings(self) -> None:
        payload = {
            "protection_level": "STRICT",
            "evidence_retention_days": 15,
            "watch_haptics_enabled": True,
        }
        res = self.client.post("/api/settings", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["protection_level"], "STRICT")
        self.assertEqual(data["evidence_retention_days"], 15)

        # Reset back to ENHANCED
        self.client.post("/api/settings", json={"protection_level": "ENHANCED"})

    def test_purge_audit_logs(self) -> None:
        res = self.client.post("/api/settings/purge")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("purged_messages_count", data)

    def test_get_demo_attack_flow_9_stages(self) -> None:
        res = self.client.get("/api/demo/flow")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["steps"]), 9)
        self.assertEqual(data["mode"], "DEMO / SIMULATED FLOW")
        self.assertIn("SEBI", data["steps"][0]["content"])

        # Check step names
        step_names = [s["name"] for s in data["steps"]]
        self.assertIn("User Receives Inbound Message", step_names[0])
        self.assertIn("Quarantine", step_names[5])
        self.assertIn("User-Confirmed Incident Escalation", step_names[8])

    def test_claim_verification_sebi_app_approval_contradicted(self) -> None:
        res = security_hub.verify_claim("SEBI approved this app for retail trading", "official_endorsement")
        self.assertEqual(res.verification_status, ClaimVerificationStatus.CONTRADICTED)
        self.assertIn("SEBI", res.verification_notes)
        self.assertIn("NEVER certifies", res.verification_notes)

    def test_claim_verification_rbi_payment_contradicted(self) -> None:
        res = security_hub.verify_claim("RBI requires this payment to release clearance funds", "payment_request")
        self.assertEqual(res.verification_status, ClaimVerificationStatus.CONTRADICTED)
        self.assertIn("Reserve Bank of India", res.verification_notes)

    def test_claim_verification_govt_approved_unverified(self) -> None:
        res = security_hub.verify_claim("Government approved this investment program", "official_endorsement")
        self.assertEqual(res.verification_status, ClaimVerificationStatus.UNVERIFIED)
        self.assertIn("Could not verify", res.verification_notes)

    def test_personal_upi_payment_rule_detection(self) -> None:
        text = "Please send payment to rahul.wealth@okaxis to activate your portfolio."
        signals = rule_engine.run(text)
        signal_ids = {s.id for s in signals}
        self.assertIn("SIG_PERSONAL_UPI_PAYMENT", signal_ids)

    def test_remote_access_rule_detection(self) -> None:
        text = "Kindly install AnyDesk so our executive can verify your Demat KYC."
        signals = rule_engine.run(text)
        signal_ids = {s.id for s in signals}
        self.assertIn("SIG_REMOTE_ACCESS", signal_ids)

    def test_fake_investment_opportunity_rule_detection(self) -> None:
        text = "Access institutional FII quota allocations with guaranteed upper circuit before market open."
        signals = rule_engine.run(text)
        signal_ids = {s.id for s in signals}
        self.assertIn("SIG_FAKE_INVESTMENT_OPPORTUNITY", signal_ids)


if __name__ == "__main__":
    unittest.main()
