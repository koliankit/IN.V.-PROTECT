"""
Merged Record & Lineage Schema.
Enforces strict per-record provenance: original dataset name, source URL, original record ID,
original label definition, license information, and attribution.
"""
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class MergedDatasetRecord(BaseModel):
    record_id: str = Field(..., description="Unique composite record ID, e.g. DATASET_ID:ORIG_ID")
    text: str = Field(..., min_length=1, description="Message text or sample payload")
    canonical_label: str = Field(..., description="Canonical unified label ('scam' or 'benign')")
    original_dataset_name: str = Field(..., min_length=2, description="Name of origin dataset")
    source_url: str = Field(..., description="Canonical URL from which original data originates")
    original_record_id: str = Field(..., min_length=1, description="Row index or original ID")
    original_label_definition: str = Field(..., min_length=3, description="Exact definition of original label")
    license_type: str = Field(..., min_length=2, description="License governing this specific sample")
    attribution: Optional[str] = Field(None, description="Attribution text if required by license")
    synthetic: bool = Field(False, description="Flag indicating synthetic origin")

    @field_validator("source_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("source_url must start with http:// or https://")
        return v
