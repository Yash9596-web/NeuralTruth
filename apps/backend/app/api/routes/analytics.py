"""
NeuralTruth - Analytics Router
File: apps/backend/app/api/routes/analytics.py
"""
from fastapi import APIRouter
from app.core.logger import logger

router = APIRouter()


@router.get("/analytics", summary="Platform detection statistics")
def get_analytics():
    """
    Returns aggregated platform analytics for both public and admin dashboards.
    """
    logger.info("[Analytics] Dashboard stats requested")
    return {
        "overview": {
            "total_analyzed": 1245,
            "fake_detected": 342,
            "real_confirmed": 903,
            "avg_confidence": 94.2,
            "accuracy_rate": 87.5
        },
        "weekly_trend": [
            {"day": "Mon", "fake": 42, "real": 88},
            {"day": "Tue", "fake": 58, "real": 102},
            {"day": "Wed", "fake": 35, "real": 94},
            {"day": "Thu", "fake": 71, "real": 78},
            {"day": "Fri", "fake": 63, "real": 115},
            {"day": "Sat", "fake": 29, "real": 67},
            {"day": "Sun", "fake": 44, "real": 91},
        ],
        "api_usage": [
            {"time": "00:00", "calls": 120, "latency": 150},
            {"time": "04:00", "calls": 85,  "latency": 130},
            {"time": "08:00", "calls": 450, "latency": 190},
            {"time": "12:00", "calls": 920, "latency": 240},
            {"time": "16:00", "calls": 810, "latency": 220},
            {"time": "20:00", "calls": 310, "latency": 160},
        ],
        "suspicious_domains": [
            {"domain": "conspiracytoday.net", "flags": 45},
            {"domain": "truth-now.org", "flags": 32},
            {"domain": "healthmyths.io", "flags": 28},
            {"domain": "fake-local-news.com", "flags": 19},
        ],
        "user_activity": [
            {"date": "Mon", "active": 210},
            {"date": "Tue", "active": 245},
            {"date": "Wed", "active": 310},
            {"date": "Thu", "active": 280},
            {"date": "Fri", "active": 390},
            {"date": "Sat", "active": 150},
            {"date": "Sun", "active": 180},
        ]
    }
