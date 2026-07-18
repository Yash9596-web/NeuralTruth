import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_analytics_api():
    response = client.get("/api/v1/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "overview" in data
    assert "api_usage" in data

def test_source_score_api():
    response = client.get("/api/v1/source-score/nytimes.com")
    assert response.status_code == 200
    data = response.json()
    assert "trust_score" in data
    assert "bias" in data
    assert "risk" in data

def test_predict_api_empty_text():
    response = client.post("/api/v1/predict", json={"text": ""})
    assert response.status_code == 422  # Unprocessable Entity
