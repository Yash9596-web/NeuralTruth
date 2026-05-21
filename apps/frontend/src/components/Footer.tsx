"use client";
import Link from "next/link";
import { Shield, ExternalLink, Zap, Globe, BookOpen } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Analyze News", href: "/analyze" },
    { label: "Source Checker", href: "/source-checker" },
    { label: "Claim Verifier", href: "/claim-verifier" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Developers: [
    { label: "API Documentation", href: "/api-docs" },
    { label: "Browser Extension", href: "/extension" },
    { label: "Admin Panel", href: "/admin" },
  ],
  Company: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-24">
      <div className="section-divider mb-0" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center neon-glow-blue">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text tracking-tight">
                NeuralTruth
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Production-grade AI misinformation detection platform powered by BERT transformers and real-time source analysis.
            </p>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 mt-6 glass px-4 py-2.5 rounded-lg w-fit">
              <span className="live-dot" />
              <span className="text-xs text-slate-400">All systems operational</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              {[0, 1, 2].map((i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-cyan-400 transition-all duration-200 inline-block" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="section-divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600" suppressHydrationWarning>
            © {new Date().getFullYear()} NeuralTruth. AI-powered misinformation detection.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-500" />
              Powered by Groq + LLaMA 3.3
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3 text-purple-500" />
              BERT Transformers
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-green-500" />
              Real-time Detection
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
