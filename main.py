"""
Sangyan AI Investor Shield - Top-Level FastAPI Application Entrypoint for Vercel.
"""
import os
import sys

# Ensure project root is in sys.path
_ROOT = os.path.dirname(os.path.abspath(__file__))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from backend.main import app

__all__ = ["app"]
