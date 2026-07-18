# Model Approach

## Architecture
- **Model:** `distilroberta-base` (Groq Model)
- **Task:** Binary sequence classification (0=REAL, 1=FAKE)
- **Classification head:** Linear layer on top of [CLS] token output
- **Parameters:** ~82M (vs. 110M for full BERT-base)

## Training
- **Optimizer:** AdamW (lr=2e-5, weight_decay=0.01)
- **Scheduler:** Linear warmup with 10% warmup steps
- **Batch Size:** 16
- **Epochs:** 3
- **Max Sequence Length:** 256 tokens

## Explainability
- **Method:** Per-sentence probability scoring
- Sentences with FAKE probability > 0.65 are flagged as suspicious
- Returns `suspicious_sentences[]` in the API response

## Scripts
- `models/train.py` — Fine-tuning loop
- `models/evaluate.py` — Metrics and plots
- `models/inference.py` — Production inference singleton
