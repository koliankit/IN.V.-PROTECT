# Claim Extraction Engine Architecture (Layer 043)

## 1. Overview
The **Claim Extraction Engine** is the entry gateway for analyzing user-submitted content in the **Sangyan AI Investor Shield** pipeline. When an investor submits text from messaging apps (Telegram, WhatsApp), SMS, emails, social media posts, or text transcribed via OCR from screenshots, the engine decomposes the unstructured text into distinct, atomic, verifiable factual claims.

---

## 2. Core Responsibilities
1. **Discourse Segmentation**:
   - Parses multi-sentence, multi-line, and emoji-laden user submissions into candidate discourse units.
   - Retains exact character offsets `(start, end)` relative to the original raw text to ensure full traceability and UI highlighting.
2. **Conversational Noise Filtering**:
   - Identifies and excludes greetings ("Hello sir", "Good morning"), pleasantries ("Hope you are well"), rhetorical questions ("Are you interested?"), and sign-offs ("Thanks and regards").
   - Ensures downstream RAG retrieval and stance detection are not poisoned by non-assertive conversational chatter.
3. **Factual Claim Detection**:
   - Identifies verifiable statements asserting:
     - Guaranteed or promised returns / profits.
     - Regulatory approvals, endorsements, or registrations (SEBI, RBI, NSE, BSE, CERT-In).
     - Fee / tax / margin payment requirements for fund withdrawal.
     - Account suspension, demat freeze, or urgent KYC deactivation threats.
     - Insider calls, upper circuit guarantees, or exclusive VIP quota claims.
     - Artificial urgency or limited slot availability.
4. **Entity & Keyword Identification**:
   - Surfaces referenced percentages, financial amounts, regulatory bodies, and registration identifiers.
5. **Deterministic Claim Provenance**:
   - Each claim receives a deterministic identifier `CLM-<hash>` derived from its content and text offset.

---

## 3. Supported Input Channels
- `telegram`: Forwarded channel messages, VIP groups, admin DMs.
- `whatsapp`: Group forwards, broadcast messages, unverified business accounts.
- `sms`: KYC urgency alerts, transaction failure notices, stock tip broadcasts.
- `ocr`: Text extracted from screenshot images of apps, chats, or fake certificates.
- `web`: Ad copy, landing page claims, promotional articles.

---

## 4. Interaction with Downstream Layers
- **Layer 044 (Claim types)**: Enriches and refines the granular classification taxonomy.
- **Layer 045 (Entity extraction)**: Conducts deep NER for phone numbers, URLs, APK names, and UPI handles.
- **Layer 046 (PII protection)**: Sanitizes personal identifiable information before persistence.
- **Layer 050+ (Evidence Retrieval & Stance Detection)**: Matches extracted claims against authoritative regulatory chunks from SEBI, RBI, I4C, and CERT-In.

---

## 5. CLI Usage
```bash
# Dry run verification
python scripts/extract_claims.py --dry-run

# Run on custom text
python scripts/extract_claims.py --text "Join our VIP group for guaranteed 50% profit. SEBI approved INA00012345."

# Output JSON
python scripts/extract_claims.py --text "Pay Rs 5,000 to withdraw funds" --json
```
