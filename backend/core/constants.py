"""
Core Constants & Metadata for Sangyan AI Investor Shield.
Establishes canonical product branding, tracks, constraints, and contract constants.
"""

# Layer 002: Product Name & Branding
PRODUCT_NAME = "Sangyan AI Investor Shield"
PRODUCT_TAGLINE = "Evidence-Backed Investor Protection and Fraud Resilience"
PRODUCT_SLUG = "sangyan-ai-investor-shield"
PRODUCT_ORGANIZATION = "Sangyan AI Research Initiative"
AESTHETIC_PROFILE = "Academic, Trustworthy, Minimalist, Research-Grade"

# Forbidden aesthetic categories / terms in consumer-facing copy
FORBIDDEN_THEMES = [
    "crypto rocket",
    "moonshot",
    "guaranteed profit",
    "100x returns",
    "day trading signals",
    "insider tip",
]

# Layer 003: Primary Track Definition
PRIMARY_TRACK_CODE = "Track A"
PRIMARY_TRACK_NAME = "Digital Fraud & Scam Resilience"
PRIMARY_TRACK_DESCRIPTION = (
    "Empowering investors and citizens against digital scams, cyber fraud, "
    "deceptive high-return solicitations, and fake trading apps."
)

# Layer 004: Secondary Capability Definition
SECONDARY_TRACK_CODE = "Track E"
SECONDARY_TRACK_NAME = "Misinformation & Content Literacy"
SECONDARY_TRACK_DESCRIPTION = (
    "Integrated supporting capability: analyzing deceptive claims, deepfaked "
    "endorsements, and misleading media within a unified investor-safety workflow."
)

# Layer 005: Target User Personas
TARGET_USER_PERSONAS = [
    {
        "id": "first_time_investor",
        "name": "First-time Investors",
        "description": "Novice retail participants unfamiliar with realistic market dynamics and statutory protections.",
    },
    {
        "id": "young_social_media",
        "name": "Young Social-Media Users",
        "description": "Users exposed to viral trading reels, fake profit screenshots, and Telegram pump groups.",
    },
    {
        "id": "regional_language",
        "name": "Regional-Language Users",
        "description": "Users communicating in Hindi, Marathi, Hinglish, and regional Indian vernaculars.",
    },
    {
        "id": "elderly_investors",
        "name": "Elderly Users",
        "description": "Retirees targeted by impersonation, fake regulator notices, and digital arrest threats.",
    },
    {
        "id": "limited_literacy",
        "name": "Limited Digital/Financial Literacy",
        "description": "Citizens needing plain-language warnings, fraud prevention steps, and official reporting routes.",
    },
]



