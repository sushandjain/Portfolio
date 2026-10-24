"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShowcaseProject, ShowcaseImage } from "./showcaseData";
import SplitText from "./SplitText";
import RevealImage from "./RevealImage";
import KineticVideoCard from "./KineticVideoCard";
import {
  ExternalLink,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Film,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BentoLightboxProps {
  project: ShowcaseProject;
}

/**
 * PROJECT 3: ASYMMETRIC BENTO GRID + FULLSCREEN LIGHTBOX
 *
 * - Intro block with masked title line reveals, word-by-word fade-up description, and meta row.
 * - 7 images arranged in an asymmetrical Bento grid with varied spans and aspect ratios.
 * - Staggered fade and scale-in entrance on scroll.
 * - Fullscreen Lightbox with shared-element transition feel:
 *   - Arrow-key navigation (Left/Right)
 *   - Drag-to-swipe on touch & mouse
 *   - Escape key to close
 *   - Live counter (01/07) & thin progress line
 * - Respects prefers-reduced-motion.
 */
export default function BentoLightbox({ project }: BentoLightboxProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  // Staggered Bento Grid Entrance on Scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const grid = gridRef.current;
      if (!grid) return;

      const items = grid.querySelectorAll(".bento-item");
      if (!items.length) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: grid,
              start: "top 80%",
              once: true,
            },
          }
        );
      }, grid);

      return () => ctx.revert();
    }
  }, []);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % project.images.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + project.images.length) % project.images.length
            : null
        );
      }
    },
    [lightboxIndex, project.images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, handleKeyDown]);

  // Drag to swipe handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setIsDragging(true);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragDeltaX(clientX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragDeltaX > 50) {
      // Swiped right -> go to previous
      setLightboxIndex((prev) =>
        prev !== null
          ? (prev - 1 + project.images.length) % project.images.length
          : null
      );
    } else if (dragDeltaX < -50) {
      // Swiped left -> go to next
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % project.images.length : null
      );
    }
    setDragStartX(null);
    setDragDeltaX(0);
  };

  // Bento span classes for 7 images (responsive 12-col layout)
  const getBentoSpan = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-12 lg:col-span-8";
      case 1:
        return "col-span-12 sm:col-span-6 lg:col-span-4";
      case 2:
        return "col-span-12 sm:col-span-6 lg:col-span-4";
      case 3:
        return "col-span-12 lg:col-span-8";
      case 4:
        return "col-span-12 sm:col-span-4";
      case 5:
        return "col-span-12 sm:col-span-4";
      case 6:
        return "col-span-12 sm:col-span-4";
      default:
        return "col-span-12 sm:col-span-6";
    }
  };

  const currentImage: ShowcaseImage | null =
    lightboxIndex !== null ? project.images[lightboxIndex] : null;

  return (
    <div className="relative w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300">
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
            <span className="text-xs uppercase tracking-widest font-mono text-[var(--text-muted)]">
              PROJECT {project.index} &bull; BENTO GRID &amp; LIGHTBOX
            </span>
          </div>

          {/* External links */}
          <div className="flex items-center gap-3">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-sm"
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] shadow-sm transition-colors"
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] shadow-sm transition-colors"
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-main)] mb-6 uppercase font-display"
        >
          {project.title}
        </SplitText>

        {/* Tagline / Subtitle */}
        <p
          className="text-lg md:text-xl font-medium tracking-wide mb-8 max-w-3xl"
          style={{ color: project.accentColor }}
        >
          {project.tagline}
        </p>

        {/* Description: Word-by-word fade-up */}
        <div className="max-w-3xl mb-12">
          <SplitText
            as="p"
            type="words"
            className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-body"
          >
            {project.description}
          </SplitText>
        </div>

        {/* Meta Row: Role / Year / Tools / Client */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[var(--border-subtle)]">
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
          ASYMMETRIC BENTO GRID (7 Images)
          --------------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-32">
        {/* Bento Grid Header HUD */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-4 h-4" style={{ color: project.accentColor }} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
              EXPLORATORY BENTO MATRIX
            </span>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            CLICK ANY CARD TO EXPAND FULLSCREEN
          </span>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start"
        >
          {/* Premier Video with Scroll Movement Effect */}
          {project.videoUrl && (
            <div className="bento-item col-span-12 mb-2 rounded-3xl overflow-hidden">
              <KineticVideoCard
                videoUrl={project.videoUrl}
                title={project.title}
                tagline={project.tagline}
                accentColor={project.accentColor}
                badge={
                  project.id.includes("tunexia") || project.title.toLowerCase().includes("tunexia")
                    ? "1080P AUDIO STREAMING ARCHITECTURE"
                    : "1080P KUDREMUKH EXPEDITION DISPATCH"
                }
                aspectRatio="aspect-[16/9]"
              />
            </div>
          )}

          {project.images.map((img, idx) => (
            <div
              key={img.id || idx}
              data-cursor-label="View"
              onClick={() => setLightboxIndex(idx)}
              className={`bento-item ${getBentoSpan(
                idx
              )} group relative cursor-pointer rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10`}
            >
              <RevealImage
                src={img.url}
                alt={img.alt}
                caption={img.caption}
                tag={img.tag || `MODULE 0${idx + 1}`}
                index={idx + 1}
                aspectRatio={
                  idx === 0 || idx === 3
                    ? "aspect-[16/10]"
                    : "aspect-[4/3]"
                }
                cursorLabel="View"
                parallaxPercent={4}
                className="w-full"
              >
                {/* Hover expand icon */}
                <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </RevealImage>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          FULLSCREEN LIGHTBOX MODAL (Shared-Element feel)
          --------------------------------------------------------------------- */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/95 backdrop-blur-2xl p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxIndex(null);
            }
          }}
        >
          {/* Top Bar HUD */}
          <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              {/* Live Counter */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 font-mono text-xs font-bold text-white tracking-widest shadow-lg">
                <span style={{ color: project.accentColor }}>
                  {String(lightboxIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">
                  {String(project.images.length).padStart(2, "0")}
                </span>
              </div>

              <span className="text-xs uppercase font-mono tracking-wider text-slate-300 hidden sm:inline">
                {currentImage.tag || project.title}
              </span>
            </div>

            {/* Close Button & Instructions */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 hidden md:inline">
                [ESC] or click outside to close
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox"
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Container with Drag to Swipe */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {/* Nav Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null
                    ? (prev - 1 + project.images.length) % project.images.length
                    : null
                );
              }}
              aria-label="Previous Image"
              className="absolute left-2 sm:left-6 z-30 w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all duration-200 active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev !== null ? (prev + 1) % project.images.length : null
                );
              }}
              aria-label="Next Image"
              className="absolute right-2 sm:right-6 z-30 w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all duration-200 active:scale-90 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Active Display Image */}
            <div
              className="relative max-w-5xl w-full h-[70vh] rounded-2xl overflow-hidden border border-white/15 bg-black/50 shadow-2xl transition-transform duration-150 ease-out"
              style={{
                transform: `translateX(${dragDeltaX}px)`,
              }}
            >
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Bottom Bar: Caption and Progress Line */}
          <div className="z-20 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-slate-200">
                {currentImage.caption}
              </p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {currentImage.alt}
              </p>
            </div>

            {/* Thin Progress Line */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden self-center sm:self-auto">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${
                    ((lightboxIndex + 1) / project.images.length) * 100
                  }%`,
                  backgroundColor: project.accentColor,
                  boxShadow: `0 0 10px ${project.accentColor}`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
