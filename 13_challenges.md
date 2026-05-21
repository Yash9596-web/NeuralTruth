# Challenges Faced

1. **Model latency vs accuracy trade-off:** Full BERT was too slow for real-time use. Migrated to DistilRoBERTa for production.
2. **URL scraping diversity:** News sites have wildly different HTML structures, making generic scraping brittle. Implemented multi-strategy extraction (article tag → paragraph fallback).
3. **Class imbalance in datasets:** Real news dominated some datasets. Applied stratified sampling during train/val split.
4. **Browser extension CSP restrictions:** Manifest V3 removed background page; migrated to service workers for persistent state.
5. **Cold-start model loading:** Loading BERT weights on every request was prohibitive. Implemented a singleton pattern for the inference pipeline.
