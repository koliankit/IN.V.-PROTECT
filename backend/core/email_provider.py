"""
Transactional Email Provider Abstraction for Sangyan AI Investor Shield.
Supports SMTP and Resend API. Strictly checks configuration.
Never prints OTP into public logs and never pretends email was sent if unconfigured.
"""
from abc import ABC, abstractmethod
import email.utils
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import smtplib
import ssl
from typing import Dict, Optional, Tuple
import httpx


class EmailProvider(ABC):
    """Abstract interface for transactional email delivery."""

    sent_otps: Dict[str, str] = {}

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True only if valid live credentials and settings exist."""
        pass

    @abstractmethod
    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        """
        Sends the 6-digit OTP to the recipient.
        Returns: (success: bool, status_message: str)
        """
        pass


class SMTPProvider(EmailProvider):
    """Real transactional email delivery via standard SMTP with STARTTLS / SSL."""

    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        username: Optional[str] = None,
        password: Optional[str] = None,
        email_from: Optional[str] = None,
        use_tls: bool = True,
    ) -> None:
        self.host = host or os.getenv("EMAIL_HOST") or os.getenv("SMTP_HOST", "")
        port_env = os.getenv("EMAIL_PORT") or os.getenv("SMTP_PORT")
        self.port = port if port is not None else (int(port_env) if port_env and port_env.isdigit() else 587)
        self.username = username or os.getenv("EMAIL_USERNAME") or os.getenv("SMTP_USERNAME", "")
        raw_pw = password or os.getenv("EMAIL_PASSWORD") or os.getenv("SMTP_PASSWORD", "")
        self.password = raw_pw.replace(" ", "") if "gmail" in (self.host or "").lower() else raw_pw
        self.email_from = email_from or os.getenv("EMAIL_FROM", "security@sangyan.gov.in")
        self.use_tls = use_tls

    def is_configured(self) -> bool:
        return bool(self.host and self.port and self.username and self.password)

    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        if not self.is_configured():
            return False, "Email verification service is not configured."

        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Sangyan AI Investor Shield - Your {purpose.title()} Verification Code"
        msg["From"] = self.email_from
        msg["To"] = to_email
        msg["Date"] = email.utils.formatdate(localtime=True)

        plain_text = (
            f"Sangyan AI Investor Shield - Owner Verification\n\n"
            f"Your single-use verification code is: {otp}\n\n"
            f"This code will expire in 5 minutes.\n"
            f"If you did not request this verification, please secure your email account immediately.\n"
            f"Sangyan will NEVER ask for your bank password, Demat password, UPI PIN, or ATM PIN.\n"
        )
        html_text = f"""
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 28px; border-radius: 12px; max-width: 520px;">
            <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #38bdf8; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em;">SANGYAN AI INVESTOR SHIELD</h2>
                <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Government & Regulatory Fraud Resilience Platform</p>
            </div>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5;">
                An owner verification request was initiated for your digital financial shield. Use the secure single-use code below to complete authorization:
            </p>
            <div style="background: #111827; border: 1px solid #38bdf8; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">{otp}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8;">
                ✓ Valid for <strong>5 minutes</strong> only.<br>
                ✓ Single-use cryptographic verification.<br>
                ✓ Zero storage of bank passwords, OTPs, or UPI PINs.
            </p>
            <div style="border-top: 1px solid #1e293b; padding-top: 14px; margin-top: 24px; font-size: 11px; color: #64748b;">
                Notice: If you did not initiate this registration or login, disregard this message. Sangyan AI does not authorize remote funds transfers.
            </div>
        </div>
        """
        msg.attach(MIMEText(plain_text, "plain"))
        msg.attach(MIMEText(html_text, "html"))

        try:
            context = ssl.create_default_context()
            if self.port == 465:
                with smtplib.SMTP_SSL(self.host, self.port, context=context, timeout=10) as server:
                    server.login(self.username, self.password)
                    server.sendmail(self.email_from, [to_email], msg.as_string())
            else:
                with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                    if self.use_tls:
                        server.starttls(context=context)
                    server.login(self.username, self.password)
                    server.sendmail(self.email_from, [to_email], msg.as_string())
            return True, "Verification code sent to your email address."
        except Exception as e:
            return False, f"Failed to deliver verification email via SMTP: {str(e)}"


class ResendProvider(EmailProvider):
    """Transactional email delivery via Resend HTTP API."""

    def __init__(self, api_key: Optional[str] = None, email_from: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("RESEND_API_KEY", "")
        self.email_from = email_from or os.getenv("EMAIL_FROM", "onboarding@resend.dev")

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        if not self.is_configured():
            return False, "Email verification service is not configured."

        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "from": self.email_from,
            "to": [to_email],
            "subject": f"Sangyan AI Investor Shield - {purpose.title()} Verification Code",
            "html": f"""
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 24px; border-radius: 8px;">
                <h3 style="color: #38bdf8;">SANGYAN AI INVESTOR SHIELD</h3>
                <p>Your one-time verification code is:</p>
                <h1 style="color: #38bdf8; letter-spacing: 6px;">{otp}</h1>
                <p>This code expires in 5 minutes.</p>
            </div>
            """,
        }
        try:
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(url, headers=headers, json=payload)
                if resp.status_code in (200, 201):
                    return True, "Verification code sent to your email address."
                return False, f"Email delivery failed with status {resp.status_code}."
        except Exception as e:
            return False, f"Failed to deliver verification email: {str(e)}"


class UnconfiguredEmailProvider(EmailProvider):
    """Active when no email credentials exist in environment. Never pretends verification succeeded."""

    def is_configured(self) -> bool:
        return False

    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        return False, "Email verification service is not configured."


class MockLoopbackEmailProvider(EmailProvider):
    """
    STRICTLY FOR AUTOMATED TESTING ONLY.
    Allows testing OTP end-to-end verification without hitting live external SMTP in test runners.
    Only instantiated when explicitly enabled in pytest test fixtures.
    """

    def __init__(self) -> None:
        self.sent_otps: Dict[str, str] = {}

    def is_configured(self) -> bool:
        return True

    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        self.sent_otps[to_email.lower()] = otp
        return True, "Verification code sent to your email address (Test Engine)."


class SandboxEmailProvider(EmailProvider):
    """
    Developer Sandbox Mode for local development without live external credentials.
    Generates real cryptographically secure OTPs, logs them prominently to the terminal,
    and exposes the code so developers can test verification end-to-end without external SMTP dependencies.
    """

    def __init__(self) -> None:
        self.last_otp: Optional[str] = None

    def is_configured(self) -> bool:
        return True

    def send_otp(self, to_email: str, otp: str, purpose: str = "REGISTRATION") -> Tuple[bool, str]:
        self.last_otp = otp
        print("\n" + "=" * 64, flush=True)
        print("[SANGYAN DEV SANDBOX OTP DELIVERY]", flush=True)
        print(f"Recipient : {to_email}", flush=True)
        print(f"Purpose   : {purpose}", flush=True)
        print(f"YOUR CODE : >>> {otp} <<<", flush=True)
        print("Notice    : Real HMAC-SHA256 salted hash stored in database.", flush=True)
        print("=" * 64 + "\n", flush=True)
        return True, f"Sandbox Mode: Code [{otp}] generated (Logged to console)."


# Singleton instances
_mock_email_instance = MockLoopbackEmailProvider()
_sandbox_email_instance = SandboxEmailProvider()


def get_email_provider() -> EmailProvider:
    """Factory selecting the configured transactional email provider."""
    # Dedicated test mode hook for testing environment only
    if os.getenv("SANGYAN_TEST_EMAIL_LOOPBACK") == "true":
        return _mock_email_instance

    provider_name = os.getenv("EMAIL_PROVIDER", "").strip().lower()

    if provider_name in ("sandbox", "console", "dev"):
        return _sandbox_email_instance

    if provider_name == "smtp":
        p = SMTPProvider()
        return p if p.is_configured() else UnconfiguredEmailProvider()

    elif provider_name == "resend":
        p = ResendProvider()
        return p if p.is_configured() else UnconfiguredEmailProvider()

    elif (os.getenv("EMAIL_HOST") or os.getenv("SMTP_HOST")) and (os.getenv("EMAIL_USERNAME") or os.getenv("SMTP_USERNAME")) and (os.getenv("EMAIL_PASSWORD") or os.getenv("SMTP_PASSWORD")):
        p = SMTPProvider()
        return p if p.is_configured() else UnconfiguredEmailProvider()

    elif os.getenv("RESEND_API_KEY"):
        p = ResendProvider()
        return p if p.is_configured() else UnconfiguredEmailProvider()

    return UnconfiguredEmailProvider()
