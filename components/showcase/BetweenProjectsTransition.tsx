"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BetweenProjectsTransitionProps {
  nextTitle: string;
  nextIndex: string;
  nextTagline: string;
  accentColor?: string;
}

/**
 * BETWEEN PROJECTS TRANSITION
 *
 * Implements the requirement:
 * "A smooth transition: the next project's title scales up and takes over the screen as you scroll."
 *
 * Uses GSAP ScrollTrigger scrub to scale the upcoming project title from scale(0.6) to scale(1.5)
 * while expanding an accent ambient glow, creating a cinematic full-screen takeover.
 */
export default function BetweenProjectsTransition({
  nextTitle,
  nextIndex,
  nextTagline,
  accentColor = "#6366F1",
}: BetweenProjectsTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const container = containerRef.current;
    const title = titleRef.current;
    const glow = glowRef.current;
    const meta = metaRef.current;

    if (!container || !title) return;

    const isMobile = window.innerWidth < 768;
    const targetScale = isMobile ? 1.15 : 1.45;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });

      // Title scales up gracefully without edge clipping on mobile
      tl.fromTo(
        title,
        { scale: 0.7, opacity: 0.25 },
        { scale: targetScale, opacity: 1, ease: "power2.out" }
      );

      // Glow intensifies as title expands
      if (glow) {
        tl.fromTo(
          glow,
          { opacity: 0, scale: 0.5 },
          { opacity: 0.45, scale: isMobile ? 1.05 : 1.3, ease: "power2.out" },
          "<"
        );
      }

      // Meta info fades in
      if (meta) {
        tl.fromTo(
          meta,
          { opacity: 0, y: isMobile ? 15 : 30 },
          { opacity: 1, y: 0, ease: "power2.out" },
          "<0.2"
        );
      }
    }, container);

    return () => ctx.revert();
  }, [accentColor]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[90vh] min-h-[90dvh] lg:min-h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-main)] transition-colors duration-300 py-16 sm:py-24 select-none"
    >
      {/* Dynamic Ambient Glow Circle */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none will-change-[transform,opacity]"
        style={{
          backgroundColor: accentColor,
          opacity: 0,
        }}
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />

      {/* Transitional Label */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <span className="w-8 h-px bg-[var(--border-subtle)]" />
        <span className="text-xs uppercase font-mono tracking-widest text-[var(--text-muted)]">
          TRANSITIONING TO PROJECT {nextIndex}
        </span>
        <span className="w-8 h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Scaling Next Project Title: Screen Takeover */}
      <h2
        ref={titleRef}
        className="relative z-10 text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter text-center uppercase text-[var(--text-main)] px-4 will-change-[transform,opacity]"
        style={{
          textShadow: `0 0 60px ${accentColor}44`,
        }}
      >
        {nextTitle}
      </h2>

      {/* Next Tagline & Downward Arrow Indicator */}
      <div
        ref={metaRef}
        className="relative z-10 flex flex-col items-center mt-8 text-center px-4"
      >
        <p className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] font-medium max-w-xl">
          {nextTagline}
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--text-faint)]">
          <span>KEEP SCROLLING</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[var(--text-main)]" />
        </div>
      </div>
    </div>
  );
}
