"""
ML Dataset Selector & Suitability Evaluator.
Manages candidate public ML datasets for baseline model training and evaluation,
recording explicit pros, cons, licensing constraints, and suitability determinations.
"""
import json
import os
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class DatasetSuitability(str, Enum):
    RECOMMENDED_FOR_BASELINE = "RECOMMENDED_FOR_BASELINE"
    SUITABLE_WITH_LIMITATIONS = "SUITABLE_WITH_LIMITATIONS"
    REJECTED = "REJECTED"


class DatasetEvaluationEntry(BaseModel):
    dataset_id: str
    dataset_name: str
    origin_publisher: str
    status: DatasetSuitability
    suitability_score: float = Field(..., ge=0.0, le=1.0)
    license: str
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    recommendation: str


class MLDatasetSelector:
    def __init__(self, manifest_path: Optional[str] = None):
        if manifest_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            manifest_path = os.path.join(base_dir, "data", "manifests", "ml_datasets_evaluation.json")
        self.manifest_path = manifest_path
        self._evaluations: Dict[str, DatasetEvaluationEntry] = {}
        self.load_evaluations()

    def load_evaluations(self) -> None:
        if not os.path.isfile(self.manifest_path):
            return

        with open(self.manifest_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        for entry in raw:
            item = DatasetEvaluationEntry(**entry)
            self._evaluations[item.dataset_id] = item

    def get_evaluation(self, dataset_id: str) -> Optional[DatasetEvaluationEntry]:
        return self._evaluations.get(dataset_id)

    def list_all(self) -> List[DatasetEvaluationEntry]:
        return list(self._evaluations.values())

    def get_recommended_for_baseline(self) -> List[DatasetEvaluationEntry]:
        return [
            d for d in self._evaluations.values()
            if d.status == DatasetSuitability.RECOMMENDED_FOR_BASELINE
        ]

    def get_rejected_datasets(self) -> List[DatasetEvaluationEntry]:
        return [
            d for d in self._evaluations.values()
            if d.status == DatasetSuitability.REJECTED
        ]


ml_dataset_selector = MLDatasetSelector()
