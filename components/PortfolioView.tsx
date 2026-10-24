"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";
import PageLoader from "@/components/ui/PageLoader";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileHomeHub from "@/components/mobile/MobileHomeHub";

// Dynamic imports for performance
const Projects = dynamic(() => import("@/components/Projects"), { ssr: true });
const Experience = dynamic(() => import("@/components/Experience"), { ssr: true });
const SkillsMatrix = dynamic(() => import("@/components/SkillsMatrix"), { ssr: true });
const Education = dynamic(() => import("@/components/Education"), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true });

export type PortfolioSection = "home" | "work" | "experience" | "credentials" | "arsenal" | "contact";

interface PortfolioViewProps {
  activeSection?: PortfolioSection;
  content: any;
}

export default function PortfolioView({ activeSection = "home", content }: PortfolioViewProps) {
  const visibility = content.settings?.sectionsVisibility || {
    hero: true,
    work: true,
    experience: true,
    credentials: true,
    arsenal: true,
    contact: true,
  };

  // On desktop / laptop, auto-scroll to the requested section if visiting a direct route
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (activeSection === "home") return;

    const sectionMap: Record<PortfolioSection, string> = {
      home: "home",
      work: "work",
      experience: "experience",
      credentials: "education",
      arsenal: "stack",
      contact: "contact",
    };

    const targetId = sectionMap[activeSection];
    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  return (
    <>
      {/* Editorial Cinematic Shutter Loader */}
      <PageLoader />

      {/* Global Interactive Constellation Mesh & Ambient Glowing Background */}
      <HeroCanvasMesh />

      {/* Top Reading Progress Bar */}
      <ProgressBar />

      {/* Interactive Velocity-Stretching Cursor & Sound FX */}
      <CursorSound />

      {/* Global Navigation Header */}
      <Header profile={content.profile} />

      {/* =========================================================================
          DESKTOP / LAPTOP LAYOUT (>= 768px):
          100% UNCHANGED FULL SINGLE-PAGE KINETIC PORTFOLIO WITH PINNED GALLERIES
          ========================================================================= */}
      <div className="hidden md:block">
        <main className="relative z-10 scroll-skew-layer">
          {visibility.hero !== false && <Hero profile={content.profile} />}
          <Ticker />
          {visibility.work !== false && <Projects projects={content.projects} />}
          {visibility.experience !== false && (
            <Experience
              experience={content.experience}
              achievements={content.achievements}
            />
          )}
          {visibility.arsenal !== false && <SkillsMatrix skills={content.skills} />}
          {visibility.credentials !== false && (
            <Education
              education={content.education}
              certificates={content.certificates}
            />
          )}
          {visibility.contact !== false && <Contact profile={content.profile} />}
        </main>
        <Footer settings={content.settings} profile={content.profile} />
      </div>

      {/* =========================================================================
          MOBILE LAYOUT (< 768px):
          LANDING PAGE RETAINS HERO, TICKER, EXPERIENCE, EDUCATION, CONTACT
          EXCEPT PROJECTS AND SKILLS WHICH LIVE ON DEDICATED SUBPAGES (/work, /arsenal)
          ========================================================================= */}
      <div className="block md:hidden pb-24">
        <main className="relative z-10">
          {activeSection === "home" && (
            <>
              {/* 1. Hero Profile & Bio */}
              {visibility.hero !== false && <Hero profile={content.profile} />}

              {/* 2. Kinetic Marquee Ticker */}
              <Ticker />

              {/* 3. Featured Projects Showcase Banner (Excluded from landing page -> links to dedicated /work) */}
              <div className="px-4 py-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span>SELECTED WORKS &bull; 03 FLAGSHIPS</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-faint)]">DEDICATED PAGE</span>
                  </div>

                  <h3 className="text-xl font-black text-[var(--text-main)] font-display uppercase tracking-tight mb-2">
                    Client Projects &amp; Apps
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    Malnad Direct D2C logistics, TuneXIA progressive audio CDN, and Henjodi mountain expedition booking portal with horizontal scroll walkthroughs.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {content.projects.slice(0, 3).map((p: any, i: number) => (
                      <a
                        key={p.id || i}
                        href="/work"
                        className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center block group active:scale-95 transition-all"
                      >
                        <span
                          className="w-2 h-2 rounded-full mx-auto block mb-1.5"
                          style={{ backgroundColor: p.accentHex || p.accentColor || "#6366F1" }}
                        />
                        <span className="text-[10px] font-mono font-bold text-[var(--text-main)] block truncate">
                          0{i + 1} {p.name?.split(" ")[0]}
                        </span>
                      </a>
                    ))}
                  </div>

                  <a
                    href="/work"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>View Projects with Horizontal Scroll &rarr;</span>
                  </a>
                </div>
              </div>

              {/* 4. Enterprise Experience & Honors (Remaining on landing page) */}
              {visibility.experience !== false && (
                <div id="experience" className="pt-2">
                  <Experience
                    experience={content.experience}
                    achievements={content.achievements}
                  />
                </div>
              )}

              {/* 5. Academic Foundation & Credentials (Remaining on landing page) */}
              {visibility.credentials !== false && (
                <div id="education" className="pt-2">
                  <Education
                    education={content.education}
                    certificates={content.certificates}
                  />
                </div>
              )}

              {/* 6. Technical Skills Spotlight Banner (Excluded from landing page -> links to dedicated /arsenal) */}
              <div className="px-4 py-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span>TECHNICAL ARSENAL</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-faint)]">DEDICATED PAGE</span>
                  </div>

                  <h3 className="text-xl font-black text-[var(--text-main)] font-display uppercase tracking-tight mb-2">
                    Skills Matrix &amp; Stack
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    Frontend, Backend, Cloud &amp; Databases, DevOps &amp; Distributed Systems proficiency meters and telemetry.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["Next.js 15", "React 19", "Node.js", "TypeScript", "MongoDB", "Tailwind CSS", "Redis", "Claude AI"].map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <a
                    href="/arsenal"
                    className="w-full py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Open Interactive Skills Matrix &rarr;</span>
                  </a>
                </div>
              </div>

              {/* 7. Contact & Dispatch (Remaining on landing page) */}
              {visibility.contact !== false && (
                <div id="contact" className="pt-2">
                  <Contact profile={content.profile} />
                </div>
              )}
            </>
          )}

          {activeSection === "work" && (
            <div className="pt-16">
              <Projects projects={content.projects} />
            </div>
          )}

          {activeSection === "experience" && (
            <div className="pt-16">
              <Experience
                experience={content.experience}
                achievements={content.achievements}
              />
            </div>
          )}

          {activeSection === "credentials" && (
            <div className="pt-16">
              <Education
                education={content.education}
                certificates={content.certificates}
              />
            </div>
          )}

          {activeSection === "arsenal" && (
            <div className="pt-16">
              <SkillsMatrix skills={content.skills} />
            </div>
          )}

          {activeSection === "contact" && (
            <div className="pt-16">
              <Contact profile={content.profile} />
            </div>
          )}
        </main>

        <Footer settings={content.settings} profile={content.profile} />

        {/* Native Mobile Floating Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>
    </>
  );
}
