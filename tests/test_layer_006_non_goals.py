"""
Validation Test for Layer 006: Define non-goals.
Verifies the explicit product non-goals (no buy/sell/hold, no price prediction, no portfolio recommendations,
no speculative trading, no broker promotion, no investment upselling).
"""
import os
import unittest
from backend.core.constants import PRODUCT_NON_GOALS, NON_GOAL_DESCRIPTIONS


class TestLayer006NonGoals(unittest.TestCase):
    def test_non_goals_list(self):
        expected = [
            "NO_BUY_SELL_HOLD",
            "NO_PRICE_PREDICTION",
            "NO_PORTFOLIO_RECOMMENDATION",
            "NO_SPECULATIVE_TRADING",
            "NO_BROKER_PROMOTION",
            "NO_INVESTMENT_UPSELLING",
        ]
        self.assertEqual(PRODUCT_NON_GOALS, expected)
        for key in expected:
            self.assertIn(key, NON_GOAL_DESCRIPTIONS)

    def test_non_goals_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "NON_GOALS.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("No Buy / Sell / Hold Recommendations", content)
        self.assertIn("No Stock Price or Return Prediction", content)
        self.assertIn("No Portfolio Recommendations", content)
        self.assertIn("No Speculative Trading Assistance", content)
        self.assertIn("No Broker or Intermediary Promotion", content)
        self.assertIn("No Financial Product Upselling", content)


if __name__ == "__main__":
    unittest.main()
