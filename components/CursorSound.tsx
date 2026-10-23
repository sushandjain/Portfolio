"use client";

import { useEffect, useRef, useState } from "react";
import { playTick } from "@/lib/sound";

export default function CursorSound() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [hasPointer, setHasPointer] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string>("");

  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const velocity = useRef({ x: 0, y: 0, speed: 0, angle: 0 });
  const lastTime = useRef(performance.now());
  const hoverState = useRef<string | null>(null);

  useEffect(() => {
    // Only enable custom cursor on fine pointers (desktops/laptops)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setHasPointer(true);

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      lastTime.current = now;

      const dx = e.clientX - mousePos.current.x;
      const dy = e.clientY - mousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt * 16; // Pixels per frame
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      velocity.current = {
        x: dx,
        y: dy,
        speed: Math.min(speed, 50),
        angle: angle,
      };

      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    // Smooth animation loop for trailing fluid velocity-stretching ring
    let rafId = 0;
    const tick = () => {
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      // Calculate fluid stretch based on speed
      const isHovering = !!hoverState.current;
      const speed = velocity.current.speed;
      const angle = velocity.current.angle;

      // Decay velocity speed smoothly
      velocity.current.speed *= 0.88;

      if (ringRef.current) {
        if (isHovering) {
          // Morph into an interactive pill badge
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(1)`;
        } else {
          // Elastic velocity stretching
          const stretchX = 1 + Math.min(speed * 0.025, 1.2);
          const stretchY = 1 / Math.sqrt(stretchX);
          ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) rotate(${angle}deg) scale(${stretchX}, ${stretchY})`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Detect interactive elements for cursor expansion & contextual labeling
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const projectRow = target.closest(".project-row, .glass-panel[data-project]");
      const driveLink = target.closest("a[href*='drive.google.com']");
      const liveLink = target.closest("a[href*='vercel.app'], a[href*='netlify.app']");
      const stretchChar = target.closest(".stretch-char");
      const sayHello = target.closest("#contact a, [data-cta]");
      const techPill = target.closest(".tech-pill");
      const skillCard = target.closest(".group\\/item");
      const navLink = target.closest("header nav a");
      const slider = target.closest("input[type='range']");
      const interactive = target.closest("a, button, input, [role='button'], .cursor-interactive");

      if (projectRow) {
        hoverState.current = "project";
        setCursorLabel("VIEW");
      } else if (driveLink) {
        hoverState.current = "drive";
        setCursorLabel("DRIVE ↗");
      } else if (liveLink) {
        hoverState.current = "live";
        setCursorLabel("LAUNCH ↗");
      } else if (stretchChar) {
        hoverState.current = "stretch";
        setCursorLabel("STRETCH");
        playTick(600 + Math.random() * 350);
      } else if (sayHello) {
        hoverState.current = "hello";
        setCursorLabel("DISPATCH ↗");
      } else if (techPill) {
        hoverState.current = "tech";
        setCursorLabel("TECH");
      } else if (skillCard) {
        hoverState.current = "skill";
        setCursorLabel("SKILL");
      } else if (navLink) {
        hoverState.current = "nav";
        setCursorLabel("NAV");
      } else if (slider) {
        hoverState.current = "slider";
        setCursorLabel("SLIDE");
      } else if (interactive) {
        hoverState.current = "interactive";
        setCursorLabel("");
      } else {
        hoverState.current = null;
        setCursorLabel("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  if (!hasPointer) return null;

  const isExpanded = !!hoverState.current;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          backgroundColor: isExpanded ? "transparent" : "var(--accent-primary)",
          boxShadow: isExpanded ? "none" : "0 0 10px var(--accent-primary)",
        }}
      />

      {/* Fluid Trailing Velocity-Stretching Ring / Morphing Badge */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[background-color,border-color,width,height,padding,color] duration-150 flex items-center justify-center font-mono font-bold text-[9px] uppercase tracking-widest ${
          isExpanded
            ? "px-3 py-1.5 rounded-full bg-white text-black shadow-2xl border-none"
            : "w-8 h-8 rounded-full border border-white/30 bg-white/5"
        }`}
        style={{
          backdropFilter: isExpanded ? "none" : "blur(2px)",
          mixBlendMode: isExpanded ? "difference" : "normal",
        }}
      >
        {isExpanded && cursorLabel && (
          <span ref={labelRef} className="animate-fade-in select-none">
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}
