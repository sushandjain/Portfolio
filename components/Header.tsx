"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { personalInfo } from "@/lib/data";
import { isSoundEnabled, toggleSound, playPop, playTick } from "@/lib/sound";
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
  Layers,
  Briefcase,
  Award,
  Cpu,
  Send,
  MessageCircle,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function Header() {
  const [time, setTime] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const navItems = [
    { label: "Work", href: "#work", id: "work", icon: Layers, desc: "Production Flagships" },
    { label: "Experience", href: "#experience", id: "experience", icon: Briefcase, desc: "TCS Systems & Honors" },
    { label: "Credentials", href: "#education", id: "education", icon: Award, desc: "Claude, TCS & JSpiders" },
    { label: "Arsenal", href: "#stack", id: "stack", icon: Cpu, desc: "Technical Skills Matrix" },
    { label: "Contact", href: "#contact", id: "contact", icon: Send, desc: "Dispatch & Direct Line" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2.5 sm:py-3 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-lg shadow-black/25"
            : "py-3 sm:py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-2.5 text-decoration-none"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              onClick={() => playPop()}
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/40 group-hover:ring-amber-400 shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shrink-0">
                <Image
                  src="/sushan.jpg"
                  alt="Sushan D Jain"
                  fill
                  sizes="40px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className="font-extrabold text-sm sm:text-base tracking-tight leading-tight transition-all duration-300 text-[var(--text-main)] truncate"
                  style={{
                    fontFamily: "var(--font-d)",
                    fontStretch: logoHovered ? "135%" : "95%",
                  }}
                >
                  SUSHAN JAIN
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                  <span className="pulse-green shrink-0" />
                  <span className="hidden sm:inline truncate">SYSTEMS ENGINEER @ TCS</span>
                  <span className="sm:hidden truncate">TCS ENGINEER</span>
                </span>
              </div>
            </a>
          </div>

          {/* Center Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--bg-card)]/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[var(--border-subtle)] shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => playPop()}
                  className="px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
                >
                  <Icon size={12} className="text-indigo-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Live Clock Widget (Desktop only) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>BLR {time || "IST"}</span>
            </div>

            {/* Sound Toggle (Visible on screens >= 380px and in mobile drawer) */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundOn ? "Mute audio effects" : "Enable tactile sound effects"}
              className="hidden xs:flex min-w-[44px] min-h-[44px] w-11 h-11 sm:w-9 sm:h-9 rounded-full items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] transition-all cursor-pointer active:scale-90"
              title={soundOn ? "Sound Effects: ON (Click to Mute)" : "Sound Effects: OFF (Click to Enable)"}
            >
              {soundOn ? <Volume2 size={16} className="text-indigo-400" /> : <VolumeX size={16} />}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle dark/light theme"
              className="min-w-[44px] min-h-[44px] w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-focus)] transition-all cursor-pointer active:scale-90"
            >
              {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}
            </button>

            {/* Mobile Menu Toggle Button (Min 44x44px for thumb accessibility) */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                playPop();
              }}
              aria-label="Toggle Navigation Menu"
              className={`lg:hidden min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white transition-all cursor-pointer active:scale-90 ${
                mobileMenuOpen ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30" : ""
              }`}
            >
              {mobileMenuOpen ? (
                <X size={18} className="rotate-90 transition-transform duration-200" />
              ) : (
                <Menu size={18} />
              )}
            </button>

            {/* Desktop Talk CTA */}
            <a
              href="#contact"
              onClick={() => playPop()}
              className="!hidden sm:!inline-flex magnetic-btn magnetic-btn-primary text-xs py-2 px-4 shadow-sm min-h-[40px] items-center"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Fluid Touch Sheet */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="lg:hidden fixed inset-0 top-[65px] bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="lg:hidden relative z-50 mt-2 px-3 pb-3 animate-fade-in">
              <div className="glass-panel p-4 rounded-3xl border border-indigo-500/25 shadow-2xl space-y-2 backdrop-blur-2xl bg-[var(--bg-primary)]/95 max-h-[calc(100dvh-85px)] overflow-y-auto">
              {/* Menu Header Status */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)] text-[11px] font-mono">
                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  NAVIGATION DIRECTORY
                </span>
                <span className="text-[var(--text-faint)]">BLR {time}</span>
              </div>

              {/* Navigation Items with rich metadata & icons */}
              <div className="space-y-1.5 py-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        playTick(780);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl transition-all active:scale-[0.98] hover:bg-[var(--bg-secondary)] text-[var(--text-main)] border border-transparent hover:border-[var(--border-subtle)]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[var(--bg-secondary)] text-indigo-400 border border-[var(--border-subtle)]">
                          <Icon size={15} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-xs uppercase tracking-wider block text-[var(--text-main)]">
                            {item.label}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-faint)] block truncate">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[var(--text-faint)] shrink-0" />
                    </a>
                  );
                })}
              </div>

              {/* Mobile Audio Effects Toggle */}
              <button
                type="button"
                onClick={handleToggleSound}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] hover:text-white transition-all cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  {soundOn ? <Volume2 size={16} className="text-indigo-400" /> : <VolumeX size={16} />}
                  <span className="font-bold text-[var(--text-main)]">TACTILE AUDIO</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${soundOn ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-white/10 text-slate-400"}`}>
                  {soundOn ? "ACTIVE" : "MUTED"}
                </span>
              </button>

              {/* Mobile Quick Dispatch Actions */}
              <div className="pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/918088155097?text=Hi%20Sushan%2C%20reviewed%20your%20portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playPop()}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold transition-all active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${personalInfo.email}`}
                  onClick={() => playPop()}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/25 active:scale-95"
                >
                  <Mail size={14} />
                  <span>Direct Mail</span>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>

      {/* Floating Mobile Quick Dock (Visible when scrolled past hero on mobile) */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden transition-all duration-300 pointer-events-auto ${
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl shadow-black/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => playTick(800)}
                aria-label={item.label}
                title={item.label}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full transition-all duration-200 relative flex items-center justify-center cursor-pointer active:scale-90 text-[var(--text-muted)] hover:text-white hover:bg-white/10"
              >
                <Icon size={16} />
              </a>
            );
          })}

          <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

          {/* Quick WhatsApp Dispatch on Mobile Dock (Min 44x44px for thumb accessibility) */}
          <a
            href="https://wa.me/918088155097?text=Hi%20Sushan%2C%20reviewed%20your%20portfolio"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playPop()}
            aria-label="Direct WhatsApp"
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full text-emerald-400 hover:text-emerald-300 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </>
  );
}
