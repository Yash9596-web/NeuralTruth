// NeuralTruth Background Service Worker
// Handles installation events and keeps the extension service worker active when needed.

chrome.runtime.onInstalled.addListener(() => {
  console.log("NeuralTruth Fake News Detector installed.");
});

// Since we are using Manifest V3, we don't use persistent background pages.
// The core logic resides in popup.js, which wakes up when the user clicks the extension icon.
// The content script (content.js) will handle the DOM manipulation (highlighting).
