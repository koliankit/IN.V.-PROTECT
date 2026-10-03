"""
Entity Extractor for Sangyan AI Investor Shield.
Identifies financial, regulatory, and communication entities from unformatted text:
- SEBI registration numbers (INH, INZ, INP, INA, etc.)
- APK / App download links
- UPI handles / Payment addresses
- Promised ROI / Return percentages
- High-risk platforms (Telegram, WhatsApp, Signal)
"""
import re
from typing import Dict, List, Any


# Regulatory ID patterns (SEBI formats: INH000012345, INZ000123456, etc.)
SEBI_REG_REGEX = re.compile(r'\b(IN[A-Z]\d{8,9})\b', re.IGNORECASE)
UPI_REGEX = re.compile(r'[\w.\-]+@(?:okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|ibl|upi|postbank)\b', re.IGNORECASE)
PERCENTAGE_REGEX = re.compile(r'(\d+(?:\.\d+)?\s*%\s*(?:daily|weekly|monthly|per day|per week|return|profit|guaranteed)?)', re.IGNORECASE)
AMOUNT_REGEX = re.compile(r'(?:₹|INR|Rs\.?)\s*(\d+(?:,\d+)*(?:\.\d+)?)|\b(\d+(?:,\d+)*)\s*(?:INR|rupees|lakh|crore)\b', re.IGNORECASE)
URL_REGEX = re.compile(r'https?://(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*', re.IGNORECASE)
APK_REGEX = re.compile(r'\b(?:[\w\-]+\.apk|\bapk\b|sideload|install our app from link)\b', re.IGNORECASE)
COMM_CHANNEL_REGEX = re.compile(r'\b(telegram|whatsapp|signal|t\.me|wa\.me|vip group|admin)\b', re.IGNORECASE)


class EntityExtractor:
    """Extracts critical financial, regulatory, and contact entities."""

    def extract(self, text: str) -> Dict[str, List[Any]]:
        return {
            "sebi_registration_numbers": list(set(SEBI_REG_REGEX.findall(text.upper()))),
            "upi_ids": list(set(UPI_REGEX.findall(text))),
            "urls": list(set(URL_REGEX.findall(text))),
            "apk_mentions": list(set(APK_REGEX.findall(text))),
            "percentages": list(set(m[0] for m in PERCENTAGE_REGEX.findall(text) if m[0])),
            "amounts": list(set(m[0] or m[1] for m in AMOUNT_REGEX.findall(text) if m[0] or m[1])),
            "channels": list(set(m.lower() for m in COMM_CHANNEL_REGEX.findall(text))),
        }


entity_extractor = EntityExtractor()
