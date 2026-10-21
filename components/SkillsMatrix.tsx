"use client";

import { useState } from "react";
import { skillGroups } from "@/lib/data";
import { playPop, playTick } from "@/lib/sound";
import { Cpu, Code2, Server, Database, Wrench, Sparkles, Check } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

export default function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const categories = ["All", ...skillGroups.map((g) => g.category)];

  const filteredGroups = activeTab === "All"
    ? skillGroups
    : skillGroups.filter((g) => g.category === activeTab);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Languages": return <Code2 size={16} className="text-amber-400" />;
      case "Frontend": return <Sparkles size={16} className="text-cyan-400" />;
      case "Backend & APIs": return <Server size={16} className="text-indigo-400" />;
      case "Databases": return <Database size={16} className="text-emerald-400" />;
      case "Tools & Deployment": return <Wrench size={16} className="text-rose-400" />;
      default: return <Cpu size={16} className="text-indigo-400" />;
    }
  };

  return (
    <section id="stack" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>05 / TECHNICAL ARSENAL</span>
            <span>✦</span>
            <span>MODERN FULL-STACK CAPABILITIES</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SKILLS & TOOLING
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveTab(cat);
                playPop();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <SpotlightCard
            key={group.category}
            className="glass-panel p-6 border border-[var(--border-subtle)] hover:border-indigo-500/35 transition-all duration-300 flex flex-col justify-between"
            spotlightColor="rgba(99, 102, 241, 0.12)"
            borderColor="rgba(129, 140, 248, 0.4)"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[var(--border-subtle)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                  {getCategoryIcon(group.category)}
                </div>
                <h3 className="font-extrabold text-base tracking-wide uppercase text-[var(--text-main)] font-mono">
                  {group.category}
                </h3>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-transparent hover:border-indigo-500/20 transition-all duration-200 group/item cursor-pointer"
                    onMouseEnter={() => playTick(700 + i * 40)}
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[var(--text-main)] group-hover/item:text-indigo-400 transition-colors">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        item.level === "Expert"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : item.level === "Advanced"
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer badge */}
            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-faint)] flex items-center justify-between">
              <span>{group.items.length} TECHNOLOGIES</span>
              <span className="text-emerald-400">100% PRODUCTION TESTED</span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
