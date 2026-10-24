"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShowcaseProject } from "./showcaseData";
import SplitText from "./SplitText";
import RevealImage from "./RevealImage";
import KineticVideoCard from "./KineticVideoCard";
import { ExternalLink, ArrowRight, ArrowLeft, Film } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalGalleryProps {
  project: ShowcaseProject;
}

/**
 * PROJECT 1: PINNED HORIZONTAL GALLERY
 *
 * - Intro block with masked line reveal for title, word-by-word fade-up description,
 *   and staggered meta row.
 * - Pinned desktop gallery: Section pins while 7 images scroll sideways with ScrollTrigger
 *   pin + scrub, inner-image parallax, live counter (01/07 to 07/07), and progress line.
 * - Mobile (<768px): Gracefully switches to a touch-swipe snap carousel with interactive controls.
 * - Respects prefers-reduced-motion.
 */
export default function HorizontalGallery({ project }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop Pinned Horizontal Scroll
  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth + 120;

      const trackTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(getDistance(), 1400)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);

            // Live slide counter: calculate which card is most visible
            const total = project.images.length;
            const current = Math.min(
              total,
              Math.max(1, Math.round(progress * (total - 1)) + 1)
            );
            setActiveIndex(current);
          },
        },
      });

      // Subtle parallax on individual cards inside track
      const cards = track.querySelectorAll(".gallery-card");
      cards.forEach((card) => {
        const img = card.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: trackTween,
                start: "left right",
                end: "right left",
                scrub: 0.5,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, project.images.length]);

  // Mobile scroll observer to update live index
  const handleMobileScroll = () => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.82;
    const index = Math.min(
      project.images.length,
      Math.max(1, Math.round(scrollLeft / cardWidth) + 1)
    );
    setActiveIndex(index);
    setScrollProgress(scrollLeft / (el.scrollWidth - el.clientWidth));
  };

  const scrollMobileTo = (direction: "prev" | "next") => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.85;
    el.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300">
      {/* ---------------------------------------------------------------------
          INTRO BLOCK
          --------------------------------------------------------------------- */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-10 pb-8 sm:pt-20 sm:pb-12 lg:pt-32 lg:pb-20">
        {/* Project Header Tag & Live Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
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
            <span className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]">
              PROJECT {project.index} &bull; PINNED HORIZONTAL GALLERY
            </span>
          </div>

          {/* External links */}
          <div className="flex items-center gap-2 sm:gap-3">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-sm"
                style={{
                  color: project.accentColor,
                  backgroundColor: `${project.accentColor}18`,
                  borderColor: `${project.accentColor}40`,
                }}
              >
                <Film className="w-3.5 h-3.5" style={{ color: project.accentColor }} />
                <span>1080p Video</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] shadow-sm transition-colors"
              >
                <span>Live Deploy</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-faint)]" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] shadow-sm transition-colors"
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
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-main)] mb-4 sm:mb-6 uppercase font-display"
        >
          {project.title}
        </SplitText>

        {/* Tagline / Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl font-medium tracking-wide mb-4 sm:mb-8 max-w-3xl"
          style={{ color: project.accentColor }}
        >
          {project.tagline}
        </p>

        {/* Description: Word-by-word fade-up */}
        <div className="max-w-3xl mb-6 sm:mb-12">
          <SplitText
            as="p"
            type="words"
            className="text-sm sm:text-base md:text-lg text-[var(--text-muted)] leading-relaxed font-body"
          >
            {project.description}
          </SplitText>
        </div>

        {/* Meta Row: Role / Year / Tools / Client */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-[var(--border-subtle)]">
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-1">
              Role
            </span>
            <p className="text-sm font-semibold text-[var(--text-main)]">{project.role}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-1">
              Timeline
            </span>
            <p className="text-sm font-semibold text-[var(--text-main)]">{project.year}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-1">
              Client
            </span>
            <p className="text-sm font-semibold text-[var(--text-main)]">{project.client}</p>
          </div>
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] mb-1">
              Core Tech
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {project.tools.slice(0, 3).map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                >
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--text-faint)]">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          DESKTOP: PINNED HORIZONTAL GALLERY
          --------------------------------------------------------------------- */}
      <div
        ref={sectionRef}
        className="hidden md:block relative w-full h-screen overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300"
      >
        {/* Gallery Top Navigation HUD */}
        <div className="absolute top-6 left-8 right-8 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4">
            {/* Live Counter (01/07) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs font-bold tracking-widest shadow-lg">
              <span style={{ color: project.accentColor }}>
                {String(activeIndex).padStart(2, "0")}
              </span>
              <span className="text-[var(--text-faint)]">/</span>
              <span className="text-[var(--text-muted)]">
                {String(project.images.length).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]">
              SCROLL HORIZONTALLY &bull; DRAG TO EXPLORE
            </span>
          </div>

          <div className="text-xs font-mono text-[var(--text-muted)] hidden lg:block">
            {project.images[activeIndex - 1]?.caption || project.title}
          </div>
        </div>

        {/* Horizontal Track containing 7 image cards */}
        <div className="flex items-center h-full">
          <div
            ref={trackRef}
            className="flex items-center gap-8 lg:gap-12 pl-8 lg:pl-16 pr-24 will-change-transform h-[70vh]"
          >
            {/* Premier Video 1 with Scroll Movement Effect */}
            {project.videoUrl && (
              <div
                data-cursor-label="Watch"
                className="gallery-card relative flex-shrink-0 w-[62vw] lg:w-[48vw] xl:w-[42vw] h-full flex flex-col justify-between group"
              >
                <div className="relative w-full flex-1 overflow-hidden rounded-3xl">
                  <KineticVideoCard
                    videoUrl={project.videoUrl}
                    title={project.title}
                    tagline={project.tagline}
                    accentColor={project.accentColor}
                    badge="1080P DEMO WALKTHROUGH"
                    aspectRatio="aspect-[16/10]"
                  />
                </div>
                <div className="flex items-center justify-between pt-3 px-1 text-xs text-indigo-300 font-mono font-bold">
                  <span>LIVE ARCHITECTURE DEMO &bull; MALNAD SPEED POST ENGINE</span>
                  <span className="text-slate-500">VIDEO 01 / 08</span>
                </div>
              </div>
            )}

            {project.images.map((img, idx) => (
              <div
                key={img.id || idx}
                data-cursor-label="Drag"
                className="gallery-card relative flex-shrink-0 w-[58vw] lg:w-[46vw] xl:w-[40vw] h-full flex flex-col justify-between group"
              >
                {/* Image Component with Clip Reveal and Inner Parallax */}
                <div className="relative w-full flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0F121C]">
                  <RevealImage
                    src={img.url}
                    alt={img.alt}
                    caption={img.caption}
                    tag={img.tag || `FRAME 0${idx + 1}`}
                    index={idx + 1}
                    aspectRatio="aspect-[16/10]"
                    cursorLabel="Drag"
                    parallaxPercent={6}
                    className="w-full h-full"
                  />
                </div>

                {/* Subtitle / Caption row under each card */}
                <div className="flex items-center justify-between pt-3 px-1 text-xs text-slate-400 font-mono">
                  <span className="truncate max-w-[70%] text-slate-300">
                    {img.caption}
                  </span>
                  <span className="text-slate-500">
                    0{idx + 1} &mdash; 0{project.images.length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thin Scroll-Progress Line at the bottom */}
        <div className="absolute bottom-6 left-8 right-8 z-30">
          <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(5, scrollProgress * 100)}%`,
                backgroundColor: project.accentColor || "#6366F1",
                boxShadow: `0 0 12px ${project.accentColor || "#6366F1"}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          MOBILE: TOUCH SWIPE CAROUSEL (< 768px)
          --------------------------------------------------------------------- */}
      <div className="md:hidden relative w-full px-4 pb-16 bg-[var(--bg-secondary)] transition-colors duration-300">
        {/* Mobile Header & Live Counter */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-xs font-bold">
            <span style={{ color: project.accentColor }}>
              {String(activeIndex).padStart(2, "0")}
            </span>
            <span className="text-[var(--text-faint)]">/</span>
            <span className="text-[var(--text-muted)]">
              {String(project.images.length).padStart(2, "0")}
            </span>
          </div>

          {/* Swipe arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollMobileTo("prev")}
              aria-label="Previous slide"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollMobileTo("next")}
              aria-label="Next slide"
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Track with snap */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {project.videoUrl && (
            <div className="w-[88vw] flex-shrink-0 snap-center rounded-2xl overflow-hidden">
              <KineticVideoCard
                videoUrl={project.videoUrl}
                title={project.title}
                tagline={project.tagline}
                accentColor={project.accentColor}
                badge="1080P DEMO"
                aspectRatio="aspect-[16/10]"
              />
            </div>
          )}

          {project.images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="w-[85vw] flex-shrink-0 snap-center rounded-2xl overflow-hidden"
            >
              <RevealImage
                src={img.url}
                alt={img.alt}
                caption={img.caption}
                tag={img.tag || `FRAME 0${idx + 1}`}
                index={idx + 1}
                aspectRatio="aspect-[16/10]"
                parallaxPercent={0}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Mobile Dots Progress */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {project.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx + 1
                  ? "w-6 bg-indigo-500"
                  : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
