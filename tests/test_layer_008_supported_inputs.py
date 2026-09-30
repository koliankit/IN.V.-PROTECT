"""
Validation Test for Layer 008: Define supported inputs.
Verifies plain text, pasted message, screenshot image, and optional URL inputs with fallback rules.
"""
import os
import unittest
from backend.core.constants import SUPPORTED_INPUT_MODALITIES


class TestLayer008SupportedInputs(unittest.TestCase):
    def test_supported_modalities(self):
        expected_keys = {"plain_text", "pasted_message", "screenshot_image", "public_url"}
        self.assertEqual(set(SUPPORTED_INPUT_MODALITIES.keys()), expected_keys)
        self.assertTrue(SUPPORTED_INPUT_MODALITIES["plain_text"]["required"])
        self.assertTrue(SUPPORTED_INPUT_MODALITIES["screenshot_image"]["required"])
        self.assertFalse(SUPPORTED_INPUT_MODALITIES["public_url"]["required"])

    def test_inputs_documentation(self):
        doc_path = os.path.join(os.path.dirname(__file__), "..", "docs", "SUPPORTED_INPUTS.md")
        self.assertTrue(os.path.isfile(doc_path))
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("Plain Text Input", content)
        self.assertIn("Pasted Message", content)
        self.assertIn("Screenshot & Image Upload", content)
        self.assertIn("Public Web URL", content)


if __name__ == "__main__":
    unittest.main()
