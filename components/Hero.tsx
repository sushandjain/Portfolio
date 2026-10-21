"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess, playTick } from "@/lib/sound";
import confetti from "canvas-confetti";
import { ArrowDown, Copy, Check, Terminal, Sliders, Sparkles, Activity, Waves } from "lucide-react";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [stretchValue, setStretchValue] = useState<number>(100);
  const [stretchMode, setStretchMode] = useState<"wave" | "elastic" | "wide" | "compact" | "manual">("wave");
  const heroRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const charRefs1 = useRef<(HTMLSpanElement | null)[]>([]);
  const charRefs2 = useRef<(HTMLSpanElement | null)[]>([]);
  const lastMousePos = useRef({ x: 0, time: 0 });
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

  // Harmonic Letter-by-Letter Wave Physics Engine
  useEffect(() => {
    let rafId = 0;
    let targetX = -1000;
    let currentX = -1000;

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
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

    const updateLetterWave = () => {
      const now = performance.now();

      // Fluid spring lerp for pointer tracking
      currentX += (targetX - currentX) * 0.16;

      if (stretchMode === "wave") {
        if (!isIdle.current && targetX > 0) {
          // PROXIMITY WAVE: Calculate distance of each letter from cursor
          charRefs1.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const rect = charEl.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const dist = Math.abs(currentX - charCenterX);
            const radius = 220; // Influence field width

            // Gaussian bell curve stretch
            const influence = Math.exp(-Math.pow(dist / radius, 2));
            const calculatedStretch = 60 + influence * 90; // 60% to 150%
            charEl.style.setProperty("--char-stretch", calculatedStretch.toFixed(1));

            // Subtle vertical wave lift
            const lift = influence * -6;
            charEl.style.transform = `translateY(${lift.toFixed(1)}px)`;
          });

          // Inverse wave for Line 2 (JAIN) - Creates dynamic accordion interplay
          charRefs2.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const rect = charEl.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const dist = Math.abs(currentX - charCenterX);
            const radius = 220;

            const influence = Math.exp(-Math.pow(dist / radius, 2));
            const calculatedStretch = 150 - influence * 85; // Counter-accordion
            charEl.style.setProperty("--char-stretch", calculatedStretch.toFixed(1));

            const lift = influence * 4;
            charEl.style.transform = `translateY(${lift.toFixed(1)}px)`;
          });
        } else {
          // AMBIENT OCEAN BREATHE: Smooth continuous harmonic sine wave when idle
          charRefs1.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const wave = 100 + Math.sin(now * 0.0025 + idx * 0.7) * 42;
            charEl.style.setProperty("--char-stretch", wave.toFixed(1));
            charEl.style.transform = `translateY(${Math.sin(now * 0.0025 + idx * 0.7) * -3}px)`;
          });

          charRefs2.current.forEach((charEl, idx) => {
            if (!charEl) return;
            const wave = 105 - Math.sin(now * 0.0025 + idx * 0.8) * 42;
            charEl.style.setProperty("--char-stretch", wave.toFixed(1));
            charEl.style.transform = `translateY(${Math.cos(now * 0.0025 + idx * 0.8) * 3}px)`;
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
    rafId = requestAnimationFrame(updateLetterWave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
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
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Interactive Ambient Particle Constellation Canvas */}
      <HeroCanvasMesh />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Controller Dock / Konrad Makowski Stretch Playground */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel text-xs font-mono text-[var(--text-muted)] shadow-sm">
          <span className="pulse-green" />
          <span className="font-bold text-[var(--text-main)]">AVAILABLE FOR PRODUCTION ROLES</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>SYSTEMS ENGINEER @ TCS</span>
        </div>

        {/* Stretch Mode Dock */}
        <div className="flex flex-wrap items-center gap-3 glass-panel px-4 py-2 rounded-2xl shadow-sm text-xs font-mono">
          <div className="flex items-center gap-2">
            <Waves size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-[var(--text-faint)]">KINETIC MODE:</span>
          </div>

          {/* Mode Preset Buttons */}
          <div className="flex items-center gap-1">
            {[
              { id: "wave", label: "Harmonic Wave" },
              { id: "elastic", label: "Elastic Pulse" },
              { id: "wide", label: "Wide" },
              { id: "compact", label: "Compact" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id as "wave" | "elastic" | "wide" | "compact")}
                className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  stretchMode === m.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Interactive Range Slider */}
          <div className="flex items-center gap-2 border-l border-[var(--border-subtle)] pl-3">
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
            <span className="text-indigo-400 font-bold min-w-[36px] text-[11px]">{stretchValue}%</span>
          </div>
        </div>
      </div>

      {/* Main Kinetic Stretch Folio Display Typography */}
      <div className="w-full max-w-7xl mx-auto my-auto select-none py-4">
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
              className="stretch-char"
              onMouseEnter={() => playTick(700 + i * 50)}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Line 2: JAIN (Inverted Stroke / Hollow Accordion) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mt-2">
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
                className="stretch-char stretch-char-stroke"
                onMouseEnter={() => playTick(800 + i * 60)}
              >
                {char}
              </span>
            ))}
          </h2>

          {/* Subtitle / Focus Callout */}
          <div className="max-w-md space-y-2 text-left md:text-right self-start md:self-end md:pb-4">
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium leading-relaxed">
              <span className="text-[var(--text-main)] font-semibold">Systems Engineer at TCS</span> &amp;{" "}
              <span className="text-indigo-400 font-semibold">Full-Stack Architect</span> crafting high-throughput REST APIs, progressive streaming engines, and resilient e-commerce platforms.
            </p>
            <div className="flex items-center justify-start md:justify-end gap-3 text-xs font-mono text-[var(--text-faint)]">
              <span>BENGALURU, INDIA</span>
              <span>✦</span>
              <span>12.9716° N, 77.5946° E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Dock */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[var(--border-subtle)]">
        {/* Left: Quick Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#work"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-primary text-xs"
          >
            <span>Explore Works</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>

          <a
            href="#systems"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-ghost text-xs"
          >
            <Terminal size={14} className="text-emerald-400" />
            <span>Launch API Console</span>
          </a>
        </div>

        {/* Right: Quick Copy Email Pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-indigo-500/40 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">Email Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-indigo-400" />
                <span>{personalInfo.email}</span>
                <span className="text-[10px] text-[var(--text-faint)] uppercase">(Copy)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
