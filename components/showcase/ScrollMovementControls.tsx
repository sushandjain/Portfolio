"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, Play, Pause, FastForward, Compass, Sparkles, Move, Zap, RotateCcw } from "lucide-react";
import { playPop, playTick } from "@/lib/sound";

export type ScrollMode = "kinetic" | "autoglide" | "snap";

interface ScrollMovementControlsProps {
  onModeChange?: (mode: ScrollMode) => void;
  onParallaxChange?: (depth: number) => void;
  className?: string;
}

/**
 * SCROLL MOVEMENT CONTROLS COMPONENT
 * Provides interactive options for tuning the kinetic scroll movement:
 * - Movement Engine Selector: Kinetic Momentum / Auto-Glide / Frame Snap
 * - Auto-Glide Play/Pause with dynamic scroll speeds (1x, 1.5x, 2x)
 * - Parallax Intensity Depth (4%, 8%, 14%)
 * - GPU Acceleration & FPS Telemetry indicator
 */
export default function ScrollMovementControls({
  onModeChange,
  onParallaxChange,
  className = "",
}: ScrollMovementControlsProps) {
  const [scrollMode, setScrollMode] = useState<ScrollMode>("kinetic");
  const [autoScrollPlaying, setAutoScrollPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [parallaxDepth, setParallaxDepth] = useState<number>(8); // 8% default
  const [isExpanded, setIsExpanded] = useState(false);
  const autoScrollRaf = useRef<number>(0);

  // Auto-Glide continuous scroll engine
  useEffect(() => {
    if (scrollMode !== "autoglide" || !autoScrollPlaying) {
      if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
      return;
    }

    let lastTime = performance.now();

    const glideLoop = (time: number) => {
      const dt = Math.min(32, time - lastTime);
      lastTime = time;

      const pixelsPerSec = 65 * speedMultiplier;
      const step = (pixelsPerSec * dt) / 1000;

      window.scrollBy({ top: step, behavior: "auto" });

      // Stop if reached bottom
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
        setAutoScrollPlaying(false);
        return;
      }

      autoScrollRaf.current = requestAnimationFrame(glideLoop);
    };

    autoScrollRaf.current = requestAnimationFrame(glideLoop);

    return () => {
      if (autoScrollRaf.current) cancelAnimationFrame(autoScrollRaf.current);
    };
  }, [scrollMode, autoScrollPlaying, speedMultiplier]);

  const handleSelectMode = (mode: ScrollMode) => {
    setScrollMode(mode);
    if (mode === "autoglide") {
      setAutoScrollPlaying(true);
    } else {
      setAutoScrollPlaying(false);
    }
    if (onModeChange) onModeChange(mode);
    playPop();
  };

  const handleParallaxChange = (depth: number) => {
    setParallaxDepth(depth);
    document.documentElement.style.setProperty("--showcase-parallax-depth", `${depth}%`);
    if (onParallaxChange) onParallaxChange(depth);
    playTick(720 + depth * 20);
  };

  const toggleAutoPlay = () => {
    const next = !autoScrollPlaying;
    setAutoScrollPlaying(next);
    if (next && scrollMode !== "autoglide") {
      setScrollMode("autoglide");
    }
    playPop();
  };

  return (
    <div
      className={`relative z-30 select-none py-3 px-4 rounded-2xl bg-[#090C15]/90 backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-300 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Left: Engine Mode Title & Toggle Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold tracking-wider">
            <Compass size={14} className="animate-spin" />
            <span className="hidden sm:inline">SCROLL MOVEMENT ENGINE:</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => handleSelectMode("kinetic")}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                scrollMode === "kinetic"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kinetic Inertia
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode("autoglide")}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                scrollMode === "autoglide"
                  ? "bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap size={11} className={autoScrollPlaying ? "text-amber-300 animate-pulse" : ""} />
              Auto-Glide
            </button>
            <button
              type="button"
              onClick={() => handleSelectMode("snap")}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer hidden md:inline-block ${
                scrollMode === "snap"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Step Snap
            </button>
          </div>
        </div>

        {/* Right: Controls & Parameters */}
        <div className="flex items-center gap-3">
          {/* If Auto-Glide is active: Play/Pause and Speed Toggle */}
          {scrollMode === "autoglide" && (
            <div className="flex items-center gap-2 pr-2 border-r border-white/10">
              <button
                type="button"
                onClick={toggleAutoPlay}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                {autoScrollPlaying ? (
                  <>
                    <Pause size={12} /> <span>Pause Glide</span>
                  </>
                ) : (
                  <>
                    <Play size={12} /> <span>Start Glide</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                {[1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      setSpeedMultiplier(spd);
                      playTick(800 + spd * 100);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      speedMultiplier === spd
                        ? "bg-indigo-500 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Parallax Depth Intensity Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase hidden lg:inline">
              Parallax Depth:
            </span>
            <div className="flex items-center gap-1">
              {[
                { label: "4%", depth: 4 },
                { label: "8%", depth: 8 },
                { label: "14%", depth: 14 },
              ].map((p) => (
                <button
                  key={p.depth}
                  type="button"
                  onClick={() => handleParallaxChange(p.depth)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    parallaxDepth === p.depth
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50"
                      : "text-slate-400 hover:text-white bg-white/5 border border-white/10"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
