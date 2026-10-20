"use client";

import { playPop } from "@/lib/sound";
import { ArrowUp, Heart, Code2 } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    playPop();
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 py-12 px-4 sm:px-6 lg:px-8 mt-20 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[var(--text-muted)]">
        {/* Left: Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-bold text-[var(--text-main)]">© 2026 SUSHAN D JAIN</span>
          <span className="hidden sm:inline text-[var(--text-faint)]">·</span>
          <span>Bengaluru, India (12.9716° N, 77.5946° E)</span>
        </div>

        {/* Center: Tech note */}
        <div className="flex items-center gap-1.5 text-[var(--text-faint)]">
          <span>Engineered with Next.js 15 &amp; Stretch Motion</span>
        </div>

        {/* Right: Back to Top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-indigo-500/40 text-[var(--text-main)] transition-all cursor-pointer group"
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={13} className="text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
