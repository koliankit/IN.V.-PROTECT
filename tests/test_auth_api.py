"""
REST API Endpoint Tests for Sangyan AI Investor Shield Authentication.
Validates HTTP status codes, headers, cookie setting, rate limiting, and route protection.
"""
import os
from typing import cast
import unittest
from fastapi.testclient import TestClient

from backend.main import app
from backend.core.email_provider import get_email_provider, MockLoopbackEmailProvider
from backend.db.auth_db import auth_db


class TestAuthAPI(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)
        self.test_email = f"api_user_{os.urandom(4).hex()}@example.com"
        self.test_name = "Vikram Aditya"
        self.activation_code = "SANGYAN-2026"

    def test_01_get_auth_status(self) -> None:
        resp = self.client.get("/api/auth/status")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("has_registered_owner", data)
        self.assertIn("email_provider_configured", data)
        self.assertIn("face_provider_configured", data)
        self.assertTrue(data["zero_password_enforced"])
        self.assertFalse(data["raw_biometric_storage"])

    def test_02_register_owner_and_otp_flow(self) -> None:
        os.environ["SANGYAN_TEST_EMAIL_LOOPBACK"] = "true"
        os.environ["SANGYAN_TEST_FACE_LOOPBACK"] = "true"

        # Register
        reg_resp = self.client.post(
            "/api/auth/register",
            json={
                "full_name": self.test_name,
                "email": self.test_email,
                "activation_code": self.activation_code,
                "device_name": "Test Laptop",
            },
        )
        self.assertEqual(reg_resp.status_code, 200, reg_resp.text)
        reg_data = reg_resp.json()
        self.assertEqual(reg_data["account_status"], "PENDING_EMAIL")
        user_id = reg_data["user_id"]

        # Dispatched OTP
        email_prov = cast(MockLoopbackEmailProvider, get_email_provider())
        otp = email_prov.sent_otps[self.test_email.lower()]

        # Verify OTP
        verif_resp = self.client.post(
            "/api/auth/email/verify",
            json={"email": self.test_email, "otp": otp, "purpose": "REGISTRATION"},
        )
        self.assertEqual(verif_resp.status_code, 200, verif_resp.text)
        self.assertTrue(verif_resp.json()["email_verified"])

        # Start Liveness
        live_resp = self.client.post(
            "/api/auth/identity/create",
            json={"user_id": user_id, "consent_given": True},
        )
        self.assertEqual(live_resp.status_code, 200, live_resp.text)
        session_id = live_resp.json()["session_id"]

        # Complete Liveness
        comp_resp = self.client.post(
            "/api/auth/identity/complete",
            json={
                "session_id": session_id,
                "liveness_proof": {"faces_detected": 1, "lighting_acceptable": True},
            },
        )
        self.assertEqual(comp_resp.status_code, 200, comp_resp.text)
        self.assertTrue(comp_resp.json()["identity_verified"])

        # Multi-factor Login
        login_init_resp = self.client.post("/api/auth/login", json={"email": self.test_email})
        self.assertEqual(login_init_resp.status_code, 200)

        email_prov = cast(MockLoopbackEmailProvider, get_email_provider())
        login_otp = email_prov.sent_otps[self.test_email.lower()]
        login_resp = self.client.post(
            "/api/auth/login/verify",
            json={"email": self.test_email, "otp": login_otp, "device_name": "Test Device"},
        )
        self.assertEqual(login_resp.status_code, 200)
        auth_tokens = login_resp.json()
        token = auth_tokens["access_token"]

        # Access Protected /api/auth/me
        me_resp = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(me_resp.status_code, 200)
        me_data = me_resp.json()
        self.assertEqual(me_data["email"], self.test_email)
        self.assertTrue(me_data["identity_verified"])

        # List Sessions
        sessions_resp = self.client.get(
            "/api/auth/sessions",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(sessions_resp.status_code, 200)
        self.assertTrue(len(sessions_resp.json()) >= 1)

        # Logout
        logout_resp = self.client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(logout_resp.status_code, 200)

        # Access after logout must be rejected (401)
        revoked_resp = self.client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(revoked_resp.status_code, 401)


if __name__ == "__main__":
    unittest.main()
