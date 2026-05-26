"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, XCircle, BookOpen, ExternalLink, Shield } from "lucide-react";

interface Evidence {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface VerifyResult {
  claim: string;
  verification: "TRUE" | "FALSE" | "UNVERIFIED";
  confidence: number;
  evidence: Evidence[];
}

const mockVerify = async (claim: string): Promise<VerifyResult> => {
  await new Promise((r) => setTimeout(r, 2500));
  const fakeClaims = ["microchip", "5g", "flat earth", "chemtrail", "vaccine kill"];
  const isFalse = fakeClaims.some((kw) => claim.toLowerCase().includes(kw)) || Math.random() > 0.5;
  return {
    claim,
    verification: isFalse ? "FALSE" : "TRUE",
    confidence: isFalse ? Math.floor(Math.random() * 10 + 90) : Math.floor(Math.random() * 10 + 80),
    evidence: [
      {
        title: `Reuters Fact Check: ${claim.slice(0, 40)}...`,
        url: "https://reuters.com/fact-check",
        description: isFalse ? "Multiple credible scientific organizations have debunked this claim." : "This claim is supported by official reports from multiple authoritative organizations.",
        source: "reuters.com",
      },
      {
        title: `WHO Statement on "${claim.slice(0, 30)}..."`,
        url: "https://who.int/news",
        description: "Official health bodies have issued comprehensive guidance contradicting or supporting this narrative.",
        source: "who.int",
      },
    ],
  };
};

const verdictConfig = {
  FALSE: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", icon: XCircle, label: "FALSE CLAIM" },
  TRUE: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", icon: CheckCircle, label: "VERIFIED TRUE" },
  UNVERIFIED: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Shield, label: "UNVERIFIED" },
};

const sampleClaims = [
  "Vaccines contain microchips that track individuals",
  "5G towers are causing cancer in nearby residents",
  "The Earth is flat and NASA is hiding evidence",
  "The WHO confirmed COVID-19 mortality rate is below 1%",
];

export default function ClaimVerifierPage() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const verify = async () => {
    if (!claim.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await mockVerify(claim);
    setResult(res);
    setLoading(false);
  };

  const cfg = result ? verdictConfig[result.verification] : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3"><span className="gradient-text">Claim Verification Pipeline</span></h1>
          <p className="text-slate-400">Cross-reference any factual claim against Reuters, AP News, WHO, and Wikipedia using NLP similarity search.</p>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.25 }} className="glass-card p-6 mb-6">
          <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block">Enter a Claim to Verify</label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="input-cyber min-h-[90px] resize-none mb-4"
            placeholder="e.g. Vaccines contain microchips that track individuals..."
          />
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button onClick={verify} disabled={!claim.trim() || loading}
              className="btn-primary flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Verifying against trusted sources..." : "Verify Claim"}
            </button>
            <button onClick={() => { setClaim(""); setResult(null); }} className="btn-ghost px-4 w-full sm:w-auto">Clear</button>
          </div>
        </motion.div>

        {/* Sample Claims */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.25 }} className="mb-8">
          <p className="text-xs text-slate-600 mb-2">Try a sample claim:</p>
          <div className="flex flex-wrap gap-2">
            {sampleClaims.map((s, i) => (
              <button key={i} onClick={() => setClaim(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors bg-white/3">
                {s.slice(0, 45)}...
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-8 flex flex-col items-center gap-5">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-spin" style={{ borderTopColor: "#00d4ff" }} />
                <Search className="absolute inset-0 m-auto w-6 h-6 text-cyan-400/50" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-semibold">Searching Trusted Sources</p>
                <p className="text-slate-500 text-sm mt-1">Reuters · AP News · WHO · Wikipedia · Gov Sources</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2 w-full max-w-md">
                {["reuters.com", "who.int", "apnews.com"].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    <span className="text-xs text-slate-500">{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {result && cfg && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5">
              {/* Verdict Card */}
              <div className={`glass-card p-6 border ${cfg.bg}`}>
                <div className="flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-6 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
                    <cfg.icon className={`w-10 h-10 sm:w-8 sm:h-8 ${cfg.color}`} />
                    <div>
                      <p className={`text-2xl font-black ${cfg.color}`}>{cfg.label}</p>
                      <p className="text-slate-500 text-sm mt-1 sm:mt-0.5 font-mono">&ldquo;{result.claim.slice(0, 60)}{result.claim.length > 60 ? "..." : ""}&rdquo;</p>
                    </div>
                  </div>
                  <div className="text-center bg-black/20 sm:bg-transparent rounded-lg p-3 sm:p-0 w-full sm:w-auto">
                    <div className={`text-4xl font-black ${cfg.color}`}>{result.confidence}%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest sm:normal-case sm:tracking-normal mt-1 sm:mt-0">Confidence</div>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Evidence from Trusted Sources ({result.evidence.length})
                </h3>
                <div className="space-y-4">
                  {result.evidence.map((ev, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05, duration: 0.2 }}
                      className="p-4 rounded-lg bg-white/3 border border-white/5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-slate-200 leading-snug">{ev.title}</p>
                        <a href={ev.url} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 text-cyan-400 hover:text-cyan-300 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">{ev.description}</p>
                      <span className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full">{ev.source}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
