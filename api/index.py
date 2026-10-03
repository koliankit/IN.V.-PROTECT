"""
Vercel Serverless Function entry point for Sangyan AI Investor Shield.
Directs incoming requests to the unified FastAPI application.
"""
import os
import sys

# Ensure project root is in the Python module search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Flag Vercel serverless environment
os.environ["VERCEL"] = "1"

# Import FastAPI application instance
from backend.main import app
