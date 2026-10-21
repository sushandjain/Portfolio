"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SplitTextProps {
  /** Text content to animate */
  children: string;
  /** "lines" for masked slide-up headers, "words" for word-by-word fade-up descriptions */
  type?: "lines" | "words";
  /** Optional container element tag */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Additional CSS classes */
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Stagger interval between lines or words (default 0.08s for lines, 0.025s for words) */
  stagger?: number;
  /** Duration of reveal in seconds (default 1.0s) */
  duration?: number;
  /** ScrollTrigger start position (e.g. "top 85%") */
  triggerStart?: string;
  /** Custom accent or highlight word to style differently */
  highlightWord?: string;
  /** Custom highlight class */
  highlightClassName?: string;
}

/**
 * SplitText component for premium typography reveals.
 *
 * - "lines": Each line is wrapped in an overflow-hidden mask. The inner text slides up
 *   from yPercent: 120 -> 0 with a 0.08s stagger and cubic-bezier(0.16, 1, 0.3, 1) easing.
 * - "words": Each word fades and drifts up (opacity: 0, y: 16 -> opacity: 1, y: 0).
 * - Respects prefers-reduced-motion: skips motion and renders fully visible text immediately.
 * - Animates ONLY transform and opacity.
 */
export default function SplitText({
  children,
  type = "lines",
  as: Component = "div",
  className = "",
  delay = 0,
  stagger,
  duration = 1.0,
  triggerStart = "top 85%",
  highlightWord,
  highlightClassName = "text-indigo-400",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user's motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const el = containerRef.current;
    const items = el.querySelectorAll<HTMLElement>(".split-target");
    if (!items.length) return;

    // Use cubic-bezier(0.16, 1, 0.3, 1)
    const customEase = "power4.out"; // Matches cubic-bezier(0.16, 1, 0.3, 1) curve profile closely

    const computedStagger = stagger ?? (type === "lines" ? 0.08 : 0.025);

    // Initial state before reveal
    if (type === "lines") {
      gsap.set(items, { yPercent: 120, opacity: 1 });
    } else {
      gsap.set(items, { y: 18, opacity: 0 });
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: triggerStart,
        once: true,
        onEnter: () => {
          if (type === "lines") {
            gsap.to(items, {
              yPercent: 0,
              duration,
              delay,
              stagger: computedStagger,
              ease: customEase,
            });
          } else {
            gsap.to(items, {
              y: 0,
              opacity: 1,
              duration: duration * 0.85,
              delay,
              stagger: computedStagger,
              ease: customEase,
            });
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, type, delay, stagger, duration, triggerStart, children]);

  // If user prefers reduced motion, render clean markup without hidden spans
  if (reducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  if (type === "lines") {
    // Split text by explicit newline (\n) or treat as single line
    const lines = children.split("\n");

    return (
      <Component
        ref={containerRef as any}
        className={`split-text-lines ${className}`}
        aria-label={children}
      >
        {lines.map((line, idx) => (
          <span
            key={idx}
            className="block overflow-hidden pb-1"
            style={{ display: "block" }}
          >
            <span
              className="split-target inline-block will-change-transform"
              style={{ transform: "translateY(120%)" }}
            >
              {line}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  // Word-by-word split
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Component
      ref={containerRef as any}
      className={`split-text-words ${className}`}
      aria-label={children}
    >
      {words.map((word, idx) => {
        const isHighlight =
          highlightWord &&
          word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <span
            key={idx}
            className="inline-block mr-[0.28em] last:mr-0 overflow-hidden align-top"
          >
            <span
              className={`split-target inline-block will-change-[transform,opacity] ${
                isHighlight ? highlightClassName : ""
              }`}
              style={{ opacity: 0, transform: "translateY(18px)" }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Component>
  );
}
