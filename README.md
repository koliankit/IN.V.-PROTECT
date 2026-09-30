# Sangyan AI Investor Shield

## Overview
Sangyan AI Investor Shield is an AI-assisted investor protection and fraud-resilience platform. It is engineered to detect digital scams, financial fraud signals, and deceptive investment claims, verify content against authoritative regulatory and government advisories, and provide transparent, actionable safety guidance to end users.

## Project Structure
This repository is organized as a clean monorepo:

```
sangyam-ai/
├── frontend/          # Responsive web application interface
├── backend/           # Core API services and business logic
├── ml/                # Feature extraction, heuristic rules, and classification pipelines
├── data/
│   ├── raw/           # Raw uncurated data from approved sources
│   ├── processed/     # Processed and normalized datasets
│   ├── external/      # Verified external resources and public benchmark data
│   ├── synthetic/     # Controlled synthetic examples for stress-testing and augmentation
│   ├── official/      # Authoritative regulatory advisories, circulars, and notices
│   ├── splits/        # Stratified train, validation, and test splits
│   └── manifests/     # Provenance records, hashes, and licensing manifests
├── docs/              # Architectural, specifications, and governance documentation
├── scripts/           # Automation scripts for data fetching, verification, and tooling
├── tests/             # End-to-end, integration, unit, and adversarial test suites
└── infra/             # Deployment and infrastructure configurations
```

## Guiding Principles & Constraints
1. **Fact & Provenance Integrity**: Strictly utilize authoritative government and regulator sources for factual claims. No fabricated datasets, source URLs, statistics, model metrics, or citations.
2. **Explicit Non-Goals**: Sangyan AI Investor Shield is exclusively a protective and analytical tool. It never provides stock tips, buy/sell/hold recommendations, price predictions, or portfolio/broker endorsements.
3. **Reproducibility & Safety**: All processed data, rules, and machine learning models are bound by immutable provenance records and content hashes.

## Getting Started
Development instructions, dependencies, and environment setup will be configured through subsequent execution layers.
