"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Briefcase, Cpu, Send } from "lucide-react";
import { playPop } from "@/lib/sound";

const NAV_TABS = [
  { label: "Home", href: "/", icon: Home, sectionId: "home" },
  { label: "Work", href: "/#work", icon: Layers, sectionId: "work" },
  { label: "Skills", href: "/#stack", icon: Cpu, sectionId: "stack" },
  { label: "Exp", href: "/#experience", icon: Briefcase, sectionId: "experience" },
  { label: "Contact", href: "/#contact", icon: Send, sectionId: "contact" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>("home");

  // Track active section on home page via IntersectionObserver
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["work", "experience", "stack", "education", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Detect if scrolled near the top
    const handleScroll = () => {
      if (window.scrollY < 300) {
        setActiveSection("home");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const isTabActive = (tab: (typeof NAV_TABS)[0]) => {
    if (pathname === "/") {
      if (tab.sectionId === "home") {
        return activeSection === "home";
      }
      return activeSection === tab.sectionId;
    }

    if (pathname === "/work" || pathname === "/projects") {
      return tab.label === "Work";
    }
    if (pathname === "/arsenal" || pathname === "/skills") {
      return tab.label === "Skills";
    }
    if (pathname === "/experience" || pathname === "/credentials") {
      return tab.label === "Exp";
    }
    if (pathname === "/contact") {
      return tab.label === "Contact";
    }

    return false;
  };

  const handleNavClick = (tab: (typeof NAV_TABS)[0], e: React.MouseEvent) => {
    try {
      playPop();
    } catch {}

    if (pathname === "/") {
      e.preventDefault();
      if (tab.sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
        return;
      }
      const el = document.getElementById(tab.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(tab.sectionId);
      }
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-3 left-3 right-3 z-50 md:hidden max-w-lg mx-auto"
    >
      <div className="relative rounded-2xl bg-[var(--bg-card)]/95 backdrop-blur-2xl border border-[var(--border-subtle)] shadow-2xl shadow-black/40 p-1 flex items-center justify-around transition-all">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(tab);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={(e) => handleNavClick(tab, e)}
              className={`relative flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer touch-manipulation ${
                active
                  ? "text-indigo-400 font-bold bg-indigo-500/15 shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {/* Active ambient glow pill */}
              {active && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366F1]" />
              )}

              <Icon
                size={18}
                className={
                  active ? "text-indigo-400 scale-110 transition-transform" : "transition-transform"
                }
              />
              <span className="text-[10px] font-mono leading-none tracking-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
