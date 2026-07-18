"use client";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Activity, Users, Server, AlertTriangle } from "lucide-react";

const apiUsageData = [
  { time: "00:00", calls: 120, latency: 150 },
  { time: "04:00", calls: 85, latency: 130 },
  { time: "08:00", calls: 450, latency: 190 },
  { time: "12:00", calls: 920, latency: 240 },
  { time: "16:00", calls: 810, latency: 220 },
  { time: "20:00", calls: 310, latency: 160 },
];

const userActivityData = [
  { date: "Mon", active: 210 },
  { date: "Tue", active: 245 },
  { date: "Wed", active: 310 },
  { date: "Thu", active: 280 },
  { date: "Fri", active: 390 },
  { date: "Sat", active: 150 },
  { date: "Sun", active: 180 },
];

const suspiciousDomains = [
  { domain: "conspiracytoday.net", flags: 45, severity: "high" },
  { domain: "truth-now.org", flags: 32, severity: "high" },
  { domain: "healthmyths.io", flags: 28, severity: "medium" },
  { domain: "fake-local-news.com", flags: 19, severity: "medium" },
];

const accuracyTrend = [
  { day: "Mon", accuracy: 84.2 },
  { day: "Tue", accuracy: 85.1 },
  { day: "Wed", accuracy: 85.0 },
  { day: "Thu", accuracy: 86.4 },
  { day: "Fri", accuracy: 87.2 },
  { day: "Sat", accuracy: 87.5 },
  { day: "Sun", accuracy: 88.1 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color?: string;
    fill?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/10 text-xs">
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const severityClass: Record<string, string> = {
  high: "threat-high",
  medium: "threat-medium",
};

export default function AdminCharts() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* API Usage & Latency */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
          <h2 className="font-display font-bold mb-1 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" /> API Usage &amp; Latency
          </h2>
          <p className="text-slate-500 text-xs mb-5">Traffic volume vs response times (ms)</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={apiUsageData}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line yAxisId="left" type="monotone" dataKey="calls" name="Requests" stroke="#00d4ff" strokeWidth={2.5} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency ms" stroke="#ffcc00" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model Accuracy */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h2 className="font-display font-bold mb-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> Model Accuracy Trend
          </h2>
          <p className="text-slate-500 text-xs mb-5">Daily accuracy rate over the last 7 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={accuracyTrend}>
              <defs>
                <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#00ff88" strokeWidth={2.5} fill="url(#accGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6 lg:col-span-2">
          <h2 className="font-display font-bold mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Platform Activity
          </h2>
          <p className="text-slate-500 text-xs mb-5">Daily active users executing analysis</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={userActivityData}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(179,71,255,0.05)" }} />
              <Bar dataKey="active" name="Active Users" fill="#b347ff" radius={[5, 5, 0, 0]} barSize={36}
                style={{ filter: "drop-shadow(0 0 4px rgba(179,71,255,0.4))" }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Threat Monitor */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="font-display font-bold mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Threat Monitor
          </h2>
          <p className="text-slate-500 text-xs mb-5">Top flagged suspicious domains</p>
          <div className="space-y-3">
            {suspiciousDomains.map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${severityClass[item.severity]}`}>
                <span className="font-mono text-xs text-slate-200 truncate mr-2">{item.domain}</span>
                <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded bg-black/20">
                  {item.flags}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
