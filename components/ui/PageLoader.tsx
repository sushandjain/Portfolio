"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { playTick, playSuccess } from "@/lib/sound";
import { Cpu, GraduationCap, Code2, Terminal, Sparkles, BookOpen, Layers } from "lucide-react";

interface LogoSlide {
  id: "coding" | "javascript" | "engineer" | "studying" | "claude";
  category: string;
  tag: string;
  title: string;
  subtitle: string;
  code: string;
  accent: string;
  accentRgb: string;
}

const logoSlides: LogoSlide[] = [
  {
    id: "coding",
    category: "DEV ARCHITECTURE",
    tag: "SYNTAX & ALGORITHMS",
    title: "CODING & FULL STACK",
    subtitle: "Clean Scalable System Architecture",
    code: "MERN · TS · REACT",
    accent: "#06B6D4",
    accentRgb: "6, 182, 212",
  },
  {
    id: "javascript",
    category: "CORE RUNTIME",
    tag: "ECMASCRIPT 2026",
    title: "JAVASCRIPT & NODE",
    subtitle: "High-Throughput Web Protocols",
    code: "EVENT LOOP · ASYNC",
    accent: "#F7DF1E",
    accentRgb: "247, 223, 30",
  },
  {
    id: "engineer",
    category: "SYSTEMS ENGINEERING",
    tag: "TATA CONSULTANCY SERVICES",
    title: "SYSTEMS ENGINEER",
    subtitle: "Enterprise Reliability & High SLA",
    code: "TCS · ARCHITECTURE",
    accent: "#6366F1",
    accentRgb: "99, 102, 241",
  },
  {
    id: "studying",
    category: "ACADEMIC FOUNDATION",
    tag: "BCA HIGH DISTINCTION",
    title: "STUDYING & LEARNING",
    subtitle: "8.92 / 10 CGPA · Continuous Growth",
    code: "ACADEMIC HONORS",
    accent: "#10B981",
    accentRgb: "16, 185, 129",
  },
  {
    id: "claude",
    category: "ARTIFICIAL INTELLIGENCE",
    tag: "ANTHROPIC ACCREDITED",
    title: "CLAUDE CERTIFIED",
    subtitle: "GenAI & Prompt Architecture",
    code: "PEARSON CREDLY VERIFIED",
    accent: "#EA580C",
    accentRgb: "234, 88, 12",
  },
];

/**
 * Animated Logo Presenter for the Shutter Frame
 * Renders modern, crisp, illuminated vector/logo emblems with glowing ambient rings.
 */
function ShutterLogoView({ id, accent }: { id: string; accent: string }) {
  if (id === "coding") {
    return (
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Ambient glow circle */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
          style={{ background: accent }}
        />
        {/* Coding Logo Badge */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-cyan-950/40 border-2 border-cyan-400/50 flex flex-col items-center justify-center shadow-xl shadow-cyan-500/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          {/* Top terminal status pill */}
          <div className="absolute top-2 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[8px] font-mono text-cyan-300 font-bold tracking-wider">DEV.TS</span>
          </div>
          {/* Main coding brackets </ > */}
          <div className="text-cyan-300 font-mono font-black text-3xl sm:text-4xl tracking-tighter flex items-center gap-1.5 select-none drop-shadow-[0_2px_12px_rgba(6,182,212,0.6)]">
            <span className="text-cyan-400">&lt;</span>
            <span className="text-white">/</span>
            <span className="text-cyan-400">&gt;</span>
          </div>
          {/* Typing terminal prompt cursor */}
          <div className="absolute bottom-2.5 right-3.5 text-[10px] font-mono text-cyan-400 font-bold animate-pulse">
            _
          </div>
        </div>
      </div>
    );
  }

  if (id === "javascript") {
    return (
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Ambient glow circle */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
          style={{ background: accent }}
        />
        {/* Iconic JavaScript JS Logo Badge */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#F7DF1E]/15 border-2 border-[#F7DF1E]/70 flex flex-col items-end justify-end p-3.5 shadow-xl shadow-[#F7DF1E]/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          {/* Top Tag */}
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7DF1E] animate-ping" />
            <span className="text-[8px] font-mono text-[#F7DF1E] font-bold tracking-wider">JAVASCRIPT</span>
          </div>
          {/* Iconic bold JS typography */}
          <span className="text-[#F7DF1E] font-black text-4xl sm:text-5xl font-mono tracking-tighter leading-none select-none drop-shadow-[0_2px_12px_rgba(247,223,30,0.6)]">
            JS
          </span>
        </div>
      </div>
    );
  }

  if (id === "engineer") {
    return (
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Ambient glow circle */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
          style={{ background: accent }}
        />
        {/* Systems Engineer CPU Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-indigo-950/40 border-2 border-indigo-400/50 flex flex-col items-center justify-center shadow-xl shadow-indigo-500/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          {/* CPU Edge pins */}
          <div className="absolute -top-1 w-10 h-1 bg-indigo-400/50 rounded-full" />
          <div className="absolute -bottom-1 w-10 h-1 bg-indigo-400/50 rounded-full" />
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            <span className="text-[8px] font-mono text-indigo-300 font-bold tracking-wider">TCS.SYS</span>
          </div>
          <Cpu size={38} className="text-indigo-400 animate-pulse mb-1 mt-1 drop-shadow-[0_2px_12px_rgba(99,102,241,0.6)]" />
          <span className="text-[9px] font-mono font-black text-indigo-200 tracking-wider uppercase">
            ENGINEER
          </span>
        </div>
      </div>
    );
  }

  if (id === "studying") {
    return (
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Ambient glow circle */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
          style={{ background: accent }}
        />
        {/* Studying / Learner Knowledge Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-emerald-950/40 border-2 border-emerald-400/50 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/25 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[8px] font-mono text-emerald-300 font-bold tracking-wider">BCA 8.92</span>
          </div>
          <GraduationCap size={40} className="text-emerald-400 mb-1 mt-1 drop-shadow-[0_2px_12px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-mono font-black text-emerald-200 tracking-wider uppercase">
            LEARNER
          </span>
        </div>
      </div>
    );
  }

  if (id === "claude") {
    return (
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Ambient glow circle */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
          style={{ background: accent }}
        />
        {/* Claude AI Badge Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-orange-950/40 border-2 border-orange-400/50 flex flex-col items-center justify-center shadow-xl shadow-orange-500/25 backdrop-blur-md p-2 transition-transform duration-300 group-hover:scale-105">
          <div className="absolute top-2.5 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
            <span className="text-[8px] font-mono text-orange-300 font-bold tracking-wider">AI.CRED</span>
          </div>
          <div className="w-12 h-12 relative my-0.5">
            <Image
              src="/claude-badge.png"
              alt="Claude AI"
              width={48}
              height={48}
              priority
              className="object-contain drop-shadow-[0_4px_12px_rgba(234,88,12,0.6)]"
            />
          </div>
          <span className="text-[8px] font-mono font-black text-orange-200 tracking-wider uppercase">
            ANTHROPIC
          </span>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Studio Olimpo-Inspired Editorial Shutter Page Loader
 * Cycles through animated, modern Logo & Typography badges (Coding, JavaScript, Systems Engineer, Studying, Claude AI)
 * with a high-precision numeric counter and curtain-reveal exit motion.
 */
export default function PageLoader() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const numberRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const lastSoundPercent = useRef(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    // Skip loader on repeat visits within the same session
    try {
      if (sessionStorage.getItem("portfolio_loader_seen") === "1") {
        setIsMounted(false);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    // Lock body scroll while loader is active
    document.body.style.overflow = "hidden";

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const startTime = performance.now();
    const duration = isMobile ? 90 : 250; // high-speed camera shutter burst

    let animationFrame: number;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawRatio = Math.min(1, elapsed / duration);

      // Studio Olimpo curve: fast start, brief suspense plateau around 75%, rapid finish
      let easedRatio: number;
      if (rawRatio < 0.6) {
        easedRatio = Math.pow(rawRatio / 0.6, 1.2) * 0.72;
      } else if (rawRatio < 0.8) {
        easedRatio = 0.72 + Math.pow((rawRatio - 0.6) / 0.2, 1.5) * 0.16;
      } else {
        easedRatio = 0.88 + Math.pow((rawRatio - 0.8) / 0.2, 0.9) * 0.12;
      }

      const calculatedProgress = Math.min(100, Math.floor(easedRatio * 100));

      if (numberRef.current) {
        numberRef.current.textContent = calculatedProgress.toString().padStart(2, "0");
      }
      if (barRef.current) {
        barRef.current.style.width = `${calculatedProgress}%`;
      }
      if (statusRef.current) {
        if (calculatedProgress < 25) statusRef.current.textContent = "INITIALIZING CODING & ALGORITHMIC ARCHITECTURE...";
        else if (calculatedProgress < 50) statusRef.current.textContent = "MOUNTING JAVASCRIPT & ASYNCHRONOUS RUNTIME...";
        else if (calculatedProgress < 75) statusRef.current.textContent = "CALIBRATING TCS SYSTEMS ENGINEERING PROTOCOLS...";
        else if (calculatedProgress < 95) statusRef.current.textContent = "SYNCHRONIZING CONTINUOUS LEARNING & AI MODELS...";
        else statusRef.current.textContent = "SYSTEMS READY · UNVEILING EXPERIENCES";
      }

      // Micro audio tick every 8-10%
      if (calculatedProgress - lastSoundPercent.current >= 9) {
        playTick(600 + calculatedProgress * 4);
        lastSoundPercent.current = calculatedProgress;
      }

      // Shutter click sound when logo slide changes
      const currentIdx = Math.min(
        logoSlides.length - 1,
        Math.floor((calculatedProgress / 100) * logoSlides.length)
      );
      if (currentIdx !== lastIndex.current) {
        playTick(820 + currentIdx * 40);
        lastIndex.current = currentIdx;
        setActiveIndex(currentIdx);
      }

      if (rawRatio < 1) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        if (numberRef.current) numberRef.current.textContent = "100";
        if (barRef.current) barRef.current.style.width = "100%";
        playSuccess();

        try {
          sessionStorage.setItem("portfolio_loader_seen", "1");
        } catch {
          // sessionStorage unavailable
        }

        // Snappy curtain exit
        setTimeout(() => {
          setIsExiting(true);
          document.body.style.overflow = "";
          setTimeout(() => {
            setIsMounted(false);
          }, 200);
        }, 20);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    // Guaranteed unmount fallback after compositor animation completes
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsMounted(false);
    }, isMobile ? 500 : 850);

    return () => {
      clearTimeout(fallbackTimer);
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = "";
    };
  }, []);

  const handleSkip = () => {
    try {
      sessionStorage.setItem("portfolio_loader_seen", "1");
    } catch {
      // sessionStorage unavailable
    }
    if (numberRef.current) numberRef.current.textContent = "100";
    if (barRef.current) barRef.current.style.width = "100%";
    setIsExiting(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsMounted(false);
    }, 150);
  };

  if (!isMounted) return null;

  const currentSlide = logoSlides[activeIndex] || logoSlides[0];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-between p-4 sm:p-8 lg:p-12 bg-[#08090E] text-white select-none will-change-transform shutter-curtain-auto shadow-2xl shadow-black ${
        isExiting ? "-translate-y-full opacity-0 pointer-events-none" : ""
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${currentSlide.accentRgb}, 0.12) 0%, rgba(8, 9, 14, 0.98) 75%)`,
      }}
    >
      {/* Background ambient fine noise */}
      <div className="absolute inset-0 bg-noise opacity-3 pointer-events-none" />

      {/* 1. Top Header Bar (Studio Olimpo style) */}
      <div className="w-full max-w-7xl mx-auto flex items-start justify-between gap-4 relative z-10">
        <div>
          <h2
            className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white leading-none"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SUSHAN JAIN
          </h2>
          <div className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] tracking-wider mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>FULL-STACK ARCHITECT &bull; TCS SYSTEMS ENGINEER</span>
          </div>
        </div>

        {/* Large Kinetic Number Counter */}
        <div className="text-right">
          <div
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tighter text-white tabular-nums leading-none"
            style={{ fontFamily: "var(--font-d)" }}
          >
            <span ref={numberRef}>00</span>
            <span
              className="text-sm sm:text-2xl font-bold ml-1 transition-colors duration-200"
              style={{ color: currentSlide.accent }}
            >
              %
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono text-[var(--text-faint)] tracking-widest uppercase mt-0.5">
            INDEX [0{activeIndex + 1} / 0{logoSlides.length}]
          </div>
        </div>
      </div>

      {/* 2. Center Studio Olimpo Vertical Shutter Animated Logo Box */}
      <div className="w-full flex-1 flex flex-col items-center justify-center py-4 sm:py-6 relative z-10">
        <div className="relative group/shutter">
          {/* Ambient Card Backlight Aura matching current logo color */}
          <div
            className="absolute -inset-3 rounded-3xl blur-2xl opacity-60 transition-all duration-300"
            style={{
              background: `radial-gradient(circle, rgba(${currentSlide.accentRgb}, 0.35) 0%, transparent 70%)`,
            }}
          />

          {/* Vertical Shutter Frame with Modern Animated Logo & Text */}
          <div className="relative w-[230px] h-[310px] sm:w-[290px] sm:h-[390px] lg:w-[320px] lg:h-[420px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0B0D14]/95 flex flex-col justify-between p-5 sm:p-6">
            {/* Top Frame Status Bar */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-zinc-400 border-b border-white/10 pb-3 relative z-10">
              <span
                className="font-bold flex items-center gap-1.5 tracking-wider uppercase transition-colors"
                style={{ color: currentSlide.accent }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ background: currentSlide.accent }}
                />
                {currentSlide.category}
              </span>
              <span className="text-zinc-500 font-mono">0{activeIndex + 1} / 05</span>
            </div>

            {/* Center Animated Logo Presentation */}
            <div className="relative my-auto flex items-center justify-center py-4">
              {logoSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`transition-all duration-200 ease-out ${
                    idx === activeIndex
                      ? "opacity-100 scale-100 relative"
                      : "opacity-0 scale-90 pointer-events-none absolute"
                  }`}
                >
                  <ShutterLogoView id={slide.id} accent={slide.accent} />
                </div>
              ))}
            </div>

            {/* Bottom In-Frame Typography Stamp */}
            <div className="border-t border-white/10 pt-3 text-left relative z-10">
              <span
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest font-bold block mb-0.5 transition-colors"
                style={{ color: currentSlide.accent }}
              >
                {currentSlide.tag}
              </span>
              <h4
                className="text-base sm:text-lg font-black uppercase tracking-tight text-white line-clamp-1"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {currentSlide.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400 line-clamp-1 mt-0.5">
                {currentSlide.subtitle}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-zinc-500">
                <span>{currentSlide.code}</span>
                <span className="text-white font-bold">FOLIO &apos;26</span>
              </div>
            </div>

            {/* Corner Shutter Focus Crosshairs */}
            <div className="absolute top-2.5 left-2.5 text-[8px] font-mono text-white/30">✦</div>
            <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-white/30">✦</div>
            <div className="absolute bottom-2.5 left-2.5 text-[8px] font-mono text-white/30">✦</div>
            <div className="absolute bottom-2.5 right-2.5 text-[8px] font-mono text-white/30">✦</div>
          </div>
        </div>

        {/* Current Loading Step Subtitle */}
        <div className="mt-4 sm:mt-6 text-center max-w-sm px-4">
          <p ref={statusRef} className="text-[10px] sm:text-xs font-mono text-zinc-400 tracking-wider">
            INITIALIZING CODING &amp; ALGORITHMIC ARCHITECTURE...
          </p>
        </div>
      </div>

      {/* 3. Bottom Progress Bar & Telemetry Bar */}
      <div className="w-full max-w-7xl mx-auto space-y-3 relative z-10">
        {/* Real-time 2px razor line with active accent color */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div
            ref={barRef}
            className="h-full transition-all duration-75 ease-out"
            style={{
              width: "0%",
              background: `linear-gradient(90deg, #06B6D4 0%, ${currentSlide.accent} 100%)`,
            }}
          />
        </div>

        {/* Bottom Details Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-[var(--text-faint)]">
          <div className="flex items-center gap-2">
            <span>BENGALURU, INDIA</span>
            <span>✦</span>
            <span>12.9716° N, 77.5946° E</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">HIGH-THROUGHPUT FULL STACK SYSTEMS</span>
            {/* Quick Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="text-[10px] font-mono font-bold text-indigo-400 hover:text-white uppercase tracking-wider px-2 py-0.5 rounded-md hover:bg-white/5 transition-all cursor-pointer"
            >
              Skip Intro &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
