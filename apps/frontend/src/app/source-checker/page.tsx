"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Shield, CheckCircle, XCircle } from "lucide-react";

interface SourceResult {
  source: string;
  trust_score: number;
  bias: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  details: { label: string; value: string; ok: boolean }[];
}

const knownSources = [
  { domain: "reuters.com", score: 96, bias: "Neutral", risk: "LOW" },
  { domain: "apnews.com", score: 94, bias: "Neutral", risk: "LOW" },
  { domain: "bbc.com", score: 89, bias: "Moderate", risk: "LOW" },
  { domain: "conspiracyworld.net", score: 12, bias: "High", risk: "HIGH" },
  { domain: "fakealert.io", score: 8, bias: "High", risk: "HIGH" },
];

function TrustMeter({ score }: { score: number }) {
  const color = score > 75 ? "#00ff88" : score > 50 ? "#ffcc00" : "#ff3366";
  return (
    <div className="relative">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>Untrusted</span>
        <span>Trusted</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #ff3366, #ffcc00, #00ff88)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs mt-2">
        <span className="text-slate-600">0</span>
        <span style={{ color }} className="font-bold text-lg">{score}/100</span>
        <span className="text-slate-600">100</span>
      </div>
    </div>
  );
}

export default function SourceCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SourceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const cleaned = domain.replace(/^https?:\/\//, "").split("/")[0];
    try {
      const response = await fetch("/api/source-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleaned }),
      });
      if (!response.ok) throw new Error("Source check failed. Please try again.");
      const res: SourceResult = await response.json();
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3"><span className="gradient-text">Source Credibility Engine</span></h1>
          <p className="text-slate-400">Analyze any news domain&apos;s trustworthiness using AI-powered bias detection &amp; credibility scoring.</p>
        </motion.div>

        {/* Search Box */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.25 }}
          className="glass-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 input-cyber w-full">
              <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
                className="bg-transparent w-full outline-none text-sm placeholder:text-slate-600"
                placeholder="e.g. reuters.com or https://example-news.com"
              />
            </div>
            <button onClick={check} disabled={!domain.trim() || loading}
              className="btn-primary flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed px-6 w-full sm:w-auto py-3">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Scanning..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Result Panel */}
          <div>
            <AnimatePresence mode="wait">
              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4 sm:gap-0">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Domain Analyzed</p>
                      <p className="text-xl font-bold font-mono text-cyan-400 break-all">{result.source}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold w-full sm:w-auto ${result.risk === "LOW" ? "bg-green-500/15 text-green-400 border border-green-500/30" : result.risk === "MEDIUM" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                      {result.risk} RISK
                    </div>
                  </div>

                  <TrustMeter score={result.trust_score} />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/3 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Bias Rating</p>
                      <p className="font-bold text-lg mt-0.5">{result.bias}</p>
                    </div>
                    <div className="bg-white/3 rounded-lg p-3">
                      <p className="text-xs text-slate-500">Trust Score</p>
                      <p className="font-bold text-lg mt-0.5">{result.trust_score}<span className="text-slate-500">/100</span></p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Detail Checks</p>
                    <div className="space-y-2">
                      {result.details.map((d, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-2">
                            {d.ok ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                            <span className="text-sm text-slate-400">{d.label}</span>
                          </div>
                          <span className={`text-xs font-medium ${d.ok ? "text-green-400" : "text-red-400"}`}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {error && !loading && (
                <motion.div key="error" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 flex flex-col items-center justify-center gap-4 min-h-[300px] border-red-500/30">
                  <XCircle className="w-12 h-12 text-red-400" />
                  <p className="text-red-400 font-medium text-center">{error}</p>
                  <p className="text-slate-500 text-xs text-center">Please try a different domain or try again.</p>
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                  <Shield className="w-12 h-12 text-cyan-400/30 animate-pulse" />
                  <p className="text-slate-400">Querying AI for domain reputation...</p>
                  <div className="flex gap-1.5">
                    {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  </div>
                </motion.div>
              )}
              {!result && !loading && !error && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="glass-card p-6 flex flex-col items-center justify-center text-slate-600 gap-3 min-h-[300px]">
                  <Globe className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Enter a domain to begin analysis</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Known Sources Panel */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.25 }} className="glass-card p-6">
            <h2 className="font-bold mb-1">Known Source Directory</h2>
            <p className="text-slate-500 text-xs mb-5">Click a domain to instantly run an AI analysis</p>
            <div className="space-y-3">
              {knownSources.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.04, duration: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => { setDomain(s.domain); }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${s.risk === "LOW" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {s.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium font-mono truncate">{s.domain}</p>
                    <p className="text-xs text-slate-500">{s.bias} Bias</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.risk === "LOW" ? "badge-real" : "badge-fake"}`}>{s.risk}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
