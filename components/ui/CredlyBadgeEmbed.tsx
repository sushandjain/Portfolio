"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, ExternalLink, Award, Eye } from "lucide-react";
import { playPop, playTick } from "@/lib/sound";

interface CredlyBadgeEmbedProps {
  badgeId?: string;
  badgeHost?: string;
  badgeWidth?: number;
  badgeHeight?: number;
  className?: string;
}

/**
 * High-Performance Interactive Credly Verified Digital Credential Component
 * Combines the official Credly iframe embed widget with a responsive,
 * ultra-premium glass UI dossier, verified badges, and fail-safe rendering.
 */
export default function CredlyBadgeEmbed({
  badgeId = "e66a5b5f-9a91-4a17-80c1-05e949d3df51",
  badgeHost = "https://www.credly.com",
  badgeWidth = 150,
  badgeHeight = 270,
  className = "",
}: CredlyBadgeEmbedProps) {
  const [activeTab, setActiveTab] = useState<"dossier" | "live_embed">("dossier");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Inject official Credly script as well for standards compliance
    const scriptId = "credly-embed-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      script.async = true;
      script.src = "//cdn.credly.com/assets/utilities/embed.js";
      document.body.appendChild(script);
    }
  }, []);

  const verificationUrl = `${badgeHost}/badges/${badgeId}`;
  const embeddedBadgeUrl = `${badgeHost}/embedded_badge/${badgeId}`;

  return (
    <div
      className={`glass-panel p-5 sm:p-7 rounded-3xl border border-orange-500/35 hover:border-orange-500/65 transition-all duration-300 relative overflow-hidden group shadow-xl shadow-orange-500/5 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(217, 119, 87, 0.09) 0%, rgba(15, 18, 28, 0.88) 100%)",
      }}
    >
      {/* Background ambient terracotta glow aura */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-orange-500/15 via-orange-600/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-orange-500/25 transition-all duration-500" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)] relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/15 border border-orange-500/35 text-orange-400 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
            OFFICIAL CREDLY ACCREDITATION
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={11} />
            VERIFIED ACTIVE
          </span>
        </div>

        {/* View Switcher Pill */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              playTick(720);
              setActiveTab("dossier");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === "dossier"
                ? "bg-orange-600 text-white font-bold shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              playTick(820);
              setActiveTab("live_embed");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === "live_embed"
                ? "bg-orange-600 text-white font-bold shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            <span>Live Credly Widget</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        </div>
      </div>

      {/* Main Showcase Layout */}
      {activeTab === "dossier" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Official Badge Presentation */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-[var(--bg-secondary)]/60 border border-orange-500/25 relative group/badge">
            <div className="relative mb-3">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-b from-orange-500/20 to-orange-950/20 border border-orange-500/40 p-3 flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover/badge:scale-105 transition-all duration-300">
                <Image
                  src="/claude-badge.png"
                  alt="Claude Certified Associate Badge"
                  width={130}
                  height={130}
                  priority
                  className="object-contain drop-shadow-[0_8px_20px_rgba(217,119,87,0.45)]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] flex items-center justify-center text-white shadow-md">
                <CheckCircle2 size={14} />
              </span>
            </div>

            <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-widest mb-0.5">
              ANTHROPIC
            </span>
            <div className="text-xs font-mono text-[var(--text-faint)]">
              Credly ID: <span className="text-white font-semibold">{badgeId.slice(0, 8)}...</span>
            </div>

            <div className="w-full mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>ISSUED: <strong>OCT 23, 2026</strong></span>
              <span>EXPIRES: <strong>OCT 23, 2027</strong></span>
            </div>
          </div>

          {/* Right Column: In-depth Dossier and Verified Competencies */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
                <Award size={14} />
                <span>Anthropic Professional Credential</span>
              </div>
              <h3
                className="text-2xl sm:text-3xl font-black uppercase text-[var(--text-main)] group-hover:text-orange-300 transition-colors tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-d)" }}
              >
                Claude Certified Associate — Foundations
              </h3>
              <p className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-1">
                Issued to: <strong className="text-white">Sushan Jain</strong> &bull; Authenticated by <strong className="text-orange-400">Anthropic</strong>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Demonstrates mastery in prompt architecture, extended thinking orchestration, output evaluation, model family selection across Claude 3.5 Sonnet / Opus / Haiku, and reliable enterprise generative AI integration patterns.
            </p>

            {/* Verified Skills Grid */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] block mb-1.5">
                VERIFIED SKILLS &amp; PROFICIENCIES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Claude 3.5 Sonnet",
                  "Prompt Engineering",
                  "System Prompts & Constraints",
                  "Output Validation",
                  "Extended Thinking",
                  "Multi-Turn Workflows",
                  "Responsible AI",
                  "Enterprise GenAI",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[var(--bg-secondary)] border border-orange-500/25 text-orange-300 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all cursor-default"
                  >
                    ✦ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playPop()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <ShieldCheck size={14} />
                <span>Verify Live on Credly</span>
                <ArrowUpRight size={13} />
              </a>

              <button
                type="button"
                onClick={() => {
                  playTick(800);
                  setActiveTab("live_embed");
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                <Eye size={13} />
                <span>Inspect Embedded Badge</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Live Credly Embed View */
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 py-2 sm:py-4 relative z-10">
          <div className="relative p-3 rounded-2xl bg-black/40 border border-orange-500/40 shadow-2xl shadow-orange-500/20 flex flex-col items-center">
            {/* Live official Credly badge iframe */}
            <div className="w-[150px] h-[270px] relative overflow-hidden rounded-xl bg-[#0f1118]">
              <iframe
                src={embeddedBadgeUrl}
                width={badgeWidth}
                height={badgeHeight}
                frameBorder="0"
                scrolling="no"
                title="Anthropic Claude Certified Associate Credly Badge"
                className="rounded-xl"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-orange-400 font-semibold flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>LIVE CREDLY EMBED IFRAME</span>
            </div>
          </div>

          <div className="max-w-md space-y-3 text-center md:text-left">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold">
              OFFICIAL EMBED CODE RENDERING
            </span>
            <h4
              className="text-xl sm:text-2xl font-bold uppercase text-[var(--text-main)]"
              style={{ fontFamily: "var(--font-d)" }}
            >
              Direct Credly System Sync
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              This interactive widget communicates directly with Credly&apos;s credential verification servers. Anyone can click the verified seal inside to independently validate the issuing authority (Anthropic) and recipient (Sushan Jain).
            </p>
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--text-muted)] space-y-1 text-left">
              <div><strong className="text-white">Badge ID:</strong> {badgeId}</div>
              <div><strong className="text-white">Host:</strong> credly.com</div>
              <div><strong className="text-white">Format:</strong> 150px &times; 270px Responsive Frame</div>
            </div>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-orange-600/30 active:scale-95"
              >
                <span>Open in Credly</span>
                <ArrowUpRight size={13} />
              </a>
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-white/5 active:scale-95"
              >
                &larr; Back to overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official embed container for any third-party scraper or embed.js processing */}
      <div className="hidden" aria-hidden="true">
        <div
          data-iframe-width={badgeWidth}
          data-iframe-height={badgeHeight}
          data-share-badge-id={badgeId}
          data-share-badge-host={badgeHost}
        />
      </div>
    </div>
  );
}
