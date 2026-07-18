"""
NeuralTruth - AI Model Pipeline
File: models/preprocess.py
Preprocessing pipeline for fake news detection.
"""
import re
import string
import pandas as pd
from transformers import AutoTokenizer

TOKENIZER_NAME = "distilroberta-base"

def clean_text(text: str) -> str:
    """Clean and normalize text input."""
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)     # remove URLs
    text = re.sub(r"<.*?>+", "", text)                        # remove HTML
    text = re.sub(r"@\w+|#\w+", "", text)                     # remove mentions/hashtags
    text = re.sub(r"\[.*?\]", "", text)                       # remove brackets
    text = re.sub(r"[^\w\s]", " ", text)                      # remove punctuation
    text = re.sub(r"\s+", " ", text).strip()                  # collapse whitespace
    return text


def load_dataset(fake_path: str, true_path: str) -> pd.DataFrame:
    """
    Load and merge Fake/Real news datasets.
    Expects CSVs with 'title' and 'text' columns.
    Compatible with the Kaggle Fake-and-Real-News-Dataset.
    """
    fake_df = pd.read_csv(fake_path)
    true_df = pd.read_csv(true_path)
    fake_df["label"] = 1   # 1 = FAKE
    true_df["label"] = 0   # 0 = REAL

    df = pd.concat([fake_df, true_df], ignore_index=True)
    df["content"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["content"] = df["content"].apply(clean_text)
    df = df[["content", "label"]].dropna().sample(frac=1, random_state=42).reset_index(drop=True)
    print(f"[Preprocess] Dataset loaded: {len(df)} records | Fake: {df.label.sum()} | Real: {(df.label == 0).sum()}")
    return df


class NewsTokenizer:
    """HuggingFace tokenizer wrapper with caching."""

    def __init__(self, model_name: str = TOKENIZER_NAME, max_len: int = 256):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.max_len = max_len

    def encode_batch(self, texts: list[str]) -> dict:
        return self.tokenizer(
            texts,
            padding="max_length",
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt",
        )

    def encode_single(self, text: str) -> dict:
        cleaned = clean_text(text)
        return self.encode_batch([cleaned])
