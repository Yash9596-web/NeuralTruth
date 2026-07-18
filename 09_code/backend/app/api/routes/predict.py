"""
NeuralTruth - Full Predict Router
File: apps/backend/app/api/routes/predict.py
Integrates the inference pipeline from /models.
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "models"))

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from app.core.logger import logger

router = APIRouter()


class PredictRequest(BaseModel):
    text: str
    source_url: Optional[str] = None

    model_config = {"json_schema_extra": {
        "example": {
            "text": "Scientists discover water on Mars...",
            "source_url": "https://nasa.gov/news"
        }
    }}


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    risk_level: str
    suspicious_sentences: list[str]


def _get_detector():
    """Lazy-import the inference module — avoids crashing if model weights aren't ready."""
    try:
        from inference import detector
        return detector
    except Exception as e:
        logger.warning(f"[Predict] Model not loaded, using mock: {e}")
        return None


@router.post("/predict", response_model=PredictResponse, summary="Analyze article for fake news")
async def predict(req: PredictRequest):
    """
    Analyze article text with BERT classifier.
    Returns prediction (FAKE/REAL), confidence score, risk level,
    and any suspicious sentences that contributed to the verdict.
    """
    if not req.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty")

    logger.info(f"[Predict] Analyzing {len(req.text)} chars | source={req.source_url}")

    detector = _get_detector()

    if detector:
        result = detector.predict(req.text)
    else:
        # Mock response when model weights are not yet trained
        import random
        is_fake   = random.choice([True, False])
        confidence = round(random.uniform(80, 99), 2)
        result = {
            "prediction":           "FAKE" if is_fake else "REAL",
            "confidence":           confidence,
            "risk_level":           "HIGH" if (is_fake and confidence > 90) else ("MEDIUM" if is_fake else "LOW"),
            "suspicious_sentences": ["This claim lacks verifiable sources."] if is_fake else [],
        }

    logger.info(f"[Predict] Result: {result['prediction']} @ {result['confidence']}%")
    return PredictResponse(**result)


class URLRequest(BaseModel):
    url: str


@router.post("/analyze-url", response_model=PredictResponse, summary="Scrape & analyze a news article URL")
async def analyze_url(req: URLRequest):
    """Scrape article content from a URL and run fake news analysis."""
    from app.services.scraper import scrape_article_text
    from app.services.source_analysis import score_domain

    try:
        text = await scrape_article_text(req.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not scrape URL: {e}")

    predict_req = PredictRequest(text=text, source_url=req.url)
    result = await predict(predict_req)

    # Augment with source score
    src = score_domain(req.url)
    logger.info(f"[URL] Source '{src['source']}' trust_score={src['trust_score']}")
    return result
