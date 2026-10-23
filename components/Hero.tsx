"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess, playTick } from "@/lib/sound";
import confetti from "canvas-confetti";
import { ArrowDown, Copy, Check, Briefcase, Sliders, Waves, ArrowUpRight, Trophy, Award, Code2 } from "lucide-react";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [stretchValue, setStretchValue] = useState<number>(100);
  const [stretchMode, setStretchMode] = useState<"wave" | "elastic" | "wide" | "compact" | "manual">("wave");
  const heroRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const charRefs1 = useRef<(HTMLSpanElement | null)[]>([]);
  const charRefs2 = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseInHero = useRef(false);
  const isIdle = useRef(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const line1 = "SUSHAN".split("");
  const line2 = "JAIN".split("");

  // Update overall title stretch
  const applyGlobalStretch = useCallback((val: number) => {
    const clamped1 = Math.max(50, Math.min(150, val));
    const clamped2 = Math.max(50, Math.min(150, 205 - val));

    if (title1Ref.current) title1Ref.current.style.setProperty("--stretch", clamped1.toFixed(1));
    if (title2Ref.current) title2Ref.current.style.setProperty("--stretch", clamped2.toFixed(1));

    // Clear individual overrides if manual/wide/compact
    charRefs1.current.forEach((el) => el?.style.removeProperty("--char-stretch"));
    charRefs2.current.forEach((el) => el?.style.removeProperty("--char-stretch"));
  }, []);

  // Harmonic Letter-by-Letter Wave Physics Engine with Fluid Aura Tracking & Mobile Touch Engine
  useEffect(() => {
    let rafId = 0;
    let targetX = -1000;
    let currentX = -1000;
    let targetY = -1000;
    let currentY = -1000;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      mouseInHero.current = true;
      isIdle.current = false;

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isIdle.current = true;
      }, 2500);
    };

    const onPointerLeave = () => {
      mouseInHero.current = false;
    };

    // Mobile touch interaction engine
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        mouseInHero.current = true;
        isIdle.current = false;
        playTick(720);
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        mouseInHero.current = true;
        isIdle.current = false;
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }
    };

    const onTouchEnd = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isIdle.current = true;
        mouseInHero.current = false;
      }, 1000);
    };

    const updateLetterWave = () => {
      const now = performance.now();
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const radius = isMobile ? 120 : 220; // Mobile-tuned influence field

      // Fluid spring lerp for pointer tracking
      currentX += (targetX - currentX) * (isMobile ? 0.22 : 0.16);
      currentY += (targetY - currentY) * (isMobile ? 0.22 : 0.16);

      // Update dynamic fluid aura
      if (auraRef.current && heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const auraX = currentX - heroRect.left;
        const auraY = currentY - heroRect.top;
        auraRef.current.style.transform = `translate3d(${auraX - 250}px, ${auraY - 250}px, 0)`;
        auraRef.current.style.opacity = mouseInHero.current && !isIdle.current ? "0.65" : "0.2";
      }

      if (stretchMode === "wave") {
        if (!isIdle.current && targetX > 0) {
          // PROXIMITY WAVE: Calculate distance of each letter from touch/cursor
          charRefs1.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const rect = charEl.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const dist = Math.abs(currentX - charCenterX);

            // Gaussian bell curve stretch (calibrated to stay within 100vw on 320px+ phones)
            const influence = Math.exp(-Math.pow(dist / radius, 2));
            const calculatedStretch = isMobile ? 65 + influence * 58 : 60 + influence * 90;
            charEl.style.setProperty("--char-stretch", calculatedStretch.toFixed(1));

            // Vertical wave lift (calibrated for mobile viewport bounds)
            const lift = influence * (isMobile ? -3 : -6);
            charEl.style.transform = `translateY(${lift.toFixed(1)}px)`;
          });

          // Inverse wave for Line 2 (JAIN) - Creates dynamic accordion interplay
          charRefs2.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const rect = charEl.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const dist = Math.abs(currentX - charCenterX);

            const influence = Math.exp(-Math.pow(dist / radius, 2));
            const calculatedStretch = isMobile ? 124 - influence * 52 : 150 - influence * 85;
            charEl.style.setProperty("--char-stretch", calculatedStretch.toFixed(1));

            const lift = influence * (isMobile ? 2 : 4);
            charEl.style.transform = `translateY(${lift.toFixed(1)}px)`;
          });
        } else {
          // AMBIENT OCEAN BREATHE: Smooth continuous harmonic sine wave when idle
          charRefs1.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const amplitude = isMobile ? 32 : 42;
            const wave = 100 + Math.sin(now * 0.0028 + idx * 0.72) * amplitude;
            charEl.style.setProperty("--char-stretch", wave.toFixed(1));
            charEl.style.transform = `translateY(${Math.sin(now * 0.0028 + idx * 0.72) * (isMobile ? -2 : -3)}px)`;
          });

          charRefs2.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const amplitude = isMobile ? 32 : 42;
            const wave = 105 - Math.sin(now * 0.0028 + idx * 0.8) * amplitude;
            charEl.style.setProperty("--char-stretch", wave.toFixed(1));
            charEl.style.transform = `translateY(${Math.cos(now * 0.0028 + idx * 0.8) * (isMobile ? 2 : 3)}px)`;
          });
        }
      } else if (stretchMode === "elastic") {
        // Continuous elastic pulse
        charRefs1.current.forEach((charEl, idx) => {
          if (!charEl) return;
          const val = 100 + Math.sin(now * 0.004 + idx * 0.6) * 48;
          charEl.style.setProperty("--char-stretch", val.toFixed(1));
        });
        charRefs2.current.forEach((charEl, idx) => {
          if (!charEl) return;
          const val = 100 - Math.sin(now * 0.004 + idx * 0.6) * 48;
          charEl.style.setProperty("--char-stretch", val.toFixed(1));
        });
      }

      rafId = requestAnimationFrame(updateLetterWave);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    rafId = requestAnimationFrame(updateLetterWave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(rafId);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [stretchMode]);

  // Handle Preset Stretch Modes
  const handleModeChange = (mode: "wave" | "elastic" | "wide" | "compact") => {
    setStretchMode(mode);
    playPop();

    if (mode === "wide") {
      setStretchValue(150);
      applyGlobalStretch(150);
    } else if (mode === "compact") {
      setStretchValue(60);
      applyGlobalStretch(60);
    } else {
      setStretchValue(100);
    }
  };

  // Manual Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setStretchMode("manual");
    setStretchValue(val);
    applyGlobalStretch(val);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    playSuccess();

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#6366F1", "#FFB000", "#10B981"],
      });
    } catch {}

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] min-h-[92dvh] min-h-[92svh] flex flex-col justify-between pt-20 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden touch-manipulation"
    >
      {/* Interactive Ambient Particle Constellation Canvas */}
      <HeroCanvasMesh />

      {/* Dynamic Cursor/Touch-Tracking Fluid Lighting Aura */}
      <div
        ref={auraRef}
        className="pointer-events-none absolute top-0 left-0 w-[420px] sm:w-[500px] h-[420px] sm:h-[500px] rounded-full bg-gradient-to-r from-indigo-500/20 via-cyan-500/15 to-transparent blur-3xl -z-10 transition-opacity duration-500 will-change-transform"
      />

      {/* Background ambient lighting anchors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] h-[240px] sm:h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-4 sm:right-10 w-[240px] sm:w-[350px] h-[240px] sm:h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Controller Dock / Kinetic Stretch Playground */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-panel text-[11px] sm:text-xs font-mono text-[var(--text-muted)] shadow-xs border border-[var(--border-subtle)] w-fit">
          <span className="pulse-green shrink-0" />
          <span className="font-bold text-[var(--text-main)]">AVAILABLE FOR ROLES</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span className="truncate">SYSTEMS ENGINEER @ TCS</span>
        </div>

        {/* Stretch Mode Dock */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xs text-xs font-mono border border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <Waves size={13} className="text-indigo-400 animate-pulse shrink-0" />
            <span className="text-[var(--text-faint)] text-[10px] sm:text-xs uppercase">MODE:</span>
          </div>

          {/* Mode Preset Buttons */}
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)]/70 p-0.5 rounded-xl border border-white/5 shrink-0">
            {[
              { id: "wave", label: "Wave" },
              { id: "elastic", label: "Pulse" },
              { id: "wide", label: "Wide" },
              { id: "compact", label: "Compact" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id as "wave" | "elastic" | "wide" | "compact")}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  stretchMode === m.id
                    ? "bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400/50"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-95"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Interactive Range Slider (hidden on extra small phones, shown on sm+) */}
          <div className="hidden sm:flex items-center gap-2 border-l border-[var(--border-subtle)] pl-3 shrink-0">
            <Sliders size={13} className="text-indigo-400" />
            <input
              type="range"
              min="50"
              max="150"
              value={stretchValue}
              onChange={handleSliderChange}
              aria-label="Typography Stretch Slider"
              className="w-20 sm:w-28 accent-indigo-500 cursor-pointer"
            />
            <span className="text-indigo-400 font-bold min-w-[36px] text-[11px] font-mono">{stretchValue}%</span>
          </div>
        </div>
      </div>

      {/* Floating Live Engineering Metrics - Horizontal Touch Scrollable on Mobile */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-auto sm:px-0 sm:flex-wrap">
        {/* 1. Anthropic Claude Certified */}
        <a
          href="https://www.credly.com/badges/e66a5b5f-9a91-4a17-80c1-05e949d3df51"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playTick(880)}
          className="group shrink-0 px-3 py-1 rounded-full text-[11px] font-mono bg-[#d97757]/12 hover:bg-[#d97757]/20 border border-[#d97757]/35 hover:border-[#d97757]/65 text-[#f59e7a] flex items-center gap-1.5 backdrop-blur-md shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <img src="/claude-badge.png" alt="Claude" className="w-3.5 h-3.5 object-contain" />
          <span><strong className="text-white font-bold">Anthropic</strong> Claude Certified</span>
          <ArrowUpRight size={11} className="text-[#f59e7a] opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 2. 2nd Place TCS AI-Friday Hackathon */}
        <a
          href="https://drive.google.com/file/d/1YRILSJmNRNpKXfT4Fdv1w9ffTBiSL6Z9/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playTick(840)}
          className="group shrink-0 px-3 py-1 rounded-full text-[11px] font-mono bg-amber-500/12 hover:bg-amber-500/20 border border-amber-500/35 hover:border-amber-500/65 text-amber-300 flex items-center gap-1.5 backdrop-blur-md shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Trophy size={12} className="text-amber-400" />
          <span><strong className="text-white font-bold">2nd Place</strong> TCS AI Hackathon</span>
          <ArrowUpRight size={11} className="text-amber-400 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* 3. JSpiders MERN Full Stack Certified */}
        <a
          href="https://drive.google.com/file/d/1KqbAk37MIZkDtMHSjcaNrMSw0QUferVj/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playTick(800)}
          className="group shrink-0 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/12 hover:bg-emerald-500/20 border border-emerald-500/35 hover:border-emerald-500/65 text-emerald-300 flex items-center gap-1.5 backdrop-blur-md shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Code2 size={12} className="text-emerald-400" />
          <span><strong className="text-white font-bold">JSpiders</strong> MERN Certified</span>
          <ArrowUpRight size={11} className="text-emerald-400 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Main Kinetic Stretch Folio Display Typography */}
      <div className="w-full max-w-7xl mx-auto my-auto select-none py-2 sm:py-4">
        {/* Line 1: SUSHAN (Solid High-Contrast, Letter-by-Letter Wave) */}
        <h1
          ref={title1Ref}
          className="stretch-title text-[var(--text-main)] cursor-default tracking-tighter"
          style={{ "--stretch": stretchValue } as React.CSSProperties}
        >
          {line1.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                charRefs1.current[i] = el;
              }}
              className="stretch-char select-none"
              onMouseEnter={() => playTick(700 + i * 50)}
              onTouchStart={() => playTick(700 + i * 50)}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Line 2: JAIN (Inverted Stroke / Hollow Accordion) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 sm:gap-4 mt-1 sm:mt-2">
          <h2
            ref={title2Ref}
            className="stretch-title stretch-stroke text-transparent cursor-default tracking-tighter"
            style={{ "--stretch": 205 - stretchValue } as React.CSSProperties}
          >
            {line2.map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  charRefs2.current[i] = el;
                }}
                className="stretch-char stretch-char-stroke select-none"
                onMouseEnter={() => playTick(800 + i * 60)}
                onTouchStart={() => playTick(800 + i * 60)}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Subtitle / Focus Callout */}
          <div className="max-w-md space-y-2 text-left md:text-right self-start md:self-end md:pb-4 mt-2 sm:mt-0">
            <p className="text-xs sm:text-base text-[var(--text-muted)] font-medium leading-relaxed">
              <span className="text-[var(--text-main)] font-semibold">Systems Engineer at TCS</span> &amp;{" "}
              <span className="text-indigo-400 font-semibold">Full-Stack Architect</span> crafting high-throughput REST APIs, progressive streaming engines, and resilient e-commerce platforms.
            </p>
            <div className="flex items-center justify-start md:justify-end gap-2.5 text-[11px] sm:text-xs font-mono text-[var(--text-faint)]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                BENGALURU, INDIA
              </span>
              <span>✦</span>
              <span>12.9716° N, 77.5946° E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Dock */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-6 pt-5 sm:pt-8 border-t border-[var(--border-subtle)]">
        {/* Left: Quick Actions Grid for mobile */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <a
            href="#work"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-primary text-xs flex items-center justify-center gap-2 py-3 sm:py-2.5 active:scale-95 transition-transform"
          >
            <span>Explore Works</span>
            <ArrowDown size={14} className="animate-bounce shrink-0" />
          </a>

          <a
            href="#experience"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-ghost text-xs flex items-center justify-center gap-2 py-3 sm:py-2.5 active:scale-95 transition-transform"
          >
            <Briefcase size={14} className="text-indigo-400 shrink-0" />
            <span>Career &amp; Honors</span>
          </a>
        </div>

        {/* Right: Quick Copy Email Pill */}
        <div className="w-full sm:w-auto flex items-center justify-stretch sm:justify-end">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-indigo-500/40 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">Email Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-indigo-400" />
                <span className="truncate">{personalInfo.email}</span>
                <span className="text-[10px] text-[var(--text-faint)] uppercase shrink-0">(Copy)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
