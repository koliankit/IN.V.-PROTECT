# Analysis Result Contract Specification

Every analysis invocation in Sangyan AI Investor Shield returns a structured, strictly validated result contract matching the following schema:

## Contract Fields

1. **`risk_level`** *(enum: string)*
   - `"Low Concern"`: No significant scam signals detected; routine or verified communication.
   - `"Needs Verification"`: Ambiguous claims, unregistered entities, or unverifiable propositions.
   - `"High Concern"`: Multiple high-severity red flags (guaranteed returns, fake regulator endorsements, credential requests, unauthorized trading apps).

2. **`confidence_or_uncertainty`** *(object)*
   - `level`: `"high"` | `"moderate"` | `"uncertain"`
   - `score`: Optional calibrated float between 0.0 and 1.0
   - `uncertainty_note`: Explicit plain-language caveat when evidence is limited (e.g. "Unable to verify unregistered entity from available circulars").

3. **`detected_signals`** *(array of objects)*
   - Red flags identified by rules engine or ML classifier (e.g. `urgency`, `guaranteed_return`, `credential_request`, `payment_request`, `fake_app_link`).

4. **`extracted_claims`** *(array of objects)*
   - Specific factual assertions made in the input (e.g. "Earn 50% weekly", "SEBI approved scheme").

5. **`evidence`** *(array of objects)*
   - Authoritative passages retrieved from SEBI, RBI, I4C, or CERT-In publications backing the findings.
   - Includes `source_id`, `publisher`, `title`, `url`, and exact `passage`.

6. **`explanation`** *(string)*
   - Plain-language, evidence-grounded assessment synthesizing why the message is risky or benign.

7. **`safe_next_steps`** *(array of strings)*
   - Concrete protective actions (e.g., "Do not transfer money", "Verify broker on SEBI Intermediary Portal").

8. **`official_source_links`** *(array of objects)*
   - Direct URLs to statutory verification registers and grievance portals.
