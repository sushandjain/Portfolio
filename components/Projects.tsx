"use client";

import { useState } from "react";
import Image from "next/image";
import { projects, Project } from "@/lib/data";
import { playPop, playTick } from "@/lib/sound";
import {
  ArrowUpRight,
  ExternalLink,
  X,
  Layers,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Globe,
  LayoutGrid,
  List,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const categories = ["All", "Live Production", "E-Commerce & Logistics", "Media & Cloud"];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Live Production") return p.status === "Live Production";
    if (activeCategory === "E-Commerce & Logistics")
      return p.category.includes("E-Commerce") || p.category.includes("Logistics");
    if (activeCategory === "Media & Cloud") return p.category.includes("Media");
    return true;
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const openModal = (p: Project) => {
    setSelectedProject(p);
    playPop();
  };

  const closeModal = () => {
    setSelectedProject(null);
    playPop();
  };

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" onMouseMove={handleMouseMove}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>02 / SELECTED WORKS</span>
            <span>✦</span>
            <span>LIVE PRODUCTION & MEDIA</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CLIENT PROJECTS & APPS
          </h2>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* List vs Visual Grid Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => {
                setViewMode("list");
                playPop();
              }}
              title="Stretch Typography View"
              className={`p-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">Stretch List</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("grid");
                playPop();
              }}
              title="Visual Screenshot & Media Showcase"
              className={`p-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Visual Media</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)] shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  playPop();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Stretch Typography List (Konrad Makowski style) */}
      {viewMode === "list" && (
        <div className="space-y-0">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-row group py-8 sm:py-12 cursor-pointer transition-all duration-300 px-4 sm:px-6 rounded-2xl border-b border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)]"
              onMouseEnter={() => {
                setHoveredProject(project);
                playTick(600 + index * 60);
              }}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => openModal(project)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Index, Title & Thumbnail peek */}
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="font-mono text-sm sm:text-base font-bold text-[var(--text-faint)] group-hover:text-indigo-400 transition-colors">
                    0{index + 1}
                  </span>

                  {/* Thumbnail peek on row */}
                  {project.previewImage && (
                    <div className="relative w-16 h-10 sm:w-24 sm:h-14 rounded-lg overflow-hidden border border-[var(--border-subtle)] shrink-0 hidden sm:block group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={project.previewImage}
                        alt={project.name}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className="text-3xl sm:text-5xl lg:text-6xl text-[var(--text-main)] group-hover:text-white transition-all uppercase tracking-tight"
                        style={{ fontFamily: "var(--font-d)" }}
                      >
                        {project.name}
                      </h3>
                      {project.liveUrl && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Globe size={11} /> LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-medium line-clamp-1 max-w-xl">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: Category, Stack & Action Trigger */}
                <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8 shrink-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide border shadow-2xs"
                    style={{
                      backgroundColor: `${project.badgeColor}15`,
                      borderColor: `${project.badgeColor}40`,
                      color: project.badgeColor,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.badgeColor }} />
                    {project.status}
                  </span>

                  <div className="w-11 h-11 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:scale-110 transition-all duration-300">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>

              {/* Tech chips preview */}
              <div className="mt-4 flex flex-wrap gap-2 pl-8 sm:pl-12 opacity-80 group-hover:opacity-100 transition-opacity">
                {project.stack.slice(0, 5).map((tech) => (
                  <span key={tech} className="tech-pill text-[11px] py-0.5 px-2.5">
                    {tech}
                  </span>
                ))}
                {project.stack.length > 5 && (
                  <span className="tech-pill text-[11px] py-0.5 px-2.5 opacity-60">
                    +{project.stack.length - 5} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: Visual Media Showcase (Mockups & Screenshots) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="glass-panel rounded-3xl border border-[var(--border-subtle)] hover:border-indigo-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => openModal(project)}
            >
              {/* Browser Window Frame Mockup */}
              <div className="p-3 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)] max-w-xs truncate flex items-center gap-1">
                  <span className="text-emerald-400">https://</span>
                  <span>{project.liveUrl ? project.liveUrl.replace("https://", "").replace("http://", "") : `${project.id}.app`}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ● PRODUCTION
                </span>
              </div>

              {/* Real Project Image with Pan Zoom on hover */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/40">
                {project.previewImage ? (
                  <Image
                    src={project.previewImage}
                    alt={project.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${project.previewGradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Overlaid Pill Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md"
                    style={{
                      backgroundColor: `${project.badgeColor}25`,
                      color: project.badgeColor,
                      border: `1px solid ${project.badgeColor}50`,
                    }}
                  >
                    {project.category}
                  </span>

                  {project.liveUrl && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE APP
                    </span>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3
                    className="text-2xl font-black uppercase tracking-tight text-[var(--text-main)] group-hover:text-indigo-400 transition-colors"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {project.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
                  {project.tagline}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono">
                  {project.metrics.slice(0, 2).map((m, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-faint)] block">{m.label}</span>
                      <span className="text-indigo-400 font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-pill text-[10px] py-0.5 px-2">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cursor Preview (Desktop Only in list mode) */}
      {hoveredProject && viewMode === "list" && (
        <div
          className="fixed pointer-events-none z-40 hidden md:block w-96 rounded-2xl overflow-hidden glass-panel shadow-2xl transition-opacity duration-150 -translate-x-1/2 -translate-y-full -mt-6 border border-indigo-500/50"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {/* Real screenshot preview in floating card */}
          <div className="relative h-44 w-full bg-black/60 overflow-hidden">
            {hoveredProject.previewImage ? (
              <Image
                src={hoveredProject.previewImage}
                alt={hoveredProject.name}
                fill
                className="object-cover object-top"
                unoptimized
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${hoveredProject.previewGradient}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300 block mb-0.5">
                {hoveredProject.category}
              </span>
              <p className="font-black text-xl tracking-tight uppercase" style={{ fontFamily: "var(--font-d)" }}>
                {hoveredProject.name}
              </p>
              {hoveredProject.liveUrl && (
                <span className="text-[10px] font-mono text-emerald-300 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {hoveredProject.liveUrl.replace("https://", "").replace("http://", "").replace("/", "")}
                </span>
              )}
            </div>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              {hoveredProject.metrics.slice(0, 2).map((m, i) => (
                <div key={i} className="bg-[var(--bg-secondary)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <span className="text-[var(--text-faint)] block">{m.label}</span>
                  <span className="text-indigo-400 font-bold">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 text-center text-[10px] font-mono text-[var(--text-faint)]">
              Click row to inspect live platform & architecture ↗
            </div>
          </div>
        </div>
      )}

      {/* In-Depth Project Modal Drawer */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer z-20"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="pr-12 mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border mb-3"
                style={{
                  backgroundColor: `${selectedProject.badgeColor}15`,
                  borderColor: `${selectedProject.badgeColor}40`,
                  color: selectedProject.badgeColor,
                }}
              >
                {selectedProject.status} · {selectedProject.date}
              </span>
              <h3
                className="text-3xl sm:text-5xl font-black text-[var(--text-main)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {selectedProject.name}
              </h3>
              <p className="text-sm sm:text-base text-indigo-400 font-medium mt-1">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Visual Screenshot / Media Preview Window */}
            {selectedProject.previewImage && (
              <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] mb-8 bg-black/50">
                {/* Simulated Browser Bar */}
                <div className="px-4 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] max-w-sm truncate flex items-center gap-1.5">
                    <Globe size={12} className="text-emerald-400" />
                    <span>{selectedProject.liveUrl || "https://github.com/sushandjain"}</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="pulse-green" /> REAL CAPTURE
                  </span>
                </div>

                <div className="relative h-64 sm:h-96 w-full overflow-hidden">
                  <Image
                    src={selectedProject.previewImage}
                    alt={selectedProject.name}
                    fill
                    className="object-cover object-top hover:object-bottom transition-all duration-1000 cursor-zoom-in"
                    unoptimized
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playPop()}
                  className="magnetic-btn magnetic-btn-primary text-xs py-2.5 px-5"
                >
                  <Globe size={14} />
                  <span>Launch Live Platform</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playPop()}
                  className="magnetic-btn magnetic-btn-ghost text-xs py-2.5 px-5"
                >
                  <GithubIcon size={14} />
                  <span>View Source Code</span>
                </a>
              )}
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {selectedProject.metrics.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-faint)] block">{m.label}</span>
                  <span className="text-sm sm:text-base font-bold text-[var(--text-main)] font-mono">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Description & Technical Points */}
            <div className="space-y-5 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              <p>{selectedProject.description}</p>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-main)] font-bold mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-amber-400" />
                  Key Architectural Implementations
                </h4>
                <div className="space-y-2.5">
                  {selectedProject.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Tech Stack Pills */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-main)] font-bold mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400" />
                  Verified Engineering Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((tech) => (
                    <span key={tech} className="tech-pill text-xs py-1 px-3">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
