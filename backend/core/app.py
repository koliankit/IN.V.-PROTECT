"""
Sangyan AI Investor Shield — FastAPI Application Entry Point.
Provides REST API endpoints for scam detection, evidence retrieval, and investor support.
"""
import re
import os
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.core.config import settings
from backend.core.constants import (
    PRODUCT_NAME,
    PRODUCT_TAGLINE,
    PRIMARY_TRACK_CODE,
    PRIMARY_TRACK_NAME,
    SUPPORTED_INPUT_MODALITIES,
    USER_JOURNEY_STAGES,
)
from backend.core.evidence import evidence_store
from backend.core.support import investor_support_index
from backend.schemas.analysis import (
    AnalysisResponse,
    ConfidenceLevel,
    ConfidenceOrUncertainty,
    DetectedSignal,
    EvidenceItem,
    ExtractedClaim,
    OfficialSourceLink,
    RiskLevel,
)


# ─── Lifespan (startup / shutdown) ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm-up: evidence store and support index are singletons, already loaded.
    yield


# ─── App Instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=PRODUCT_NAME,
    description=PRODUCT_TAGLINE,
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ─────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    text: str
    url: Optional[str] = None


# ─── Scam Detection Engine (Rule-based + Heuristic) ───────────────────────────
SCAM_RULES = [
    {
        "id": "SIG_GUARANTEED_RETURN",
        "name": "Guaranteed / Fixed Return Promise",
        "severity": "critical",
        "rule_id": "RULE_001",
        "description": "No SEBI-registered intermediary is legally permitted to guarantee fixed returns. This is a statutory violation.",
        "keywords": ["guaranteed return", "guaranteed profit", "fixed return", "100% return",
                     "sure profit", "assured return", "guaranteed income", "guaranteed ₹"],
    },
    {
        "id": "SIG_CREDENTIAL_HARVEST",
        "name": "Credential / OTP Harvesting",
        "severity": "critical",
        "rule_id": "RULE_002",
        "description": "Legitimate financial institutions never ask for passwords, OTPs, or PINs via message or chat.",
        "keywords": ["share password", "share otp", "share pin", "send otp", "send password",
                     "demat password", "broker password", "verify otp", "otp verification"],
    },
    {
        "id": "SIG_MALICIOUS_APK",
        "name": "Fake / Malicious APK or App Download",
        "severity": "high",
        "rule_id": "RULE_003",
        "description": "Legitimate brokers distribute apps exclusively via official stores (Play Store / App Store). APK sideloads are a high-risk fraud vector.",
        "keywords": [".apk", "download app", "vip trading app", "exclusive trading app",
                     "install apk", "sideload", "trading terminal download"],
    },
    {
        "id": "SIG_PAYMENT_BEFORE_WITHDRAWAL",
        "name": "Advance Fee / Payment Before Withdrawal",
        "severity": "high",
        "rule_id": "RULE_004",
        "description": "Demanding advance fees to 'unlock' or 'release' profits is a hallmark of investment fraud.",
        "keywords": ["processing fee", "withdrawal fee", "margin deposit", "pay to withdraw",
                     "release profit", "tax deposit", "unlock balance", "pay fee first"],
    },
    {
        "id": "SIG_REGULATORY_IMPERSONATION",
        "name": "Regulatory / Authority Impersonation",
        "severity": "critical",
        "rule_id": "RULE_005",
        "description": "Fraudsters forge SEBI, RBI, or police identities. Verify any official-sounding communication independently.",
        "keywords": ["sebi approved", "rbi approved", "sebi certified", "government approved",
                     "sebi authorized", "rbi authorized", "police notice", "ed notice",
                     "income tax notice"],
    },
    {
        "id": "SIG_URGENCY_PRESSURE",
        "name": "Artificial Urgency / Pressure Tactics",
        "severity": "medium",
        "rule_id": "RULE_006",
        "description": "Creating artificial time pressure is a social engineering technique used to prevent victims from seeking advice.",
        "keywords": ["urgent", "immediately", "act now", "limited time", "last chance",
                     "expires today", "respond immediately", "deadline", "account blocked",
                     "account suspended"],
    },
    {
        "id": "SIG_UNREGISTERED_ENTITY",
        "name": "Unregistered / Fake SEBI Registration Claim",
        "severity": "high",
        "rule_id": "RULE_007",
        "description": "Only licensed intermediaries registered with SEBI may solicit investment. Always verify registration at sebi.gov.in/intermediaries.",
        "keywords": ["sebi registered", "sebi ra reg", "inh000", "ina000", "sebi registration"],
    },
    {
        "id": "SIG_HIGH_RETURN_PROMISE",
        "name": "Unrealistic High Return Promise",
        "severity": "high",
        "rule_id": "RULE_008",
        "description": "Promises of extraordinary returns (5x, 10x, multibagger overnight) are hallmark indicators of pump-and-dump or Ponzi schemes.",
        "keywords": ["5x return", "10x return", "multibagger", "200% profit", "300% gain",
                     "upper circuit daily", "double your money", "triple your investment"],
    },
    {
        "id": "SIG_VIP_GROUP_LURE",
        "name": "VIP / Exclusive Telegram or WhatsApp Group",
        "severity": "medium",
        "rule_id": "RULE_009",
        "description": "Fake 'VIP' investment groups on Telegram/WhatsApp are commonly used for coordinated pump-and-dump fraud.",
        "keywords": ["vip group", "exclusive group", "telegram group", "whatsapp group",
                     "vip channel", "premium signals", "insider tips", "vip members"],
    },
]

OFFICIAL_LINKS = [
    OfficialSourceLink(
        title="SEBI Intermediary Verification",
        url="https://www.sebi.gov.in/intermediaries.html",
        description="Verify if a broker, adviser, or research analyst is SEBI-registered.",
        category="verification",
    ),
    OfficialSourceLink(
        title="National Cyber Crime Reporting Portal",
        url="https://cybercrime.gov.in",
        description="Report financial fraud and cyber crime. Helpline: 1930.",
        category="reporting",
    ),
    OfficialSourceLink(
        title="SEBI SCORES Grievance Portal",
        url="https://scores.sebi.gov.in",
        description="File complaints against SEBI-registered entities.",
        category="grievance",
    ),
    OfficialSourceLink(
        title="RBI Financial Awareness (FAME)",
        url="https://rbi.org.in/financialeducation/",
        description="Official RBI financial literacy and fraud awareness resources.",
        category="awareness",
    ),
]


def detect_scam(text: str, url: Optional[str] = None) -> AnalysisResponse:
    """Core rule-based scam detection pipeline."""
    combined = text.lower()
    if url:
        combined += " " + url.lower()

    triggered_signals: list[DetectedSignal] = []
    triggered_keywords: list[str] = []

    for rule in SCAM_RULES:
        for kw in rule["keywords"]:
            if kw in combined:
                triggered_signals.append(
                    DetectedSignal(
                        id=rule["id"],
                        name=rule["name"],
                        severity=rule["severity"],
                        rule_id=rule["rule_id"],
                        description=rule["description"],
                    )
                )
                triggered_keywords.append(kw)
                break  # one signal per rule

    # Risk level determination
    critical_count = sum(1 for s in triggered_signals if s.severity == "critical")
    high_count = sum(1 for s in triggered_signals if s.severity == "high")
    total = len(triggered_signals)

    if critical_count >= 1 or total >= 2:
        risk_level = RiskLevel.HIGH_CONCERN
        confidence = ConfidenceOrUncertainty(level=ConfidenceLevel.HIGH, score=0.95)
    elif high_count >= 1 or total == 1:
        risk_level = RiskLevel.NEEDS_VERIFICATION
        confidence = ConfidenceOrUncertainty(level=ConfidenceLevel.MODERATE, score=0.72)
    else:
        risk_level = RiskLevel.LOW_CONCERN
        confidence = ConfidenceOrUncertainty(
            level=ConfidenceLevel.HIGH,
            score=0.88,
            uncertainty_note="No scam indicators detected with current rule set. Stay vigilant.",
        )

    # Evidence retrieval
    evidence: list[EvidenceItem] = []
    search_terms = triggered_keywords[:3] if triggered_keywords else ["investment", "fraud"]
    for term in search_terms:
        items = evidence_store.find_evidence_by_keyword(term, limit=1)
        evidence.extend(items)
        if len(evidence) >= 3:
            break

    # Claim extraction (simple heuristic)
    extracted_claims: list[ExtractedClaim] = []
    patterns = [
        (r"guaranteed?\s+\w+\s+(return|profit|income)", "guaranteed_return"),
        (r"₹[\d,]+", "payment_request"),
        (r"(sebi|rbi|government)\s+(approved|certified|authorized)", "official_endorsement"),
        (r"(urgent|immediately|act now|deadline)", "urgency"),
        (r"(INH|INA)\d{9}", "registration_claim"),
    ]
    for pattern, claim_type in patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            extracted_claims.append(
                ExtractedClaim(
                    claim_text=m.group(0),
                    claim_type=claim_type,
                    entity=None,
                )
            )

    # Explanation
    if risk_level == RiskLevel.HIGH_CONCERN:
        explanation = (
            f"⚠️ HIGH RISK — {total} scam indicator(s) detected. "
            "According to official SEBI and I4C advisories, the patterns in this message "
            "match known financial fraud tactics including "
            + ", ".join(s.name for s in triggered_signals[:3])
            + ". Do NOT act on this message without independent verification."
        )
        safe_next_steps = [
            "Do NOT share any OTP, password, or personal financial information.",
            "Do NOT transfer any money or pay any 'fee' to release profits.",
            "Verify SEBI registration at sebi.gov.in/intermediaries.html before engaging.",
            "Report immediately to the National Cyber Crime Helpline: 1930.",
            "File a complaint on cybercrime.gov.in if funds have been transferred.",
        ]
    elif risk_level == RiskLevel.NEEDS_VERIFICATION:
        explanation = (
            f"🟡 NEEDS VERIFICATION — {total} indicator(s) found. "
            "Some elements of this message require independent verification against official "
            "SEBI and RBI sources before proceeding."
        )
        safe_next_steps = [
            "Independently verify any SEBI/RBI registration claim at the official portal.",
            "Do not rely solely on the sender's claims — cross-check with official sources.",
            "If unsure, contact the SEBI Investor Helpline: 1800-266-7575 (Toll-Free).",
        ]
    else:
        explanation = (
            "🟢 LOW CONCERN — No active scam indicators detected in this message. "
            "Standard investor awareness reminder: always verify registration and read all "
            "scheme documents. Mutual fund investments are subject to market risks."
        )
        safe_next_steps = [
            "Stay alert to unsolicited investment offers.",
            "Always verify SEBI/RBI registrations before transacting.",
            "Read all scheme documents and disclosures carefully.",
        ]

    return AnalysisResponse(
        risk_level=risk_level,
        confidence_or_uncertainty=confidence,
        detected_signals=triggered_signals,
        extracted_claims=extracted_claims,
        evidence=evidence,
        explanation=explanation,
        safe_next_steps=safe_next_steps,
        official_source_links=OFFICIAL_LINKS,
    )


# ─── API Routes ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Render health check endpoint."""
    return {
        "status": "healthy",
        "product": PRODUCT_NAME,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/")
async def root():
    """API root — returns product metadata."""
    return {
        "product": PRODUCT_NAME,
        "tagline": PRODUCT_TAGLINE,
        "track": f"{PRIMARY_TRACK_CODE}: {PRIMARY_TRACK_NAME}",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Analyze a message, text, or URL for financial scam indicators.
    Returns a structured risk assessment with evidence citations.
    """
    if not request.text or len(request.text.strip()) < 5:
        raise HTTPException(status_code=422, detail="Text input is too short for analysis.")
    if len(request.text) > 10000:
        raise HTTPException(status_code=422, detail="Text input exceeds maximum length (10,000 chars).")

    return detect_scam(request.text, request.url)


@app.get("/api/support")
async def get_support_channels():
    """Return official investor support and reporting channels."""
    channels = investor_support_index.list_all_channels()
    return {"channels": [ch.model_dump() for ch in channels]}


@app.get("/api/support/routing")
async def get_recommended_routing(suspected_unregistered: bool = True):
    """Return recommended reporting routing for suspected fraud."""
    channels = investor_support_index.get_recommended_routing(suspected_unregistered)
    return {"routing": [ch.model_dump() for ch in channels]}


@app.get("/api/meta/journey")
async def get_user_journey():
    """Return the canonical 7-stage user journey pipeline."""
    return {"stages": USER_JOURNEY_STAGES}


@app.get("/api/meta/modalities")
async def get_supported_modalities():
    """Return supported input modalities."""
    return {"modalities": SUPPORTED_INPUT_MODALITIES}


# ─── Dev server entry point ────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.core.app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level=settings.LOG_LEVEL.lower(),
    )
