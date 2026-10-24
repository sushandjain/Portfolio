"use client";

import Image from "next/image";
import { experience, achievements } from "@/lib/data";
import { playPop } from "@/lib/sound";
import { Briefcase, Trophy, Award, CheckCircle2, ChevronRight, Building, Sparkles } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TiltCard from "@/components/ui/TiltCard";

export default function Experience({
  experience: initialExp,
  achievements: initialAch,
}: {
  experience?: any[];
  achievements?: any[];
} = {}) {
  const expList = (initialExp && initialExp.length > 0 ? initialExp : experience).filter(
    (e: any) => e.published !== false
  );
  const achList = (initialAch && initialAch.length > 0 ? initialAch : achievements).filter(
    (a: any) => a.published !== false
  );

  if (expList.length === 0 && achList.length === 0) return null;

  return (
    <section id="experience" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>03 / CAREER TRAJECTORY</span>
            <span>✦</span>
            <span>ENTERPRISE SYSTEMS & RECOGNITION</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            EXPERIENCE & HONORS
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md font-mono">
          Maintaining high-availability enterprise services and shipping battle-tested systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TCS Systems Engineer Featured Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold flex items-center gap-2">
            <Building size={14} className="text-indigo-400" />
            CURRENT ENTERPRISE ROLE
          </h3>

          {expList.map((exp: any, idx: number) => (
            <TiltCard key={exp.id || idx} maxTilt={4} scale={1.01} className="w-full">
              <SpotlightCard
                className="glass-panel p-6 sm:p-8 border border-indigo-500/25 hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
                spotlightColor="rgba(99, 102, 241, 0.18)"
                borderColor="rgba(129, 140, 248, 0.55)"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                    <span className="pulse-green" /> {exp.status}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-faint)]">{exp.period}</span>
                </div>

                <h4
                  className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-d)" }}
                >
                  {exp.role}
                </h4>
                <p className="text-sm font-semibold text-indigo-400 mt-1 mb-4 flex items-center gap-1.5">
                  <span>{exp.company}</span>
                  <span>·</span>
                  <span className="text-[var(--text-muted)] font-normal">{exp.location}</span>
                </p>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                  {exp.summary}
                </p>

                {/* Responsibilities list */}
                <div className="space-y-3 mb-6">
                  {(exp.highlights || []).map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-muted)]">
                      <CheckCircle2 size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  {(exp.tags || []).map((tag: string) => (
                    <span key={tag} className="tech-pill text-[11px] py-1 px-3">
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </TiltCard>
          ))}
        </div>

        {/* Hackathons & Achievements Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" />
            HONORS & INDUSTRY ACCREDITATION
          </h3>

          <div className="space-y-4">
            {achList.map((ach, idx) => (
              <TiltCard key={ach.id || idx} maxTilt={5} scale={1.015} className="w-full">
                <SpotlightCard
                  className={`glass-panel p-6 border transition-all duration-300 group ${
                    "credlyUrl" in ach && ach.credlyUrl
                      ? "border-orange-500/35 hover:border-orange-500/60 shadow-lg shadow-orange-500/5"
                      : "border-[var(--border-subtle)] hover:border-amber-500/40"
                  }`}
                  spotlightColor={
                    "credlyUrl" in ach && ach.credlyUrl
                      ? "rgba(204, 85, 0, 0.18)"
                      : "rgba(245, 158, 11, 0.16)"
                  }
                  borderColor={
                    "credlyUrl" in ach && ach.credlyUrl
                      ? "rgba(204, 85, 0, 0.6)"
                      : "rgba(245, 158, 11, 0.55)"
                  }
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        "credlyUrl" in ach && ach.credlyUrl
                          ? "bg-orange-500/20 border border-orange-500/35 text-orange-300"
                          : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                      }`}
                    >
                      {ach.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-faint)]">{ach.date}</span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    {"badgeImage" in ach && ach.badgeImage ? (
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 p-1 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-md shadow-orange-500/15">
                        <Image
                          src={ach.badgeImage as string}
                          alt={ach.title}
                          width={42}
                          height={42}
                          loading="lazy"
                          decoding="async"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all">
                        {ach.icon === "trophy" ? <Trophy size={18} /> : <Award size={18} />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-base text-[var(--text-main)] group-hover:text-amber-400 transition-colors">
                        {ach.title}
                      </h5>
                      <p
                        className={`text-xs font-medium ${
                          "credlyUrl" in ach && ach.credlyUrl ? "text-orange-400 font-bold" : "text-indigo-400"
                        }`}
                      >
                        {ach.issuer}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                        {ach.description}
                      </p>
                      {"credlyUrl" in ach && ach.credlyUrl && (
                        <div className="mt-3">
                          <a
                            href={ach.credlyUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 decoration-orange-500/50"
                          >
                            <span>Verify Official Credential on Credly</span>
                            <span>↗</span>
                          </a>
                        </div>
                      )}
                      {"driveUrl" in ach && ach.driveUrl && (
                        <div className="mt-3">
                          <a
                            href={ach.driveUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-500/50"
                          >
                            <span>Inspect Verified Certificate on Google Drive</span>
                            <span>↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            ))}

            {/* Quick Summary Pill */}
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono leading-relaxed">
              <span className="text-indigo-400 font-bold block mb-1">PROVEN TRACK RECORD</span>
              Proven ability to analyze business problems under tight deadlines, architect scalable schemas, and deliver verified solutions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
