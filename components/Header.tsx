"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { personalInfo } from "@/lib/data";
import { isSoundEnabled, toggleSound, playPop } from "@/lib/sound";
import { Volume2, VolumeX, Moon, Sun, ArrowUpRight, Sparkles } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    // Sound setting
    setSoundOn(isSoundEnabled());

    // Theme setting
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Live Clock (IST - Asia/Kolkata)
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setTime(formatted);
      } catch {
        setTime("Bengaluru, IN");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Scroll listener for sticky styling
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playPop();
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    playPop();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-[var(--bg-primary)]/85 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg shadow-black/20"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="group flex items-center gap-2.5 text-decoration-none"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            onClick={() => playPop()}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/40 group-hover:ring-amber-400 shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0">
              <Image
                src="/sushan.jpg"
                alt="Sushan D Jain"
                fill
                sizes="40px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className="font-extrabold text-base tracking-tight leading-tight transition-all duration-300 text-[var(--text-main)]"
                style={{
                  fontFamily: "var(--font-d)",
                  fontStretch: logoHovered ? "135%" : "95%",
                }}
              >
                SUSHAN JAIN
              </span>
              <span className="text-[11px] font-mono tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <span className="pulse-green" /> SYSTEMS ENGINEER @ TCS
              </span>
            </div>
          </a>
        </div>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[var(--bg-card)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border-subtle)] shadow-sm">
          {[
            { label: "Work", href: "#work" },
            { label: "Experience", href: "#experience" },
            { label: "Arsenal", href: "#stack" },
            { label: "Education", href: "#education" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => playPop()}
              className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] rounded-full transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock Widget */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>BLR {time || "IST"}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundOn ? "Mute audio effects" : "Enable tactile sound effects"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] transition-all cursor-pointer"
            title={soundOn ? "Sound Effects: ON (Click to Mute)" : "Sound Effects: OFF (Click to Enable)"}
          >
            {soundOn ? <Volume2 size={15} className="text-indigo-400" /> : <VolumeX size={15} />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Toggle dark/light theme"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] transition-all cursor-pointer"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
          </button>

          {/* Talk CTA */}
          <a
            href="#contact"
            onClick={() => playPop()}
            className="magnetic-btn magnetic-btn-primary text-xs py-2 px-4 shadow-sm"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </header>
  );
}
