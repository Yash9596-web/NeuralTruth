"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", fake: 42, real: 88 },
  { day: "Tue", fake: 58, real: 102 },
  { day: "Wed", fake: 35, real: 94 },
  { day: "Thu", fake: 71, real: 78 },
  { day: "Fri", fake: 63, real: 115 },
  { day: "Sat", fake: 29, real: 67 },
  { day: "Sun", fake: 44, real: 91 },
];

const pieData = [
  { name: "FAKE", value: 342, color: "#ff3366" },
  { name: "REAL", value: 903, color: "#00ff88" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/10 text-xs">
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="glass-card p-6 lg:col-span-2"
      >
        <h2 className="font-display font-bold mb-1">Weekly Analysis Volume</h2>
        <p className="text-slate-500 text-xs mb-6">Fake vs. Real articles detected this week</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff3366" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="fake" name="Fake" stroke="#ff3366" strokeWidth={2.5} fill="url(#colorFake)" dot={false} />
            <Area type="monotone" dataKey="real" name="Real" stroke="#00ff88" strokeWidth={2.5} fill="url(#colorReal)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="glass-card p-6 flex flex-col items-center justify-center"
      >
        <h2 className="font-display font-bold mb-1 w-full">Detection Split</h2>
        <p className="text-slate-500 text-xs mb-4 w-full">All-time fake vs real ratio</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke="transparent"
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}80)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-sm">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
              <span className="text-slate-400">{d.name}: <strong style={{ color: d.color }}>{d.value}</strong></span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
