# Preprocessing Notes

## Pipeline
1. Load Fake.csv and True.csv from `04_data_collection/`
2. Concatenate and assign labels (1=FAKE, 0=REAL)
3. Merge title + text into a single `content` column
4. Apply `clean_text()`:
   - Lowercase
   - Strip URLs, HTML, mentions, hashtags
   - Remove punctuation
   - Collapse whitespace
5. Tokenize using `distilroberta-base` tokenizer (max_len=256)
6. 85/15 stratified train/val split

## Script
`models/preprocess.py`
