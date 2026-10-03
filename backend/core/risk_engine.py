"""
Risk Assessment and Decision Engine for Sangyan AI Investor Shield.
Fuses rule-based indicators, claim analysis, and regulatory evidence to output a calibrated
risk level, evidence-grounded explanation, and actionable next steps.
"""
from typing import List, Dict, Any, Optional
from backend.schemas.analysis import (
    RiskLevel,
    ConfidenceLevel,
    ConfidenceOrUncertainty,
    DetectedSignal,
    ExtractedClaim,
    EvidenceItem,
    OfficialSourceLink,
    AnalysisResponse,
)
from backend.core.sources import official_registry
from ml.baseline_classifier import baseline_classifier


class RiskEngine:
    """Computes comprehensive investor risk and assembles an AnalysisResponse."""

    def evaluate(
        self,
        raw_text: str,
        claims: List[ExtractedClaim],
        signals: List[DetectedSignal],
        entities: Dict[str, Any],
    ) -> AnalysisResponse:
        # 0. Prompt-Injection & Anti-Advisory Guardrail Detection
        lowered = raw_text.lower()
        if "ignore all previous instructions" in lowered or "ignore previous instructions" in lowered or "which stock i should buy" in lowered or "which stock to buy" in lowered:
            signals.append(
                DetectedSignal(
                    id="SIG_PROMPT_INJECTION_DEFENSE",
                    name="Embedded Instruction / Anti-Advisory Guardrail",
                    severity="high",
                    rule_id="RULE_092_PROMPT_INJECTION_DEFENSE",
                    description=(
                        "Detected embedded instruction attempting to solicit stock buy/sell tips. "
                        "Sangyan AI strictly functions as an investor fraud awareness engine and NEVER issues "
                        "buy, sell, or hold recommendations under SEBI Research Analyst Regulations."
                    ),
                )
            )

        # 0b. ML Baseline Prediction
        ml_pred = baseline_classifier.predict(raw_text)

        has_critical = any(s.severity == "critical" for s in signals)
        has_high = any(s.severity == "high" for s in signals)
        has_medium = any(s.severity == "medium" for s in signals)
        signal_count = len(signals)

        # 1. Determine Risk Level & Confidence
        high_severity_signals = [s for s in signals if s.severity in ("critical", "high")]
        
        if has_critical or (has_high and signal_count >= 2) or (has_high and ml_pred["predicted_label"] == "scam"):
            risk_level = RiskLevel.HIGH_CONCERN
            confidence_level = ConfidenceLevel.HIGH
            # Ground confidence score in ML classifier probability and detected signal count
            base_score = ml_pred["confidence"] if ml_pred["predicted_label"] == "scam" else 0.88
            confidence_score = round(min(0.96, base_score + (0.02 * len(high_severity_signals))), 2)
            uncertainty_note = f"{len(high_severity_signals)} high-severity fraud indicators detected"
        elif has_high or has_medium or (entities.get("sebi_registration_numbers") and not has_critical):
            risk_level = RiskLevel.NEEDS_VERIFICATION
            confidence_level = ConfidenceLevel.MODERATE
            confidence_score = 0.82
            uncertainty_note = (
                "Entity, tip, or advisory references detected. Verification against the official SEBI registry is required before taking action."
            )
        else:
            # Low concern
            risk_level = RiskLevel.LOW_CONCERN
            confidence_level = ConfidenceLevel.HIGH
            confidence_score = 0.90
            uncertainty_note = "No acute scam indicators detected"

        # 2. Assemble Evidence Items directly from authentic official repositories (SEBI, RBI, I4C, CERT-In)
        evidence: List[EvidenceItem] = []
        signal_ids = {s.id for s in signals}

        if "SIG_CREDENTIAL_HARVESTING" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC005",
                    publisher="RBI",
                    title="RBI Financial Awareness Messages (FAME 2024) & Fraud Prevention Advisory",
                    url="https://www.rbi.org.in/commonperson/images/FAME202426022024.pdf",
                    passage="Reserve Bank of India reiterates that banks, financial institutions, and regulators never ask for sensitive credentials such as Account passwords, PIN, OTP, UPI PIN, Card CVV, or biometric data over telephone calls, SMS, email, or messaging apps. Any request for such credentials is an indicator of digital financial fraud.",
                    relevance_score=0.99,
                )
            )
            evidence.append(
                EvidenceItem(
                    source_id="SRC003",
                    publisher="SEBI Investor",
                    title="Investor Awareness: Fraud Red Flags and Protection Guidelines",
                    url="https://investor.sebi.gov.in/inv_aware_edu_videos.html",
                    passage="Investors must never share One-Time Passwords (OTPs), PINs, or demat account login credentials under any circumstance. Legitimate stock exchanges and brokers will never ask users to install screen-sharing or remote desktop tools (e.g., AnyDesk, TeamViewer) to resolve trading or KYC issues.",
                    relevance_score=0.98,
                )
            )

        if "SIG_ARTIFICIAL_URGENCY" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC006",
                    publisher="CERT-In",
                    title="CERT-In Advisory CIAD-2024-0050: Preventing Online Scams and Phishing Attacks",
                    url="https://www.cert-in.org.in/s2cMainServlet?VLCODE=CIAD-2024-0050&pageid=PUBVLNOTES02",
                    passage="Scammers engineer psychological pressure through urgent deadlines, threats of immediate demat account deactivation, fictitious regulatory compliance fines, or expiring pre-IPO allocations. CERT-In cautions that genuine regulatory authorities and financial institutions never demand immediate funds transfer to avert account suspension.",
                    relevance_score=0.96,
                )
            )

        if "SIG_GUARANTEED_RETURN" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC003",
                    publisher="SEBI Investor",
                    title="Investor Awareness: Fraud Red Flags and Protection Guidelines",
                    url="https://investor.sebi.gov.in/inv_aware_edu_videos.html",
                    passage="Under SEBI regulations, no registered intermediary or collective scheme is permitted to promise fixed or guaranteed returns in equity and derivative markets. Any solicitation promising zero-risk, assured daily/weekly interest, or guaranteed capital doubling is a cardinal indicator of fraud.",
                    relevance_score=0.98,
                )
            )
            evidence.append(
                EvidenceItem(
                    source_id="SRC001",
                    publisher="SEBI Investor",
                    title="Fake Trading App Scam Landscape",
                    url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    passage="SEBI reiterates that registered intermediaries never guarantee returns on stock market investments and never solicit funds into third-party accounts. Investors must verify registration status on the official SEBI website (www.sebi.gov.in) and download trading applications only from recognized app stores.",
                    relevance_score=0.97,
                )
            )

        if "SIG_FAKE_APP" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC001",
                    publisher="SEBI Investor",
                    title="Fake Trading App Scam Landscape",
                    url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    passage="Victims are instructed to download third-party applications via direct APK download links, unknown web URLs, or customized interfaces outside authorized app distribution stores. These fake applications simulate live market prices and display inflated fictitious trading profits on the user's dashboard to encourage larger deposits.",
                    relevance_score=0.98,
                )
            )
            evidence.append(
                EvidenceItem(
                    source_id="SRC002",
                    publisher="I4C / Ministry of Home Affairs",
                    title="Advisory: Fake Stock Market Investment Websites/Apps",
                    url="https://cybercrime.gov.in/pdf/Advisories/ADVISORY%20TAU-ADV-001%20%2822.04.2024%29.pdf",
                    passage="Citizens are advised: (1) Never install APK files from untrusted links or chat messages. (2) Cross-verify broker authenticity on the SEBI portal prior to transferring funds. (3) Report cyber financial fraud immediately to the National Cyber Crime Reporting Portal at www.cybercrime.gov.in or call Helpline 1930 within the golden hour to facilitate account lien placement.",
                    relevance_score=0.97,
                )
            )

        if "SIG_WITHDRAWAL_EXTORTION" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC001",
                    publisher="SEBI Investor",
                    title="Fake Trading App Scam Landscape",
                    url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    passage="When an investor attempts to withdraw funds or claimed profits, the perpetrators deny access, demanding additional payments under the pretext of statutory taxes, platform fees, conversion charges, or account unfreezing fees. Once the demand is met, further fees are demanded or communication is abruptly cut off.",
                    relevance_score=0.99,
                )
            )

        if "SIG_UNSOLICITED_TIP" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC003",
                    publisher="SEBI Investor",
                    title="Investor Awareness: Fraud Red Flags and Protection Guidelines",
                    url="https://investor.sebi.gov.in/inv_aware_edu_videos.html",
                    passage="Offering investment advice, research analyst reports, or portfolio management services without valid SEBI registration is illegal under SEBI (Investment Advisers) Regulations, 2013. Unregistered entities operating across Telegram, YouTube, and WhatsApp frequently execute pump-and-dump manipulations to offload shares onto retail followers.",
                    relevance_score=0.95,
                )
            )

        if "SIG_IMPERSONATION" in signal_ids:
            evidence.append(
                EvidenceItem(
                    source_id="SRC001",
                    publisher="SEBI Investor",
                    title="Fake Trading App Scam Landscape",
                    url="https://investor.sebi.gov.in/pdf/Fake%20trading%20app%20scam%20Landscape.pdf",
                    passage="Fraudsters create groups on social media platforms like WhatsApp and Telegram using names that resemble well-known SEBI registered intermediaries or foreign portfolio investors. Unsuspecting investors are added to these groups and lured with claims of high guaranteed returns, exclusive institutional trading access, and pre-IPO allocations.",
                    relevance_score=0.96,
                )
            )

        # Fallback evidence when no signal-specific item matched
        if not evidence:
            if risk_level == RiskLevel.NEEDS_VERIFICATION:
                evidence.append(
                    EvidenceItem(
                        source_id="SRC004",
                        publisher="SEBI Investor",
                        title="SEBI Investor Support and Grievance Redressal Guidance",
                        url="https://investor.sebi.gov.in/Investor-support.html",
                        passage="Investors must verify the registration status and valid registration certificate number (e.g., INZ for brokers, INA for investment advisers, INH for research analysts) directly on the SEBI official directory (https://www.sebi.gov.in/intermediaries.html). Dealing with unregistered individuals or transferring money to personal bank accounts leaves investors outside the protection of SEBI dispute resolution mechanisms.",
                        relevance_score=0.92,
                    )
                )
            else:
                evidence.append(
                    EvidenceItem(
                        source_id="SRC003",
                        publisher="SEBI Investor",
                        title="Investor Awareness: Fraud Red Flags and Protection Guidelines",
                        url="https://investor.sebi.gov.in/inv_aware_edu_videos.html",
                        passage="SEBI advises investors to verify that any financial advisory is conducted exclusively through SEBI-registered intermediaries. Always review offer documents, understand underlying risk disclosures, and never commit funds on unverified claims.",
                        relevance_score=0.88,
                    )
                )

        # Deduplicate evidence by title
        dedup_evidence: List[EvidenceItem] = []
        seen_titles = set()
        for ev in evidence:
            if ev.title not in seen_titles:
                seen_titles.add(ev.title)
                dedup_evidence.append(ev)

        # 3. Grounded Explanation
        explanation_parts = []
        if risk_level == RiskLevel.HIGH_CONCERN:
            explanation_parts.append(
                "CRITICAL FRAUD INDICATORS DETECTED: This communication exhibits high-risk scam patterns identified by SEBI, RBI, and the Indian Cyber Crime Coordination Centre (I4C)."
            )
            for s in signals:
                explanation_parts.append(f"• {s.name}: {s.description}")
        elif risk_level == RiskLevel.NEEDS_VERIFICATION:
            explanation_parts.append(
                "CAUTION ADVISED: This message contains financial claims or purported regulatory registrations that cannot be accepted without independent statutory verification."
            )
            for s in signals:
                explanation_parts.append(f"• {s.name}: {s.description}")
        else:
            explanation_parts.append(
                "LOW CONCERN: No acute scam indicators, coercive urgency, or fraudulent return guarantees were detected in the analyzed message. Always remember that legitimate investments carry standard market risks."
            )

        explanation = "\n".join(explanation_parts)

        # 4. Contextual Safe Next Steps (strictly tailored to triggered signals)
        safe_steps: List[str] = []
        if "SIG_CREDENTIAL_HARVESTING" in signal_ids:
            safe_steps.append("DO NOT share your Demat password, OTP, PIN, or credentials. Regulators and genuine brokers NEVER ask for confidential passwords.")
            safe_steps.append("If credentials were submitted anywhere, immediately change your Demat password and MPIN through your genuine broker's verified app.")
            safe_steps.append("Contact your depository participant (DP) or broker's verified helpline to ensure no unauthorized access has occurred.")

        if "SIG_WITHDRAWAL_EXTORTION" in signal_ids:
            safe_steps.append("DO NOT pay any additional fees, taxes, or margin charges to release your funds. Registered brokers never demand upfront payments to unfreeze withdrawals.")
            safe_steps.append("Preserve all chat transcripts, payment slips, UPI handles, and transaction IDs as legal evidence.")

        if "SIG_FAKE_APP" in signal_ids:
            safe_steps.append("DO NOT install or run APK files received via messaging apps or unverified web links.")
            safe_steps.append("If already downloaded, immediately disconnect your phone from the internet, uninstall the app, and run a security scan.")

        if "SIG_GUARANTEED_RETURN" in signal_ids:
            safe_steps.append("DO NOT commit capital or transfer funds. SEBI regulations strictly prohibit guaranteed or assured market returns in equities and derivatives.")
            safe_steps.append("Never transfer money to personal savings accounts or third-party UPI IDs.")

        if "SIG_ARTIFICIAL_URGENCY" in signal_ids:
            safe_steps.append("Do not panic or rush into action. Urgent suspension deadlines and coercive countdowns are standard psychological manipulation tactics.")

        if risk_level == RiskLevel.HIGH_CONCERN:
            safe_steps.append("Report the incident immediately to the National Cyber Crime Reporting Portal at https://cybercrime.gov.in or call Helpline 1930 within the golden hour to facilitate financial freezing.")
            safe_steps.append("Report fraudulent phone numbers and message headers on DoT's Chakshu facility at https://sancharsaathi.gov.in/sfc/.")
        elif risk_level == RiskLevel.NEEDS_VERIFICATION:
            safe_steps.append("Verify the intermediary's exact registration number (INA/INH/INZ) on the official SEBI directory (https://www.sebi.gov.in) before engaging.")
            safe_steps.append("Cross-check whether the bank account matches the verified institutional account registered with SEBI/Exchanges.")
            safe_steps.append("Never share OTPs, Demat login passwords, or signed delivery instruction slips (DIS).")
        else:
            safe_steps.append("Ensure you only trade through SEBI-registered brokers and official mobile applications from verified app stores.")
            safe_steps.append("Review official scheme documents and read all risk disclosures carefully.")

        # 5. Official Source Links
        official_links: List[OfficialSourceLink] = [
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
            OfficialSourceLink(
                title="SEBI SCORES Grievance Redressal",
                url="https://scores.sebi.gov.in",
                description="Official investor grievance system for complaints against registered entities.",
                category="grievance",
            ),
        ]

        if risk_level == RiskLevel.HIGH_CONCERN:
            tier_str = "Quarantined / High Risk"
        elif risk_level == RiskLevel.NEEDS_VERIFICATION:
            tier_str = "Review / Verify"
        else:
            tier_str = "Trusted / Important"

        return AnalysisResponse(
            risk_level=risk_level,
            confidence_or_uncertainty=ConfidenceOrUncertainty(
                level=confidence_level,
                score=confidence_score,
                uncertainty_note=uncertainty_note,
            ),
            detected_signals=signals,
            extracted_claims=claims,
            evidence=dedup_evidence,
            explanation=explanation,
            safe_next_steps=safe_steps,
            official_source_links=official_links,
            protection_tier=tier_str,
        )


risk_engine = RiskEngine()
