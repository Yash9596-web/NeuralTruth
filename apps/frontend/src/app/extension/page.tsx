"use client";
import { motion } from "framer-motion";
import { Puzzle, Shield, Zap, Globe, CheckCircle, ArrowRight, Download } from "lucide-react";

const steps = [
  { num: "01", title: "Install Extension", desc: "Download from the Chrome Web Store or load as unpacked extension in Chrome.", icon: Download },
  { num: "02", title: "Browse Normally", desc: "Navigate to any news site or social media feed. The extension monitors page content.", icon: Globe },
  { num: "03", title: "Instant Analysis", desc: "Click the NeuralTruth icon to analyze the current page or highlighted text.", icon: Zap },
  { num: "04", title: "Get the Verdict", desc: "See the FAKE/REAL verdict with confidence score and suspicious sentence highlights.", icon: Shield },
];

const features = [
  "One-click analysis of current page",
  "Highlight suspicious sentences inline",
  "Source credibility score in popup",
  "Claim verification via trusted sources",
  "Works on Twitter, Facebook, Reddit",
  "Respects privacy — no data stored",
];

export default function ExtensionPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 border border-purple-500/20">
            <Puzzle className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Chrome Extension — Manifest V3</span>
          </div>
          <h1 className="text-5xl font-black mb-5">
            Detect Fake News
            <br />
            <span className="gradient-text">While You Browse</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            The NeuralTruth browser extension brings AI-powered fake news detection directly to your browser — no copy-pasting required.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              <Puzzle className="w-5 h-5" />
              Add to Chrome
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
              <Download className="w-5 h-5" />
              Load as Unpacked
            </button>
          </div>
        </motion.div>

        {/* Extension Preview Mockup */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="flex justify-center mb-16">
          <div className="glass-card p-1 w-72 shadow-[0_0_60px_rgba(0,212,255,0.12)]">
            {/* Extension Header */}
            <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 rounded-t-xl p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-sm">NeuralTruth</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500">Analyzing current page...</p>
            </div>
            {/* Result */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Verdict</p>
                  <p className="text-xl font-black text-red-400">FAKE NEWS</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-red-500/30 flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(255,51,102,0.2)" }}>
                  <span className="text-lg font-black text-red-400">94%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" style={{ width: "94%" }} />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-orange-400 font-semibold">⚠ 3 suspicious sentences found</p>
                <div className="text-xs text-slate-400 bg-red-500/8 rounded p-2 border border-red-500/20">
                  "...this shocking revelation was suppressed by..."
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/4 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">Source</p>
                  <p className="text-xs font-bold text-red-400">HIGH RISK</p>
                </div>
                <div className="bg-white/4 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-500">Trust Score</p>
                  <p className="text-xs font-bold">14/100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-3 right-4 text-5xl font-black text-white/3">{s.num}</div>
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 stat-card">
          <h2 className="text-2xl font-bold mb-6 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="btn-primary inline-flex items-center gap-2 px-10 py-3.5 text-base">
              <Puzzle className="w-5 h-5" />
              Add to Chrome — It's Free
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
