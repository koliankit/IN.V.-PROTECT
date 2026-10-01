"""
Indian-Context & Hinglish Scam Dataset Schema.
Enforces strict distinction between regulator/official sources and community-created datasets,
while capturing India-specific scam patterns and linguistic constructs (Hinglish/Devanagari).
"""
from enum import Enum
from typing import List
from pydantic import BaseModel, Field, model_validator


class SourceTier(str, Enum):
    REGULATOR_OFFICIAL = "regulator_official"
    COMMUNITY_RESEARCH = "community_research"
    SYNTHETIC_BENCHMARK = "synthetic_benchmark"


class IndianScamPatternType(str, Enum):
    TELEGRAM_VIP_TRADING = "telegram_vip_trading"
    PART_TIME_TASK_FRAUD = "part_time_task_fraud"
    DEMAT_KYC_SUSPENSION = "demat_kyc_suspension"
    APK_SCREEN_SHARING = "apk_screen_sharing"
    GUARANTEED_UPPER_CIRCUIT = "guaranteed_upper_circuit"


class IndianContextDatasetRecord(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier")
    title: str = Field(..., min_length=3, description="Canonical title of the dataset")
    source_tier: SourceTier = Field(..., description="Strict tier classification")
    publisher_organization: str = Field(..., min_length=2)
    is_official_government: bool = Field(..., description="True ONLY for official statutory/regulatory authorities")
    language_mix: List[str] = Field(..., min_length=1, description="Languages represented (e.g. Hinglish, Hindi, English)")
    covered_patterns: List[IndianScamPatternType] = Field(..., min_length=1)
    license: str
    provenance_url: str
    evaluation_notes: str

    @model_validator(mode="after")
    def verify_government_tier_consistency(self) -> "IndianContextDatasetRecord":
        if self.source_tier == SourceTier.COMMUNITY_RESEARCH and self.is_official_government:
            raise ValueError(
                "Integrity violation: Community research datasets CANNOT be marked as official government sources."
            )
        if self.source_tier == SourceTier.REGULATOR_OFFICIAL and not self.is_official_government:
            raise ValueError(
                "Integrity violation: Regulator official sources MUST have is_official_government set to True."
            )
        return self
