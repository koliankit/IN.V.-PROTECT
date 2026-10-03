#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Render Build Script — IN V PROTECT Backend
# Runs during the "Build" phase of the Render web service.
# ─────────────────────────────────────────────────────────
set -o errexit  # exit on error

echo "==> Upgrading pip..."
pip install --upgrade pip

echo "==> Installing backend dependencies..."
pip install -r backend/requirements.txt

echo "==> Build complete."
