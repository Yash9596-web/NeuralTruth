// NeuralTruth Content Script
// Highlights suspicious sentences found by the extension popup on the page.

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "HIGHLIGHT_SUSPICIOUS") {
    const sentences = msg.sentences || [];
    sentences.forEach(s => {
      const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex   = new RegExp(escaped, "gi");
      document.body.innerHTML = document.body.innerHTML.replace(regex,
        `<mark style="background:rgba(255,51,102,0.2);border-bottom:2px solid #ff3366;border-radius:3px;padding:0 2px;">${s}</mark>`
      );
    });
    sendResponse({ ok: true });
  }
});
