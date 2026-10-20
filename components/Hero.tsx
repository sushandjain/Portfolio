"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess, playTick } from "@/lib/sound";
import confetti from "canvas-confetti";
import { ArrowDown, Copy, Check, Terminal, Sliders, Sparkles, Activity } from "lucide-react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [stretchValue, setStretchValue] = useState<number>(100);
  const [stretchMode, setStretchMode] = useState<"pointer" | "rubber" | "wide" | "compact" | "manual">("pointer");
  const heroRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const lastMousePos = useRef({ x: 0, time: 0 });
  const velocity = useRef(0);

  const line1 = "SUSHAN".split("");
  const line2 = "JAIN".split("");

  // Update DOM styles directly for ultra-smooth 60+ FPS motion
  const applyStretch = useCallback((val: number) => {
    const clamped1 = Math.max(50, Math.min(150, val));
    const clamped2 = Math.max(50, Math.min(150, 205 - val));

    if (title1Ref.current) {
      title1Ref.current.style.setProperty("--stretch", clamped1.toFixed(1));
    }
    if (title2Ref.current) {
      title2Ref.current.style.setProperty("--stretch", clamped2.toFixed(1));
    }
  }, []);

  useEffect(() => {
    if (stretchMode !== "pointer") return;

    let targetStretch = 100;
    let currentStretch = 100;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMousePos.current.time);
      const dx = e.clientX - lastMousePos.current.x;

      velocity.current = Math.min(45, (Math.abs(dx) / dt) * 12);
      lastMousePos.current = { x: e.clientX, time: now };

      // Map cursor X across window: 0 to 1 -> stretch from 55% to 150%
      const normalizedX = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      const baseStretch = 55 + normalizedX * 95;

      // Add velocity spring overshoot
      targetStretch = dx > 0 ? baseStretch + velocity.current * 0.4 : baseStretch - velocity.current * 0.4;
    };

    const updateLoop = () => {
      // Fluid spring lerp
      currentStretch += (targetStretch - currentStretch) * 0.12;
      setStretchValue(Math.round(currentStretch));
      applyStretch(currentStretch);
      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("pointermove", onPointerMove);
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [stretchMode, applyStretch]);

  // Handle Preset Stretch Modes
  const handleModeChange = (mode: "pointer" | "rubber" | "wide" | "compact") => {
    setStretchMode(mode);
    playPop();

    if (mode === "wide") {
      setStretchValue(150);
      applyStretch(150);
    } else if (mode === "compact") {
      setStretchValue(60);
      applyStretch(60);
    } else if (mode === "rubber") {
      let step = 0;
      const interval = setInterval(() => {
        step += 0.18;
        const val = 100 + Math.sin(step) * 48;
        setStretchValue(Math.round(val));
        applyStretch(val);
        if (step > Math.PI * 4) clearInterval(interval);
      }, 30);
    }
  };

  // Manual Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setStretchMode("manual");
    setStretchValue(val);
    applyStretch(val);
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
      className="relative min-h-[92vh] pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Kinetic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
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
            <Sliders size={14} className="text-indigo-400" />
            <span className="text-[var(--text-faint)]">STRETCH:</span>
            <span className="text-indigo-400 font-bold min-w-[42px]">{stretchValue}%</span>
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min="50"
            max="150"
            value={stretchValue}
            onChange={handleSliderChange}
            aria-label="Typography Stretch Slider"
            className="w-24 sm:w-32 accent-indigo-500 cursor-pointer"
          />

          {/* Mode Preset Buttons */}
          <div className="flex items-center gap-1 border-l border-[var(--border-subtle)] pl-3">
            {[
              { id: "pointer", label: "Fluid Mouse" },
              { id: "rubber", label: "Elastic" },
              { id: "wide", label: "Wide" },
              { id: "compact", label: "Compact" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeChange(m.id as "pointer" | "rubber" | "wide" | "compact")}
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
        </div>
      </div>

      {/* Main Kinetic Stretch Folio Display Typography */}
      <div className="w-full max-w-7xl mx-auto my-auto select-none py-4">
        {/* Line 1: SUSHAN (Solid High-Contrast) */}
        <h1
          ref={title1Ref}
          className="stretch-title text-[var(--text-main)] cursor-default tracking-tighter"
          style={{ "--stretch": stretchValue } as React.CSSProperties}
        >
          {line1.map((char, i) => (
            <span
              key={i}
              className="stretch-char"
              onMouseEnter={() => playTick(700 + i * 50)}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Line 2: JAIN (Outlined Hollow Accordion Stroke) */}
        <h2
          ref={title2Ref}
          className="stretch-title cursor-default tracking-tighter mt-1"
          style={{
            "--stretch": 205 - stretchValue,
            color: "transparent",
            WebkitTextStroke: "2.5px var(--text-main, #FFFFFF)",
          } as React.CSSProperties}
        >
          {line2.map((char, i) => (
            <span
              key={i}
              className="stretch-char"
              style={{
                WebkitTextStroke: "inherit",
              }}
              onMouseEnter={() => playTick(900 + i * 50)}
            >
              {char}
            </span>
          ))}
        </h2>

        {/* Subtitle Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-indigo-400 font-bold flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400" />
            CRAFTING RESILIENT ARCHITECTURES & VISCERAL INTERFACES
          </span>
        </div>
      </div>

      {/* Bottom Hero Info & CTAs */}
      <div className="w-full max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Bio paragraph */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Full-Stack Developer in Bengaluru building with <strong className="text-[var(--text-main)]">React.js</strong>,{" "}
            <strong className="text-[var(--text-main)]">Node.js</strong>, and{" "}
            <strong className="text-[var(--text-main)]">TypeScript</strong>. Creator of live platforms including{" "}
            <span className="text-emerald-400 font-semibold">Malnad Direct</span> (Western Ghats D2C) and{" "}
            <span className="text-indigo-400 font-semibold">TuneXIA</span> (Cloud Media). Currently ensuring 99.9% reliability and orchestrating REST API workflows as a{" "}
            <strong className="text-[var(--text-main)]">Systems Engineer at TCS</strong>.
          </p>

          {/* Quick Stat Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="tech-pill">
              <span className="text-emerald-400 font-bold">●</span> Malnad Direct Live
            </span>
            <span className="tech-pill">
              <span className="text-indigo-400 font-bold">🎵</span> TuneXIA Music Live
            </span>
            <span className="tech-pill">
              <span className="text-amber-400 font-bold">🏔️</span> Henjodi Stores Live
            </span>
            <span className="tech-pill">
              <span className="text-amber-400 font-bold">🏆</span> TCS AI Hackathon #2
            </span>
            <span className="tech-pill font-mono">
              BCA 8.92 CGPA
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-5 flex flex-wrap items-center lg:justify-end gap-3">
          <a
            href="#work"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-primary"
          >
            <span>Explore Works</span>
            <ArrowDown size={16} />
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="magnetic-btn magnetic-btn-ghost cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-400" />
                <span className="text-emerald-400">Copied Email!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Email</span>
              </>
            )}
          </button>

          <a
            href="#systems"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-ghost font-mono text-xs"
          >
            <Terminal size={14} className="text-indigo-400" />
            <span>API Console</span>
          </a>
        </div>
      </div>
    </section>
  );
}
