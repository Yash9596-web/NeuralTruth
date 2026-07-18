const API_BASE = "http://localhost:8000/api/v1";

// ── Tab switching ─────────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const name = tab.dataset.tab;
    document.getElementById("panel-page").style.display = name === "page" ? "" : "none";
    document.getElementById("panel-text").style.display = name === "text" ? "" : "none";
    clearStates();
  });
});

function clearStates() {
  ["state-loading", "state-result", "state-error"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
}

function showLoading() {
  clearStates();
  document.getElementById("state-loading").style.display = "";
}

function showError(msg) {
  clearStates();
  const el = document.getElementById("state-error");
  el.textContent = "⚠ " + msg;
  el.style.display = "";
}

function showResult(data) {
  clearStates();
  const isFake = data.prediction === "FAKE";
  const color  = isFake ? "#ff3366" : "#00ff88";

  let html = `
    <div class="verdict-card ${isFake ? "fake" : "real"}">
      <div>
        <div style="font-size:11px;color:#64748b;margin-bottom:3px;">VERDICT</div>
        <div class="verdict-label">${data.prediction} NEWS</div>
        <div style="font-size:11px;color:#94a3b8;margin-top:3px;">Risk: <strong style="color:${color}">${data.risk_level}</strong></div>
      </div>
      <div class="confidence-ring" style="color:${color}">
        ${data.confidence}%
        <div class="conf-sub">confidence</div>
      </div>
    </div>

    <div class="risk-bar-wrap" style="margin-top:10px;">
      <div class="risk-label"><span>Safe</span><span>Risky</span></div>
      <div class="risk-bar" style="width:100%;"></div>
    </div>
  `;

  if (data.suspicious_sentences && data.suspicious_sentences.length > 0) {
    html += `<div class="suspicious-section">
      <div class="suspicious-title">⚠ ${data.suspicious_sentences.length} Suspicious Sentence(s)</div>`;
    data.suspicious_sentences.forEach(s => {
      html += `<div class="suspicious-item">${s}</div>`;
    });
    html += `</div>`;
  }

  const el = document.getElementById("state-result");
  el.innerHTML = html;
  el.style.display = "";
}

// ── Analyze text ──────────────────────────────────────────────────────────────
async function analyzeText(text) {
  if (!text || text.trim().length < 10) {
    showError("Please enter at least 10 characters of text.");
    return;
  }
  showLoading();
  try {
    const res  = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() })
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showError("Cannot connect to NeuralTruth API. Make sure the backend is running on localhost:8000.");
  }
}

// ── Analyze current page via content script ───────────────────────────────────
document.getElementById("btn-page").addEventListener("click", async () => {
  showLoading();
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const article = document.querySelector("article");
        if (article) return article.innerText.slice(0, 4000);
        const paragraphs = [...document.querySelectorAll("p")];
        return paragraphs.map(p => p.innerText).join(" ").slice(0, 4000);
      }
    });
    const text = results[0]?.result || "";
    if (!text) { showError("Could not extract article text from this page."); return; }
    await analyzeText(text);
  } catch (err) {
    showError("Could not access page content: " + err.message);
  }
});

// ── Analyze custom text ───────────────────────────────────────────────────────
document.getElementById("btn-text").addEventListener("click", async () => {
  const text = document.getElementById("custom-text").value;
  await analyzeText(text);
});
