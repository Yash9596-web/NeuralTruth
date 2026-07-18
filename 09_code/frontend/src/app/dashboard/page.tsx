"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Shield, AlertTriangle, BarChart3, Activity, Clock, Globe } from "lucide-react";
import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center text-slate-600">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        Loading charts...
      </div>
    </div>
  ),
});

const recentAnalyses = [
  { id: 1, title: "Government announces secret Moon base program", verdict: "FAKE", confidence: 96.2, source: "conspiracytoday.net", time: "2m ago" },
  { id: 2, title: "WHO reports 15% decline in global disease rates", verdict: "REAL", confidence: 91.4, source: "reuters.com", time: "5m ago" },
  { id: 3, title: "Scientists confirm coffee cures all cancers", verdict: "FAKE", confidence: 99.1, source: "healthmyths.io", time: "12m ago" },
  { id: 4, title: "Central bank raises interest rates by 0.25%", verdict: "REAL", confidence: 88.7, source: "apnews.com", time: "24m ago" },
];

const statCards = [
  { label: "Total Analyzed", value: "1,245", icon: BarChart3, change: "+12%", up: true, color: "cyan" },
  { label: "Fake Detected", value: "342", icon: AlertTriangle, change: "+8%", up: true, color: "red" },
  { label: "Real Confirmed", value: "903", icon: Shield, change: "+14%", up: true, color: "green" },
  { label: "Avg. Confidence", value: "94.2%", icon: Activity, change: "+2.1%", up: true, color: "purple" },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
  green: "text-green-400 bg-green-400/10 border-green-400/20",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="ai-chip mb-3">Analytics</div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1 tracking-tight">
                <span className="gradient-text">Analytics Dashboard</span>
              </h1>
              <p className="text-slate-500 text-sm">Real-time overview of detection platform performance</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-lg">
              <span className="live-dot" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="glass-card p-5 stat-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[s.color]}`}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                <span className={`text-xs font-bold flex items-center gap-1 ${s.up ? "text-green-400" : "text-red-400"}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <div className="text-3xl font-mono font-bold mb-1 tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <DashboardCharts />

        {/* Recent Analyses Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-lg">Recent Analyses</h2>
              <p className="text-slate-500 text-xs mt-0.5">Latest article verdicts from the AI pipeline</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 text-xs">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Live Feed
            </div>
          </div>
          <div className="divide-y divide-white/4">
            {recentAnalyses.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.2 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate font-medium">{item.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><Globe className="w-3 h-3" />{item.source}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-600"><Clock className="w-3 h-3" />{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-slate-400 font-mono">{item.confidence}%</span>
                  {item.verdict === "FAKE"
                    ? <span className="badge-fake">FAKE</span>
                    : <span className="badge-real">REAL</span>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
