import io
import os
import sys
import time
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi.testclient import TestClient
from backend.main import app
from backend.core.sources import official_registry

client = TestClient(app)

print("==================================================================")
print("      SANGYAN AI — EMPIRICAL PERFORMANCE BENCHMARKING             ")
print("==================================================================")

# 1. Measure Text Analysis Response Time
test_text = (
    "LIMITED TIME INVESTMENT OPPORTUNITY. "
    "Invest ₹10,000 today and earn guaranteed returns of ₹50,000 within 7 days. "
    "This opportunity is 100% risk-free and officially approved by SEBI. "
    "To withdraw your profits, you must first pay a ₹2,500 processing fee. "
    "Offer expires tonight. Send the payment immediately."
)

latencies_text = []
for _ in range(10):
    t0 = time.perf_counter()
    r = client.post("/api/analyze", json={"text": test_text, "channel": "whatsapp"})
    elapsed = (time.perf_counter() - t0) * 1000
    assert r.status_code == 200
    latencies_text.append(elapsed)

avg_text = sum(latencies_text) / len(latencies_text)
min_text = min(latencies_text)
max_text = max(latencies_text)
print(f"1. Text Analysis Latency (10 runs):")
print(f"   Average: {avg_text:.2f} ms | Min: {min_text:.2f} ms | Max: {max_text:.2f} ms")

# 2. Measure URL Analysis Response Time
test_url = "http://sebi-verification.top/terminal.apk"
latencies_url = []
for _ in range(10):
    t0 = time.perf_counter()
    r = client.post("/api/analyze-url", json={"url": test_url})
    elapsed = (time.perf_counter() - t0) * 1000
    assert r.status_code == 200
    latencies_url.append(elapsed)

avg_url = sum(latencies_url) / len(latencies_url)
min_url = min(latencies_url)
max_url = max(latencies_url)
print(f"\n2. URL Analysis Latency (10 runs):")
print(f"   Average: {avg_url:.2f} ms | Min: {min_url:.2f} ms | Max: {max_url:.2f} ms")

# 3. Measure Screenshot / Image Upload Latency
img = Image.new("RGB", (400, 200), color=(250, 250, 250))
buf = io.BytesIO()
img.save(buf, format="PNG")
img_bytes = buf.getvalue()

latencies_img = []
for _ in range(10):
    t0 = time.perf_counter()
    r = client.post(
        "/api/analyze-upload",
        files={"file": ("bench_screenshot.png", img_bytes, "image/png")},
        data={"channel": "screenshot", "language": "en"}
    )
    elapsed = (time.perf_counter() - t0) * 1000
    assert r.status_code == 200
    latencies_img.append(elapsed)

avg_img = sum(latencies_img) / len(latencies_img)
min_img = min(latencies_img)
max_img = max(latencies_img)
print(f"\n3. Screenshot / OCR Upload Latency (10 runs):")
print(f"   Average: {avg_img:.2f} ms | Min: {min_img:.2f} ms | Max: {max_img:.2f} ms")

# 4. Measure Evidence Retrieval & Source Lookup Latency
latencies_rag = []
source_ids = ["SRC001", "SRC002", "SRC003", "SRC004", "SRC005", "SRC006", "SRC007", "SRC008"]
for s_id in source_ids * 3:
    t0 = time.perf_counter()
    src = official_registry.get_source(s_id)
    filtered = official_registry.filter_by_publisher("SEBI")
    elapsed = (time.perf_counter() - t0) * 1000
    latencies_rag.append(elapsed)

avg_rag = sum(latencies_rag) / len(latencies_rag)
min_rag = min(latencies_rag)
max_rag = max(latencies_rag)
print(f"\n4. Evidence Retrieval / Source Lookup Latency ({len(latencies_rag)} runs):")
print(f"   Average: {avg_rag:.4f} ms | Min: {min_rag:.4f} ms | Max: {max_rag:.4f} ms")

print("\n==================================================================")
print("             PERFORMANCE BENCHMARK COMPLETE                       ")
print("==================================================================")
