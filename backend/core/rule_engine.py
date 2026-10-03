"""
Rule Engine for Sangyan AI Investor Shield.
Encodes statutory and regulatory fraud detection heuristics grounded in official SEBI, RBI,
and I4C cybercrime advisories.
Every signal carries signal_id, signal_name, severity, evidence_text, confidence, and rule_source.
"""
import re
from typing import List, Dict, Any, Optional
from backend.schemas.analysis import DetectedSignal


class ScamRule:
    def __init__(
        self,
        rule_id: str,
        name: str,
        severity: str,
        description: str,
        statutory_reference: str,
        default_confidence: float = 0.90,
    ):
        self.rule_id = rule_id
        self.name = name
        self.severity = severity  # low, medium, high, critical
        self.description = description
        self.statutory_reference = statutory_reference
        self.default_confidence = default_confidence

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        raise NotImplementedError


class GuaranteedReturnRule(ScamRule):
    """SEBI prohibits registered intermediaries from offering guaranteed returns."""
    PATTERNS = [
        re.compile(r'\bguarantee[ds]?\s+.*?(?:profit|return|gains?|income)\b', re.IGNORECASE | re.DOTALL),
        re.compile(r'\bguaranteed\s+(?:returns?|profits?|gains?|payout|income)\b', re.IGNORECASE),
        re.compile(r'\b(?:risk[- ]?free|100%\s+risk[- ]?free|zero\s+risk)\b', re.IGNORECASE),
        re.compile(r'\b(?:\d+%\s*(?:daily|weekly|monthly|per\s+day|profit|return|gains?))\b', re.IGNORECASE),
        re.compile(r'\b(guaranteed|fixed|assured|risk[- ]?free)\s+(?:profit|return|gains?|income)\b', re.IGNORECASE),
        re.compile(r'\b(?:double|triple)\s+your\s+money\b', re.IGNORECASE),
        re.compile(r'\b(paisa\s+double|rozana\s+munafa|sure\s+shot\s+profit)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_001_GUARANTEED_RETURN",
            name="Guaranteed or Unrealistic Profit Promise",
            severity="critical",
            description="Offers of guaranteed returns, daily fixed profits, or risk-free trading violate SEBI regulations (SEBI/HO/MIRSD/DOS3/CIR/P/2018/139). Market investments inherently carry risk.",
            statutory_reference="SEBI Circular SEBI/HO/MIRSD/DOS3/CIR/P/2018/139 & Advisory on Unregistered Entities",
            default_confidence=0.98,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_GUARANTEED_RETURN",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class FakeAppRule(ScamRule):
    """Detects sideloaded APKs and unofficial trading apps."""
    PATTERNS = [
        re.compile(r'\b(?:download|install)\s+(?:our\s+)?(?:apk|app|software)\s+(?:from|via|at)\b', re.IGNORECASE),
        re.compile(r'\.apk\b', re.IGNORECASE),
        re.compile(r'\b(institutional\s+account|fii\s+quota|foreign\s+institutional|vip\s+trading\s+terminal|custom\s+app)\b', re.IGNORECASE),
        re.compile(r'\b(sideload|unknown\s+sources?)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_002_FAKE_TRADING_APP",
            name="Unofficial App Sideloading / APK Distribution",
            severity="critical",
            description="I4C and SEBI issue alerts against downloading unauthorized investment APKs or apps outside Google Play/Apple App Store that display fictitious ledger profits.",
            statutory_reference="I4C Advisory (Feb 2024) & SEBI Caution on Fake Trading Apps (PR No.04/2024)",
            default_confidence=0.95,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        if entities.get("apk_mentions"):
            return DetectedSignal(
                id="SIG_FAKE_APP",
                name=self.name,
                severity=self.severity,
                rule_id=self.rule_id,
                description=self.description,
                evidence_text=".apk package mention in entities",
                confidence=self.default_confidence,
                rule_source=self.statutory_reference,
            )
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_FAKE_APP",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class WithdrawalFeeExtortionRule(ScamRule):
    """Detects advance fees, taxes, or margin demands prior to withdrawal."""
    PATTERNS = [
        re.compile(r'\b(?:to|before)\s+(?:withdraw|release|unlock|payout)\b.*?\b(?:pay|deposit|fee|charge)\b', re.IGNORECASE | re.DOTALL),
        re.compile(r'\b(pay|deposit|transfer|send)\s+.*?(?:before|to)\s+(?:withdraw|release|unlock|payout)\b', re.IGNORECASE | re.DOTALL),
        re.compile(r'\b(?:processing|withdrawal|activation|release|unlock|margin)\s+(?:fee|charge|deposit)\b', re.IGNORECASE),
        re.compile(r'\b(pay|deposit|transfer)\s+(?:\d+|tax|margin|fee|commission)\s+(?:to|before|for)\s+(?:withdraw|release|unlock|payout)\b', re.IGNORECASE),
        re.compile(r'\b(withdrawal\s+fee|tax\s+deduction\s+before\s+withdrawal|frozen\s+funds?\s+release|release\s+charge|unlock\s+fee)\b', re.IGNORECASE),
        re.compile(r'\b(pay\s+(?:20%|15%|10%|tds)\s+to\s+withdraw)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_003_WITHDRAWAL_EXTORTION",
            name="Advance Fee or Margin Demand for Withdrawal",
            severity="critical",
            description="Legitimate SEBI-regulated brokers automatically deduct statutory taxes (STT/TDS) and never demand upfront cash or UPI deposits to release user balances.",
            statutory_reference="SEBI Master Circular on Stock Brokers & I4C Cyber Fraud Typology",
            default_confidence=0.98,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_WITHDRAWAL_EXTORTION",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class ImpersonationRule(ScamRule):
    """Detects false claims of SEBI, RBI, or institutional affiliation on messaging apps."""
    PATTERNS = [
        re.compile(r'\b(?:officially\s+)?(?:approved|certified|endorsed|backed|registered)\s+by\s+(?:sebi|rbi|govt|government|nse|bse)\b', re.IGNORECASE),
        re.compile(r'\b(?:sebi|rbi|govt|government|securities and exchange board of india)\s+(?:has\s+)?(?:approved|certified|endorsed|backed|authorized|licensed)\b', re.IGNORECASE),
        re.compile(r'\b(?:sebi|rbi|nse|bse)\s+(?:approved|registered|certified|licensed)\s+(?:telegram|whatsapp|group|channel|expert|tipster|scheme)\b', re.IGNORECASE),
        re.compile(r'\b(?:institutional\s+desk|fii\s+client|privileged\s+quota|exclusive\s+club)\b', re.IGNORECASE),
        re.compile(r'\b(?:official\s+sebi\s+officer|rbi\s+authorized\s+agent|official\s+sebi\s+notice|official\s+rbi\s+notice)\b', re.IGNORECASE),
        re.compile(r'\b(?:sebi|rbi)\s+(?:recovery|settlement\s+scheme|investor\s+recovery)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_004_REGULATORY_IMPERSONATION",
            name="Regulatory Impersonation (SEBI/RBI/Exchange)",
            severity="high",
            description="SEBI and RBI never operate Telegram/WhatsApp groups, nor do they endorse private trading advisory channels or FII quotas for retail users.",
            statutory_reference="SEBI Press Release No. 04/2024 & RBI Cautionary Notices",
            default_confidence=0.92,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        channels = entities.get("channels", [])
        has_channel = any(c in channels for c in ["telegram", "whatsapp", "signal", "vip group"])
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_IMPERSONATION",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        if has_channel and ("sebi" in text.lower() or "rbi" in text.lower()):
            if "register" in text.lower() or "approved" in text.lower() or "guarantee" in text.lower():
                return DetectedSignal(
                    id="SIG_IMPERSONATION",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text="Regulatory entity mentioned in private group context",
                    confidence=0.85,
                    rule_source=self.statutory_reference,
                )
        return None


class ArtificialUrgencyRule(ScamRule):
    """Detects psychological pressure, countdowns, and panic triggers."""
    PATTERNS = [
        re.compile(r'\b(?:limited\s+time|expires?\s+(?:tonight|today|soon)|send\s+(?:the\s+)?payment\s+immediately)\b', re.IGNORECASE),
        re.compile(r'\b(?:account|demat)\s+(?:will\s+be\s+)?(?:blocked|suspended|deactivated|frozen)\s+(?:within|today|in\s+\d+\s+hours?)\b', re.IGNORECASE),
        re.compile(r'\b(?:urgent|immediately|act\s+now|last\s+chance|only\s+\d+\s+slots?\s+left)\b', re.IGNORECASE),
        re.compile(r'\b(?:kyc\s+(?:expired|failed|pending)|update\s+kyc\s+now)\b', re.IGNORECASE),
        re.compile(r'\b(?:claim|settle|verify)\b.{0,40}\bimmediately\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_005_ARTIFICIAL_URGENCY",
            name="Coercive Urgency & Account Freeze Threat",
            severity="high",
            description="Scammers fabricate artificial urgency or threats of immediate Demat/bank freeze to prevent victims from conducting independent due diligence.",
            statutory_reference="CERT-In Advisory CIAD-2023-0041 & DoT Sanchar Saathi Warnings",
            default_confidence=0.90,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_ARTIFICIAL_URGENCY",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class CredentialHarvestingRule(ScamRule):
    """Detects requests for Demat password, OTP, PIN, or remote screen-sharing tools."""
    PATTERNS = [
        # Matches: "share your Demat login password and 6-digit OTP", "send OTP", "provide PIN", etc.
        re.compile(r'\b(?:share|send|provide|give|enter|submit)\b.{0,60}\b(?:otp|one[-\s]?time[-\s]?password|pin|mpin|password|credentials)\b', re.IGNORECASE | re.DOTALL),
        re.compile(r'\b(?:otp|password|pin|mpin)\b.{0,40}\b(?:share|send|provide|verify|needed|required)\b', re.IGNORECASE | re.DOTALL),
        re.compile(r'\b(?:install|download)\s+(?:anydesk|teamviewer|rustdesk|quicksupport)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_006_CREDENTIAL_HARVESTING",
            name="Credential or Remote Screen-Sharing Request",
            severity="critical",
            description="No legitimate financial institution or broker will ever ask for OTPs, Demat passwords, or installation of remote access applications like AnyDesk.",
            statutory_reference="RBI Master Direction on Digital Payment Security & CERT-In Guidelines",
            default_confidence=0.99,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_CREDENTIAL_HARVESTING",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class KYCPressureRule(ScamRule):
    """Detects threats of deactivation or urgent KYC demands."""
    PATTERNS = [
        re.compile(r'\b(?:kyc\s+(?:expired|suspended|pending|update)|update\s+(?:your\s+)?kyc\s+immediately)\b', re.IGNORECASE),
        re.compile(r'\b(?:demat|bank)\s+account\s+(?:blocked|frozen)\s+(?:for\s+non[-\s]compliance|due\s+to\s+kyc)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_008_KYC_PRESSURE",
            name="Coercive KYC Verification Pressure",
            severity="high",
            description="Regulatory bodies and genuine brokers never send SMS/messages demanding instant KYC updates under threat of immediate account freeze.",
            statutory_reference="SEBI Advisory on Impersonation and Fake KYC Updation Links",
            default_confidence=0.92,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_KYC_PRESSURE",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class UnsolicitedStockTipRule(ScamRule):
    """Detects pump-and-dump, insider stock tips, or upper circuit hype."""
    PATTERNS = [
        re.compile(r'\b(?:insider\s+tip|sure\s+shot\s+call|upper\s+circuit\s+target|jackpot\s+share|multibagger\s+call)\b', re.IGNORECASE),
        re.compile(r'\b(?:buy\s+heavy|target\s+hit|guaranteed\s+circuit)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_007_UNSOLICITED_TIP",
            name="Unsolicited Stock Tip / Pump-and-Dump Indicator",
            severity="medium",
            description="SEBI cautions investors against unsolicited stock recommendations circulated via SMS, Telegram, or social media designed to manipulate penny stock liquidity.",
            statutory_reference="SEBI Caution Notice on Bulk SMS and Telegram Stock Tips",
            default_confidence=0.88,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_UNSOLICITED_TIP",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class SuspiciousUrlRule(ScamRule):
    """Detects suspicious financial phishing URLs, domain spoofing, and unofficial TLDs."""
    SUSPICIOUS_TLDS = [".xyz", ".top", ".club", ".buzz", ".online", ".site", ".vip", ".cc", ".tk", ".ml", ".ga"]
    REGULATOR_KEYWORDS = ["sebi", "rbi", "scores", "sancharsaathi", "cybercrime", "demat", "nsdl", "cdsl"]
    OFFICIAL_DOMAINS = ["sebi.gov.in", "rbi.org.in", "scores.gov.in", "cybercrime.gov.in", "sancharsaathi.gov.in", "cert-in.org.in", "nsdl.co.in", "cdslindia.com"]

    def __init__(self):
        super().__init__(
            rule_id="RULE_009_SUSPICIOUS_URL_DOMAIN_MISMATCH",
            name="Suspicious Financial URL / Domain Mismatch",
            severity="high",
            description="Message includes a link to an unofficial domain attempting to mimic financial institutions or statutory regulators. Legitimate statutory portals only operate under verified .gov.in or .org.in addresses.",
            statutory_reference="CERT-In Advisory on Financial Phishing & Fake Portal Masquerading",
            default_confidence=0.94,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        url_matches = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', text)
        if not url_matches and entities.get("urls"):
            url_matches = entities["urls"]

        for u in url_matches:
            u_lower = u.lower()
            # 1. Unofficial TLD with financial/regulator keyword
            for tld in self.SUSPICIOUS_TLDS:
                if tld in u_lower:
                    return DetectedSignal(
                        id="SIG_SUSPICIOUS_URL",
                        name=self.name,
                        severity=self.severity,
                        rule_id=self.rule_id,
                        description=f"Suspicious top-level domain ({tld}) detected in link: {u}",
                        evidence_text=u,
                        confidence=self.default_confidence,
                        rule_source=self.statutory_reference,
                    )
            # 2. Impersonating regulator/institution on non-official domain
            for kw in self.REGULATOR_KEYWORDS:
                if kw in u_lower:
                    is_official = any(off in u_lower for off in self.OFFICIAL_DOMAINS)
                    if not is_official:
                        return DetectedSignal(
                            id="SIG_SUSPICIOUS_URL",
                            name=self.name,
                            severity=self.severity,
                            rule_id=self.rule_id,
                            description=f"Link masquerades as {kw.upper()} on unofficial domain: {u}",
                            evidence_text=u,
                            confidence=0.96,
                            rule_source=self.statutory_reference,
                        )
        return None


class PersonalUPIPaymentRule(ScamRule):
    """Detects demands to transfer funds to personal UPI handles or savings accounts."""
    PATTERNS = [
        re.compile(r'[\w\.\-]+@(okhdfcbank|okaxis|okicici|oksbi|ybl|ibl|paytm|upi|postbank|barodampay|axl|apl)', re.IGNORECASE),
        re.compile(r'\b(?:personal|individual|savings)\s+(?:upi|bank\s+account|gpay|phonepe|paytm)\b', re.IGNORECASE),
        re.compile(r'\b(?:transfer|send|deposit|pay)\b.{0,40}\b(?:personal\s+account|personal\s+upi|our\s+upi)\b', re.IGNORECASE),
        re.compile(r'\b(?:pay|send|transfer)\s+(?:to|via)\s+[\w\.\-]+@\w+\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_010_PERSONAL_UPI_PAYMENT",
            name="Personal UPI / Third-Party Account Transfer Demand",
            severity="critical",
            description="SEBI Master Circular stipulates that investors must only fund trades via registered broker client bank accounts. Demands to send money to personal UPI handles or savings accounts are clear indicators of investment fraud.",
            statutory_reference="SEBI Master Circular for Stock Brokers (SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/71)",
            default_confidence=0.96,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_PERSONAL_UPI_PAYMENT",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class RemoteAccessRule(ScamRule):
    """Detects requests to download or install remote access software."""
    PATTERNS = [
        re.compile(r'\b(?:install|download|run|open)\s+(?:anydesk|teamviewer|rustdesk|quicksupport|airdroid|zoho\s+assist)\b', re.IGNORECASE),
        re.compile(r'\b(?:remote\s+access|screen[- ]?share|screen[- ]?sharing)\s+(?:app|tool|software|session)\b', re.IGNORECASE),
        re.compile(r'\b(?:grant|give)\s+(?:remote|screen)\s+access\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_011_REMOTE_ACCESS_TOOLS",
            name="Remote Desktop / Screen-Sharing Application Request",
            severity="critical",
            description="Perpetrators instruct investors to install screen-sharing software (AnyDesk, TeamViewer, RustDesk) to spy on OTPs and net banking logins in real-time. Regulators and genuine brokers NEVER request remote access.",
            statutory_reference="CERT-In Advisory CIAD-2024-0012 & RBI Digital Security Directives",
            default_confidence=0.98,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_REMOTE_ACCESS",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class AccountSuspensionThreatRule(ScamRule):
    """Detects explicit threats of immediate account freeze, Demat block, or penalty."""
    PATTERNS = [
        re.compile(r'\b(?:account|demat|portfolio)\s+(?:will\s+be\s+)?(?:permanently\s+)?(?:suspended|blocked|frozen|terminated|deactivated)\b', re.IGNORECASE),
        re.compile(r'\b(?:failure\s+to\s+comply\s+will\s+result\s+in|immediate\s+suspension\s+of\s+trading|avert\s+suspension)\b', re.IGNORECASE),
        re.compile(r'\b(?:suspended|blocked|frozen)\s+(?:today|within\s+\d+\s+hours?|immediately)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_012_ACCOUNT_SUSPENSION_THREAT",
            name="Account Suspension / Coercive Freeze Threat",
            severity="high",
            description="Threats of sudden Demat freezing or account cancellation are psychological extortion tactics designed to induce panic and bypass normal verification safeguards.",
            statutory_reference="DoT Sanchar Saathi & SEBI Cautionary Circulars on Impersonation",
            default_confidence=0.92,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_ACCOUNT_SUSPENSION",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class FakeInvestmentOpportunityRule(ScamRule):
    """Detects fake FII quotas, guaranteed upper circuits, or pre-IPO retail pools."""
    PATTERNS = [
        re.compile(r'\b(?:pre[- ]?ipo\s+(?:quota|shares?|allocation)|institutional\s+(?:quota|allocation|desk|fii))\b', re.IGNORECASE),
        re.compile(r'\b(?:upper\s+circuit\s+allocations?|upper\s+circuit\s+guarantee|vip\s+allotment|exclusive\s+quota)\b', re.IGNORECASE),
        re.compile(r'\b(?:zero\s+brokerage\s+vip|institutional\s+pool|fii\s+sub[- ]?account)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_013_FAKE_INVESTMENT_OPPORTUNITY",
            name="Fictitious Institutional / Pre-IPO / VIP Quota Solicitations",
            severity="critical",
            description="SEBI has issued explicit public warnings against fraudsters promising retail investors direct access to FII/institutional quotas, guaranteed upper circuit allocations, or pre-IPO shares through private pooling.",
            statutory_reference="SEBI Press Release PR No. 04/2024 & Advisory on Unregistered FII Claims",
            default_confidence=0.97,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_FAKE_INVESTMENT_OPPORTUNITY",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class SocialMediaScamGroupRule(ScamRule):
    """Detects unsolicited recruitment into WhatsApp/Telegram VIP pump groups."""
    PATTERNS = [
        re.compile(r'\b(?:vip\s+group|whatsapp\s+vip|telegram\s+channel|join\s+our\s+channel|join\s+our\s+whatsapp|daily\s+call\s+group)\b', re.IGNORECASE),
        re.compile(r'\b(?:send\s+screenshot\s+of\s+payment|share\s+profit\s+screenshot|contact\s+admin\s+for\s+link)\b', re.IGNORECASE),
        re.compile(r'\b(?:whatsapp\s+pe\s+join|telegram\s+pe\s+aao)\b', re.IGNORECASE),
    ]

    def __init__(self):
        super().__init__(
            rule_id="RULE_014_SOCIAL_MEDIA_SCAM_GROUP",
            name="Unregulated Social-Media Advisory Group / Tip Channel",
            severity="high",
            description="Unsolicited recruitment into WhatsApp, Telegram, or Instagram stock advisory groups operated by unregistered entities for pump-and-dump manipulation.",
            statutory_reference="SEBI Advisory on Social Media Financial Influencer Guidelines",
            default_confidence=0.88,
        )

    def evaluate(self, text: str, entities: Dict[str, Any]) -> Optional[DetectedSignal]:
        for pat in self.PATTERNS:
            m = pat.search(text)
            if m:
                return DetectedSignal(
                    id="SIG_SOCIAL_MEDIA_SCAM_GROUP",
                    name=self.name,
                    severity=self.severity,
                    rule_id=self.rule_id,
                    description=self.description,
                    evidence_text=m.group(0).strip(),
                    confidence=self.default_confidence,
                    rule_source=self.statutory_reference,
                )
        return None


class RuleEngine:
    """Evaluates all scam detection rules against the submission."""

    def __init__(self):
        self.rules: List[ScamRule] = [
            GuaranteedReturnRule(),
            FakeAppRule(),
            WithdrawalFeeExtortionRule(),
            ImpersonationRule(),
            ArtificialUrgencyRule(),
            CredentialHarvestingRule(),
            KYCPressureRule(),
            UnsolicitedStockTipRule(),
            SuspiciousUrlRule(),
            PersonalUPIPaymentRule(),
            RemoteAccessRule(),
            AccountSuspensionThreatRule(),
            FakeInvestmentOpportunityRule(),
            SocialMediaScamGroupRule(),
        ]

    def run(self, text: str, entities: Optional[Dict[str, Any]] = None) -> List[DetectedSignal]:
        if entities is None:
            entities = {}
        signals: List[DetectedSignal] = []
        for rule in self.rules:
            sig = rule.evaluate(text, entities)
            if sig:
                signals.append(sig)
        return signals


rule_engine = RuleEngine()
