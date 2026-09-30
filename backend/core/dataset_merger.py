"""
Dataset Merger & Provenance Preserver.
Enforces that datasets are never merged without retaining original dataset name,
source URL, original record ID, label definition, and license information.
"""
from typing import Any, Dict, List
from backend.schemas.merged_record import MergedDatasetRecord


class ProvenanceIntegrityError(Exception):
    """Raised when an attempt is made to merge data lacking mandatory lineage metadata."""
    pass


class DatasetMerger:
    MANDATORY_PROVENANCE_KEYS = [
        "original_dataset_name",
        "source_url",
        "original_record_id",
        "original_label_definition",
        "license_type",
    ]

    def validate_raw_record(self, raw_record: Dict[str, Any]) -> None:
        missing = [k for k in self.MANDATORY_PROVENANCE_KEYS if not raw_record.get(k)]
        if missing:
            raise ProvenanceIntegrityError(
                f"Cannot merge record: Missing mandatory provenance fields: {missing}. "
                f"Record summary: {raw_record.get('original_record_id', 'unknown')}"
            )

    def merge_datasets(
        self, datasets_records: List[List[Dict[str, Any]]]
    ) -> List[MergedDatasetRecord]:
        """
        Safely merges multiple lists of dataset records into standard MergedDatasetRecords.
        Aborts if any record violates lineage retention constraints.
        """
        unified: List[MergedDatasetRecord] = []
        seen_composite_ids = set()

        for dataset_list in datasets_records:
            for item in dataset_list:
                self.validate_raw_record(item)

                # Generate or verify composite record ID
                dataset_prefix = item["original_dataset_name"].replace(" ", "_")
                composite_id = f"{dataset_prefix}:{item['original_record_id']}"

                record = MergedDatasetRecord(
                    record_id=composite_id,
                    text=item["text"],
                    canonical_label=item["canonical_label"],
                    original_dataset_name=item["original_dataset_name"],
                    source_url=item["source_url"],
                    original_record_id=str(item["original_record_id"]),
                    original_label_definition=item["original_label_definition"],
                    license_type=item["license_type"],
                    attribution=item.get("attribution"),
                    synthetic=item.get("synthetic", False),
                )

                if composite_id in seen_composite_ids:
                    # Duplicate record ID within/across datasets
                    continue

                seen_composite_ids.add(composite_id)
                unified.append(record)

        return unified


dataset_merger = DatasetMerger()
