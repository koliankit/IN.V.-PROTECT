"""
Validation Test for Layer 011: Create environment configuration.
Verifies .env.example variables, default settings validation, and environment safety.
"""
import os
import unittest
from backend.core.config import AppSettings, settings


class TestLayer011EnvConfig(unittest.TestCase):
    def test_env_example_file_exists_and_covers_sections(self):
        env_path = os.path.join(os.path.dirname(__file__), "..", ".env.example")
        self.assertTrue(os.path.isfile(env_path), ".env.example file must exist")
        with open(env_path, "r", encoding="utf-8") as f:
            content = f.read()

        required_vars = [
            "ENVIRONMENT",
            "DATABASE_URL",
            "VECTOR_STORE_PROVIDER",
            "CHROMA_PERSIST_DIR",
            "LLM_PROVIDER",
            "OCR_ENGINE",
            "OCR_MIN_CONFIDENCE",
            "PUBLIC_API_URL",
        ]
        for var in required_vars:
            self.assertIn(var, content, f"Variable {var} missing from .env.example")

    def test_settings_validation_defaults(self):
        self.assertEqual(settings.ENVIRONMENT, "development")
        self.assertEqual(settings.VECTOR_STORE_PROVIDER, "chroma")
        self.assertEqual(settings.OCR_MIN_CONFIDENCE, 60.0)
        self.assertEqual(settings.LLM_PROVIDER, "offline_rule_fallback")

    def test_settings_invalid_environment_raises(self):
        with self.assertRaises(ValueError):
            AppSettings(ENVIRONMENT="invalid_env_name")


if __name__ == "__main__":
    unittest.main()
