"use client";

import { playTick } from "@/lib/sound";

export default function Ticker() {
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
      {/* Track 1: Scrolling Left */}
      <div className="marquee-track marquee-animate-left flex items-center gap-8">
        {[...row1, ...row1, ...row1].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-8 cursor-pointer group"
            onMouseEnter={() => playTick(500 + (i % 5) * 60)}
          >
            <span
              className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--text-faint)] group-hover:text-indigo-400 group-hover:font-stretch-[135%] transition-all duration-300"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {text}
            </span>
            <span className="text-amber-400 text-sm opacity-60">✦</span>
          </div>
        ))}
      </div>

      {/* Track 2: Scrolling Right */}
      <div className="marquee-track marquee-animate-right flex items-center gap-8 opacity-75">
        {[...row2, ...row2, ...row2].map((text, i) => (
          <div
            key={i}
            className="flex items-center gap-8 cursor-pointer group"
            onMouseEnter={() => playTick(700 + (i % 5) * 60)}
          >
            <span
              className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[var(--text-faint)] group-hover:text-amber-400 group-hover:font-stretch-[120%] transition-all duration-300"
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
