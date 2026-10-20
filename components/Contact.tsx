"use client";

import { useState } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess } from "@/lib/sound";
import confetti from "canvas-confetti";
import { Mail, Phone, MessageSquare, ArrowUpRight, Copy, Check, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from "@/components/Icons";

export default function Contact() {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    playSuccess();

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 },
        colors: ["#6366F1", "#FFB000", "#10B981"],
      });
    } catch {}

    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccess();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name || "a Visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name || "Visitor"}`);
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

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
          Available for engineering roles, technical advisory, and high-impact full-stack development.
        </p>
      </div>

      {/* Giant Stretch CTA */}
      <div className="mb-16 select-none">
        <a
          href={`mailto:${personalInfo.email}`}
          onClick={() => playPop()}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="block group text-decoration-none"
        >
          <span
            className="block text-[clamp(2.8rem,10.5vw,9.5rem)] font-black uppercase tracking-tight text-[var(--text-main)] group-hover:text-indigo-400 transition-all duration-700 leading-[0.88]"
            style={{
              fontFamily: "var(--font-d)",
              fontStretch: ctaHovered ? "145%" : "80%",
            }}
          >
            SAY HELLO ↗
          </span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Links & Quick Copy (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold mb-4">
            DIRECT CHANNELS
          </h3>

          {/* Email Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">EMAIL</span>
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
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedType === "email" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedType === "email" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Phone Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-[var(--text-faint)] block uppercase">PHONE / WHATSAPP</span>
                <a
                  href={`tel:${personalInfo.phone.replace(/\s+/g, "")}`}
                  className="font-bold text-sm sm:text-base text-[var(--text-main)] hover:text-emerald-400 transition-colors truncate block"
                >
                  {personalInfo.phone}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(personalInfo.phone, "phone")}
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedType === "phone" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedType === "phone" ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Social Links Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => playPop()}
              className="glass-panel p-4 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <LinkedinIcon size={18} className="text-indigo-400" />
                <span className="text-xs font-bold text-[var(--text-main)]">LinkedIn</span>
              </div>
              <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-white transition-colors" />
            </a>

            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => playPop()}
              className="glass-panel p-4 rounded-2xl border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <GithubIcon size={18} className="text-indigo-400" />
                <span className="text-xs font-bold text-[var(--text-main)]">GitHub</span>
              </div>
              <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>

        {/* Quick Message Form (6 cols) */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-subtle)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-400" />
              QUICK DISPATCH NOTE
            </h3>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                  YOUR NAME OR ORGANIZATION
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex (Engineering Lead)"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="text-xs font-mono text-[var(--text-muted)] block mb-1.5">
                  MESSAGE / PROJECT OVERVIEW
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your product vision, system challenges, or open role..."
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full magnetic-btn magnetic-btn-primary py-3.5 text-xs font-mono uppercase tracking-wider"
              >
                <span>Dispatch Email Message</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
