"""
Test Suite for Live Communication Security Layer, Security Inbox, Source Verification,
Preservation, Incident Reporting, and Security Assistant.
"""
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.security_hub import security_hub
from backend.schemas.security_hub import ProtectionTier

client = TestClient(app)


def test_communication_sources_listing_and_honest_states():
    """Verify all 6 communication sources exist with transparent status."""
    res = client.get("/api/communication-sources")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 6

    by_id = {s["id"]: s for s in data}
    assert "INT-EMAIL" in by_id
    assert "INT-SMS" in by_id
    assert "INT-BROWSER" in by_id
    assert "INT-FIN-ALERTS" in by_id
    assert "INT-SCREENSHOTS" in by_id

    # SMS must be honest: NOT CONFIGURED by default
    assert by_id["INT-SMS"]["status"] == "NOT CONFIGURED"
    assert "cannot silently read" in by_id["INT-SMS"]["notes"]


def test_connect_and_disconnect_source():
    """Test connecting and disconnecting sources with zero password entry."""
    # Connect SMS
    res = client.post("/api/communication-sources/INT-SMS/connect", json={"account_identifier": "+91 98765 43210"})
    assert res.status_code == 200
    assert res.json()["status"] == "CONNECTED"

    # Disconnect SMS
    res2 = client.post("/api/communication-sources/INT-SMS/disconnect")
    assert res2.status_code == 200
    assert res2.json()["status"] == "NOT CONFIGURED"


def test_simulate_incoming_communication_pipeline():
    """Test simulating an incoming SMS through the full AI analysis pipeline."""
    payload = {
        "source_channel": "SMS",
        "sender": "VK-DEMATBLOCK",
        "sender_identifier": "+919123456789",
        "claimed_source": "Depository KYC Cell",
        "content": "IMMEDIATE ACTION REQUIRED: Your Demat trading account has been frozen due to KYC non-compliance. Send your 6-digit OTP and trading password to unlock.",
    }
    res = client.post("/api/communication-sources/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["is_demo"] is True
    assert data["protection_tier"] == "Quarantined / High Risk"
    assert data["sender_verification"] == "NOT VERIFIED"
    assert data["claimed_source"] == "Depository KYC Cell"
    assert any("OTP" in s["name"] or "Credential" in s["name"] for s in data["detected_signals"])


def test_message_preservation_actions():
    """Test KEEP, MARK IMPORTANT, and ARCHIVE actions on legitimate communications."""
    # Seeded legitimate message MSG-TRU-001
    res = client.post("/api/messages/MSG-TRU-001/preserve", json={"action": "keep"})
    assert res.status_code == 200
    assert res.json()["success"] is True

    res2 = client.post("/api/messages/MSG-TRU-001/preserve", json={"action": "mark_important"})
    assert res2.status_code == 200
    assert res2.json()["success"] is True

    res3 = client.post("/api/messages/MSG-TRU-001/preserve", json={"action": "archive"})
    assert res3.status_code == 200
    assert res3.json()["success"] is True


def test_incident_report_generation_and_export():
    """Verify structured incident report generation with official evidence citations."""
    res = client.post("/api/messages/MSG-QUAR-001/generate-report", json={"user_action": "Preserved for 1930 reporting"})
    assert res.status_code == 200
    report = res.json()

    assert "IN V PROTECT SECURITY INCIDENT REPORT" in report["title"]
    assert report["incident_id"].startswith("INC-")
    assert report["risk_level"] == "High Concern"
    assert report["official_verification"]["status"] == "NOT VERIFIED"
    assert len(report["evidence"]) > 0
    assert "formatted_text" in report
    assert "1930" in report["formatted_text"]


def test_security_assistant_chat_queries():
    """Verify context-aware chatbot answers grounded in real analyzed data."""
    # 1. Ask about high-risk message
    req1 = {
        "query": "Is this message safe?",
        "current_message_id": "MSG-QUAR-001",
    }
    res1 = client.post("/api/assistant/chat", json=req1)
    assert res1.status_code == 200
    data1 = res1.json()
    assert "NOT SAFE" in data1["response"] or "HIGH RISK" in data1["response"]
    assert data1["context_message_id"] == "MSG-QUAR-001"

    # 2. Ask why it was marked high risk
    req2 = {
        "query": "Why was this marked high risk?",
        "current_message_id": "MSG-QUAR-001",
    }
    res2 = client.post("/api/assistant/chat", json=req2)
    assert res2.status_code == 200
    assert "Analysis Breakdown" in res2.json()["response"]

    # 3. Ask where the message is coming from
    req3 = {
        "query": "Where is this message actually coming from?",
        "current_message_id": "MSG-QUAR-001",
    }
    res3 = client.post("/api/assistant/chat", json=req3)
    assert res3.status_code == 200
    assert "Claimed Source" in res3.json()["response"]

    # 4. Ask for recent threats
    req4 = {
        "query": "Show my recent high-risk messages",
    }
    res4 = client.post("/api/assistant/chat", json=req4)
    assert res4.status_code == 200
    assert "Quarantined" in res4.json()["response"]
