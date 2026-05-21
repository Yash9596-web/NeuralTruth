import os
import torch
from transformers import AutoModelForSequenceClassification

SAVE_PATH = "./saved_weights"
QUANTIZED_PATH = "./quantized_weights"

def optimize_model():
    print("[Optimize] Loading pre-trained DistilRoBERTa model...")
    if not os.path.exists(SAVE_PATH):
        print(f"[Optimize] Error: {SAVE_PATH} not found. Train the model first.")
        return

    model = AutoModelForSequenceClassification.from_pretrained(SAVE_PATH)
    
    print("[Optimize] Applying dynamic PyTorch quantization (qint8)...")
    # Quantize the Linear layers to 8-bit integers
    quantized_model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear}, dtype=torch.qint8
    )
    
    os.makedirs(QUANTIZED_PATH, exist_ok=True)
    quantized_model.save_pretrained(QUANTIZED_PATH)
    
    orig_size = os.path.getsize(os.path.join(SAVE_PATH, "pytorch_model.bin")) / (1024 * 1024)
    quant_size = os.path.getsize(os.path.join(QUANTIZED_PATH, "pytorch_model.bin")) / (1024 * 1024)
    
    print(f"[Optimize] Optimization Complete!")
    print(f"[Optimize] Original Model Size: {orig_size:.2f} MB")
    print(f"[Optimize] Quantized Model Size: {quant_size:.2f} MB")
    print(f"[Optimize] Estimated Latency Reduction: 40-50% on CPU")

if __name__ == "__main__":
    optimize_model()
