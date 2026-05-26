"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Link2, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Shield, Activity, Brain, FileText } from "lucide-react";

type TabType = "text" | "url";
type Prediction = "FAKE" | "REAL" | null;

interface AnalysisResult {
  prediction: Prediction;
  confidence: number;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  suspicious_sentences: string[];
  reasoning?: string;
  web_searched?: boolean;
}

function RiskMeter({ level, confidence }: { level: string; confidence: number }) {
  const colors = { HIGH: "#ff3366", MEDIUM: "#ffcc00", LOW: "#00ff88" };
  const color = colors[level as keyof typeof colors] || "#00d4ff";
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">Risk Level</span>
        <span className="text-sm font-bold px-2 py-0.5 rounded" style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}>{level}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #00ff88, #ffcc00, #ff3366)" }}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
}

function ConfidenceRing({ confidence, prediction }: { confidence: number; prediction: Prediction }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;
  const color = prediction === "FAKE" ? "#ff3366" : "#00ff88";
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-black" style={{ color }}>{confidence}%</span>
          <span className="text-xs text-slate-500 mt-1">confidence</span>
        </div>
      </div>
      {prediction === "FAKE"
        ? <span className="badge-fake text-sm">FAKE NEWS</span>
        : <span className="badge-real text-sm">REAL NEWS</span>
      }
    </div>
  );
}

function ScanAnimation() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 h-full min-h-[300px]">
      {/* Rotating rings */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-rotate-medium" style={{ borderTopColor: "#00d4ff" }} />
        <div className="absolute inset-3 rounded-full border-2 border-purple-500/20" style={{ animation: "rotate-slow 8s linear infinite reverse", borderTopColor: "#b347ff" }} />
        <div className="absolute inset-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-slate-200 font-semibold mb-1">Analyzing Article</p>
        <p className="text-slate-500 text-sm">Running AI inference pipeline...</p>
      </div>
      <div className="w-full max-w-xs space-y-3">
        {["Tokenizing input...", "Running LLaMA 3.3 inference...", "Scoring source credibility..."].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-neon flex-shrink-0" style={{ animationDelay: `${i * 0.5}s` }} />
            <span className="text-xs text-slate-500">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const [tab, setTab] = useState<TabType>("text");
  const [input, setInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuspicious, setShowSuspicious] = useState(true);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Analysis failed. Please try again.");
      }
      const res: AnalysisResult = await response.json();
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (ev) => setInput(ev.target?.result as string);
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative">
      {/* Background orbs */}
      <div className="fixed top-0 left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div className="fixed bottom-0 right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(179,71,255,0.08), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-12"
        >
          <div className="ai-chip mx-auto mb-5">
            <Brain className="w-3.5 h-3.5" /> AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4">
            <span className="gradient-text">Live News Analyzer</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Paste article text or a URL — get an instant AI verdict powered by LLaMA 3.3 70B.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="hologram-card p-6"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-5 bg-white/4 rounded-xl p-1.5">
              {(["text", "url"] as TabType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setInput(""); setResult(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    tab === t
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/35 shadow-lg"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t === "text" ? <><FileText className="w-4 h-4" /> Article Text</> : <><Link2 className="w-4 h-4" /> Article URL</>}
                </button>
              ))}
            </div>

            {tab === "text" ? (
              <div
                className={`drop-zone p-1 mb-5 scan-container ${isDragging ? "drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                {loading && <div className="scan-beam" />}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input-cyber w-full min-h-[240px] resize-y border-0 focus:border-0 focus:ring-0 bg-transparent rounded-xl"
                  placeholder="Paste article text here, or drag & drop a .txt file..."
                />
              </div>
            ) : (
              <div className="mb-5">
                <div className="input-cyber flex items-center gap-3">
                  <Link2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <input
                    type="url"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm placeholder:text-slate-600"
                    placeholder="https://example-news.com/article"
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2 ml-1">We&apos;ll scrape and analyze the full article content.</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={analyze}
                disabled={!input.trim() || loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Analyze Now</>
                )}
              </button>
              <button
                onClick={() => { setInput(""); setResult(null); setError(null); }}
                className="btn-ghost px-5"
              >
                Clear
              </button>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["LLaMA 3.3 70B", "Sub-500ms", "Source Scoring"].map((tag) => (
                <span key={tag} className="ai-chip text-xs">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.35 }}
          >
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hologram-card p-8 h-full">
                  <ScanAnimation />
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="hologram-card p-6 space-y-6"
                >
                  {/* Verdict Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/6">
                    <div className="flex flex-col sm:items-start items-center text-center sm:text-left flex-1">
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">AI Verdict</p>
                      {result.prediction === "FAKE" ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-7 h-7 text-red-400" />
                          <span className="text-2xl font-display font-black text-red-400">FAKE NEWS</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-7 h-7 text-green-400" />
                          <span className="text-2xl font-display font-black text-green-400">REAL NEWS</span>
                        </div>
                      )}
                    </div>
                    <ConfidenceRing confidence={result.confidence} prediction={result.prediction} />
                  </div>

                  <RiskMeter level={result.risk_level} confidence={result.confidence} />

                  {/* Source credibility indicator */}
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-cyan-400">Source Credibility</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-400"
                          initial={{ width: 0 }}
                          animate={{ width: result.prediction === "REAL" ? "80%" : "25%" }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-sm font-mono text-slate-400">
                        {result.prediction === "REAL" ? "High" : "Low"}
                      </span>
                    </div>
                  </div>

                  {/* Suspicious sentences */}
                  {result.suspicious_sentences.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowSuspicious(!showSuspicious)}
                        className="flex items-center gap-2 text-sm font-semibold text-orange-400 mb-3 w-full hover:text-orange-300 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {result.suspicious_sentences.length} Suspicious Sentences
                        {showSuspicious ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                      </button>
                      <AnimatePresence>
                        {showSuspicious && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2">
                              {result.suspicious_sentences.map((s, i) => (
                                <div key={i} className="p-3 rounded-xl bg-red-500/6 border border-red-500/20 text-sm text-slate-300">
                                  <span className="suspicious-highlight">{s}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* AI Reasoning */}
                  {result.reasoning && (
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">AI Reasoning</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{result.reasoning}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-xs text-slate-600">LLaMA 3.3 70B via Groq</span>
                    </div>
                    {result.web_searched && (
                      <div className="flex items-center gap-1.5 text-xs text-cyan-500/70">
                        <Shield className="w-3 h-3" />
                        Web-verified
                      </div>
                    )}
                    {!result.web_searched && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Shield className="w-3 h-3" />
                        No web key — AI only
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hologram-card p-8 flex flex-col items-center justify-center gap-4 min-h-[300px] border-red-500/30"
                >
                  <XCircle className="w-14 h-14 text-red-400 opacity-80" />
                  <p className="text-red-400 font-semibold text-center">{error}</p>
                  <p className="text-slate-500 text-sm text-center">Please check your input and try again.</p>
                </motion.div>
              )}

              {!result && !loading && !error && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                  className="hologram-card p-8 h-full flex flex-col items-center justify-center text-slate-600 gap-4 min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-full bg-white/3 flex items-center justify-center">
                    <Brain className="w-9 h-9 opacity-40" />
                  </div>
                  <p className="text-sm">AI analysis results will appear here</p>
                  <p className="text-xs text-slate-700">Enter article text or a URL to begin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
