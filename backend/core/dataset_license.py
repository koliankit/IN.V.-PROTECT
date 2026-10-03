"""
Dataset License Verifier & Policy Enforcer.
Ensures every public dataset has an affirmative license check, attribution requirements,
provenance metadata, and structural schema verification prior to inclusion.
"""
import json
import os
from typing import Dict, List, Optional, Tuple
from backend.schemas.dataset_license import DatasetLicenseRecord


class DatasetLicenseVerifier:
    def __init__(self, manifest_path: Optional[str] = None) -> None:
        if manifest_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            manifest_path = os.path.join(base_dir, "data", "manifests", "dataset_licenses.json")
        self.manifest_path = manifest_path
        self._records: Dict[str, DatasetLicenseRecord] = {}
        self.load_records()

    def load_records(self) -> None:
        if not os.path.isfile(self.manifest_path):
            return

        with open(self.manifest_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        for item in raw:
            record = DatasetLicenseRecord(**item)
            self._records[record.dataset_id] = record

    def get_record(self, dataset_id: str) -> Optional[DatasetLicenseRecord]:
        return self._records.get(dataset_id)

    def list_all(self) -> List[DatasetLicenseRecord]:
        return list(self._records.values())

    def verify_dataset_inclusion(
        self, candidate: DatasetLicenseRecord, required_use: str
    ) -> Tuple[bool, str]:
        """
        Evaluates whether a candidate dataset meets inclusion criteria:
        1. license_verified must be True
        2. Must allow research use
        3. If attribution_required is True, attribution_text must be non-empty
        4. record_structure must specify non-empty field definitions
        5. required_use must be present in permitted_uses
        """
        if not candidate.license_verified:
            return False, "License is unverified or ambiguous."

        if not candidate.is_research_allowed:
            return False, "Research use is not permitted by license."

        if candidate.attribution_required and not candidate.attribution_text:
            return False, "Attribution is required by license but attribution_text is missing."

        if not candidate.record_structure:
            return False, "Record structure is undefined or empty."

        if required_use not in candidate.permitted_uses:
            return False, f"Intended use '{required_use}' not permitted by license. Permitted: {candidate.permitted_uses}"

        return True, "Dataset license, attribution, and record structure verified for inclusion."


dataset_license_verifier = DatasetLicenseVerifier()
