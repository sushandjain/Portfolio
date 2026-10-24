"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Sparkles, Layers, Briefcase, Cpu, Award, Send, MapPin, CheckCircle2 } from "lucide-react";
import { playPop } from "@/lib/sound";

interface MobileHomeHubProps {
  profile?: any;
  projects?: any[];
  experience?: any[];
}

export default function MobileHomeHub({ profile, projects = [], experience = [] }: MobileHomeHubProps) {
  const router = useRouter();
  const avatarClicksRef = useRef<number[]>([]);
  const avatar = profile?.avatarUrl || "/sushan.jpg";
  const name = profile?.name || "Sushan D Jain";
  const title = profile?.title || "Systems Engineer @ TCS";
  const tagline =
    profile?.bio ||
    "Full-Stack Architect & Systems Engineer crafting high-performance distributed web architectures, high-throughput REST APIs, and Anthropic Claude AI integrations.";

  const handleAvatarClick = (e: React.MouseEvent) => {
    try {
      playPop();
    } catch {}
    const now = Date.now();
    avatarClicksRef.current = [...avatarClicksRef.current.filter((t) => now - t < 1500), now];
    if (avatarClicksRef.current.length >= 3) {
      avatarClicksRef.current = [];
      e.preventDefault();
      router.push("/admin");
    }
  };

  return (
    <div className="pt-20 px-4 space-y-6">
      {/* ---------------------------------------------------------------------
          HERO PROFILE CARD
          --------------------------------------------------------------------- */}
      <div className="relative p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-4">
          <div
            onClick={handleAvatarClick}
            className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-indigo-500/30 shrink-0 shadow-md cursor-pointer select-none touch-manipulation active:scale-95 transition-transform"
          >
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="64px"
              priority
              className="object-cover object-top pointer-events-none"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>OPEN FOR ROLES</span>
            </div>
            <h1 className="text-xl font-black text-[var(--text-main)] uppercase font-display tracking-tight">
              {name}
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {title}
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-5">
          {tagline}
        </p>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-faint)] mb-5">
          <MapPin size={12} className="text-indigo-400" />
          <span>Bengaluru, India (IST)</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href="/work"
            onClick={() => {
              try { playPop(); } catch {}
            }}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 active:scale-95 transition-all"
          >
            <Layers size={14} />
            <span>Explore Work</span>
          </Link>
          <Link
            href="/contact"
            onClick={() => {
              try { playPop(); } catch {}
            }}
            className="py-2.5 px-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Send size={14} />
            <span>Let&apos;s Talk</span>
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          KEY IMPACT METRICS
          --------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] block mb-1">
            Production Flagships
          </span>
          <span className="text-2xl font-black text-indigo-400 font-display">
            03 Active
          </span>
          <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
            D2C, Cloud CDN, Booking
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] block mb-1">
            Enterprise Tenure
          </span>
          <span className="text-2xl font-black text-emerald-400 font-display">
            TCS Systems
          </span>
          <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
            2nd Place AI Hackathon
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] block mb-1">
            Certification
          </span>
          <span className="text-xl font-black text-amber-400 font-display">
            Claude AI
          </span>
          <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
            Certified Associate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
          <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] block mb-1">
            REST Endpoints
          </span>
          <span className="text-2xl font-black text-purple-400 font-display">
            12+ APIs
          </span>
          <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
            JWT, MongoDB, Cloudinary
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          FEATURED PROJECTS SPOTLIGHT PREVIEW
          --------------------------------------------------------------------- */}
      <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              FEATURED WORKS
            </h2>
          </div>
          <Link
            href="/work"
            onClick={() => {
              try { playPop(); } catch {}
            }}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {projects.slice(0, 3).map((project, idx) => (
            <Link
              key={project.id || idx}
              href="/work"
              onClick={() => {
                try { playPop(); } catch {}
              }}
              className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${project.accentHex || project.accentColor || "#6366F1"}18`,
                    color: project.accentHex || project.accentColor || "#6366F1",
                    borderColor: `${project.accentHex || project.accentColor || "#6366F1"}40`,
                  }}
                >
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[var(--text-main)] truncate group-hover:text-indigo-400 transition-colors">
                    {project.name || project.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {project.tagline}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-muted)] group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                <ArrowUpRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/work"
          onClick={() => {
            try { playPop(); } catch {}
          }}
          className="w-full py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Open Full Interactive Showcase (03 Projects)</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* ---------------------------------------------------------------------
          QUICK NAVIGATION SECTOR CARDS
          --------------------------------------------------------------------- */}
      <div className="space-y-2.5">
        <Link
          href="/experience"
          onClick={() => {
            try { playPop(); } catch {}
          }}
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] font-mono">
                Experience &amp; Honors
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                TCS Systems Engineer &bull; AI Friday 2nd Prize
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-[var(--text-faint)]" />
        </Link>

        <Link
          href="/arsenal"
          onClick={() => {
            try { playPop(); } catch {}
          }}
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] font-mono">
                Technical Arsenal
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Next.js, Node.js, Express, MongoDB, TypeScript
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-[var(--text-faint)]" />
        </Link>

        <Link
          href="/credentials"
          onClick={() => {
            try { playPop(); } catch {}
          }}
          className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] font-mono">
                Credentials &amp; Education
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Anthropic Claude AI &bull; Sahyadri BE &bull; JSpiders
              </p>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-[var(--text-faint)]" />
        </Link>
      </div>
    </div>
  );
}
