"use client";

import { useEffect, useRef, useState } from "react";
import { personalInfo } from "@/lib/data";
import { playPop, playSuccess, playTick } from "@/lib/sound";
import confetti from "canvas-confetti";
import { ArrowDown, Copy, Check, Terminal, ExternalLink, Sparkles, Sliders } from "lucide-react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [stretchValue, setStretchValue] = useState<number>(100);
  const [stretchMode, setStretchMode] = useState<"pointer" | "rubber" | "wide" | "compact">("pointer");
  const heroRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);

  // Character sets for interactive bounce
  const line1 = "SUSHAN".split("");
  const line2 = "JAIN".split("");

  useEffect(() => {
    if (stretchMode !== "pointer") return;

    let targetStretch = 100;
    let currentStretch = 100;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      // Normalize pointer X across window: 0 to 1
      const normalizedX = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      // Map 0 -> 55%, 0.5 -> 100%, 1.0 -> 150%
      targetStretch = 55 + normalizedX * 95;
    };

    const updateLoop = () => {
      // Smooth lerp
      currentStretch += (targetStretch - currentStretch) * 0.12;
      setStretchValue(Math.round(currentStretch));

      if (title1Ref.current) {
        title1Ref.current.style.setProperty("--stretch", currentStretch.toFixed(1));
      }
      if (title2Ref.current) {
        title2Ref.current.style.setProperty("--stretch", (205 - currentStretch).toFixed(1));
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("pointermove", onPointerMove);
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [stretchMode]);

  // Apply manual / preset modes
  const applyMode = (mode: "pointer" | "rubber" | "wide" | "compact") => {
    setStretchMode(mode);
    playPop();
    if (mode === "wide") {
      setStretchValue(150);
      if (title1Ref.current) title1Ref.current.style.setProperty("--stretch", "150");
      if (title2Ref.current) title2Ref.current.style.setProperty("--stretch", "150");
    } else if (mode === "compact") {
      setStretchValue(60);
      if (title1Ref.current) title1Ref.current.style.setProperty("--stretch", "60");
      if (title2Ref.current) title2Ref.current.style.setProperty("--stretch", "60");
    } else if (mode === "rubber") {
      let step = 0;
      const interval = setInterval(() => {
        step += 0.2;
        const val = 100 + Math.sin(step) * 45;
        setStretchValue(Math.round(val));
        if (title1Ref.current) title1Ref.current.style.setProperty("--stretch", val.toFixed(1));
        if (title2Ref.current) title2Ref.current.style.setProperty("--stretch", (200 - val).toFixed(1));
        if (step > Math.PI * 4) clearInterval(interval);
      }, 30);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    playSuccess();

    try {
      confetti({
        particleCount: 50,
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
      {/* Background kinetic decorative circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Controller Dock / Stretch Mode Widget */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
          <span className="pulse-green" />
          <span>Full-Stack Developer · Systems Engineer @ TCS</span>
        </div>

        {/* Stretch Mode Playground Widget */}
        <div className="flex items-center gap-2 bg-[var(--bg-card)]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[var(--border-subtle)] text-xs font-mono">
          <Sliders size={13} className="text-indigo-400" />
          <span className="hidden sm:inline text-[var(--text-faint)]">STRETCH:</span>
          <span className="text-indigo-400 font-bold min-w-[38px]">{stretchValue}%</span>

          <div className="flex items-center gap-1 ml-1">
            {[
              { id: "pointer", label: "Fluid Mouse" },
              { id: "rubber", label: "Elastic" },
              { id: "wide", label: "Wide" },
              { id: "compact", label: "Compact" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => applyMode(m.id as "pointer" | "rubber" | "wide" | "compact")}
                className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold transition-all cursor-pointer ${
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
      <div className="w-full max-w-7xl mx-auto my-auto select-none">
        {/* Line 1: SUSHAN */}
        <h1
          ref={title1Ref}
          className="stretch-title text-[clamp(3.8rem,14.5vw,13.5rem)] text-[var(--text-main)] tracking-tighter cursor-default leading-[0.82]"
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

        {/* Line 2: JAIN (Hollow Outline with Stroke) */}
        <h2
          ref={title2Ref}
          className="stretch-title text-[clamp(3.8rem,14.5vw,13.5rem)] tracking-tighter cursor-default leading-[0.82] mt-1"
          style={{
            "--stretch": stretchValue,
            color: "transparent",
            WebkitTextStroke: "2.5px var(--text-main)",
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

        {/* Subtitle Kinetic Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm sm:text-base font-mono uppercase tracking-[0.25em] text-indigo-400 font-bold">
            ✦ CRAFTING DIGITAL ARCHITECTURES & VISCERAL INTERFACES
          </span>
        </div>
      </div>

      {/* Bottom Hero Info & CTAs */}
      <div className="w-full max-w-7xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Bio paragraph */}
        <div className="lg:col-span-6 space-y-4">
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed">
            I build production web applications with <strong className="text-[var(--text-main)]">React.js</strong>,{" "}
            <strong className="text-[var(--text-main)]">Node.js</strong>, and{" "}
            <strong className="text-[var(--text-main)]">TypeScript</strong>. Currently engineering high-throughput REST APIs,
            troubleshooting large-scale distributed systems, and ensuring 99.9% reliability as a{" "}
            <span className="text-indigo-400 font-semibold">Systems Engineer at Tata Consultancy Services (TCS)</span>.
          </p>

          {/* Quick Metrics Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="tech-pill">
              <span className="text-emerald-400 font-bold">●</span> Malnad Direct Live
            </span>
            <span className="tech-pill">
              <span className="text-indigo-400 font-bold">⚡</span> Tunexia 12+ APIs
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
        <div className="lg:col-span-6 flex flex-wrap items-center lg:justify-end gap-3">
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
                <span className="text-emerald-400">Copied sushandjain@gmail.com!</span>
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
