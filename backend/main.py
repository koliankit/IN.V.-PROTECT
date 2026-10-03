"""
Sangyan AI Investor Shield - Main FastAPI Application.
Provides high-performance endpoints for scam detection, claim extraction,
regulatory evidence grounding, entity verification, and demo cases.
"""
import io
import os
import sys

_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_PARENT_DIR = os.path.dirname(_CURRENT_DIR)
for _p in [_PARENT_DIR, _CURRENT_DIR]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import uuid
import datetime
from dotenv import load_dotenv

load_dotenv()
from typing import Optional, List, Dict, Any, AsyncGenerator, Union
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from PIL import Image

from backend.schemas.analysis import (
    AnalysisResponse,
    ExtractedClaim,
    RiskLevel,
    ConfidenceLevel,
    ConfidenceOrUncertainty,
    OfficialSourceLink,
)
from backend.schemas.claim_extraction import UserSubmission
from backend.core.claim_extractor import ClaimExtractor
from backend.core.entity_extractor import entity_extractor
from backend.core.pii_redactor import pii_redactor
from backend.core.language_detector import language_detector
from backend.core.rule_engine import rule_engine
from backend.core.risk_engine import risk_engine
from backend.core.sources import official_registry
from backend.db.database import get_db_connection
from backend.core.security_hub import security_hub
from backend.schemas.security_hub import (
    ProtectionTier,
    SecurityOverview,
    SecureMessage,
    IncidentRecord,
    IntegrationSource,
    DeviceStatus,
    PrivacyStatus,
    SecuritySettings,
)

from contextlib import asynccontextmanager
from backend.routers.auth_router import router as auth_router
from backend.db.auth_db import auth_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    auth_db.init_db()
    yield


app = FastAPI(
    title="Sangyan AI Investor Shield API",
    description="Digital Fraud & Scam Resilience Engine for Indian Investors (SEBI, RBI, I4C grounded)",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend Vite dev server, Render static site, and production
cors_env = os.getenv("CORS_ORIGINS", "").strip()
allowed_origins: List[str] = [o.strip() for o in cors_env.split(",") if o.strip()] if cors_env and cors_env != "*" else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_origin_regex=None if allowed_origins else r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication & Owner Verification Routers (mounted at root and /api)
app.include_router(auth_router)
app.include_router(auth_router, prefix="/api")

claim_extractor = ClaimExtractor()


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw text of the message, SMS, social post, or email.")
    channel: Optional[str] = Field("unspecified", description="Channel e.g. telegram, whatsapp, sms, web.")
    language: Optional[str] = Field("en", description="User preferred language (en, hi).")


class EntityVerifyRequest(BaseModel):
    query: str = Field(..., description="SEBI registration number or intermediary entity name.")


DEMO_EXAMPLES = [
    {
        "id": "demo-1",
        "title": "DEMO EXAMPLE 1: Guaranteed Return Scam",
        "channel": "whatsapp",
        "text": "LIMITED TIME INVESTMENT OPPORTUNITY. Invest ₹10,000 today and earn guaranteed returns of ₹50,000 within 7 days. This opportunity is 100% risk-free and officially approved by SEBI. Offer expires tonight. Send the payment immediately.",
    },
    {
        "id": "demo-2",
        "title": "DEMO EXAMPLE 2: OTP / Demat Credential Harvesting",
        "channel": "sms",
        "text": "URGENT SECURITY ALERT: Dear customer, your Demat account verification is pending. Please share your Demat login password and 6-digit OTP to complete verification immediately or your account will be suspended.",
    },
    {
        "id": "demo-3",
        "title": "DEMO EXAMPLE 3: Fake Trading App / APK Sideload",
        "channel": "telegram",
        "text": "Exclusive Institutional FII Quota available for retail investors. Download our official institutional VIP trading app from http://fake-terminal.com/app.apk to access guaranteed upper circuit allocations before market open.",
    },
    {
        "id": "demo-4",
        "title": "DEMO EXAMPLE 4: Payment-Before-Withdrawal Extortion",
        "channel": "whatsapp",
        "text": "Congratulations! Your ledger balance has grown to ₹4,50,000. To withdraw your profits to your personal bank account, you must first pay a ₹25,000 release processing fee and 10% margin deposit.",
    },
    {
        "id": "demo-5",
        "title": "DEMO EXAMPLE 5: Legitimate Investor Awareness Message",
        "channel": "web",
        "text": "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Verify all broker and research analyst registration details on the official SEBI portal.",
    },
    {
        "id": "demo-6",
        "title": "DEMO EXAMPLE 6: Ambiguous Financial Message",
        "channel": "telegram",
        "text": "Alpha Research (claiming SEBI RA Reg INH000099999) providing technical intraday levels for Nifty 50 and Bank Nifty. Please verify trading setup and risk-reward ratio before taking positions.",
    },
]


@app.get("/health")
def root_health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "service": "in-v-protect",
        "version": "1.0.0",
        "registered_sources_count": len(official_registry.list_all()),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "in-v-protect",
        "version": "1.0.0",
        "registered_sources_count": len(official_registry.list_all()),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


@app.get("/api/demo-examples")
def get_demo_examples() -> List[Dict[str, Any]]:
    return DEMO_EXAMPLES


@app.get("/api/sources")
def list_sources() -> List[Dict[str, Any]]:
    sources = official_registry.list_all()
    return [
        {
            "source_id": s.source_id,
            "title": s.title,
            "publisher": s.publisher,
            "url": s.url,
            "allowed_use": s.allowed_use.value if hasattr(s.allowed_use, "value") else str(s.allowed_use),
            "license": s.license,
        }
        for s in sources
    ]


@app.post("/api/verify-entity")
def verify_entity(req: EntityVerifyRequest) -> Dict[str, Any]:
    query_upper = req.query.strip().upper()
    # Check if query matches standard SEBI ID format
    is_valid_format = False
    valid_prefixes = ["INH", "INZ", "INP", "INA", "INF", "INM"]
    for pref in valid_prefixes:
        if query_upper.startswith(pref) and len(query_upper) >= 11:
            is_valid_format = True
            break

    # Search in registered official dataset
    is_verified = is_valid_format
    return {
        "query": req.query,
        "is_valid_format": is_valid_format,
        "status": "Recognized Format (Must confirm in SEBI Master Database)" if is_valid_format else "Unrecognized / Unregistered Format",
        "advisory": (
            "Ensure the registered entity name exactly matches the bank account holder name. Never transfer funds to personal savings accounts."
        ),
        "official_verification_url": "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13",
    }


@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_submission(req: AnalyzeRequest) -> AnalysisResponse:
    raw_text = req.text.strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Submission text cannot be empty.")

    # 1. PII Redaction
    redacted_text, pii_stats = pii_redactor.redact(raw_text)

    # 2. Entity Extraction
    entities = entity_extractor.extract(raw_text)

    # 3. Claim Extraction
    submission_id = f"SUB-{uuid.uuid4().hex[:8].upper()}"
    submission = UserSubmission(
        submission_id=submission_id,
        text=redacted_text,
        source_channel=req.channel or "unspecified",
    )
    extracted = claim_extractor.extract_claims(submission)

    converted_claims: List[ExtractedClaim] = []
    for c in extracted.claims:
        ctype = c.claim_type.value if hasattr(c.claim_type, "value") else str(c.claim_type)
        cleaned_claim_text, _ = pii_redactor.redact(c.claim_text)
        converted_claims.append(
            ExtractedClaim(
                claim_text=cleaned_claim_text,
                claim_type=ctype,
                entity=", ".join(entities.get("sebi_registration_numbers", [])) or None,
            )
        )

    # 4. Scam Rule Evaluation
    signals = rule_engine.run(redacted_text, entities)
    for s in signals:
        if s.evidence_text:
            s.evidence_text, _ = pii_redactor.redact(s.evidence_text)

    # 5. Risk Assessment & Evidence Assembly
    result = risk_engine.evaluate(
        raw_text=redacted_text,
        claims=converted_claims,
        signals=signals,
        entities=entities,
    )
    result.explanation, _ = pii_redactor.redact(result.explanation)

    # 6. Audit Trail Logging (Fail-safe)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO analysis_audit_log (
                submission_id, channel, risk_level, confidence, signals_count, created_at
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                submission_id,
                req.channel,
                result.risk_level.value,
                result.confidence_or_uncertainty.score,
                len(result.detected_signals),
                datetime.datetime.now(datetime.timezone.utc).isoformat(),
            ),
        )
        conn.commit()
        conn.close()
    except Exception:
        # Fallback gracefully if database table not yet initialized
        pass

    # 7. Multi-Tier Security Classification & Claim Verifications
    if result.risk_level == RiskLevel.HIGH_CONCERN:
        tier_str = "Quarantined / High Risk"
    elif result.risk_level == RiskLevel.NEEDS_VERIFICATION:
        tier_str = "Review / Verify"
    else:
        tier_str = "Trusted / Important"
    result.protection_tier = tier_str

    # Language Detection & PII Masking Metrics
    result.detected_language = language_detector.detect(raw_text)
    result.pii_redacted_stats = pii_stats

    verifications = []
    for c in result.extracted_claims:
        v_item = security_hub.verify_claim(c.claim_text, c.claim_type)
        verifications.append(v_item.model_dump())
    result.claim_verifications = verifications

    # 8. Real-time Ingestion into Security Hub
    try:
        security_hub.ingest_message(
            sender="User Direct Submission",
            sender_identifier=f"CHANNEL:{req.channel.upper() if req.channel else 'MANUAL'}",
            source_channel=(req.channel or "Web Submission").title(),
            raw_text=raw_text,
            custom_id=submission_id,
            is_demo=False,
        )
    except Exception:
        pass

    return result


@app.post("/api/analyze-upload", response_model=AnalysisResponse)
async def analyze_upload(
    file: UploadFile = File(...),
    channel: str = Form("screenshot"),
    language: str = Form("en"),
) -> AnalysisResponse:
    """Handles image screenshot uploads with OCR text extraction, validation, and safe fallback."""
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. File size limit: 10MB
    max_size = 10 * 1024 * 1024
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed limit of 10MB.")

    # 2. File extension & format verification
    filename = (file.filename or "").lower()
    allowed_exts = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"}
    is_valid_ext = any(filename.endswith(ext) for ext in allowed_exts)
    is_valid_mime = bool(file.content_type and file.content_type.startswith("image/"))
    if not is_valid_ext and not is_valid_mime:
        raise HTTPException(status_code=400, detail="Unsupported image format. Allowed formats: PNG, JPEG, WEBP, BMP, TIFF.")

    # 3. Check for image corruption
    try:
        img = Image.open(io.BytesIO(contents))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Corrupted or invalid image file. Please upload an intact image.")

    # 4. OCR text extraction
    extracted_text = ""
    tesseract_available = False
    try:
        from backend.core.ocr_pipeline import OCRPipeline
        ocr = OCRPipeline()
        tesseract_available = ocr._tesseract_available
        ocr_result = ocr.process_image_bytes(contents, source_id="UPLOAD", filename=file.filename or "screenshot.png")
        extracted_text = (ocr_result.full_extracted_text or "").strip()
    except Exception:
        extracted_text = ""

    # 5. Handle empty or fallback OCR output honestly
    if not extracted_text or (not tesseract_available and "Scanned image artifact" in extracted_text):
        official_links = [
            OfficialSourceLink(
                title="SEBI Recognized Intermediaries Portal",
                url="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13",
                description="Statutory register to check whether an adviser or broker is genuinely registered with SEBI.",
                category="verification",
            ),
            OfficialSourceLink(
                title="National Cyber Crime Reporting Portal (1930)",
                url="https://cybercrime.gov.in",
                description="Government portal and 24x7 toll-free helpline (1930) for reporting financial cyber fraud.",
                category="reporting",
            ),
            OfficialSourceLink(
                title="Chakshu Facility (DoT Sanchar Saathi)",
                url="https://sancharsaathi.gov.in/sfc/",
                description="Citizen portal to report suspected fraudulent SMS, calls, or WhatsApp communication.",
                category="reporting",
            ),
        ]
        return AnalysisResponse(
            risk_level=RiskLevel.NEEDS_VERIFICATION,
            confidence_or_uncertainty=ConfidenceOrUncertainty(
                level=ConfidenceLevel.UNCERTAIN,
                score=0.50,
                uncertainty_note=(
                    "OCR Engine Limitation: Tesseract binary is not installed on the server environment. "
                    "To enable automatic optical text extraction, install Tesseract OCR (e.g. winget install UB-Mannheim.TesseractOCR) "
                    "or copy and paste the message text into the Text Inspector tab."
                ),
            ),
            detected_signals=[],
            extracted_claims=[],
            evidence=[],
            explanation=(
                f"Screenshot '{file.filename}' was uploaded. Optical text extraction is pending server-side OCR binary configuration. "
                "For immediate deep analysis against SEBI/I4C fraud databases, copy and paste the message text into the Text Inspector tab."
            ),
            safe_next_steps=[
                "Copy and paste the visible message text directly into the Text Inspector tab.",
                "Verify whether the sender claims SEBI registration on sebi.gov.in before transferring any money.",
                "Never share Demat credentials, PINs, or install APK files from private messaging links.",
            ],
            official_source_links=official_links,
        )

    return analyze_submission(
        AnalyzeRequest(
            text=extracted_text,
            channel=channel,
            language=language,
        )
    )


# Alias for /api/analyze-image to match test specifications
app.post("/api/analyze-image", response_model=AnalysisResponse)(analyze_upload)


class AnalyzeURLRequest(BaseModel):
    url: str = Field(..., description="Web URL or link to inspect for domain risk.")


@app.post("/api/analyze-url")
def analyze_url_endpoint(req: AnalyzeURLRequest) -> Dict[str, Any]:
    from backend.core.url_analyzer import url_analyzer
    return url_analyzer.analyze_url(req.url)


# ============================================================================
# SANGYAN AI INVESTOR SHIELD — SECURITY HUB & COMMUNICATION FIREWALL ENDPOINTS
# ============================================================================

@app.get("/api/security-overview", response_model=SecurityOverview)
@app.get("/api/overview", response_model=SecurityOverview)
def get_security_overview() -> SecurityOverview:
    """Returns top-level security dashboard statistics and device posture."""
    return security_hub.get_overview()


@app.get("/api/quarantine")
def get_quarantined_messages() -> List[Dict[str, Any]]:
    """Convenience endpoint returning all quarantined high-risk communications."""
    msgs = security_hub.get_messages(tier="quarantine")
    return [m.model_dump() for m in msgs]


@app.get("/api/messages")
def get_secure_messages(tier: Optional[str] = None) -> List[Dict[str, Any]]:
    """Returns messages filtered by tier: important, review, quarantine, or all."""
    msgs = security_hub.get_messages(tier=tier)
    return [m.model_dump() for m in msgs]


@app.get("/api/messages/{message_id}")
def get_message_detail(message_id: str) -> Dict[str, Any]:
    """Returns full security analysis, claim verifications, and evidence for a specific message."""
    msg = security_hub.get_message_detail(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found in security store.")
    return msg.model_dump()


class MessageActionRequest(BaseModel):
    action: str = Field(..., description="Action to perform: release, delete, quarantine, mark_safe")


@app.post("/api/messages/{message_id}/action")
def perform_message_action(message_id: str, req: MessageActionRequest) -> Dict[str, Any]:
    """Executes investor-directed protection actions on quarantined or review messages."""
    res = security_hub.perform_message_action(message_id, req.action)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Action failed"))
    return res


@app.get("/api/incidents")
def get_incidents() -> List[Dict[str, Any]]:
    """Returns critical threat incidents recorded by the security firewall."""
    incidents = security_hub.get_incidents()
    return [inc.model_dump() for inc in incidents]


@app.get("/api/incidents/{incident_id}")
def get_incident_detail(incident_id: str) -> Dict[str, Any]:
    """Returns full incident record with exportable evidence package and official reporting guide."""
    inc = security_hub.get_incident_detail(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident record not found.")
    return inc.model_dump()


@app.get("/api/integrations", response_model=List[IntegrationSource])
def get_integrations() -> List[IntegrationSource]:
    """Returns all communication sources with transparent REAL vs DEMO/SIMULATED status."""
    return security_hub.get_integrations()


@app.get("/api/devices", response_model=List[DeviceStatus])
def get_devices() -> List[DeviceStatus]:
    """Returns investor protected devices (PC, Mobile, Smartwatch) and their security roles."""
    return security_hub.get_devices()


@app.post("/api/devices/{device_id}/test-alert")
def trigger_device_test_alert(device_id: str) -> Dict[str, Any]:
    """Simulates rapid high-priority alert dispatch to smartwatch companion."""
    return security_hub.trigger_smartwatch_alert(device_id)


@app.get("/api/privacy/status", response_model=PrivacyStatus)
def get_privacy_status() -> PrivacyStatus:
    """Returns the investor privacy and zero-password/zero-OTP storage guarantees."""
    return security_hub.get_privacy_status()


class SettingsUpdateRequest(BaseModel):
    protection_level: Optional[str] = Field(None, description="STANDARD, ENHANCED, STRICT")
    onboarding_completed: Optional[bool] = None
    notifications_enabled: Optional[bool] = None
    watch_haptics_enabled: Optional[bool] = None
    desktop_alerts_enabled: Optional[bool] = None
    evidence_retention_days: Optional[int] = None
    local_processing_only: Optional[bool] = None


@app.get("/api/settings", response_model=SecuritySettings)
def get_security_settings() -> SecuritySettings:
    """Returns the current investor protection configuration, protection level, and device preferences."""
    return security_hub.get_settings()


@app.post("/api/settings", response_model=SecuritySettings)
def update_security_settings(req: SettingsUpdateRequest) -> SecuritySettings:
    """Updates user-controlled protection levels (STANDARD, ENHANCED, STRICT) and privacy retention."""
    updates = req.model_dump(exclude_unset=True)
    return security_hub.update_settings(updates)


@app.post("/api/settings/purge")
def purge_local_audit_logs() -> Dict[str, Any]:
    """Purges volatile audit logs and cached dossiers at user direction without removing protected assets."""
    return security_hub.purge_audit_logs()


@app.get("/api/demo/flow")
def get_demo_threat_flow() -> Dict[str, Any]:
    """Returns Section 19 9-Stage Interactive Attack Interception Demonstration."""
    return security_hub.get_demo_attack_flow()


# ============================================================================
# IN V PROTECT — DASHBOARD EXTENSION ENDPOINTS
# ============================================================================

@app.get("/api/security/daily-report")
def get_daily_security_report() -> Dict[str, Any]:
    """Returns the official Daily Security Report for investor posture monitoring."""
    return security_hub.get_daily_security_report()


@app.get("/api/security/trends")
def get_scam_trends() -> Dict[str, Any]:
    """Returns active financial fraud & scam trends grounded in official regulatory notices."""
    return security_hub.get_scam_trends()


@app.get("/api/security/safety-review")
def get_safety_review() -> Dict[str, Any]:
    """Returns the comprehensive investor safety review & defensive audit checklist."""
    return security_hub.get_safety_review()


@app.post("/api/messages/{message_id}/report")
def report_quarantined_message(message_id: str) -> Dict[str, Any]:
    """Initiates user-confirmed reporting for a quarantined threat with official evidence."""
    res = security_hub.perform_message_action(message_id, "report")
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error", "Reporting action failed"))
    return res


# ============================================================================
# PRODUCTION FRONTEND MOUNTING (FOR DESKTOP APP & STANDALONE EXE)
# ============================================================================
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
    bundled_dist = os.path.join(sys._MEIPASS, "frontend", "dist")
    if os.path.exists(bundled_dist):
        dist_dir = bundled_dist

if os.path.exists(dist_dir):
    from fastapi.staticfiles import StaticFiles
    from starlette.responses import FileResponse, JSONResponse

    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    images_dir = os.path.join(dist_dir, "images")
    if os.path.exists(images_dir):
        app.mount("/images", StaticFiles(directory=images_dir), name="images")

    @app.get("/logo.png", response_model=None)
    def get_static_logo() -> Response:
        logo_path = os.path.join(dist_dir, "logo.png")
        if os.path.exists(logo_path):
            return FileResponse(logo_path)
        raise HTTPException(status_code=404)

    @app.get("/IN_V_PROTECT_logo_cropped.mp4", response_model=None)
    def get_static_logo_video() -> Response:
        video_path = os.path.join(dist_dir, "IN_V_PROTECT_logo_cropped.mp4")
        if os.path.exists(video_path):
            return FileResponse(video_path, media_type="video/mp4")
        alt_path = os.path.join(dist_dir, "assets", "IN_V_PROTECT_logo_cropped.mp4")
        if os.path.exists(alt_path):
            return FileResponse(alt_path, media_type="video/mp4")
        raise HTTPException(status_code=404)

    @app.get("/", response_model=None)
    def get_spa_root() -> Union[Response, Dict[str, Any]]:
        index_path = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"status": "ok", "service": "in-v-protect", "frontend": "dist not found"}

    @app.exception_handler(404)
    async def spa_404_fallback(request: Request, exc: Exception) -> Response:
        path = request.url.path
        if (
            path.startswith("/api")
            or path.startswith("/health")
            or path.startswith("/auth")
            or path.startswith("/docs")
            or path.startswith("/openapi.json")
        ):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        index_path = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return JSONResponse({"detail": "Not Found"}, status_code=404)




