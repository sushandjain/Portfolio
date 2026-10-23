"use client";

import React, { useState, useId } from "react";
import { skillGroups } from "@/lib/data";
import { playPop, playTick, playSuccess } from "@/lib/sound";
import confetti from "canvas-confetti";
import {
  Cpu,
  Code2,
  Server,
  Database,
  Wrench,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TiltCard from "@/components/ui/TiltCard";

interface SkillWithMeta {
  name: string;
  level: string;
  proficiency: number;
  projectUsage?: string;
  category: string;
}

// Enriched skillset with real project linkage and numerical proficiency metrics
const enrichedSkillGroups = [
  {
    category: "Languages",
    icon: Code2,
    accent: "#F59E0B", // Amber
    summary: "Core algorithmic foundations & type-safe application architecture",
    items: [
      { name: "JavaScript (ES6+)", level: "Advanced", proficiency: 95, projectUsage: "Henjodi Stores, TuneXIA, Kheti Bazaar" },
      { name: "TypeScript", level: "Advanced", proficiency: 92, projectUsage: "Malnad Direct, Portfolio Core, TCS Systems" },
      { name: "Java (Core & OOP)", level: "Proficient", proficiency: 86, projectUsage: "Simplilearn Certified, Enterprise Workflows" },
      { name: "Python", level: "Intermediate", proficiency: 78, projectUsage: "TCS AI Hackathon 2nd Place Pipeline" },
      { name: "SQL", level: "Proficient", proficiency: 88, projectUsage: "Relational Schemas, Order Ingestion" },
    ],
  },
  {
    category: "Frontend Architecture",
    icon: Sparkles,
    accent: "#06B6D4", // Cyan
    summary: "High-framerate responsive interfaces, micro-animations & state orchestration",
    items: [
      { name: "React.js 18/19", level: "Expert", proficiency: 96, projectUsage: "TuneXIA, Malnad Direct, JSpiders Immersion" },
      { name: "Next.js 15 (App Router)", level: "Advanced", proficiency: 94, projectUsage: "Malnad Direct D2C Platform" },
      { name: "Tailwind CSS", level: "Expert", proficiency: 98, projectUsage: "Every Flagship Production Deploy" },
      { name: "HTML5 / Canvas / Modern CSS", level: "Expert", proficiency: 97, projectUsage: "GSAP Kinematics, WebGL Particle Meshes" },
      { name: "Angular", level: "Proficient", proficiency: 76, projectUsage: "TCS Enterprise Application Portal" },
    ],
  },
  {
    category: "Backend & Microservices",
    icon: Server,
    accent: "#6366F1", // Indigo
    summary: "High-throughput RESTful routing, byte-range audio buffers & authentication",
    items: [
      { name: "Node.js Runtime", level: "Advanced", proficiency: 94, projectUsage: "TuneXIA Streaming Engine, API Gateways" },
      { name: "Express.js", level: "Advanced", proficiency: 93, projectUsage: "Kheti Bazaar REST API, Ingestion Pipelines" },
      { name: "RESTful API Design", level: "Expert", proficiency: 96, projectUsage: "Speed Post SLA & Kudremukh Permits" },
      { name: "JWT Auth & Security", level: "Advanced", proficiency: 91, projectUsage: "TuneXIA Role-Based Token Validation" },
      { name: "Cloudinary CDN", level: "Proficient", proficiency: 89, projectUsage: "320kbps Audio Buffer Ingestion" },
    ],
  },
  {
    category: "Databases & Storage",
    icon: Database,
    accent: "#10B981", // Emerald
    summary: "Distributed document models, relational integrity & cache optimization",
    items: [
      { name: "MongoDB Atlas", level: "Advanced", proficiency: 93, projectUsage: "TuneXIA Dynamic Playlist Records" },
      { name: "MySQL / Relational SQL", level: "Proficient", proficiency: 88, projectUsage: "Agri-Produce Listings & Audit Logs" },
      { name: "Mongoose ODM", level: "Advanced", proficiency: 92, projectUsage: "Strict Schema Validations & Indexing" },
    ],
  },
  {
    category: "DevOps & Cloud Deployments",
    icon: Wrench,
    accent: "#EC4899", // Rose
    summary: "Automated CI/CD pipelines, edge serverless distribution & monitoring",
    items: [
      { name: "Git & GitHub Actions", level: "Advanced", proficiency: 95, projectUsage: "Version Control, Monorepos & Branch Policies" },
      { name: "Postman API Suite", level: "Expert", proficiency: 96, projectUsage: "Automated Mock Servers & Latency Benchmarks" },
      { name: "Vercel Edge Platform", level: "Advanced", proficiency: 93, projectUsage: "Malnad Direct Edge Compute & CDN" },
      { name: "Netlify", level: "Proficient", proficiency: 89, projectUsage: "Henjodi Stores Static Site Dispatch" },
      { name: "Render Cloud", level: "Proficient", proficiency: 86, projectUsage: "Containerized Backend Microservice Hosting" },
    ],
  },
  {
    category: "AI & LLM Orchestration",
    icon: Cpu,
    accent: "#D97757", // Terracotta / Anthropic Accent
    summary: "Claude 3.5 architecture, prompt design, reasoning engines & evaluation",
    items: [
      { name: "Claude 3.5 Sonnet / Opus", level: "Certified", proficiency: 96, projectUsage: "Anthropic Certified Associate, TCS GenAI Track" },
      { name: "Prompt Architecture", level: "Expert", proficiency: 95, projectUsage: "System Prompts, Delimiters & Multi-Shot Chains" },
      { name: "Output Evaluation & Grading", level: "Advanced", proficiency: 92, projectUsage: "Model Benchmark Harnesses & Rubrics" },
      { name: "Extended Thinking & Reasoning", level: "Advanced", proficiency: 91, projectUsage: "Step-by-Step Chain-of-Thought Workflows" },
      { name: "Responsible AI Engineering", level: "Advanced", proficiency: 94, projectUsage: "Anthropic Safety Guidelines & Bias Mitigation" },
    ],
  },
];

// Radar spectrum competencies
const radarCompetencies = [
  { label: "Frontend UI/UX", score: 96, angle: 0 },
  { label: "Backend REST APIs", score: 94, angle: 60 },
  { label: "Databases & SQL", score: 89, angle: 120 },
  { label: "Cloud & DevOps", score: 91, angle: 180 },
  { label: "System Reliability", score: 95, angle: 240 },
  { label: "Algorithms & OOP", score: 88, angle: 300 },
];

const categoryMeta: Record<string, { icon: any; accent: string; summary: string }> = {
  Languages: { icon: Code2, accent: "#F59E0B", summary: "Core algorithmic foundations & type-safe application architecture" },
  Frontend: { icon: Layers, accent: "#6366F1", summary: "High-frame-rate responsive UI and kinetic micro-interactions" },
  "Backend & APIs": { icon: Server, accent: "#10B981", summary: "High-throughput RESTful services and secure authentication" },
  Databases: { icon: Database, accent: "#06B6D4", summary: "Data modeling, schema optimization, and document caching" },
  "Tools & Deployment": { icon: Wrench, accent: "#EC4899", summary: "CI/CD pipelines, containerized deployments, and observability" },
  "AI & LLM Orchestration": { icon: Sparkles, accent: "#F97316", summary: "Anthropic Claude 3.5 architectures, prompt grading & model evaluation" },
};

function levelToProficiency(level: string): number {
  switch (level?.toLowerCase()) {
    case "expert": return 96;
    case "certified": return 95;
    case "advanced": return 90;
    case "proficient": return 84;
    default: return 78;
  }
}

export default function SkillsMatrix({ skills: initialSkills }: { skills?: any[] } = {}) {
  const activeSkillGroups = (initialSkills && initialSkills.length > 0
    ? initialSkills
        .filter((g) => g.published !== false)
        .map((g) => {
          const meta = categoryMeta[g.category] || {
            icon: Cpu,
            accent: "#8B5CF6",
            summary: "Technical architecture & core tooling",
          };
          return {
            category: g.category,
            icon: meta.icon,
            accent: meta.accent,
            summary: meta.summary,
            items: (g.items || []).map((item: any) => ({
              name: item.name,
              level: item.level,
              proficiency: levelToProficiency(item.level),
              category: g.category,
            })),
          };
        })
    : enrichedSkillGroups);

  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeView, setActiveView] = useState<"bento" | "radar" | "search">("bento");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredSkill, setHoveredSkill] = useState<SkillWithMeta | null>(null);

  if (activeSkillGroups.length === 0) return null;

  const categories = ["All", ...activeSkillGroups.map((g) => g.category)];

  const filteredGroups = activeTab === "All"
    ? activeSkillGroups
    : activeSkillGroups.filter((g) => g.category === activeTab);

  // All flattened skills for search mode
  const allSkills: SkillWithMeta[] = activeSkillGroups.flatMap((g) =>
    g.items.map((i: any) => ({ ...i, category: g.category }))
  );

  const searchedSkills = allSkills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.projectUsage && s.projectUsage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Polar polygon for Radar chart
  const center = 160;
  const radius = 110;
  const polygonPoints = radarCompetencies
    .map((c) => {
      const rad = (c.angle - 90) * (Math.PI / 180);
      const r = (c.score / 100) * radius;
      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <section id="stack" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ---------------------------------------------------------------------
          SECTION MASTHEAD
          --------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>04 / TECHNICAL ARSENAL</span>
            <span>✦</span>
            <span>ENTERPRISE FULL-STACK MASTERY</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SKILLS & ARSENAL
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl font-mono">
            Battle-tested technologies powering high-throughput D2C commerce, 320kbps audio streaming, and high-availability enterprise services.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto no-scrollbar max-w-full">
          <button
            type="button"
            onClick={() => {
              setActiveView("bento");
              playPop();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeView === "bento"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Layers size={13} />
            <span>Cyber Bento</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("radar");
              playPop();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeView === "radar"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Compass size={13} />
            <span>Competency Radar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("search");
              playPop();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeView === "search"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            <Search size={13} />
            <span>Search Cloud</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          ENTERPRISE TELEMETRY STRIP (High-Impact Proof Points)
          --------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "PRODUCTION SLA", val: "99.9% UPTIME", note: "TCS Systems Engineer Enterprise SLA", accent: "#10B981" },
          { label: "CORE SPECIALIZATION", val: "MERN + NEXT 15", note: "Full-Stack TypeScript & React 19", accent: "#6366F1" },
          { label: "RESTFUL ARCHITECTURE", val: "14+ ENDPOINTS", note: "Speed Post, Cloudinary & Permits", accent: "#06B6D4" },
          { label: "VERIFIED HONORS", val: "2ND PLACE TCS", note: "AI-Friday National Hackathon 2026", accent: "#F59E0B" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold">
              {item.label}
            </span>
            <span
              className="text-xl sm:text-2xl font-black uppercase my-1 font-mono tracking-tight"
              style={{ color: item.accent }}
            >
              {item.val}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] line-clamp-1">
              {item.note}
            </span>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------------------------
          VIEW 1: CYBER BENTO ARSENAL (Default Beast View)
          --------------------------------------------------------------------- */}
      {activeView === "bento" && (
        <>
          {/* Category Filter Pills with Item Counts */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const count = cat === "All"
                ? allSkills.length
                : enrichedSkillGroups.find((g) => g.category === cat)?.items.length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat);
                    playPop();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === cat
                      ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50"
                      : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-indigo-500/30"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === cat ? "bg-white/20 text-white" : "bg-white/5 text-[var(--text-faint)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bento Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const IconComponent = group.icon;
              return (
                <TiltCard key={group.category} maxTilt={5} scale={1.01} glare={true} className="h-full">
                  <SpotlightCard
                    className="glass-panel p-6 sm:p-7 border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between h-full shadow-lg"
                    spotlightColor={`${group.accent}18`}
                    borderColor={`${group.accent}55`}
                  >
                    <div>
                      {/* Card Header with Glowing Icon Badge */}
                      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] mb-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: `${group.accent}15`,
                              borderColor: `${group.accent}40`,
                              color: group.accent,
                            }}
                          >
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base tracking-wide uppercase text-white font-mono">
                              {group.category}
                            </h3>
                            <span className="text-[10px] font-mono text-[var(--text-faint)]">
                              {group.items.length} Production Tools
                            </span>
                          </div>
                        </div>

                        <span
                          className="w-2.5 h-2.5 rounded-full animate-pulse"
                          style={{ backgroundColor: group.accent }}
                        />
                      </div>

                      <p className="text-xs text-[var(--text-muted)] font-mono mb-6 leading-relaxed">
                        {group.summary}
                      </p>

                      {/* Interactive Skill Items with Animated Proficiency Progress Bars */}
                      <div className="space-y-4">
                        {(group.items || []).map((item: any, i: number) => (
                          <div
                            key={item.name}
                            onClick={() => {
                              if (item.proficiency >= 94) {
                                playSuccess();
                                try {
                                  confetti({
                                    particleCount: 40,
                                    spread: 60,
                                    origin: { y: 0.6 },
                                    colors: [group.accent, "#6366F1", "#10B981"],
                                  });
                                } catch {}
                              } else {
                                playPop();
                              }
                            }}
                            onMouseEnter={() => {
                              playTick(720 + i * 35);
                              setHoveredSkill({ ...item, category: group.category });
                            }}
                            onMouseLeave={() => setHoveredSkill(null)}
                            className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-white/5 hover:border-indigo-500/35 transition-all duration-200 cursor-pointer group/item relative overflow-hidden"
                          >
                            {/* Skill Name, Badge & Percentage */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs sm:text-sm text-white group-hover/item:text-indigo-300 transition-colors">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                                  style={{
                                    backgroundColor: `${group.accent}20`,
                                    color: group.accent,
                                    border: `1px solid ${group.accent}45`,
                                  }}
                                >
                                  {item.level}
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-300">
                                  {item.proficiency}%
                                </span>
                              </div>
                            </div>

                            {/* Animated Glowing Progress Bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 relative">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out group-hover/item:brightness-125"
                                style={{
                                  width: `${item.proficiency}%`,
                                  background: `linear-gradient(90deg, ${group.accent}80, ${group.accent})`,
                                  boxShadow: `0 0 10px ${group.accent}85`,
                                }}
                              />
                            </div>

                            {/* Verified Project Usage Badge on Hover */}
                            {item.projectUsage && (
                              <div className="mt-2 text-[10px] font-mono text-[var(--text-faint)] group-hover/item:text-indigo-400 transition-colors flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-emerald-400" />
                                <span>Verified: {item.projectUsage}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Certification Stamp */}
                    <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-faint)] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <ShieldCheck size={13} />
                        <span>VERIFIED PRODUCTION CODE</span>
                      </span>
                      <span>HIGH MASTERY</span>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              );
            })}
          </div>
        </>
      )}

      {/* ---------------------------------------------------------------------
          VIEW 2: INTERACTIVE COMPETENCY RADAR SPECTRUM
          --------------------------------------------------------------------- */}
      {activeView === "radar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/25">
          {/* Left: SVG Polar Radar Canvas */}
          <div className="lg:col-span-6 flex items-center justify-center relative overflow-hidden sm:overflow-visible py-2">
            <svg
              viewBox="0 0 320 320"
              className="w-full max-w-[270px] sm:max-w-[340px] h-auto overflow-visible select-none"
            >
              <defs>
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
                </radialGradient>
              </defs>

              {/* Concentric Polar Grid Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * step}
                  fill={step === 1 ? "url(#radarGlow)" : "none"}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeDasharray={step < 1 ? "3 3" : undefined}
                />
              ))}

              {/* Axis Spokes */}
              {radarCompetencies.map((c, idx) => {
                const rad = (c.angle - 90) * (Math.PI / 180);
                const x = center + radius * Math.cos(rad);
                const y = center + radius * Math.sin(rad);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.15)"
                  />
                );
              })}

              {/* Competency Polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(99, 102, 241, 0.35)"
                stroke="#6366F1"
                strokeWidth="2.5"
                className="transition-all duration-500 filter drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
              />

              {/* Vertex Nodes */}
              {radarCompetencies.map((c, idx) => {
                const rad = (c.angle - 90) * (Math.PI / 180);
                const r = (c.score / 100) * radius;
                const x = center + r * Math.cos(rad);
                const y = center + r * Math.sin(rad);

                // Label position slightly outward
                const labelR = radius + 24;
                const labelX = center + labelR * Math.cos(rad);
                const labelY = center + labelR * Math.sin(rad);

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => playTick(800 + idx * 50)}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#38BDF8"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="hover:scale-150 transition-transform origin-center"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-300 text-[10px] font-mono font-bold tracking-tight"
                    >
                      {c.label} ({c.score}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: Architectural Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/25">
              <Activity size={13} />
              <span>RADAR SYNTHESIS &bull; BALANCED FULL-STACK ARCHITECT</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono">
              COMPREHENSIVE ENGINEERING INDEX
            </h3>

            <p className="text-sm text-slate-300 font-mono leading-relaxed">
              Demonstrated parity across user-facing client architecture and resilient backend systems. Zero reliance on single-stack silos.
            </p>

            <div className="space-y-3 pt-3">
              {radarCompetencies.map((c) => (
                <div key={c.label} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-white">{c.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-36 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <span className="text-cyan-400 font-bold min-w-[36px] text-right">{c.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          VIEW 3: LIVE SEARCHABLE CHIP CLOUD
          --------------------------------------------------------------------- */}
      {activeView === "search" && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/25">
          {/* Search Input Bar */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology, stack, or project (e.g. Next.js, Speed Post, MongoDB)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Chips */}
          <div className="flex flex-wrap gap-2.5 justify-center">
            {searchedSkills.map((skill, idx) => (
              <div
                key={idx}
                onMouseEnter={() => playTick(750 + idx * 15)}
                className="p-3.5 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 transition-all cursor-pointer group flex items-center gap-3 shadow-sm hover:shadow-indigo-500/20"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors font-mono">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {skill.category} &bull; {skill.projectUsage}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {searchedSkills.length === 0 && (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No matching technologies found for &quot;{searchQuery}&quot;. Try searching for &quot;React&quot;, &quot;SQL&quot;, or &quot;Node&quot;.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
