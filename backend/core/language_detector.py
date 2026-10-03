"""
Language Detection Engine for IN V PROTECT.
Identifies English, Hindi (Devanagari), Hinglish (Hindi written in Roman/Latin script),
and Regional multilingual formats in incoming investor communications.
"""
import re
from typing import Dict, Any

DEVANAGARI_REGEX = re.compile(r'[\u0900-\u097F]')

HINGLISH_KEYWORDS = {
    "paisa", "paise", "double", "munafa", "kamaye", "kamao", "karein", "karo", "apka",
    "aapka", "turant", "shuru", "dhamaka", "lakh", "crore", "hoga", "hai", "nahi",
    "milenge", "rozana", "yojana", "bhejo", "khatre", "khata", "sampark", "rakhein"
}


class LanguageDetector:
    """Detects primary and mixed communication language for investor protection."""

    def detect(self, text: str) -> str:
        if not text or not text.strip():
            return "English"

        clean = text.strip()

        # 1. Check for Devanagari script (Hindi / Marathi)
        devanagari_chars = len(DEVANAGARI_REGEX.findall(clean))
        total_letters = sum(1 for c in clean if c.isalpha())
        
        if total_letters > 0 and (devanagari_chars / total_letters) > 0.15:
            return "Hindi"

        # 2. Check for Hinglish (Latin characters + Hindi vernacular keywords)
        words = re.findall(r'\b[a-zA-Z]+\b', clean.lower())
        if words:
            hinglish_hits = sum(1 for w in words if w in HINGLISH_KEYWORDS)
            if hinglish_hits >= 2 or (len(words) <= 10 and hinglish_hits >= 1):
                return "Hinglish (Hindi in Roman Script)"

        return "English"


language_detector = LanguageDetector()
