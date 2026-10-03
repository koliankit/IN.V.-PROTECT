"""
Claim Extraction Engine for User-Submitted Content.
Segments discourse, filters conversational filler, detects factual/verifiable assertions,
and maps text to atomic claims with exact spans and confidence scores.
"""
import hashlib
import re
import time
from typing import List, Optional, Pattern, Tuple

from backend.schemas.claim_extraction import (
    ClaimExtractionResult,
    ClaimSpan,
    ClaimType,
    ExtractedClaim,
    UserSubmission,
)


# Conversational filler expressions that carry zero factual/verifiable investment claims
FILLER_PATTERNS: List[Pattern[str]] = [
    re.compile(r"^\s*(hello|hi|hey|dear|namaste|sir|madam|friends?|bhai|bro)\b", re.IGNORECASE),
    re.compile(r"^\s*(good\s+(morning|afternoon|evening|day))\b", re.IGNORECASE),
    re.compile(r"^\s*(hope\s+you\s+are\s+(doing\s+)?well)\b", re.IGNORECASE),
    re.compile(r"^\s*(thank\s*you|thanks|regards|cheers|warm\s+regards)\b", re.IGNORECASE),
    re.compile(r"^\s*(please\s+reply|are\s+you\s+interested\??|let\s+me\s+know)\b", re.IGNORECASE),
    re.compile(r"^\s*(ok|okay|yes|no|fine|alright|thx)\b", re.IGNORECASE),
    re.compile(r"^\s*(how\s+are\s+you\??|kya\s+haal\s+hai\??)\b", re.IGNORECASE),
]

# Patterns for identifying specific factual claims in financial context
CLAIM_RULE_DEFINITIONS: List[Tuple[ClaimType, List[Pattern[str]], float]] = [
    # 1. Guaranteed / Promised Returns & Profit
    (
        ClaimType.GUARANTEED_RETURNS,
        [
            re.compile(
                r"\b(guarantee[d]?|assured|sure[\s-]?shot|risk[\s-]?free|100%|fixed)\s+(returns?|profit|gain|income|payout)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(\d+(\.\d+)?%|\d+x)\s+(daily|weekly|monthly|per\s+day|returns?|profit|gain)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(double|triple|2x|3x|5x|10x)\s+(your\s+)?(money|investment|capital|funds?)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(earn|make)\s+(rs\.?|inr|₹)?\s*\d+([\d,]*)\s*(daily|per\s+day|guaranteed|every\s+week)\b",
                re.IGNORECASE,
            ),
            # Hinglish patterns
            re.compile(
                r"\b(paisa\s+double|guarantee\s+munafa|pakka\s+profit|roj\s+kamaye|sure\s+shot\s+fayda)\b",
                re.IGNORECASE,
            ),
        ],
        0.95,
    ),
    # 2. Registration & Official Claims
    (
        ClaimType.REGISTRATION_CLAIM,
        [
            re.compile(r"\b(sebi|rbi|irda|amfi|securities and exchange board of india)\s+(?:has\s+)?(registered|registration|reg\.?|licensed?|approved|endorsed|authorized)\b", re.IGNORECASE),
            re.compile(r"\b(registration|reg|license)\s+(no\.?|id|number)[:\s]*[A-Z0-9\/-]{5,}\b", re.IGNORECASE),
            re.compile(r"\b(ina\d{8,9}|inh\d{8,9}|inm\d{8,9}|inb\d{8,9})\b", re.IGNORECASE),
            re.compile(r"\b(govt\.?|government)\s+(of\s+india\s+)?(approved|certified|registered|authorized)\b", re.IGNORECASE),
            re.compile(r"\b(sebi\s+reg\s*no|sebi\s+approved\s+hai)\b", re.IGNORECASE),
            re.compile(r"\b(official\s+sebi\s+notice|official\s+rbi\s+notice|sebi\s+notice)\b", re.IGNORECASE),
            re.compile(r"\b(account|demat|kyc)\s+verification\s+is\s+pending\b", re.IGNORECASE),
            re.compile(r"\bverification\s+is\s+pending\b", re.IGNORECASE),
        ],
        0.92,
    ),
    # 3. Official Regulatory Endorsement
    (
        ClaimType.OFFICIAL_ENDORSEMENT,
        [
            re.compile(r"\b(endorsed|backed|partnered|certified|approved)\s+by\s+(sebi|rbi|govt|government|nse|bse|securities and exchange board of india)\b", re.IGNORECASE),
            re.compile(r"\b(official\s+partner\s+of\s+(nse|bse|sebi|rbi|mcx))\b", re.IGNORECASE),
            re.compile(r"\b(sarkari\s+scheme|sarkar\s+duara\s+manya|govt\s+guaranteed|investor\s+recovery\s+settlement)\b", re.IGNORECASE),
        ],
        0.90,
    ),
    # 4. Fee / Payment Demands & Withdrawal Prerequisites
    (
        ClaimType.FEE_PAYMENT_DEMAND,
        [
            re.compile(
                r"\b(pay|deposit|recharge|transfer|fee)\s+(rs\.?|inr|₹)?\s*[\d,]+\s*(?:fee|charge|margin|tax)?\s*(to\s+withdraw|for\s+withdrawal|processing|tax|margin)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(withdrawal\s+(?:processing\s+)?fee|tax\s+clearance|margin\s+deposit|processing\s+charge|activation\s+fee)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(to\s+release|unfreeze|unlock)\s+.*?\b(pay|deposit|transfer)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(paisa\s+nikalne\s+ke\s+liye|withdrawal\s+ke\s+liye\s+fees|tax\s+bharo)\b",
                re.IGNORECASE,
            ),
        ],
        0.92,
    ),
    # 5. Account Blocking & KYC Suspension Threats
    (
        ClaimType.ACCOUNT_BLOCKING,
        [
            re.compile(
                r"\b(account|demat|wallet|card|pan)\s+(will\s+be\s+)?(blocked|suspended|frozen|deactivated|terminated)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(mandatory|immediate|urgent)\s+(kyc|pan|aadhaar)\s+(update|verification|link)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(khata\s+band|demat\s+freeze|account\s+block\s+ho\s+jayega)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(within|in)\s+(\d+\s+(hours?|hrs?|mins?|minutes?|days?))\s+otherwise\s+(freeze|blocked|closed)\b",
                re.IGNORECASE,
            ),
        ],
        0.90,
    ),
    # 6. Investment Tips & Insider Calls
    (
        ClaimType.INVESTMENT_TIPS,
        [
            re.compile(
                r"\b(upper\s+circuit|multibagger|jackpot\s+call|insider\s+tips?|sure\s+shot\s+trade)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(100%|accurate|guaranteed)\s+(buy\s+call|banknifty|nifty\s+tips?|stock\s+tips?)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(vip\s+group|exclusive\s+channel|institutional\s+allocation|pre-ipo\s+quota)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(kal\s+upper\s+circuit\s+lagega|sure\s+shot\s+call|vip\s+group\s+join)\b",
                re.IGNORECASE,
            ),
        ],
        0.88,
    ),
    # 7. Urgency & Scarcity Assertions
    (
        ClaimType.URGENCY_DEADLINE,
        [
            re.compile(
                r"\b(only\s+\d+\s+(slots?|seats?|spots?)\s+(left|remaining)|limited\s+slots?)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(offer\s+(valid|expires|ends)\s+(today|in\s+\d+|soon)|act\s+now|urgent\s+action)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(urgent\s+security\s+alert|security\s+alert|urgent\s+notice|action\s+required)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(aakhri\s+mauka|sirf\s+aaj\s+ke\s+liye|jaldi\s+karo)\b",
                re.IGNORECASE,
            ),
        ],
        0.85,
    ),
    # 8. Credential Harvesting & Demat / OTP Requests
    (
        ClaimType.CREDENTIAL_REQUEST,
        [
            re.compile(
                r"\b(share|enter|send|provide|submit)\s+.*?\b(password|otp|pin|credentials?|mpin|cvv)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(demat|trading|bank|login)\s+.*?\b(password|pin|otp)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(\d+[- ]?digit\s+otp|one\s+time\s+password)\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b(otp\s+share|password\s+bhejo|login\s+details)\b",
                re.IGNORECASE,
            ),
        ],
        0.95,
    ),
]


class ClaimExtractor:
    """
    Core claim extraction engine for parsing, segmenting, filtering, and structuring
    factual assertions from user-submitted text.
    """

    def __init__(self, min_claim_length: int = 10, confidence_threshold: float = 0.65) -> None:
        self.min_claim_length = min_claim_length
        self.confidence_threshold = confidence_threshold

    def segment_discourse(self, text: str) -> List[Tuple[str, int, int]]:
        """
        Segments raw text into candidate discourse units while retaining exact (start, end)
        character offsets in the original text.
        Splits on line breaks, punctuation (. ! ? ;), bullet points, and common emoji boundaries.
        """
        if not text or not text.strip():
            return []

        # Find boundaries using regex
        # Delimiters: newlines, semicolons, pipe symbols, exclamation, questions, periods followed by space/end,
        # colons followed by space, conditional disjunctions (or/otherwise followed by account threat), or common separator emojis
        delimiters = re.compile(
            r"(\r?\n+|[;\|\n]+|(?<=[.!?])\s+|:\s+|\s+(?:or|otherwise)\s+(?=your\s+(?:account|demat|funds|wallet)\b)|[\u2022\u25aa\u25b6\u25cf\u2714\u2705\u274c\U0001f680\U0001f4b0\U0001f4a5\U0001f4c8\U0001f525\U0001f6a8\U000026a0]+)"
        )

        spans: List[Tuple[str, int, int]] = []
        last_end = 0

        for match in delimiters.finditer(text):
            start = match.start()
            if start > last_end:
                segment_raw = text[last_end:start]
                if segment_raw.strip():
                    # Calculate exact trimmed offset relative to original string
                    leading_ws = len(segment_raw) - len(segment_raw.lstrip())
                    trailing_ws = len(segment_raw) - len(segment_raw.rstrip())
                    exact_start = last_end + leading_ws
                    exact_end = start - trailing_ws
                    if exact_end > exact_start:
                        spans.append((text[exact_start:exact_end], exact_start, exact_end))
            last_end = match.end()

        # Handle final segment after last delimiter
        if last_end < len(text):
            segment_raw = text[last_end:]
            if segment_raw.strip():
                leading_ws = len(segment_raw) - len(segment_raw.lstrip())
                trailing_ws = len(segment_raw) - len(segment_raw.rstrip())
                exact_start = last_end + leading_ws
                exact_end = len(text) - trailing_ws
                if exact_end > exact_start:
                    spans.append((text[exact_start:exact_end], exact_start, exact_end))

        # Fallback: if text had no delimiters but has text, treat whole string as one span
        if not spans and text.strip():
            segment_raw = text
            leading_ws = len(segment_raw) - len(segment_raw.lstrip())
            trailing_ws = len(segment_raw) - len(segment_raw.rstrip())
            exact_start = leading_ws
            exact_end = len(text) - trailing_ws
            spans.append((text[exact_start:exact_end], exact_start, exact_end))

        return spans

    def is_conversational_filler(self, segment: str) -> bool:
        """
        Determines whether a discourse unit is conversational noise / pleasantry
        rather than a verifiable factual claim.
        """
        cleaned = segment.strip().lower()
        if len(cleaned) < 4:
            return True

        for filler_pattern in FILLER_PATTERNS:
            if filler_pattern.search(cleaned):
                # If it's a greeting followed immediately by nothing or very short pleasantry, ignore it
                words = cleaned.split()
                if len(words) <= 5:
                    return True
        return False

    def extract_entities(self, text: str) -> List[str]:
        """
        Extracts prominent keywords, quantities, and entities embedded within a claim.
        """
        entities: List[str] = []

        # Monetary quantities
        money_matches = re.findall(r"(?:rs\.?|inr|₹)\s*\d+(?:,\d+)*(?:\.\d+)?|\b\d+(?:,\d+)*\s*(?:crore|lakh|rupees)", text, re.IGNORECASE)
        entities.extend([m.strip() for m in money_matches if m.strip()])

        # Percentages / multipliers
        pct_matches = re.findall(r"\b\d+(?:\.\d+)?%\b|\b\d+x\b", text, re.IGNORECASE)
        entities.extend([p.strip() for p in pct_matches if p.strip()])

        # Regulators & institutions
        org_matches = re.findall(r"\b(sebi|rbi|nse|bse|irda|amfi|cert-in)\b", text, re.IGNORECASE)
        entities.extend([o.upper() for o in org_matches if o.upper()])

        # Registration codes
        reg_matches = re.findall(r"\b(?:ina|inh|inm|inb)\d{8,9}\b", text, re.IGNORECASE)
        entities.extend([r.upper() for r in reg_matches if r.upper()])

        # Deduplicate while preserving order
        seen = set()
        deduped = []
        for e in entities:
            if e not in seen:
                seen.add(e)
                deduped.append(e)
        return deduped

    def evaluate_segment_claim(self, segment: str) -> Tuple[Optional[ClaimType], float]:
        """
        Evaluates a single segment against claim patterns and returns (ClaimType, confidence).
        Returns (None, 0.0) if no factual claim pattern matches.
        """
        matched_types: List[Tuple[ClaimType, float]] = []

        for claim_type, patterns, base_confidence in CLAIM_RULE_DEFINITIONS:
            for pattern in patterns:
                if pattern.search(segment):
                    # Boost confidence slightly if concrete numbers or entities are present
                    has_numbers = bool(re.search(r"\d+", segment))
                    conf = min(1.0, base_confidence + (0.05 if has_numbers else 0.0))
                    matched_types.append((claim_type, conf))
                    break

        if not matched_types:
            # Check for general financial assertion (imperative or declarative with financial keywords)
            generic_check = re.search(
                r"\b(invest|trading|portfolio|stock|crypto|demat|profit|earn|payout|bonus|deposit)\b",
                segment,
                re.IGNORECASE,
            )
            if generic_check and len(segment.split()) >= 4:
                return (ClaimType.GENERIC_FACTUAL, 0.70)
            return (None, 0.0)

        # Return the highest confidence match
        matched_types.sort(key=lambda x: x[1], reverse=True)
        return matched_types[0]

    def extract_claims(self, submission: UserSubmission) -> ClaimExtractionResult:
        """
        Main entrypoint: parses user submission text and returns structured claims.
        """
        start_time = time.perf_counter()
        raw_text = submission.text
        segments = self.segment_discourse(raw_text)

        extracted_claims: List[ExtractedClaim] = []

        for segment_text, start_idx, end_idx in segments:
            # Filter noise and fillers
            if len(segment_text) < self.min_claim_length:
                continue
            if self.is_conversational_filler(segment_text):
                continue

            claim_type, confidence = self.evaluate_segment_claim(segment_text)
            if claim_type is not None and confidence >= self.confidence_threshold:
                # Deterministic claim ID from raw segment and offset
                claim_hash = hashlib.sha256(f"{segment_text}:{start_idx}".encode("utf-8")).hexdigest()[:10]
                claim_id = f"CLM-{claim_hash.upper()}"

                entities = self.extract_entities(segment_text)

                claim = ExtractedClaim(
                    claim_id=claim_id,
                    claim_text=segment_text.strip(),
                    raw_fragment=raw_text[start_idx:end_idx],
                    span=ClaimSpan(start=start_idx, end=end_idx),
                    claim_type=claim_type,
                    confidence=round(confidence, 2),
                    is_verifiable=True,
                    extracted_entities=entities,
                )
                extracted_claims.append(claim)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return ClaimExtractionResult(
            submission_id=submission.submission_id,
            original_text_length=len(raw_text),
            claims=extracted_claims,
            total_claims=len(extracted_claims),
            discourse_units_count=len(segments),
            processing_time_ms=round(elapsed_ms, 2),
            metadata={
                "source_channel": submission.source_channel,
                "confidence_threshold": self.confidence_threshold,
            },
        )
