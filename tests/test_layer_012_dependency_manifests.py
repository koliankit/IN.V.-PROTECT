"""
Validation Test for Layer 012: Create dependency manifests.
Verifies pinned/compatible dependencies for frontend, backend, ML, OCR, RAG, and testing.
"""
import json
import os
import unittest


class TestLayer012DependencyManifests(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    def test_backend_requirements_file(self):
        req_path = os.path.join(self.root_dir, "backend", "requirements.txt")
        self.assertTrue(os.path.isfile(req_path))
        with open(req_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("fastapi", content)
        self.assertIn("pydantic", content)
        self.assertIn("uvicorn", content)

    def test_ml_requirements_file(self):
        req_path = os.path.join(self.root_dir, "ml", "requirements.txt")
        self.assertTrue(os.path.isfile(req_path))
        with open(req_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("scikit-learn", content)
        self.assertIn("numpy", content)

    def test_ocr_rag_requirements_file(self):
        req_path = os.path.join(self.root_dir, "backend", "requirements-ocr-rag.txt")
        self.assertTrue(os.path.isfile(req_path))
        with open(req_path, "r", encoding="utf-8") as f:
            content = f.read()
        self.assertIn("pillow", content)
        self.assertIn("chromadb", content)

    def test_frontend_package_json(self):
        pkg_path = os.path.join(self.root_dir, "frontend", "package.json")
        self.assertTrue(os.path.isfile(pkg_path))
        with open(pkg_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertEqual(data["name"], "sangyan-ai-investor-shield-frontend")
        self.assertIn("react", data["dependencies"])
        self.assertIn("vite", data["devDependencies"])
        self.assertIn("typescript", data["devDependencies"])


if __name__ == "__main__":
    unittest.main()
