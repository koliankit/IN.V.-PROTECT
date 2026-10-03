"""
Dataset Quality Gate & Rejection Auditing Engine.
Enforces rigorous quality gates to reject datasets exhibiting unclear provenance,
unclear or unverified licensing, excessive duplication, unverifiable labels, or suspicious records.
Logs structured audit trails for all decisions.
"""
from datetime import datetime, timezone
import json
import os
import re
from typing import Any, Dict, List, Optional, Set, Tuple
import uuid

from backend.schemas.dataset_quality import (
    DatasetCandidate,
    QualityGateAuditLog,
    QualityGateDecision,
    RejectionReasonCode,
)


class DatasetQualityGate:
    def __init__(
        self,
        audit_log_path: Optional[str] = None,
        max_duplicate_ratio: float = 0.20,
        unverifiable_label_tolerance: float = 0.0,
    ) -> None:
        if audit_log_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            audit_log_path = os.path.join(base_dir, "data", "manifests", "dataset_rejections.json")
        self.audit_log_path = audit_log_path
        self.max_duplicate_ratio = max_duplicate_ratio
        self.unverifiable_label_tolerance = unverifiable_label_tolerance
        self._ensure_audit_file()

    def _ensure_audit_file(self) -> None:
        os.makedirs(os.path.dirname(self.audit_log_path), exist_ok=True)
        if not os.path.isfile(self.audit_log_path):
            with open(self.audit_log_path, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    def check_provenance(self, candidate: DatasetCandidate) -> Tuple[bool, Optional[str]]:
        url = candidate.provenance_url
        if not url or not isinstance(url, str):
            return False, "Provenance URL is completely missing or not a string."

        url_clean = url.strip().lower()
        if not (url_clean.startswith("http://") or url_clean.startswith("https://")):
            return False, f"Invalid provenance URL protocol (must be http:// or https://): '{url}'"

        placeholder_hosts = ["example.com", "localhost", "127.0.0.1", "dummy.org", "unknown.invalid"]
        for ph in placeholder_hosts:
            if ph in url_clean:
                return False, f"Provenance URL points to an unverified or placeholder domain: '{url}'"

        return True, None

    def check_licensing(self, candidate: DatasetCandidate) -> Tuple[bool, Optional[str]]:
        if not candidate.license_verified:
            return False, "Dataset license has not been affirmatively verified."

        lic = candidate.license_type
        if not lic or not isinstance(lic, str):
            return False, "Dataset license_type is missing or empty."

        lic_clean = lic.strip().lower()
        disallowed = ["unknown", "unspecified", "none", "proprietary", "n/a", "all rights reserved"]
        if lic_clean in disallowed:
            return False, f"Dataset has unclear, ambiguous, or proprietary license: '{lic}'"

        return True, None

    def check_duplication(
        self, candidate: DatasetCandidate
    ) -> Tuple[bool, int, float, Optional[str]]:
        total = len(candidate.records)
        if total == 0:
            return True, 0, 0.0, None

        seen_texts: Set[str] = set()
        duplicates = 0

        for r in candidate.records:
            val = r.get(candidate.text_field, "")
            normalized = " ".join(str(val).strip().lower().split())
            if normalized in seen_texts:
                duplicates += 1
            else:
                seen_texts.add(normalized)

        duplication_rate = duplicates / total
        if duplication_rate > self.max_duplicate_ratio:
            msg = (
                f"Duplication rate of {duplication_rate:.2%} ({duplicates}/{total} duplicates) "
                f"exceeds maximum allowable threshold of {self.max_duplicate_ratio:.2%}."
            )
            return False, duplicates, duplication_rate, msg

        return True, duplicates, duplication_rate, None

    def check_labels(
        self, candidate: DatasetCandidate
    ) -> Tuple[bool, int, Optional[str]]:
        total = len(candidate.records)
        if total == 0:
            return True, 0, None

        unverifiable_count = 0
        invalid_markers = {"", "null", "none", "unknown", "?", "undefined", "n/a", "unlabeled"}

        for r in candidate.records:
            if candidate.label_field not in r:
                unverifiable_count += 1
                continue

            raw_label = r.get(candidate.label_field)
            if raw_label is None:
                unverifiable_count += 1
                continue

            label_str = str(raw_label).strip().lower()
            if label_str in invalid_markers:
                unverifiable_count += 1

        unverifiable_ratio = unverifiable_count / total
        if unverifiable_ratio > self.unverifiable_label_tolerance:
            msg = (
                f"{unverifiable_count}/{total} records have missing, ambiguous, or unverifiable labels "
                f"({unverifiable_ratio:.2%}), exceeding tolerance of {self.unverifiable_label_tolerance:.2%}."
            )
            return False, unverifiable_count, msg

        return True, unverifiable_count, None

    def check_suspicious_records(
        self, candidate: DatasetCandidate
    ) -> Tuple[bool, int, Optional[str]]:
        total = len(candidate.records)
        if total == 0:
            return True, 0, None

        suspicious_count = 0
        malicious_patterns = [
            re.compile(r"<\s*script", re.IGNORECASE),
            re.compile(r"javascript\s*:", re.IGNORECASE),
            re.compile(r"\[SYNTHETIC_TEST_MARKER\]", re.IGNORECASE),
            re.compile(r"TEST_DUMMY_RECORD", re.IGNORECASE),
        ]

        for r in candidate.records:
            text = str(r.get(candidate.text_field, ""))

            # 1. Null byte detection
            if "\x00" in text:
                suspicious_count += 1
                continue

            # 2. Corrupted Unicode replacement character
            if "\ufffd" in text:
                suspicious_count += 1
                continue

            # 3. Completely empty or whitespace string
            if len(text.strip()) == 0:
                suspicious_count += 1
                continue

            # 4. Pattern matches for injection or unflagged synthetic placeholders
            if any(p.search(text) for p in malicious_patterns):
                suspicious_count += 1
                continue

        if suspicious_count > 0:
            msg = f"{suspicious_count}/{total} records contain corrupted characters, null bytes, empty payloads, or suspicious markers."
            return False, suspicious_count, msg

        return True, suspicious_count, None

    def evaluate_dataset(self, candidate: DatasetCandidate) -> QualityGateAuditLog:
        """
        Executes all quality gates against candidate dataset and generates an audit log entry.
        """
        rejection_reasons: List[RejectionReasonCode] = []
        rejection_details: List[str] = []

        # 1. Provenance check
        prov_ok, prov_msg = self.check_provenance(candidate)
        if not prov_ok and prov_msg:
            rejection_reasons.append(RejectionReasonCode.UNCLEAR_PROVENANCE)
            rejection_details.append(prov_msg)

        # 2. Licensing check
        lic_ok, lic_msg = self.check_licensing(candidate)
        if not lic_ok and lic_msg:
            rejection_reasons.append(RejectionReasonCode.UNCLEAR_LICENSING)
            rejection_details.append(lic_msg)

        # 3. Duplication check
        dup_ok, dup_count, dup_rate, dup_msg = self.check_duplication(candidate)
        if not dup_ok and dup_msg:
            rejection_reasons.append(RejectionReasonCode.EXCESSIVE_DUPLICATION)
            rejection_details.append(dup_msg)

        # 4. Labels check
        lbl_ok, unv_lbl_count, lbl_msg = self.check_labels(candidate)
        if not lbl_ok and lbl_msg:
            rejection_reasons.append(RejectionReasonCode.UNVERIFIABLE_LABELS)
            rejection_details.append(lbl_msg)

        # 5. Suspicious records check
        sus_ok, sus_count, sus_msg = self.check_suspicious_records(candidate)
        if not sus_ok and sus_msg:
            rejection_reasons.append(RejectionReasonCode.SUSPICIOUS_RECORDS)
            rejection_details.append(sus_msg)

        decision = (
            QualityGateDecision.PASSED if len(rejection_reasons) == 0 else QualityGateDecision.REJECTED
        )

        audit_entry = QualityGateAuditLog(
            audit_id=str(uuid.uuid4()),
            dataset_id=candidate.dataset_id,
            dataset_name=candidate.dataset_name,
            decision=decision,
            rejection_reasons=rejection_reasons,
            rejection_details=rejection_details,
            total_records=len(candidate.records),
            duplicate_count=dup_count,
            duplication_rate=round(dup_rate, 4),
            unverifiable_label_count=unv_lbl_count,
            suspicious_record_count=sus_count,
            evaluated_at=datetime.now(timezone.utc).isoformat(),
            provenance_url=candidate.provenance_url,
            license_type=candidate.license_type,
        )

        self._record_audit_log(audit_entry)
        return audit_entry

    def _record_audit_log(self, entry: QualityGateAuditLog) -> None:
        logs = self.get_audit_logs()
        logs.append(entry)
        with open(self.audit_log_path, "w", encoding="utf-8") as f:
            json.dump([item.model_dump() for item in logs], f, indent=2)

    def get_audit_logs(self) -> List[QualityGateAuditLog]:
        if not os.path.isfile(self.audit_log_path):
            return []
        try:
            with open(self.audit_log_path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            return [QualityGateAuditLog(**item) for item in raw]
        except Exception:
            return []

    def get_rejected_datasets(self) -> List[QualityGateAuditLog]:
        return [log for log in self.get_audit_logs() if log.decision == QualityGateDecision.REJECTED]
