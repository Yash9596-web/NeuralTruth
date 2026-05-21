"""
NeuralTruth - AI Model Pipeline
File: models/evaluate.py
Generates confusion matrix, accuracy graphs and full classification report.
Run: python models/evaluate.py
"""
import os
import torch
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from tqdm import tqdm

from preprocess import load_dataset
from train import NewsDataset

SAVE_PATH = "./saved_weights"
FAKE_CSV  = "../04_data_collection/Fake.csv"
TRUE_CSV  = "../04_data_collection/True.csv"
OUT_DIR   = "../06_eda"
MAX_LEN   = 256
BATCH     = 32


def evaluate():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Evaluate] Loading model from: {SAVE_PATH}")

    tokenizer = AutoTokenizer.from_pretrained(SAVE_PATH)
    model     = AutoModelForSequenceClassification.from_pretrained(SAVE_PATH).to(device)
    model.eval()

    df = load_dataset(FAKE_CSV, TRUE_CSV)
    _, X_val, _, y_val = train_test_split(
        df["content"].tolist(), df["label"].tolist(), test_size=0.15, random_state=42, stratify=df["label"]
    )

    val_ds = NewsDataset(X_val, y_val, tokenizer, MAX_LEN)
    val_dl = DataLoader(val_ds, batch_size=BATCH, shuffle=False)

    preds, targets = [], []
    with torch.no_grad():
        for batch in tqdm(val_dl, desc="Evaluating"):
            out    = model(input_ids=batch["input_ids"].to(device),
                           attention_mask=batch["attention_mask"].to(device))
            logits = out.logits.cpu().numpy()
            preds.extend(np.argmax(logits, axis=1).tolist())
            targets.extend(batch["labels"].numpy().tolist())

    acc = accuracy_score(targets, preds)
    print(f"\n[Evaluate] ✅ Accuracy: {acc*100:.2f}%")
    print(classification_report(targets, preds, target_names=["REAL", "FAKE"]))

    os.makedirs(OUT_DIR, exist_ok=True)

    # ── Confusion Matrix ──────────────────────────────────────────────────────
    cm = confusion_matrix(targets, preds)
    plt.figure(figsize=(7, 5))
    sns.set_style("dark")
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["REAL", "FAKE"], yticklabels=["REAL", "FAKE"],
                linewidths=0.5, linecolor="gray")
    plt.title(f"Confusion Matrix  (Accuracy: {acc*100:.1f}%)", fontsize=14, pad=14)
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "confusion_matrix.png"), dpi=150)
    plt.close()
    print(f"[Evaluate] Confusion matrix saved → {OUT_DIR}/confusion_matrix.png")

    # ── Accuracy Bar ──────────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(5, 3.5))
    bars = ax.bar(["Model Accuracy", "Target (85%)"], [acc * 100, 85],
                  color=["#00d4ff", "#b347ff"], width=0.45, edgecolor="none")
    ax.set_ylim(0, 105)
    ax.set_ylabel("Accuracy (%)")
    ax.set_title("Detection Accuracy vs Target")
    for bar, val in zip(bars, [acc * 100, 85]):
        ax.text(bar.get_x() + bar.get_width() / 2, val + 1.5, f"{val:.1f}%", ha="center", fontsize=11, fontweight="bold")
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "accuracy_chart.png"), dpi=150)
    plt.close()
    print(f"[Evaluate] Accuracy chart saved → {OUT_DIR}/accuracy_chart.png")

    return {"accuracy": acc, "confusion_matrix": cm.tolist()}


if __name__ == "__main__":
    evaluate()
