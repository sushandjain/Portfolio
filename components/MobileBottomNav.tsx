"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Briefcase, Cpu, Send } from "lucide-react";
import { playPop } from "@/lib/sound";

const NAV_TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Work", href: "/work", icon: Layers },
  { label: "Skills", href: "/arsenal", icon: Cpu },
  { label: "Exp", href: "/#experience", icon: Briefcase },
  { label: "Contact", href: "/#contact", icon: Send },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/work") {
      return pathname === "/work" || pathname === "/projects";
    }
    if (href === "/arsenal") {
      return pathname === "/arsenal" || pathname === "/skills";
    }
    if (href === "/#experience") {
      return pathname === "/experience" || pathname === "/credentials";
    }
    if (href === "/#contact") {
      return pathname === "/contact";
    }
    return pathname === href;
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    try {
      playPop();
    } catch {}

    if (href.startsWith("/#") && pathname === "/") {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
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
          const active = isTabActive(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={(e) => handleNavClick(tab.href, e)}
              className={`relative flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                active
                  ? "text-indigo-400 font-bold bg-indigo-500/15 shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {/* Active ambient glow pill */}
              {active && (
                <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366F1]" />
              )}

              <Icon size={18} className={active ? "text-indigo-400 scale-110 transition-transform" : "transition-transform"} />
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
