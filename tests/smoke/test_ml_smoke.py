"""
ML Service Smoke Test.
Verifies that scikit-learn, numpy, and feature extraction components function properly.
"""
import unittest
from typing import Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
try:
    from sklearn.linear_model import LogisticRegression
    def get_clf() -> Any:
        return LogisticRegression()
except Exception:
    from sklearn.naive_bayes import MultinomialNB
    def get_clf() -> Any:
        return MultinomialNB()


class TestMLSmoke(unittest.TestCase):
    def test_sklearn_pipeline_smoke(self) -> None:
        # Smoke training sample
        corpus = [
            "Guaranteed 100% returns join Telegram VIP group",
            "Dear customer, your quarterly account statement is ready",
            "Urgent KYC block, send OTP immediately",
            "SEBI Investor awareness on fake trading apps",
        ]
        labels = [1, 0, 1, 0]

        vectorizer = TfidfVectorizer(ngram_range=(1, 2))
        X = vectorizer.fit_transform(corpus)
        self.assertEqual(X.shape[0], 4)

        clf = get_clf()
        clf.fit(X, labels)

        test_sample = vectorizer.transform(["Guaranteed daily profit on WhatsApp"])
        pred = clf.predict(test_sample)
        prob = clf.predict_proba(test_sample)

        self.assertIn(pred[0], [0, 1])
        self.assertEqual(prob.shape, (1, 2))


if __name__ == "__main__":
    unittest.main()
