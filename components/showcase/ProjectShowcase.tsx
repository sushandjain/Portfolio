"use client";

import React, { useEffect, useRef } from "react";
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
import { Sparkles, ArrowUpRight } from "lucide-react";

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
 * - 3 Distinct Projects:
 *   1. Pinned Horizontal Gallery (ScrollTrigger pin + scrub, parallax, live 01/07 counter)
 *   2. Sticky Stacked Cards (Each sticks, 0.92 scale + fade on overlap, live HUD)
 *   3. Asymmetric Bento Grid + Fullscreen Lightbox (shared-element expand, arrow nav, drag-to-swipe, Esc close)
 * - Between-project smooth title scale-up screen takeovers
 * - Shared motion rules: cubic-bezier(0.16, 1, 0.3, 1), masked line reveals, word-by-word fade-ups,
 *   clip-path image reveals with ±8% parallax
 * - Custom morphing cursor with "View" and "Drag" states
 * - Mobile adaptation: touch-swipe carousel, simplified reveals, hidden custom cursor
 * - Prefers-reduced-motion compliance
 */
export default function ProjectShowcase({
  id = "work",
  projects = showcaseProjects,
  className = "",
  enableLenis = true,
}: ProjectShowcaseProps) {
  const showcaseContainerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section
      ref={showcaseContainerRef}
      id={id}
      className={`relative w-full bg-[#090B10] text-slate-100 overflow-hidden ${className}`}
    >
      {/* Morphing "View" / "Drag" Floating Cursor */}
      <ShowcaseCursor />

      {/* ---------------------------------------------------------------------
          SECTION MASTHEAD
          --------------------------------------------------------------------- */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROJECT SHOWCASE &bull; 03 KINETIC CASE STUDIES</span>
            </div>

            {/* Main Header Reveal */}
            <SplitText
              as="h2"
              type="lines"
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase"
            >
              SELECTED WORKS
            </SplitText>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl font-body leading-relaxed">
              Three flagship software engineering architectures. Scroll to experience
              pinned horizontal scrub, sticky card stacking, and interactive bento matrix.
            </p>
          </div>

          {/* Quick Project Jump Selector */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => scrollToProject(proj.id)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 active:scale-95"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: proj.accentColor }}
                />
                <span className="font-bold">{proj.index}</span>
                <span className="hidden sm:inline">{proj.title.split(" ")[0]}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Scroll Movement Engine Options Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-2">
        <ScrollMovementControls />
      </div>

      {/* ---------------------------------------------------------------------
          PROJECT 1: PINNED HORIZONTAL GALLERY
          --------------------------------------------------------------------- */}
      {p1 && (
        <div id={p1.id}>
          <HorizontalGallery project={p1} />
        </div>
      )}

      {/* ---------------------------------------------------------------------
          BETWEEN PROJECT 1 -> PROJECT 2 TRANSITION
          --------------------------------------------------------------------- */}
      {p2 && (
        <BetweenProjectsTransition
          nextTitle={p2.title}
          nextIndex={p2.index}
          nextTagline={p2.tagline}
          accentColor={p2.accentColor}
        />
      )}

      {/* ---------------------------------------------------------------------
          PROJECT 2: STICKY STACKED CARDS
          --------------------------------------------------------------------- */}
      {p2 && (
        <div id={p2.id}>
          <StackedCards project={p2} />
        </div>
      )}

      {/* ---------------------------------------------------------------------
          BETWEEN PROJECT 2 -> PROJECT 3 TRANSITION
          --------------------------------------------------------------------- */}
      {p3 && (
        <BetweenProjectsTransition
          nextTitle={p3.title}
          nextIndex={p3.index}
          nextTagline={p3.tagline}
          accentColor={p3.accentColor}
        />
      )}

      {/* ---------------------------------------------------------------------
          PROJECT 3: ASYMMETRIC BENTO GRID + FULLSCREEN LIGHTBOX
          --------------------------------------------------------------------- */}
      {p3 && (
        <div id={p3.id}>
          <BentoLightbox project={p3} />
        </div>
      )}

      {/* ---------------------------------------------------------------------
          SHOWCASE FOOTER HUD
          --------------------------------------------------------------------- */}
      <div className="relative border-t border-white/10 py-12 px-6 lg:px-12 bg-[#06080D]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>3 FLAGSHIP EXPERIENCES &bull; 21 HI-RES PRODUCTION FRAMES</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>GSAP 3 + ScrollTrigger</span>
            <span>&bull;</span>
            <span>Lenis Engine</span>
            <span>&bull;</span>
            <span>GPU Accelerated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
