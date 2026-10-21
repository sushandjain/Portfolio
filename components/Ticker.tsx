"use client";

import { useEffect, useRef } from "react";
import { playTick } from "@/lib/sound";

export default function Ticker() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let rafId = 0;
    let targetBoost = 1;
    let currentBoost = 1;

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      lastTime.current = now;

      const deltaY = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;

      const velocity = (deltaY / dt) * 16;
      targetBoost = Math.min(3.5, 1 + velocity * 0.08);
    };

    const loop = () => {
      targetBoost += (1 - targetBoost) * 0.06;
      currentBoost += (targetBoost - currentBoost) * 0.12;

      if (track1Ref.current) {
        track1Ref.current.style.animationDuration = `${(32 / currentBoost).toFixed(2)}s`;
      }
      if (track2Ref.current) {
        track2Ref.current.style.animationDuration = `${(38 / currentBoost).toFixed(2)}s`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const row1 = [
    "REACT.JS",
    "NODE.JS",
    "TYPESCRIPT",
    "MONGODB",
    "ENTERPRISE REST APIS",
    "TCS SYSTEMS ENGINEERING",
    "NEXT.JS",
    "CLOUDINARY",
    "JWT AUTHENTICATION",
    "TAILWIND CSS",
    "D2C LOGISTICS",
  ];

  const row2 = [
    "PRODUCTION INCIDENT RCA",
    "EXPRESS.JS",
    "SQL / MYSQL",
    "SPEED POST PIN API",
    "STREAMING AUDIO ENGINE",
    "POSTMAN",
    "HIGH AVAILABILITY",
    "MALNAD DIRECT D2C",
    "TUNEXIA CLOUD",
    "FULL-STACK ARCHITECTURE",
  ];

  return (
    <div className="w-full py-8 border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden select-none space-y-3">
      {/* Track 1: Scrolling Left with Dynamic Velocity Acceleration */}
      <div
        ref={track1Ref}
        className="marquee-track marquee-animate-left flex items-center gap-8"
        style={{ animationDuration: "32s" }}
      >
        {[...row1, ...row1, ...row1].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-8 cursor-pointer group"
            onMouseEnter={() => playTick(500 + (i % 5) * 60)}
          >
            <span
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--text-faint)] group-hover:text-indigo-400 group-hover:font-stretch-[140%] transition-all duration-300"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {text}
            </span>
            <span className="text-amber-400 text-sm opacity-60">✦</span>
          </div>
        ))}
      </div>

      {/* Track 2: Scrolling Right with Dynamic Velocity Acceleration */}
      <div
        ref={track2Ref}
        className="marquee-track marquee-animate-right flex items-center gap-8 opacity-75"
        style={{ animationDuration: "38s" }}
      >
        {[...row2, ...row2, ...row2].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-8 cursor-pointer group"
            onMouseEnter={() => playTick(700 + (i % 5) * 60)}
          >
            <span
              className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-faint)] group-hover:text-amber-400 group-hover:font-stretch-[125%] transition-all duration-300"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {text}
            </span>
            <span className="text-indigo-400 text-xs opacity-60">✳</span>
          </div>
        ))}
      </div>
    </div>
  );
}
