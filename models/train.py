"""
NeuralTruth - AI Model Pipeline
File: models/train.py
Fine-tunes DistilRoBERTa on the fake news dataset.
Run: python models/train.py
"""
import os
import torch
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from torch.utils.data import Dataset, DataLoader
from transformers import AutoModelForSequenceClassification, AutoTokenizer, get_linear_schedule_with_warmup
from torch.optim import AdamW
from tqdm import tqdm

from preprocess import load_dataset, NewsTokenizer, clean_text

# ── Config ────────────────────────────────────────────────────────────────────
MODEL_NAME   = "distilroberta-base"
SAVE_PATH    = "./saved_weights"
BATCH_SIZE   = 16
EPOCHS       = 3
LR           = 2e-5
MAX_LEN      = 256
FAKE_CSV     = "../04_data_collection/Fake.csv"
TRUE_CSV     = "../04_data_collection/True.csv"

# ── Dataset ───────────────────────────────────────────────────────────────────
class NewsDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len):
        self.encodings = tokenizer(
            list(texts), padding="max_length",
            truncation=True, max_length=max_len, return_tensors="pt"
        )
        self.labels = torch.tensor(list(labels), dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "input_ids":      self.encodings["input_ids"][idx],
            "attention_mask": self.encodings["attention_mask"][idx],
            "labels":         self.labels[idx],
        }


# ── Training Loop ─────────────────────────────────────────────────────────────
def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Train] Using device: {device}")

    # Load data
    df = load_dataset(FAKE_CSV, TRUE_CSV)
    X_train, X_val, y_train, y_val = train_test_split(
        df["content"].tolist(), df["label"].tolist(), test_size=0.15, random_state=42, stratify=df["label"]
    )

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model     = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2).to(device)

    train_ds = NewsDataset(X_train, y_train, tokenizer, MAX_LEN)
    val_ds   = NewsDataset(X_val,   y_val,   tokenizer, MAX_LEN)

    train_dl = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True,  num_workers=2)
    val_dl   = DataLoader(val_ds,   batch_size=BATCH_SIZE, shuffle=False, num_workers=2)

    optimizer  = AdamW(model.parameters(), lr=LR, weight_decay=0.01)
    total_steps = len(train_dl) * EPOCHS
    scheduler   = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=total_steps // 10, num_training_steps=total_steps)

    best_acc = 0.0
    history  = {"train_loss": [], "val_acc": []}

    for epoch in range(EPOCHS):
        model.train()
        total_loss = 0
        for batch in tqdm(train_dl, desc=f"Epoch {epoch+1}/{EPOCHS}"):
            optimizer.zero_grad()
            out  = model(input_ids=batch["input_ids"].to(device),
                         attention_mask=batch["attention_mask"].to(device),
                         labels=batch["labels"].to(device))
            loss = out.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            total_loss += loss.item()

        avg_loss = total_loss / len(train_dl)

        # Validation
        model.eval()
        preds, targets = [], []
        with torch.no_grad():
            for batch in val_dl:
                out  = model(input_ids=batch["input_ids"].to(device),
                             attention_mask=batch["attention_mask"].to(device))
                logits = out.logits.cpu().numpy()
                preds.extend(np.argmax(logits, axis=1).tolist())
                targets.extend(batch["labels"].numpy().tolist())

        acc = accuracy_score(targets, preds)
        history["train_loss"].append(avg_loss)
        history["val_acc"].append(acc)
        print(f"\n[Epoch {epoch+1}] Loss: {avg_loss:.4f} | Val Acc: {acc*100:.2f}%")
        print(classification_report(targets, preds, target_names=["REAL", "FAKE"]))

        if acc > best_acc:
            best_acc = acc
            os.makedirs(SAVE_PATH, exist_ok=True)
            model.save_pretrained(SAVE_PATH)
            tokenizer.save_pretrained(SAVE_PATH)
            print(f"[Train] ✅ New best model saved to {SAVE_PATH} (acc={acc*100:.2f}%)")

    print(f"\n[Train] Done. Best Accuracy: {best_acc*100:.2f}%")
    return history


if __name__ == "__main__":
    history = train()
