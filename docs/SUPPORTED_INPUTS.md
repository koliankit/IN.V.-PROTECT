# Supported Input Modalities & Fallback Specifications

Sangyan AI Investor Shield supports multiple input modalities to maximize accessibility for non-technical users while ensuring system resilience:

## 1. Plain Text Input (`plain_text`)
- **Nature**: Direct short statements, questions, or suspicious propositions typed directly into the search bar.
- **Processing**: Instant text normalization, regex entity extraction, heuristic rule evaluation, and ML scoring.
- **Availability**: Core mandatory pathway; zero external network dependencies.

## 2. Pasted Message (`pasted_message`)
- **Nature**: Multi-line forwarded messages from WhatsApp, Telegram channels, SMS blasts, or email solicitation.
- **Processing**: Header stripping, whitespace normalization, URL extraction, phone/UPI extraction, and PII masking.
- **Availability**: Core mandatory pathway.

## 3. Screenshot & Image Upload (`screenshot_image`)
- **Nature**: Image files (`.png`, `.jpg`, `.jpeg`, `.webp`) of social media posts, trading terminal screenshots, or chat dialogs.
- **Processing**: Image validation, contrast adjustment, Tesseract OCR with character confidence scoring.
- **Fallback**: If OCR confidence falls below the threshold (or OCR is unavailable), the system requests a clearer image or allows manual text paste without crashing.

## 4. Public Web URL (`public_url`)
- **Nature**: Direct link to suspected trading portals, APK download landing pages, or advisory blogs.
- **Processing**: Syntactic parsing, domain reputation / lexical heuristic analysis, safe metadata extraction.
- **Resilience Fallback**: If external web retrieval is blocked, rate-limited, or offline, the system gracefully falls back to URL string heuristics without blocking user interaction.
