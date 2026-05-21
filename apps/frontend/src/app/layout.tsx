import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "NeuralTruth | AI Fake News Detection Platform",
  description: "Detect misinformation before it spreads. Production-grade AI-powered fake news detection with BERT transformers, real-time claim verification, and source credibility scoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`bg-[#030712] text-slate-200 min-h-screen bg-grid antialiased ${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans tracking-tight`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
