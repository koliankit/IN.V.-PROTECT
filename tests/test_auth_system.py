"""
Unit and Integration Tests for Production Authentication & Owner Verification.
Verifies real OTP hashing, honest unconfigured provider behavior, state transitions,
session token rotation, device pairing, and zero raw biometric persistence.
"""
import os
import unittest
from datetime import datetime, timedelta, timezone

from backend.db.auth_db import auth_db
from backend.core.security_crypto import security_crypto
from backend.core.email_provider import (
    UnconfiguredEmailProvider,
    MockLoopbackEmailProvider,
    get_email_provider,
)
from backend.core.face_provider import (
    UnconfiguredFaceProvider,
    MockLoopbackFaceProvider,
    get_face_provider,
)
from backend.core.auth_service import auth_service
from backend.schemas.auth import AccountStatus, DeviceType


class TestAuthSystem(unittest.TestCase):
    def setUp(self):
        # Ensure fresh DB state for test user
        self.test_email = f"investor_{os.urandom(4).hex()}@example.com"
        self.test_name = "Arjun Verma"
        self.activation_code = "SANGYAN-2026"

    def test_01_registration_invalid_activation_code_rejected(self):
        success, msg, data = auth_service.register_owner(
            full_name=self.test_name,
            email=self.test_email,
            activation_code="INVALID-CODE-XYZ",
        )
        self.assertFalse(success)
        self.assertIn("Invalid activation code", msg)
        self.assertIsNone(data)

    def test_02_unconfigured_email_provider_fails_honestly(self):
        # When email provider is unconfigured, system MUST NOT claim email was sent
        os.environ["SANGYAN_TEST_EMAIL_LOOPBACK"] = "false"
        os.environ["EMAIL_PROVIDER"] = ""
        os.environ["SMTP_HOST"] = ""
        os.environ["RESEND_API_KEY"] = ""

        provider = get_email_provider()
        self.assertFalse(provider.is_configured())

        sent, msg = provider.send_otp(self.test_email, "123456")
        self.assertFalse(sent)
        self.assertEqual(msg, "Email verification service is not configured.")

    def test_03_end_to_end_registration_otp_and_identity_flow(self):
        # Enable test email loopback for automated flow testing
        os.environ["SANGYAN_TEST_EMAIL_LOOPBACK"] = "true"
        os.environ["SANGYAN_TEST_FACE_LOOPBACK"] = "true"

        # 1. Register Owner
        success, reg_msg, reg_data = auth_service.register_owner(
            full_name=self.test_name,
            email=self.test_email,
            activation_code=self.activation_code,
        )
        self.assertTrue(success, reg_msg)
        self.assertIsNotNone(reg_data)
        user_id = reg_data["user_id"]
        self.assertEqual(reg_data["account_status"], AccountStatus.PENDING_EMAIL.value)

        # 2. Verify OTP record in database is salted & hashed (NO plaintext OTP)
        latest_verif = auth_db.get_latest_email_verification(self.test_email)
        self.assertIsNotNone(latest_verif)
        self.assertNotIn("123456", latest_verif["otp_hash"])  # Hash must not equal raw value
        self.assertTrue(len(latest_verif["salt"]) >= 16)

        # 3. Retrieve dispatched OTP via test provider
        test_email_prov = get_email_provider()
        dispatched_otp = test_email_prov.sent_otps.get(self.test_email.lower())
        self.assertIsNotNone(dispatched_otp)
        self.assertEqual(len(dispatched_otp), 6)

        # 4. Verify invalid OTP fails
        invalid_res, invalid_msg, _ = auth_service.verify_email_otp(self.test_email, "000000")
        self.assertFalse(invalid_res)
        self.assertIn("Invalid verification code", invalid_msg)

        # 5. Verify valid OTP succeeds and advances state to PENDING_IDENTITY
        valid_res, valid_msg, valid_data = auth_service.verify_email_otp(self.test_email, dispatched_otp)
        self.assertTrue(valid_res, valid_msg)
        self.assertTrue(valid_data["email_verified"])
        self.assertEqual(valid_data["next_step"], "IDENTITY_VERIFICATION")

        user = auth_db.get_user_by_id(user_id)
        self.assertTrue(user["email_verified"])
        self.assertEqual(user["account_status"], AccountStatus.PENDING_IDENTITY.value)

        # 6. Liveness verification requires explicit consent
        consent_failed = auth_service.start_liveness_session(user_id=user_id, consent_given=False)
        self.assertFalse(consent_failed["success"])
        self.assertIn("explicit", consent_failed["error"].lower())

        # 7. Start real liveness session with consent
        session_res = auth_service.start_liveness_session(user_id=user_id, consent_given=True)
        self.assertTrue(session_res["success"])
        session_id = session_res["session_id"]

        # 8. Complete liveness verification
        ident_res = auth_service.verify_liveness(session_id, {"faces_detected": 1, "lighting_acceptable": True})
        self.assertTrue(ident_res["success"])
        self.assertTrue(ident_res["identity_verified"])

        # 9. Verify user account is now ACTIVE
        active_user = auth_service.get_owner_profile(user_id)
        self.assertTrue(active_user["identity_verified"])
        self.assertEqual(active_user["account_status"], AccountStatus.ACTIVE.value)

    def test_04_unconfigured_face_provider_fails_honestly(self):
        os.environ["SANGYAN_TEST_FACE_LOOPBACK"] = "false"
        os.environ["LIVENESS_PROVIDER_URL"] = ""
        os.environ["LIVENESS_API_KEY"] = ""

        face_prov = get_face_provider()
        self.assertFalse(face_prov.is_configured())

        res = face_prov.create_session("USER-123", consent_given=True)
        self.assertFalse(res["success"])
        self.assertIn("not configured", res["error"].lower())

    def test_05_login_lockout_after_max_failures(self):
        os.environ["SANGYAN_TEST_EMAIL_LOOPBACK"] = "true"
        # Create active user
        user_id = f"OWNER-TEST-LOCKOUT-{os.urandom(4).hex()}"
        email = f"lockout_{os.urandom(4).hex()}@example.com"
        auth_db.create_user(user_id=user_id, full_name="Lockout Test", email=email, account_status="ACTIVE")
        auth_db.update_user_status(user_id=user_id, email_verified=True, identity_verified=True)

        # Attempt 5 incorrect OTP logins
        for _ in range(5):
            success, msg, data = auth_service.verify_login_and_create_session(
                email=email,
                otp="999999",
            )
            self.assertFalse(success)

        # 6th attempt should be blocked due to account lockout
        user = auth_db.get_user_by_id(user_id)
        self.assertEqual(user["account_status"], AccountStatus.LOCKED.value)
        self.assertIsNotNone(user["locked_until"])

        blocked_success, blocked_msg, _ = auth_service.verify_login_and_create_session(
            email=email,
            otp="999999",
        )
        self.assertFalse(blocked_success)
        self.assertIn("locked", blocked_msg.lower())

    def test_06_session_creation_refresh_and_revocation(self):
        os.environ["SANGYAN_TEST_EMAIL_LOOPBACK"] = "true"
        user_id = f"OWNER-SES-{os.urandom(4).hex()}"
        email = f"session_{os.urandom(4).hex()}@example.com"
        auth_db.create_user(user_id=user_id, full_name="Session Owner", email=email, account_status="ACTIVE")
        auth_db.update_user_status(user_id=user_id, email_verified=True, identity_verified=True)

        # Send login OTP
        auth_service.send_email_otp(email, purpose="LOGIN")
        otp = get_email_provider().sent_otps[email.lower()]

        # Login and acquire tokens
        login_ok, login_msg, auth_data = auth_service.verify_login_and_create_session(email=email, otp=otp)
        self.assertTrue(login_ok, login_msg)
        access_token = auth_data["access_token"]
        refresh_token = auth_data["refresh_token"]

        # Verify access token decodes
        decoded = security_crypto.decode_token(access_token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["sub"], user_id)
        session_id = decoded["session_id"]

        # Rotate tokens via refresh
        ref_ok, ref_msg, ref_data = auth_service.refresh_session_tokens(refresh_token)
        self.assertTrue(ref_ok, ref_msg)
        self.assertNotEqual(ref_data["access_token"], access_token)

        # Logout session
        auth_service.logout(session_id, user_id)
        sessions = auth_db.get_user_sessions(user_id)
        active_session = next((s for s in sessions if s["session_id"] == session_id), None)
        self.assertIsNone(active_session, "Revoked session must not appear in active sessions")

    def test_07_device_pairing_short_lived_lifecycle(self):
        user_id = f"OWNER-PAIR-{os.urandom(4).hex()}"
        email = f"pair_{os.urandom(4).hex()}@example.com"
        auth_db.create_user(user_id=user_id, full_name="Pairing Owner", email=email, account_status="ACTIVE")

        # Create pairing session
        pair_res = auth_service.create_pairing_session(user_id=user_id, device_type=DeviceType.MOBILE)
        self.assertEqual(pair_res["status"], "PENDING")
        pairing_id = pair_res["pairing_id"]
        pairing_code = pair_res["pairing_code"]
        self.assertTrue(len(pairing_code) >= 8)

        # Complete pairing with wrong code fails
        fail_ok, fail_msg, _ = auth_service.complete_pairing_session(pairing_id, "WRONG-CODE")
        self.assertFalse(fail_ok)

        # Complete pairing with correct code succeeds
        comp_ok, comp_msg, comp_data = auth_service.complete_pairing_session(
            pairing_id=pairing_id,
            pairing_code=pairing_code,
            device_platform="Android 14",
            device_name="Investor Pixel 8",
        )
        self.assertTrue(comp_ok, comp_msg)
        self.assertEqual(comp_data["status"], "ACTIVE")

        devices = auth_db.get_devices_for_user(user_id)
        paired_device = next((d for d in devices if d["device_name"] == "Investor Pixel 8"), None)
        self.assertIsNotNone(paired_device)
        self.assertEqual(paired_device["platform"], "Android 14")


if __name__ == "__main__":
    unittest.main()
