"""
NeuralTruth - Source Score Router
File: apps/backend/app/api/routes/source.py
"""
from fastapi import APIRouter, HTTPException
from app.services.source_analysis import score_domain
from app.core.logger import logger

router = APIRouter()


@router.get("/source-score/{domain}", summary="Get credibility score for a news domain",
            response_description="Trust score, bias rating, and risk level for the domain")
def get_source_score(domain: str):
    """
    Analyze a news domain for:
    - HTTPS enforcement
    - Domain age (WHOIS)
    - Blacklist membership
    - Whitelist membership
    - Historical reliability

    Returns a trust score from 0–100 and bias/risk labels.
    """
    logger.info(f"[Source] Scoring domain: {domain}")
    try:
        result = score_domain(domain)
        logger.info(f"[Source] {domain} → score={result['trust_score']} risk={result['risk']}")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
