"use client";

import { useState, useRef } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess, playTick } from "@/lib/sound";
import confetti from "canvas-confetti";
import { Mail, ArrowUpRight, Copy, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

export default function Contact() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [stretchWidth, setStretchWidth] = useState(75);
  const ctaRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playSuccess();

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#6366F1", "#10B981", "#F59E0B"],
      });
    } catch {}

    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleMouseMoveCTA = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    // Map mouse position across width to 60% - 150% stretch
    const calculatedStretch = Math.round(60 + relativeX * 90);
    setStretchWidth(calculatedStretch);
  };

  const handleTouchMoveCTA = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ctaRef.current || !e.touches[0]) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const relativeX = (e.touches[0].clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, relativeX));
    // Safe stretch range for mobile width
    const calculatedStretch = Math.round(60 + clamped * 65);
    setStretchWidth(calculatedStretch);
  };

  const whatsappUrl = `https://wa.me/918088155097?text=${encodeURIComponent(
    "Hi Sushan, I reviewed your Stretch Folio portfolio and would love to connect regarding an opportunity."
  )}`;

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>06 / GET IN TOUCH</span>
            <span>✦</span>
            <span>START A CONVERSATION</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            LET&apos;S CONNECT
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md font-mono">
          Available for high-impact full-stack engineering, enterprise systems architecture, and technical advisory.
        </p>
      </div>

      {/* Giant Kinetic Stretch CTA (Mouse-interactive variable font) */}
      <div
        ref={ctaRef}
        onMouseMove={handleMouseMoveCTA}
        onTouchMove={handleTouchMoveCTA}
        onTouchStart={() => {
          setCtaHovered(true);
          playTick(660);
        }}
        onMouseEnter={() => {
          setCtaHovered(true);
          playTick(660);
        }}
        onMouseLeave={() => {
          setCtaHovered(false);
          setStretchWidth(75);
        }}
        className="mb-16 select-none relative p-6 sm:p-12 rounded-3xl glass-panel border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden group cursor-pointer"
        onClick={() => {
          playPop();
          window.location.href = `mailto:${personalInfo.email}`;
        }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all" />

        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-faint)] mb-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="pulse-green" /> AVAILABLE FOR NEW PROJECTS & ROLES
          </span>
          <span className="hidden sm:inline">MOVE CURSOR HORIZONTALLY TO STRETCH</span>
          <span className="sm:hidden text-indigo-400 font-bold">SWIPE TO STRETCH</span>
        </div>

        <span
          className="block text-[clamp(2.5rem,11.5vw,10.5rem)] font-black uppercase tracking-tight text-[var(--text-main)] group-hover:text-indigo-400 transition-all duration-200 leading-[0.88]"
          style={{
            fontFamily: "var(--font-d)",
            fontStretch: `${stretchWidth}%`,
          }}
        >
          SAY HELLO ↗
        </span>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
          <span className="text-indigo-400 font-bold">TAP / CLICK BANNER TO DISPATCH EMAIL</span>
          <span className="text-[var(--text-faint)]">Current Variable Width: {stretchWidth}%</span>
        </div>
      </div>

      {/* Direct Channels */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold mb-4">
          AUTHENTIC DIRECT CHANNELS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">PRIMARY EMAIL</span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="font-bold text-sm sm:text-base text-[var(--text-main)] hover:text-indigo-400 transition-colors truncate block"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(personalInfo.email, "email")}
              className="px-3.5 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedType === "email" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedType === "email" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* WhatsApp Direct Chat Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-emerald-500/30 transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <WhatsAppIcon size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">
                  DIRECT WHATSAPP DISPATCH
                </span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm sm:text-base text-[var(--text-main)] hover:text-emerald-400 transition-colors truncate block"
                >
                  {personalInfo.phone}
                </a>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playPop()}
              className="px-4 py-2.5 min-h-[44px] min-w-[44px] rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Chat</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Social Profiles: LinkedIn */}
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => playPop()}
            className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <LinkedinIcon size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">LINKEDIN PROFILE</span>
                <span className="font-bold text-sm sm:text-base text-[var(--text-main)] group-hover:text-indigo-400 transition-colors block">
                  /in/sushandjain121
                </span>
              </div>
            </div>
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[var(--bg-secondary)] group-hover:bg-indigo-600 group-hover:text-white text-[var(--text-muted)] flex items-center justify-center transition-all">
              <ArrowUpRight size={14} />
            </div>
          </a>

          {/* Social Profiles: GitHub */}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => playPop()}
            className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <GithubIcon size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">GITHUB PROFILE</span>
                <span className="font-bold text-sm sm:text-base text-[var(--text-main)] group-hover:text-indigo-400 transition-colors block">
                  @sushandjain
                </span>
              </div>
            </div>
            <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[var(--bg-secondary)] group-hover:bg-indigo-600 group-hover:text-white text-[var(--text-muted)] flex items-center justify-center transition-all">
              <ArrowUpRight size={14} />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
