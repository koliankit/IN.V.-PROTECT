"""
Dataset License & Attribution Schema.
Enforces strict license, attribution, record structure, and permitted use verification
for every candidate public/external dataset before inclusion.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class DatasetLicenseRecord(BaseModel):
    dataset_id: str = Field(..., description="Unique dataset identifier, e.g. DATASET_UCI_SPAM")
    dataset_name: str = Field(..., min_length=3, description="Canonical name of the dataset")
    license_type: str = Field(..., description="Exact license name, e.g. CC-BY-4.0, CC0-1.0")
    is_commercial_use_allowed: bool
    is_research_allowed: bool = True
    attribution_required: bool
    attribution_text: Optional[str] = Field(None, description="Required citation or attribution notice")
    provenance_url: str = Field(..., description="Canonical source or academic repository URL")
    record_structure: Dict[str, str] = Field(..., description="Dictionary mapping field names to expected data types")
    permitted_uses: List[str] = Field(..., min_length=1, description="Sanctioned pipeline use cases")
    license_verified: bool = Field(..., description="Flag indicating affirmative license verification")
    verification_notes: str

    @field_validator("provenance_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("provenance_url must start with http:// or https://")
        return v
