"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { showcaseProjects, ShowcaseProject } from "./showcaseData";
import SplitText from "./SplitText";
import ShowcaseCursor from "./ShowcaseCursor";
import HorizontalGallery from "./HorizontalGallery";
import StackedCards from "./StackedCards";
import BentoLightbox from "./BentoLightbox";
import BetweenProjectsTransition from "./BetweenProjectsTransition";
import ScrollMovementControls from "./ScrollMovementControls";
import { Sparkles, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { playPop } from "@/lib/sound";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectShowcaseProps {
  /** Section HTML id (default "work") */
  id?: string;
  /** Optional custom project data override */
  projects?: ShowcaseProject[];
  /** Optional container className */
  className?: string;
  /** Whether to initialize Lenis smooth scroll locally (default true) */
  enableLenis?: boolean;
}

/**
 * MASTER PROJECT SHOWCASE COMPONENT
 *
 * Implements the full portfolio showcase specification:
 * - GSAP ScrollTrigger + Lenis smooth scroll synchronization
 * - Desktop: Continuous 3-project narrative with between-project scale-up transitions and horizontal scrub.
 * - Mobile (< 768px): Sticky project tab switcher ("Stitch/Switch Bar") with single-active project mode,
 *   reducing vertical scroll by over 90% and avoiding mobile scroll fatigue.
 * - Respects prefers-reduced-motion.
 */
export default function ProjectShowcase({
  id = "work",
  projects = showcaseProjects,
  className = "",
  enableLenis = true,
}: ProjectShowcaseProps) {
  const showcaseContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Synchronize Lenis smooth scroll with GSAP ScrollTrigger
  useEffect(() => {
    if (!enableLenis || typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Sync Lenis scroll with ScrollTrigger updates
    lenis.on("scroll", ScrollTrigger.update);

    // Bind GSAP ticker to Lenis RAF
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Refresh triggers once fonts and DOM layout are calculated
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [enableLenis]);

  const p1 = projects[0];
  const p2 = projects[1];
  const p3 = projects[2];

  const scrollToProject = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  const renderProjectGallery = (project: ShowcaseProject) => {
    switch (project.galleryVariant) {
      case "stacked":
        return <StackedCards project={project} />;
      case "horizontal":
        return <HorizontalGallery project={project} />;
      case "bento":
      default:
        return <BentoLightbox project={project} />;
    }
  };

  return (
    <section
      ref={showcaseContainerRef}
      id={id}
      className={`relative w-full bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300 overflow-hidden ${className}`}
    >
      {/* Morphing "View" / "Drag" Floating Cursor */}
      <ShowcaseCursor />

      {/* ---------------------------------------------------------------------
          SECTION MASTHEAD
          --------------------------------------------------------------------- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-6 sm:pt-20 sm:pb-12 lg:pt-36 lg:pb-20 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div>
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROJECT SHOWCASE &bull; 03 KINETIC CASE STUDIES</span>
            </div>

            {/* Main Header Reveal */}
            <SplitText
              as="h2"
              type="lines"
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-[var(--text-main)] uppercase"
            >
              SELECTED WORKS
            </SplitText>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[var(--text-muted)] max-w-2xl font-body leading-relaxed">
              Three flagship software engineering architectures. Explore pinned horizontal scrub,
              modular bento matrices, and fullscreen interactive lightboxes.
            </p>
          </div>

          {/* Quick Project Jump Selector (Desktop) */}
          <div className="hidden md:flex flex-wrap items-center gap-2 font-mono text-xs">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => scrollToProject(proj.id)}
                className="px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: proj.accentColor }}
                />
                <span className="font-bold">{proj.index}</span>
                <span className="hidden sm:inline">{proj.title.split(" ")[0]}</span>
                <ArrowUpRight className="w-3 h-3 text-[var(--text-faint)]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Scroll Movement Engine Options Bar (Desktop only) */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-2">
        <ScrollMovementControls />
      </div>

      {/* ---------------------------------------------------------------------
          MOBILE STICKY PROJECT SWITCHER (< 768px)
          Eliminates endless scrolling by letting mobile users stitch/switch projects with 1 tap
          --------------------------------------------------------------------- */}
      <div className="md:hidden sticky top-14 sm:top-16 z-30 w-full px-3 py-2 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-md shadow-black/5">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          {projects.map((proj, idx) => {
            const isActive = activeMobileIdx === idx;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => {
                  setActiveMobileIdx(idx);
                  try {
                    playPop();
                  } catch {}
                  showcaseContainerRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm border border-[var(--border-subtle)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                style={isActive ? { borderColor: `${proj.accentColor}77` } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: proj.accentColor }}
                />
                <span className="truncate">{proj.index} {proj.title.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          MOBILE SINGLE PROJECT RENDER (< 768px)
          Renders only the currently selected project with prev/next buttons at bottom
          --------------------------------------------------------------------- */}
      <div className="md:hidden">
        {projects[activeMobileIdx] && (
          <div key={projects[activeMobileIdx].id}>
            {renderProjectGallery(projects[activeMobileIdx])}

            {/* Mobile Project Stitch / Switch Navigation Footer */}
            <div className="px-4 py-5 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={activeMobileIdx === 0}
                onClick={() => {
                  setActiveMobileIdx((prev) => Math.max(0, prev - 1));
                  try {
                    playPop();
                  } catch {}
                  showcaseContainerRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
                  Project
                </span>
                <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                  {activeMobileIdx + 1} of {projects.length}
                </span>
              </div>

              <button
                type="button"
                disabled={activeMobileIdx === projects.length - 1}
                onClick={() => {
                  setActiveMobileIdx((prev) => Math.min(projects.length - 1, prev + 1));
                  try {
                    playPop();
                  } catch {}
                  showcaseContainerRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-main)] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------
          DESKTOP CONTINUOUS 3-PROJECT SHOWCASE (>= 768px)
          --------------------------------------------------------------------- */}
      <div className="hidden md:block">
        {/* PROJECT 1 */}
        {p1 && (
          <div id={p1.id}>
            {renderProjectGallery(p1)}
          </div>
        )}

        {/* BETWEEN PROJECT 1 -> PROJECT 2 TRANSITION */}
        {p2 && (
          <BetweenProjectsTransition
            nextTitle={p2.title}
            nextIndex={p2.index}
            nextTagline={p2.tagline}
            accentColor={p2.accentColor}
          />
        )}

        {/* PROJECT 2 (TUNEXIA) */}
        {p2 && (
          <div id={p2.id}>
            {renderProjectGallery(p2)}
          </div>
        )}

        {/* BETWEEN PROJECT 2 -> PROJECT 3 TRANSITION */}
        {p3 && (
          <BetweenProjectsTransition
            nextTitle={p3.title}
            nextIndex={p3.index}
            nextTagline={p3.tagline}
            accentColor={p3.accentColor}
          />
        )}

        {/* PROJECT 3 (HENJODI STORES) */}
        {p3 && (
          <div id={p3.id}>
            {renderProjectGallery(p3)}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------
          SHOWCASE FOOTER HUD
          --------------------------------------------------------------------- */}
      <div className="relative border-t border-[var(--border-subtle)] py-8 sm:py-12 px-4 sm:px-6 lg:px-12 bg-[var(--bg-secondary)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs font-mono text-[var(--text-muted)] text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>3 FLAGSHIP EXPERIENCES &bull; 21 HI-RES PRODUCTION FRAMES</span>
          </div>

          <div className="flex items-center gap-3 text-[var(--text-faint)]">
            <span>GSAP 3 + Lenis</span>
            <span>&bull;</span>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </div>
    </section>
  );
}
