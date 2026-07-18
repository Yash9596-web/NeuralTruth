"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Zap, BarChart3, Brain, Lock, Search, Globe, ArrowRight, CheckCircle, Activity, Cpu, Eye, GitBranch } from "lucide-react";

const stats = [
  { value: "98.7%", label: "Detection Accuracy" },
  { value: "<500ms", label: "Avg. Latency" },
  { value: "5M+", label: "Articles Analyzed" },
  { value: "3", label: "AI Models" },
];

const features = [
  { icon: Brain, title: "BERT Transformer AI", desc: "Fine-tuned transformer model delivering >98% accuracy on misinformation detection tasks.", color: "cyan" },
  { icon: Shield, title: "Source Credibility", desc: "Real-time trust scoring for news domains with bias detection and historical analysis.", color: "purple" },
  { icon: Search, title: "Claim Verification", desc: "Cross-references 5+ trusted news APIs to verify claims in milliseconds.", color: "green" },
  { icon: Zap, title: "Instant Analysis", desc: "Sub-second AI inference powered by Groq's ultra-fast LPU hardware.", color: "orange" },
  { icon: Globe, title: "URL Scanning", desc: "Paste any URL — we scrape, extract, and analyze the full article automatically.", color: "blue" },
  { icon: Lock, title: "Enterprise Security", desc: "JWT-secured API with rate limiting, audit logs, and SOC 2 compliance.", color: "red" },
];

const pipeline = [
  { step: "01", icon: Eye, label: "Ingest", desc: "Article text or URL submitted" },
  { step: "02", icon: Cpu, label: "Tokenize", desc: "BERT subword tokenization" },
  { step: "03", icon: Brain, label: "Inference", desc: "LLaMA 3.3 70B analysis" },
  { step: "04", icon: Activity, label: "Score", desc: "Confidence & risk rating" },
  { step: "05", icon: GitBranch, label: "Verdict", desc: "FAKE or REAL with reasoning" },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  green: "text-green-400 bg-green-400/10 border-green-400/20",
  orange: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
};

const SAMPLE_HEADLINES = [
  { text: "WHO confirms 40% drop in global disease rates in 2024", verdict: "REAL", conf: 94 },
  { text: "Scientists say drinking bleach cures cancer — government hiding cure", verdict: "FAKE", conf: 99 },
  { text: "Federal Reserve raises interest rates by 0.25% amid inflation concerns", verdict: "REAL", conf: 91 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background orbs - fixed so they don't cause overflow clipping */}
      <div className="fixed top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div className="fixed top-[300px] right-[-150px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(179,71,255,0.1), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      {/* ===== HERO ===== */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-36 pb-24">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="ai-chip mb-8"
        >
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          AI Detection System — Online &amp; Monitoring
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-display font-bold tracking-tighter mb-6 leading-[1.05]"
        >
          Detect Fake News
          <br />
          <span className="gradient-text font-semibold">With Neural Precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mb-10 leading-relaxed"
        >
          Production-grade AI misinformation detection powered by BERT transformers,
          real-time claim verification, and intelligent source credibility scoring.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/analyze" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4">
            <Zap className="w-5 h-5" />
            Start Analyzing Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard" className="btn-ghost flex items-center justify-center gap-2 text-base px-8 py-4">
            <BarChart3 className="w-5 h-5" />
            Live Dashboard
          </Link>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 w-full max-w-3xl"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-[40px] font-display font-bold gradient-text mb-1 tracking-tight">{s.value}</div>
              <div className="text-sm text-slate-400 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== LIVE DEMO PREVIEW ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="hologram-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Live Detection Preview</h2>
              <p className="text-slate-500 text-sm">Real results from our AI pipeline</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-xs text-slate-500">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {SAMPLE_HEADLINES.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between gap-4 glass rounded-xl p-4"
              >
                <p className="text-sm text-slate-300 flex-1">{h.text}</p>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono text-slate-500">{h.conf}%</span>
                  <span className={h.verdict === "FAKE" ? "badge-fake" : "badge-real"}>{h.verdict}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <Link href="/analyze" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
              <Zap className="w-4 h-4" /> Try With Your Own Article
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== AI DETECTION PIPELINE ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="ai-chip mx-auto mb-4 font-mono">Detection Pipeline</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">How The AI Works</h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto">A 5-stage neural processing pipeline from raw text to verified verdict</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pipeline.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center relative"
            >
              <div className="text-xs font-mono text-cyan-500/60 mb-3">{step.step}</div>
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="font-bold text-sm mb-1">{step.label}</div>
              <div className="text-xs text-slate-500">{step.desc}</div>
              {i < pipeline.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-cyan-500/50 to-transparent z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="ai-chip mx-auto mb-4 font-mono">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Everything to Fight Misinformation</h2>
          <p className="text-slate-400 font-light text-lg">A comprehensive AI pipeline from ingestion to verified verdict</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="glass-card p-6 stat-card group"
            >
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colorMap[feat.color]} transition-transform group-hover:scale-110`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== ACCURACY METRICS ===== */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hologram-card p-10"
        >
          <div className="text-center mb-10">
            <div className="ai-chip mx-auto mb-4 font-mono">AI Performance</div>
            <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">Accuracy Metrics</h2>
            <p className="text-slate-400 font-light text-lg">Validated against benchmark datasets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Overall Accuracy", value: 98.7, color: "#00d4ff" },
              { label: "Fake News Recall", value: 97.2, color: "#ff3366" },
              { label: "Real News Precision", value: 99.1, color: "#00ff88" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      whileInView={{ strokeDashoffset: (1 - m.value / 100) * 2 * Math.PI * 42 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                      style={{ filter: `drop-shadow(0 0 6px ${m.color})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-display font-bold tracking-tight" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="hologram-card p-12 text-center stat-card"
        >
          <div className="ai-chip mx-auto mb-5 font-mono">Ready to Start?</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-5 tracking-tight">
            Stop Misinformation <br className="hidden md:block" /><span className="gradient-text font-semibold">Before It Spreads</span>
          </h2>
          <p className="text-slate-300 font-light mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Analyze articles in real-time. Verify claims. Score sources. All in one production-grade AI platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/analyze" className="btn-primary flex justify-center items-center gap-2">
              <Zap className="w-4 h-4" /> Try Live Analyzer
            </Link>
            <Link href="/api-docs" className="btn-ghost flex justify-center items-center gap-2">
              View API Docs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex justify-center items-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free to start</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> API access included</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
