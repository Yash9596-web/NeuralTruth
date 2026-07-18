"use client";
import { motion } from "framer-motion";
import { Code, ChevronRight, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/predict",
    description: "Analyze article text or URL for fake news detection.",
    body: `{
  "text": "The earth is definitely flat and governments are hiding it.",
  "source_url": "https://example-news.com/article"
}`,
    response: `{
  "prediction": "FAKE",
  "confidence": 94.2,
  "risk_level": "HIGH",
  "suspicious_sentences": [
    "The earth is definitely flat and governments are hiding it."
  ]
}`,
    color: "green",
  },
  {
    method: "POST",
    path: "/api/v1/analyze-url",
    description: "Scrape and analyze the content of a public article URL.",
    body: `{
  "url": "https://some-news-site.com/controversial-article"
}`,
    response: `{
  "prediction": "FAKE",
  "confidence": 88.7,
  "risk_level": "HIGH",
  "source_trust_score": 22
}`,
    color: "green",
  },
  {
    method: "POST",
    path: "/api/v1/verify",
    description: "Verify a factual claim against trusted external sources.",
    body: `{
  "claim": "Vaccines contain microchips that track individuals"
}`,
    response: `{
  "claim": "Vaccines contain microchips that track individuals",
  "verification": "FALSE",
  "confidence": 97,
  "evidence": [...]
}`,
    color: "green",
  },
  {
    method: "GET",
    path: "/api/v1/source-score/{domain}",
    description: "Get the credibility and trust score for a specific news domain.",
    body: null,
    response: `{
  "source": "example-news.com",
  "trust_score": 72,
  "bias": "Moderate",
  "risk": "Medium"
}`,
    color: "blue",
  },
  {
    method: "GET",
    path: "/api/v1/analytics",
    description: "Retrieve platform analytics and detection statistics.",
    body: null,
    response: `{
  "total_analyzed": 1245,
  "fake_detected": 342,
  "real_confirmed": 903,
  "avg_confidence": 94.2
}`,
    color: "blue",
  },
  {
    method: "POST",
    path: "/api/v1/auth/register",
    description: "Create a new user account and receive a JWT token.",
    body: `{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "Jane Doe"
}`,
    response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`,
    color: "green",
  },
  {
    method: "POST",
    path: "/api/v1/auth/login",
    description: "Authenticate with email and password to receive a JWT token.",
    body: `{
  "email": "user@example.com",
  "password": "securePassword123"
}`,
    response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`,
    color: "green",
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  POST: "bg-green-500/15 text-green-400 border border-green-500/30",
  DELETE: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-600 uppercase tracking-widest">{label}</span>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          {copied ? <><CheckCircle className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>
      <pre className="bg-black/40 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto border border-white/5">{code}</pre>
    </div>
  );
}

export default function ApiDocsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-black mb-3"><span className="gradient-text">API Documentation</span></h1>
          <p className="text-slate-400">Production-ready REST API. Base URL: <code className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">http://localhost:8000</code></p>
        </motion.div>

        {/* Auth Notice */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-sm text-yellow-400 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Protected endpoints require a JWT Bearer token in the Authorization header: <code className="font-mono ml-1">Bearer &lt;your_token&gt;</code>
          </p>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/2 transition-colors text-left"
              >
                <span className={`text-xs font-bold px-2.5 py-1 rounded flex-shrink-0 ${methodColors[ep.method]}`}>{ep.method}</span>
                <code className="font-mono text-sm text-slate-200 flex-1">{ep.path}</code>
                <p className="text-slate-500 text-xs hidden md:block flex-1">{ep.description}</p>
                <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform flex-shrink-0 ${open === i ? "rotate-90" : ""}`} />
              </button>

              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden">
                  <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
                    <p className="text-slate-400 text-sm">{ep.description}</p>
                    {ep.body && <CodeBlock code={ep.body} label="Request Body" />}
                    <CodeBlock code={ep.response} label="Response" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Swagger Link */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-4">The FastAPI backend also provides an interactive Swagger UI at:</p>
          <code className="font-mono text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg text-sm">http://localhost:8000/docs</code>
        </motion.div>
      </div>
    </div>
  );
}
