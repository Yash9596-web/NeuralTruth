"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, BarChart3, Globe, Search,
  Puzzle, BookOpen, Menu, X, ShieldAlert
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/analyze", label: "Analyze", icon: Zap },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/source-checker", label: "Source Check", icon: Globe },
  { href: "/claim-verifier", label: "Verify Claim", icon: Search },
  { href: "/extension", label: "Extension", icon: Puzzle },
  { href: "/api-docs", label: "API Docs", icon: BookOpen },
  { href: "/admin", label: "Admin", icon: ShieldAlert },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      {/* Top glowing line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="w-full px-4 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group z-50 relative flex-shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center neon-glow-blue transition-all group-hover:scale-105">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute -inset-1 rounded-xl border border-cyan-500/30 animate-pulse-neon pointer-events-none" />
          </div>
          <span className="font-display font-bold text-lg gradient-text tracking-tight hidden sm:block">
            NeuralTruth
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`nav-link flex items-center gap-1.5 ${isActive ? "active" : ""}`}
              >
                <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Auth CTA */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs text-slate-500 hidden xl:inline">AI Online</span>
          </div>
          <Link href="/login" className="btn-ghost text-sm py-1.5 px-4">
            Login
          </Link>
          <Link href="/register" className="btn-primary text-sm py-1.5 px-4">
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-slate-400 hover:text-cyan-400 transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden glass border-t border-white/5 absolute top-16 left-0 right-0 z-40 shadow-2xl"
          >
            <div className="px-4 pb-4 pt-2 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMenuOpen(false)}
                    className={`nav-link flex items-center gap-2 ${pathname === item.href ? "active" : ""}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-ghost text-sm py-2 flex-1 text-center">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 flex-1 text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
