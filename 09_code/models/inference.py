"""
NeuralTruth - AI Model Pipeline
File: models/inference.py
Production inference pipeline — loads model once, serves predictions low-latency.
Integrated by: apps/backend/app/api/routes/predict.py
"""
import os
import re
import torch
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from typing import Optional

SAVE_PATH  = os.path.join(os.path.dirname(__file__), "saved_weights")
FALLBACK   = "distilroberta-base"   # used when weights not found
MAX_LEN    = 256
LABELS     = {0: "REAL", 1: "FAKE"}
RISK_MAP   = {"FAKE": {(0, 80): "MEDIUM", (80, 101): "HIGH"}, "REAL": {(0, 101): "LOW"}}


def _get_risk(prediction: str, confidence: float) -> str:
    for (lo, hi), risk in RISK_MAP.get(prediction, {}).items():
        if lo <= confidence < hi:
            return risk
    return "MEDIUM"


class FakeNewsDetector:
    """
    Singleton inference class.  Import and call `detector.predict(text)`.
    The model is loaded once at startup for low-latency repeated inference.
    """
    _instance: Optional["FakeNewsDetector"] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        model_path = SAVE_PATH if os.path.isdir(SAVE_PATH) else FALLBACK
        print(f"[Inference] Loading model from: {model_path}")
        self.device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model     = AutoModelForSequenceClassification.from_pretrained(
            model_path, num_labels=2
        ).to(self.device)
        self.model.eval()
        print(f"[Inference] ✅ Model ready on {self.device}")

    # ── Text cleaning ──────────────────────────────────────────────────────────
    @staticmethod
    def _clean(text: str) -> str:
        text = re.sub(r"http\S+|www\S+", "", text.lower())
        text = re.sub(r"[^\w\s]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    # ── Sentence splitter ─────────────────────────────────────────────────────
    @staticmethod
    def _sentences(text: str) -> list[str]:
        return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 20]

    # ── Explainability: suspicious sentences via per-sentence scoring ─────────
    def _find_suspicious(self, sentences: list[str], threshold: float = 0.65) -> list[str]:
        """Score each sentence individually and flag those with high fake probability."""
        suspicious = []
        for sent in sentences:
            enc = self.tokenizer(
                sent, return_tensors="pt", truncation=True,
                max_length=128, padding="max_length"
            )
            with torch.no_grad():
                logits = self.model(
                    input_ids=enc["input_ids"].to(self.device),
                    attention_mask=enc["attention_mask"].to(self.device)
                ).logits
            probs = torch.softmax(logits, dim=-1).cpu().numpy()[0]
            if probs[1] >= threshold:   # index 1 = FAKE probability
                suspicious.append(sent)
        return suspicious

    # ── Main predict ──────────────────────────────────────────────────────────
    def predict(self, text: str) -> dict:
        cleaned   = self._clean(text)
        enc       = self.tokenizer(
            cleaned, return_tensors="pt",
            truncation=True, max_length=MAX_LEN, padding="max_length"
        )
        with torch.no_grad():
            logits = self.model(
                input_ids=enc["input_ids"].to(self.device),
                attention_mask=enc["attention_mask"].to(self.device)
            ).logits

        probs      = torch.softmax(logits, dim=-1).cpu().numpy()[0]
        label_idx  = int(np.argmax(probs))
        confidence = round(float(probs[label_idx]) * 100, 2)
        prediction = LABELS[label_idx]
        risk_level = _get_risk(prediction, confidence)

        sentences   = self._sentences(text)
        suspicious  = self._find_suspicious(sentences) if prediction == "FAKE" and sentences else []

        return {
            "prediction":          prediction,
            "confidence":          confidence,
            "risk_level":          risk_level,
            "suspicious_sentences": suspicious,
        }


# Singleton instance — imported by FastAPI router
detector = FakeNewsDetector()
