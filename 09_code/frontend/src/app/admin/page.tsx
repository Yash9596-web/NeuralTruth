"use client";
import { motion } from "framer-motion";
import { Activity, Users, Zap, ShieldAlert, ShieldCheck, Server, AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";

const AdminCharts = dynamic(() => import("@/components/AdminCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center text-slate-600">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-400 rounded-full animate-spin" />
        Loading security analytics...
      </div>
    </div>
  ),
});

const kpis = [
  { label: "Current Model Accuracy", value: "88.1%", icon: ShieldCheck, color: "green" },
  { label: "API Requests (24h)", value: "2,695", icon: Server, color: "blue" },
  { label: "Avg. Latency", value: "181ms", icon: Zap, color: "orange" },
  { label: "Active Users (24h)", value: "390", icon: Users, color: "purple" },
];

const colorClass: Record<string, string> = {
  green: "text-green-400",
  blue: "text-blue-400",
  orange: "text-orange-400",
  purple: "text-purple-400",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(179,71,255,0.06), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-full px-3 py-1 mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Security Operations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              <span className="gradient-text-danger">Admin Security Center</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Threat monitoring, API analytics, and model accuracy tracking</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            LIVE MONITORING
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-5 stat-card"
            >
              <div className="flex justify-between items-start mb-4">
                <s.icon className={`w-5 h-5 ${colorClass[s.color]}`} />
                <AlertTriangle className="w-3.5 h-3.5 text-slate-700" />
              </div>
              <div className="text-3xl font-mono font-bold mb-1 tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-500 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <AdminCharts />
      </div>
    </div>
  );
}
