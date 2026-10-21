"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface RevealImageProps {
  /** Image source URL */
  src: string;
  /** Image alt text */
  alt: string;
  /** Optional caption displayed below or on hover */
  caption?: string;
  /** Optional tag badge (e.g. "ARCHITECTURE", "CHECKOUT") */
  tag?: string;
  /** Slide index or badge label (e.g. "01") */
  index?: string | number;
  /** Custom aspect ratio class (e.g. "aspect-[16/10]", "aspect-[4/3]") */
  aspectRatio?: string;
  /** Cursor label when hovering this image: "View" or "Drag" */
  cursorLabel?: "View" | "Drag";
  /** Optional click handler (e.g. to open in Lightbox) */
  onClick?: () => void;
  /** Parallax shift magnitude in percent (default 8) */
  parallaxPercent?: number;
  /** Animation duration in seconds (default 1.1s) */
  duration?: number;
  /** Delay before reveal in seconds */
  delay?: number;
  /** Additional container classes */
  className?: string;
  /** Next.js Image priority */
  priority?: boolean;
  /** Extra children overlay */
  children?: React.ReactNode;
}

/**
 * RevealImage component implementing the exact motion rules:
 * - Clip-path inset reveal: inset(100% 0 0 0) -> inset(0% 0% 0% 0%)
 * - Scale reveal: scale(1.25) -> scale(1.0)
 * - Scroll parallax: translateY from -8% to +8% scrubbed to scroll
 * - Hover scale: 0.3s snappy hover zoom
 * - Cursor label data attributes for morphing custom cursor
 * - Respects prefers-reduced-motion
 */
export default function RevealImage({
  src,
  alt,
  caption,
  tag,
  index,
  aspectRatio = "aspect-[16/10]",
  cursorLabel = "View",
  onClick,
  parallaxPercent = 8,
  duration = 1.1,
  delay = 0,
  className = "",
  priority = false,
  children,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clipWrapRef = useRef<HTMLDivElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current || !clipWrapRef.current || !imgWrapRef.current) return;

    const container = containerRef.current;
    const clipWrap = clipWrapRef.current;
    const imgWrap = imgWrapRef.current;

    const ctx = gsap.context(() => {
      // 1. Initial State: clipped from bottom, scaled up 1.25
      gsap.set(clipWrap, {
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(imgWrap, {
        scale: 1.25,
      });

      // 2. Reveal on ScrollTrigger enter
      ScrollTrigger.create({
        trigger: container,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(clipWrap, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration,
            delay,
            ease: "power4.out",
          });
          gsap.to(imgWrap, {
            scale: 1.0,
            duration,
            delay,
            ease: "power4.out",
          });
        },
      });

      // 3. Subtle Parallax Scrub: ±parallaxPercent translateY
      if (parallaxPercent > 0) {
        gsap.fromTo(
          imgWrap,
          { yPercent: -parallaxPercent },
          {
            yPercent: parallaxPercent,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [reducedMotion, duration, delay, parallaxPercent]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      data-cursor-label={cursorLabel}
      className={`group relative overflow-hidden rounded-2xl bg-[#0F121C] border border-white/10 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Clip-path reveal container */}
      <div
        ref={clipWrapRef}
        className="w-full h-full overflow-hidden will-change-[clip-path]"
        style={
          reducedMotion
            ? { clipPath: "none" }
            : { clipPath: "inset(100% 0% 0% 0%)" }
        }
      >
        {/* Inner Parallax Image Wrap */}
        <div
          ref={imgWrapRef}
          className={`relative w-full h-full ${aspectRatio} will-change-transform transition-transform duration-300 ease-out group-hover:scale-[1.03]`}
          style={reducedMotion ? {} : { transform: "scale(1.25)" }}
        >
          {!hasError ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              priority={priority}
              onError={() => setHasError(true)}
              className="object-cover object-top select-none pointer-events-none"
            />
          ) : (
            // Stylish fallback poster if asset fails
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/40 via-[#0A0D18] to-emerald-950/30">
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono mb-2">
                {tag || "SHOWCASE ASSET"}
              </span>
              <p className="text-sm font-medium text-slate-300 max-w-xs">
                {alt}
              </p>
              {caption && (
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 max-w-xs">
                  {caption}
                </p>
              )}
            </div>
          )}

          {/* Vignette & Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

          {/* Glass reflection shine on top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Badges / Header overlay */}
      {(index || tag) && (
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          {index && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-black/60 backdrop-blur-md text-white/90 border border-white/15 shadow-sm">
              {typeof index === "number" ? String(index).padStart(2, "0") : index}
            </span>
          )}
          {tag && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-indigo-500/20 backdrop-blur-md text-indigo-300 border border-indigo-500/30 shadow-sm ml-auto">
              {tag}
            </span>
          )}
        </div>
      )}

      {/* Caption overlay at bottom */}
      {caption && (
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#090B10] via-[#090B10]/80 to-transparent z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">
            {caption}
          </p>
        </div>
      )}

      {/* Optional custom children */}
      {children}
    </div>
  );
}
