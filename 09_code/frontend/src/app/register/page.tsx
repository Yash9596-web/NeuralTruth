"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";

const perks = ["Real-time fake news detection", "Source credibility scoring", "Claim verification pipeline", "Full API access"];

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {/* Perks Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-600 flex items-center justify-center mb-6 neon-glow-purple">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-3 gradient-text">NeuralTruth</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">Join thousands of journalists, researchers, and fact-checkers fighting misinformation with AI.</p>
          <div className="space-y-4">
            {perks.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-slate-300 text-sm">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 shadow-[0_0_60px_rgba(179,71,255,0.08)]">
          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-slate-500 text-sm mb-8">Get free access to the detection platform</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" className="input-cyber" placeholder="Jane Doe" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="input-cyber" placeholder="jane@neuraltruth.ai" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="input-cyber pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}>
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight className="w-4 h-4" />Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
