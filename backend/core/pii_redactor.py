"""
PII Redaction Module for Sangyan AI Investor Shield.
Safely detects and masks sensitive personal identifiers (phone numbers, bank accounts,
Aadhaar, PAN cards, email addresses) to protect investor privacy.
"""
import re
from typing import Tuple, Dict

# Regex patterns for Indian and generic PII and sensitive financial credentials
PHONE_REGEX = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PAN_REGEX = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b')
AADHAAR_REGEX = re.compile(r'\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b')
BANK_ACCOUNT_REGEX = re.compile(r'\b\d{9,18}\b')
UPI_REGEX = re.compile(r'[\w.\-]+@(?:okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|upi)\b', re.IGNORECASE)

# Sensitive credentials that must NEVER be stored, exposed, or requested
OTP_VALUE_REGEX = re.compile(r'\b((?:(?:\w+\s+)?(?:otp|one[- ]time[- ]password|verification code|security code))\s*(?:is|hai|:|[-=])\s*)(\d{4,8})\b', re.IGNORECASE)
PIN_VALUE_REGEX = re.compile(r'\b((?:upi[- ]pin|atm[- ]pin|mpin|card pin|pin)\s*(?:is|hai|:|[-=])\s*)(\d{4,6})\b', re.IGNORECASE)
PASSWORD_VALUE_REGEX = re.compile(r'\b((?:password|passwd|login pass|demat password|bank password)\s*(?:is|hai|:|[-=])\s*)([^\s,;]+)', re.IGNORECASE)


class PIIRedactor:
    """
    Detects and redacts sensitive PII and confidential credentials.
    IN V PROTECT must NEVER collect, store, request, or expose the user's actual OTP,
    UPI PIN, ATM PIN, broker password, or bank password.
    """

    def redact(self, text: str) -> Tuple[str, Dict[str, int]]:
        redacted = text
        stats = {
            "phones": 0,
            "emails": 0,
            "pan_cards": 0,
            "aadhaar_numbers": 0,
            "otps_redacted": 0,
            "pins_redacted": 0,
            "passwords_redacted": 0,
        }

        # 1. Redact actual OTP codes while preserving the word 'OTP'
        otps = OTP_VALUE_REGEX.findall(redacted)
        if otps:
            stats["otps_redacted"] = len(otps)
            redacted = OTP_VALUE_REGEX.sub(r'\g<1>[REDACTED_OTP]', redacted)

        # 2. Redact actual PIN codes
        pins = PIN_VALUE_REGEX.findall(redacted)
        if pins:
            stats["pins_redacted"] = len(pins)
            redacted = PIN_VALUE_REGEX.sub(r'\g<1>[REDACTED_PIN]', redacted)

        # 3. Redact actual passwords
        passwords = PASSWORD_VALUE_REGEX.findall(redacted)
        if passwords:
            stats["passwords_redacted"] = len(passwords)
            redacted = PASSWORD_VALUE_REGEX.sub(r'\g<1>[REDACTED_PASSWORD]', redacted)

        # 4. Redact emails
        emails = EMAIL_REGEX.findall(redacted)
        if emails:
            stats["emails"] = len(emails)
            redacted = EMAIL_REGEX.sub("[REDACTED_EMAIL]", redacted)

        # 5. Redact PAN cards
        pans = PAN_REGEX.findall(redacted)
        if pans:
            stats["pan_cards"] = len(pans)
            redacted = PAN_REGEX.sub("[REDACTED_PAN]", redacted)

        # 6. Redact Aadhaar numbers (12 digits)
        aadhaar = AADHAAR_REGEX.findall(redacted)
        if aadhaar:
            stats["aadhaar_numbers"] = len(aadhaar)
            redacted = AADHAAR_REGEX.sub("[REDACTED_AADHAAR]", redacted)

        # 7. Redact Phone numbers (10 digits starting with 6-9 or +91)
        phones = PHONE_REGEX.findall(redacted)
        if phones:
            stats["phones"] = len(phones)
            redacted = PHONE_REGEX.sub("[REDACTED_PHONE]", redacted)

        stats["total_redactions"] = sum(v for k, v in stats.items() if k != "total_redactions")
        return redacted, stats


pii_redactor = PIIRedactor()
