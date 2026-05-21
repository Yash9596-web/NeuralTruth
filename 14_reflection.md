# Reflection

Building NeuralTruth was a comprehensive exercise in bridging cutting-edge NLP research with production-grade software engineering. The key learnings include:

- **Transfer Learning is powerful:** Fine-tuning a pre-trained transformer on a domain-specific task achieves competitive accuracy without requiring massive compute.
- **Explainability matters:** Simply returning FAKE/REAL is insufficient. Users trust systems more when they understand which parts of an article were suspicious.
- **Systems design is as critical as model accuracy:** The singleton inference pattern, Redis caching, and async FastAPI were as important as the model architecture itself for achieving low latency.
- **Claim verification is hard:** True NLP-based fact-checking requires semantic similarity matching, not just keyword search. The sentence-transformers integration lays the foundation for this next step.
