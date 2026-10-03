import io
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from PIL import Image
from fastapi.testclient import TestClient
from backend.main import app

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

client = TestClient(app)

print("=== TESTING IMAGE UPLOAD ENDPOINTS ===")

# 1. Test Valid PNG Image
img = Image.new("RGB", (300, 100), color=(255, 255, 255))
buf = io.BytesIO()
img.save(buf, format="PNG")
buf.seek(0)

res = client.post(
    "/api/analyze-upload",
    files={"file": ("test_sample.png", buf.getvalue(), "image/png")},
    data={"channel": "screenshot", "language": "en"}
)
print(f"Valid Image Upload Status: {res.status_code}")
data = res.json()
print(f"Risk Level: {data.get('risk_level')}")
print(f"Confidence Level: {data.get('confidence_or_uncertainty', {}).get('level')}")
print(f"Uncertainty Note: {data.get('confidence_or_uncertainty', {}).get('uncertainty_note')}")
assert res.status_code == 200, f"Expected 200, got {res.status_code}"
assert data.get('risk_level') in ["Low Concern", "Needs Verification", "High Concern"]

# 2. Test Corrupted Image
corrupt_bytes = b"NOT_A_VALID_IMAGE_DATA_CORRUPT"
res_corrupt = client.post(
    "/api/analyze-upload",
    files={"file": ("corrupt.png", corrupt_bytes, "image/png")}
)
print(f"Corrupt Image Upload Status: {res_corrupt.status_code}")
assert res_corrupt.status_code == 400
print(f"Corrupt Image Detail: {res_corrupt.json()['detail']}")

# 3. Test Empty File
res_empty = client.post(
    "/api/analyze-upload",
    files={"file": ("empty.png", b"", "image/png")}
)
print(f"Empty Image Upload Status: {res_empty.status_code}")
assert res_empty.status_code == 400

# 4. Test Unsupported File Type
res_unsupported = client.post(
    "/api/analyze-upload",
    files={"file": ("malicious.exe", b"MZ...", "application/x-msdownload")}
)
print(f"Unsupported File Status: {res_unsupported.status_code}")
assert res_unsupported.status_code == 400

# 5. Test Alias /api/analyze-image
buf.seek(0)
res_alias = client.post(
    "/api/analyze-image",
    files={"file": ("test_alias.png", buf.getvalue(), "image/png")}
)
print(f"Alias /api/analyze-image Status: {res_alias.status_code}")
assert res_alias.status_code == 200

print("\n[✓] ALL IMAGE UPLOAD / OCR TESTS PASSED SUCCESSFULLY!")
