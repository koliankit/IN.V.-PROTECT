"""
URL Safety and Domain Analysis Module for Sangyan AI Investor Shield.
Performs safe, offline lexical and heuristic analysis of investment links,
detecting typo-squatting, APK distribution, and unauthorized domain claims
without navigating to or executing malicious web assets.
"""
import re
from urllib.parse import urlparse
from typing import Dict, Any, List

OFFICIAL_DOMAINS = {
    "sebi.gov.in",
    "rbi.org.in",
    "cybercrime.gov.in",
    "sancharsaathi.gov.in",
    "data.gov.in",
    "scores.sebi.gov.in",
    "nseindia.com",
    "bseindia.com",
}

LEGITIMATE_REGULATED_BROKERS = {
    "zerodha.com",
    "groww.in",
    "upstox.com",
    "angelone.in",
    "icicidirect.com",
    "hdfcsec.com",
    "kotaksecurities.com",
    "sharekhan.com",
}

SUSPICIOUS_TLDS = {".apk", ".top", ".xyz", ".vip", ".work", ".download", ".live", ".fit", ".rest"}
REGULATORY_KEYWORDS = ["sebi", "rbi", "nse", "bse", "fii", "institutional", "kyc-update", "demat-unfreeze"]


class URLAnalyzer:
    """Safely inspects URLs for financial phishing and sideloaded app indicators."""

    def analyze_url(self, raw_url: str) -> Dict[str, Any]:
        url = raw_url.strip()
        if not url.startswith(("http://", "https://")):
            url = f"https://{url}"

        try:
            parsed = urlparse(url)
            domain = (parsed.hostname or "").lower()
            path = parsed.path.lower()
        except Exception:
            return {
                "url": raw_url,
                "is_valid": False,
                "domain": "invalid",
                "risk_rating": "High Concern",
                "signals": ["Malformed or unparseable URL structure"],
                "is_official": False,
                "recommendation": "Do not open or enter credentials on malformed links.",
            }

        if not domain or "." not in domain:
            return {
                "url": raw_url,
                "is_valid": False,
                "domain": domain or "unknown",
                "risk_rating": "High Concern",
                "signals": ["Invalid domain name format"],
                "is_official": False,
                "recommendation": "Avoid interacting with incomplete or suspicious web addresses.",
            }

        signals: List[str] = []
        is_official = any(domain == od or domain.endswith(f".{od}") for od in OFFICIAL_DOMAINS)
        is_known_broker = any(domain == kb or domain.endswith(f".{kb}") for kb in LEGITIMATE_REGULATED_BROKERS)

        # 1. IP address host detection
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain):
            signals.append("IP Address Host: URL uses a raw numeric IP instead of a registered domain.")

        # 2. APK or Executable download detection
        if path.endswith((".apk", ".exe", ".dmg", ".bat", ".scr")):
            signals.append(f"Executable/APK Sideload: Direct binary download link detected in path ({path}).")

        # 3. Impersonation of Regulators on non-official domains
        if not is_official:
            for kw in REGULATORY_KEYWORDS:
                if kw in domain:
                    signals.append(f"Regulatory Impersonation: Non-official domain uses regulatory token '{kw}' in hostname.")

        # 4. Suspicious TLD
        if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            signals.append("High-Risk TLD: Domain uses an extension frequently abused for ephemeral scam portals.")

        # 5. Insecure scheme with sensitive keywords
        if parsed.scheme == "http" and any(k in path or k in domain for k in ["login", "kyc", "bank", "pay"]):
            signals.append("Unencrypted Transmission: HTTP protocol used with financial/authentication keywords.")

        # Determine risk
        if is_official:
            risk_rating = "Low Concern"
            recommendation = "This is a verified statutory regulatory domain."
        elif signals:
            risk_rating = "High Concern" if any("APK" in s or "Impersonation" in s or "IP Address" in s for s in signals) else "Needs Verification"
            recommendation = "Do NOT enter credentials, OTPs, or transfer money through this link. Verify via official registers."
        elif is_known_broker:
            risk_rating = "Low Concern"
            recommendation = "Domain matches a recognized SEBI-registered brokerage portal. Ensure HTTPS certificate is valid."
        else:
            risk_rating = "Needs Verification"
            recommendation = "Domain is not in the recognized regulatory or major broker whitelist. Conduct independent due diligence."

        return {
            "url": raw_url,
            "is_valid": True,
            "domain": domain,
            "scheme": parsed.scheme,
            "is_official": is_official,
            "is_known_broker": is_known_broker,
            "signals": signals,
            "risk_rating": risk_rating,
            "recommendation": recommendation,
        }


url_analyzer = URLAnalyzer()
