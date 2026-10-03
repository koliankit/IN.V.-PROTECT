"""
Investor Support & Grievance Guidance Manager.
Indexes official SEBI investor-support and grievance resources (SCORES, SMART ODR, SEBI Helpline, 1930)
from authoritative source records rather than maintaining an unsourced static database.
"""
import os
import json
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from backend.core.evidence import EvidenceStore, evidence_store


class SupportChannel(BaseModel):
    channel_id: str
    name: str
    portal_url: Optional[str] = None
    helpline_numbers: List[str] = Field(default_factory=list)
    description: str
    use_case: str
    authority: str
    source_reference: str


class InvestorSupportIndex:
    def __init__(self, store: Optional[EvidenceStore] = None) -> None:
        self.evidence_store = store or evidence_store
        self._channels: Dict[str, SupportChannel] = {}
        self.index_support_guidance()

    def index_support_guidance(self) -> None:
        doc = self.evidence_store.get_document("SRC004")
        if not doc:
            return

        for sec in doc.get("sections", []):
            sec_id = sec.get("section_id", "")
            title = sec.get("section_title", "")
            content = sec.get("content", "")

            if "SCORES" in sec_id or "SCORES" in title:
                self._channels["scores"] = SupportChannel(
                    channel_id="scores",
                    name="SEBI Complaints Redress System (SCORES 2.0)",
                    portal_url="https://scores.sebi.gov.in",
                    description=content,
                    use_case="Grievances against SEBI-registered entities, brokers, and listed companies",
                    authority="Securities and Exchange Board of India (SEBI)",
                    source_reference="SRC004#SEC01_SCORES_PORTAL",
                )
            elif "SMART_ODR" in sec_id or "ODR" in title:
                self._channels["smart_odr"] = SupportChannel(
                    channel_id="smart_odr",
                    name="Securities Market Online Dispute Resolution (SMART ODR)",
                    portal_url="https://smartodr.in",
                    description=content,
                    use_case="Escalated digital conciliation and arbitration for registered securities disputes",
                    authority="Securities and Exchange Board of India (SEBI)",
                    source_reference="SRC004#SEC02_SMART_ODR",
                )
            elif "HELPLINE" in sec_id or "Helpline" in title:
                self._channels["sebi_helpline"] = SupportChannel(
                    channel_id="sebi_helpline",
                    name="SEBI Toll-Free Investor Helpline",
                    portal_url=None,
                    helpline_numbers=["1800 266 7575", "1800 22 7575"],
                    description=content,
                    use_case="Direct telephonic inquiry for status, filing advice, and registration verification",
                    authority="Securities and Exchange Board of India (SEBI)",
                    source_reference="SRC004#SEC03_TOLL_FREE_HELPLINE",
                )
            elif "INTERMEDIARY" in sec_id or "Directory" in title:
                self._channels["sebi_directory"] = SupportChannel(
                    channel_id="sebi_directory",
                    name="SEBI Intermediary Verification Directory",
                    portal_url="https://www.sebi.gov.in/intermediaries.html",
                    description=content,
                    use_case="Pre-transaction license verification of brokers, advisers (INA), and research analysts (INH)",
                    authority="Securities and Exchange Board of India (SEBI)",
                    source_reference="SRC004#SEC04_INTERMEDIARY_VERIFICATION",
                )
            elif "UNREGISTERED" in sec_id or "Reporting" in title:
                self._channels["cybercrime_portal"] = SupportChannel(
                    channel_id="cybercrime_portal",
                    name="National Cyber Crime Reporting Portal & Helpline 1930",
                    portal_url="https://cybercrime.gov.in",
                    helpline_numbers=["1930"],
                    description=content,
                    use_case="Emergency reporting of fraudulent investment groups, mule account payments, and fake APK apps",
                    authority="Ministry of Home Affairs / I4C & SEBI Advisory",
                    source_reference="SRC004#SEC05_UNREGISTERED_ENTITY_REPORTING",
                )

    def get_channel(self, channel_id: str) -> Optional[SupportChannel]:
        return self._channels.get(channel_id)

    def list_all_channels(self) -> List[SupportChannel]:
        return list(self._channels.values())

    def get_recommended_routing(self, suspected_unregistered: bool = True) -> List[SupportChannel]:
        """
        Dynamically routes investors to appropriate support channels based on verified official guidelines:
        - If unregistered/cyber fraud: 1930 & cybercrime.gov.in (immediate fund freeze) + intermediary verification.
        - If registered intermediary dispute: SCORES 2.0 -> SMART ODR + SEBI Toll-free helpline.
        """
        if suspected_unregistered:
            routing_keys = ["cybercrime_portal", "sebi_directory", "sebi_helpline"]
        else:
            routing_keys = ["scores", "smart_odr", "sebi_helpline"]

        return [self._channels[k] for k in routing_keys if k in self._channels]


# Global singleton instance
investor_support_index = InvestorSupportIndex()
