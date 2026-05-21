# Benchmark Report

## 1. Model Latency & Optimization
- **Baseline Model:** DistilRoBERTa (`distilroberta-base`)
- **Baseline Latency:** ~350ms per request (CPU)
- **Optimization Strategy:** PyTorch Dynamic Quantization (`torch.qint8`)
- **Optimized Latency:** ~180ms per request (CPU)
- **Model Size Reduction:** 328 MB → 175 MB (46% reduction)

## 2. API Load Testing
Executed via `scripts/load_test.py` simulating concurrent users.

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| API Response Time | < 2.0 sec | 0.18 sec | ✅ PASSED |
| Concurrent Requests | 50 req/sec | 50 req/sec | ✅ PASSED |
| Success Rate | 100% | 100% | ✅ PASSED |

## 3. Model Accuracy
Evaluated on the Kaggle Fake News testing split (`06_eda/accuracy_chart.png`).

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| Accuracy | > 85% | 88.1% | ✅ PASSED |
| F1-Score | - | 0.87 | - |
