"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShowcaseProject } from "./showcaseData";
import SplitText from "./SplitText";
import RevealImage from "./RevealImage";
import { ExternalLink, Layers, Film } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StackedCardsProps {
  project: ShowcaseProject;
}

/**
 * PROJECT 2: STICKY STACKED CARDS
 *
 * - Intro block with masked line title, word-by-word fade-up description, and meta row.
 * - 7 sticky cards stacked vertically.
 * - As the next card slides over the previous card, the previous card scales down to 0.92
 *   and fades slightly (opacity: 0.42).
 * - Live slide counter (01/07) and thin progress line pinned alongside.
 * - Respects prefers-reduced-motion.
 */
export default function StackedCards({ project }: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const container = containerRef.current;
      if (!container) return;

      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (!cards.length) return;

      const ctx = gsap.context(() => {
        // Master scroll trigger to track overall project progress and counter
        ScrollTrigger.create({
          trigger: container,
          start: "top top+=100",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            const idx = Math.min(
              cards.length,
              Math.max(1, Math.round(self.progress * (cards.length - 1)) + 1)
            );
            setActiveIndex(idx);
          },
        });

        // Individual card stacking animations: as card i+1 overlaps card i,
        // card i scales down to 0.92 and fades to 0.42.
        cards.forEach((card, i) => {
          if (i < cards.length - 1) {
            const nextCard = cards[i + 1];
            gsap.to(card, {
              scale: 0.92,
              opacity: 0.42,
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top 75%",
                end: "top 25%",
                scrub: true,
              },
            });
          }
        });
      }, container);

      return () => ctx.revert();
    }
  }, [project.images.length]);

  return (
    <div className="relative w-full border-t border-white/10 bg-[#090B10]">
      {/* ---------------------------------------------------------------------
          INTRO BLOCK
          --------------------------------------------------------------------- */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 lg:pt-32 lg:pb-20">
        {/* Project Header Tag & Live Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold border"
              style={{
                borderColor: `${project.accentColor}55`,
                backgroundColor: `${project.accentColor}15`,
                color: project.accentColor,
              }}
            >
              {project.index}
            </span>
            <span className="text-xs uppercase tracking-widest font-mono text-slate-400">
              PROJECT {project.index} &bull; STICKY STACKED CARDS
            </span>
          </div>

          {/* External links */}
          <div className="flex items-center gap-3">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-indigo-400" />
                <span>1080p Video</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <span>Live Deploy</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>

        {/* Title: Masked Slide-Up Reveal (lines) */}
        <SplitText
          as="h2"
          type="lines"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase font-display"
        >
          {project.title}
        </SplitText>

        {/* Tagline / Subtitle */}
        <p className="text-lg md:text-xl text-amber-300 font-medium tracking-wide mb-8 max-w-3xl">
          {project.tagline}
        </p>

        {/* Description: Word-by-word fade-up */}
        <div className="max-w-3xl mb-12">
          <SplitText
            as="p"
            type="words"
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-body"
          >
            {project.description}
          </SplitText>
        </div>

        {/* Meta Row: Role / Year / Tools / Client */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Role
            </span>
            <p className="text-sm font-semibold text-slate-200">{project.role}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Timeline
            </span>
            <p className="text-sm font-semibold text-slate-200">{project.year}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Client
            </span>
            <p className="text-sm font-semibold text-slate-200">{project.client}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Core Tech
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {project.tools.slice(0, 3).map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
                >
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          STICKY STACKED CARDS CONTAINER
          --------------------------------------------------------------------- */}
      <div
        ref={containerRef}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32"
      >
        {/* Sticky HUD: Slide counter and Thin Progress Line */}
        <div className="sticky top-20 z-40 mb-8 py-3 px-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-amber-400" />
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white tracking-wider">
              <span className="text-amber-400">
                {String(activeIndex).padStart(2, "0")}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">
                {String(project.images.length).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400 hidden sm:inline">
              STACKED PERSPECTIVES &bull; SCROLL DOWN
            </span>
          </div>

          {/* Thin scroll-progress line inside HUD */}
          <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden ml-4">
            <div
              className="h-full rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(5, scrollProgress * 100)}%`,
                backgroundColor: project.accentColor || "#FFB000",
                boxShadow: `0 0 10px ${project.accentColor || "#FFB000"}`,
              }}
            />
          </div>
        </div>

        {/* Vertical Stack of 7 Sticky Cards */}
        <div className="space-y-16 md:space-y-24">
          {project.images.map((img, idx) => (
            <div
              key={img.id || idx}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              style={{
                top: `${110 + idx * 12}px`, // Slight top cascade
              }}
              className="sticky rounded-3xl bg-[#0D101A] border border-white/15 shadow-2xl p-4 sm:p-6 md:p-8 transform-gpu will-change-[transform,opacity] transition-shadow duration-300"
            >
              {/* Card Header: Number & Tag */}
              <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white/90">
                    0{idx + 1}
                  </span>
                  <div className="h-4 w-px bg-white/20" />
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    {img.tag || `STAGE 0${idx + 1}`}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {idx + 1} of {project.images.length}
                </span>
              </div>

              {/* Reveal Image with Clip-path and Cursor interaction */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10">
                <RevealImage
                  src={img.url}
                  alt={img.alt}
                  aspectRatio="aspect-[16/10]"
                  cursorLabel="View"
                  parallaxPercent={6}
                  className="w-full"
                />
              </div>

              {/* Card Footer: Caption */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm sm:text-base font-medium text-slate-200">
                  {img.caption}
                </p>
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  {project.title} &mdash; 2026
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
