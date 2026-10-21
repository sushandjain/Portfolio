"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * ShowcaseCursor component:
 * - Follows mouse with smooth GSAP quickTo (transform only).
 * - Detects `data-cursor-label="View"` or `"Drag"` on hovered elements.
 * - Expands into a branded circular badge with the label.
 * - Hidden on mobile, touchscreens (pointer: coarse), and when mouse leaves window.
 * - Respects prefers-reduced-motion.
 */
export default function ShowcaseCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const [cursorState, setCursorState] = useState<{
    visible: boolean;
    label: string;
    isHovering: boolean;
  }>({
    visible: false,
    label: "",
    isHovering: false,
  });

  useEffect(() => {
    // Hide cursor on touch devices or reduced motion
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReduced) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickTo for 120fps butter-smooth mouse tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      // Find nearest element with data-cursor-label
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor-label]") as HTMLElement | null;

      if (cursorTarget) {
        const label = cursorTarget.getAttribute("data-cursor-label") || "View";
        setCursorState({
          visible: true,
          label: label.toUpperCase(),
          isHovering: true,
        });
      } else {
        setCursorState((prev) =>
          prev.isHovering
            ? { visible: false, label: "", isHovering: false }
            : prev
        );
      }
    };

    const handleMouseLeave = () => {
      setCursorState({ visible: false, label: "", isHovering: false });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Return nothing on SSR or if hovering is false
  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] hidden md:flex items-center justify-center rounded-full transition-opacity duration-200 ${
        cursorState.visible && cursorState.isHovering ? "opacity-100" : "opacity-0"
      }`}
      style={{
        width: 82,
        height: 82,
        willChange: "transform, opacity",
      }}
      aria-hidden="true"
    >
      {/* Outer frosted glass circle */}
      <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-md border border-white/30 shadow-2xl shadow-indigo-500/20 transform scale-100 transition-transform duration-300 ease-out" />

      {/* Subtle glowing ring pulse */}
      <div className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping opacity-25" />

      {/* Label text */}
      <span
        ref={textRef}
        className="relative z-10 text-[11px] font-mono font-bold tracking-widest text-white uppercase select-none drop-shadow-sm flex items-center gap-1"
      >
        {cursorState.label === "DRAG" && <span className="text-[10px]">‹</span>}
        {cursorState.label || "VIEW"}
        {cursorState.label === "DRAG" && <span className="text-[10px]">›</span>}
      </span>
    </div>
  );
}
