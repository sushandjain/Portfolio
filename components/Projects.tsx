"use client";

import { useState } from "react";
import { projects, Project } from "@/lib/data";
import { playPop, playTick } from "@/lib/sound";
import { ArrowUpRight, ExternalLink, X, Layers, Zap, CheckCircle2, ShieldCheck, Globe } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const categories = ["All", "Live Production", "E-Commerce & Logistics", "Media & Cloud"];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Live Production") return p.status === "Live Production";
    if (activeCategory === "E-Commerce & Logistics") return p.category.includes("E-Commerce") || p.category.includes("Logistics");
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>02 / SELECTED WORKS</span>
            <span>✦</span>
            <span>STRETCH FOLIO SHOWCASE</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            LIVE CLIENT & PRODUCTION APPS
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-[var(--bg-card)] p-1.5 rounded-full border border-[var(--border-subtle)] shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                playPop();
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Stretch List */}
      <div className="space-y-0">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className="project-row group py-8 sm:py-12 cursor-pointer transition-all duration-300 px-4 sm:px-6 rounded-2xl"
            onMouseEnter={() => {
              setHoveredProject(project);
              playTick(600 + index * 60);
            }}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => openModal(project)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Index & Title */}
              <div className="flex items-baseline gap-4 sm:gap-8">
                <span className="font-mono text-sm sm:text-base font-bold text-[var(--text-faint)] group-hover:text-indigo-400 transition-colors">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl text-[var(--text-main)] transition-all">
                      {project.name}
                    </h3>
                    {project.liveUrl && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Globe size={11} /> LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-medium line-clamp-1 max-w-xl">
                    {project.tagline}
                  </p>
                </div>
              </div>

              {/* Right: Category, Stack & Action Trigger */}
              <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8 shrink-0">
                {/* Status Badge */}
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

                {/* Arrow trigger button */}
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

      {/* Floating Cursor Preview (Desktop Only) */}
      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-40 hidden md:block w-80 rounded-2xl overflow-hidden glass-panel p-4 shadow-2xl transition-opacity duration-200 -translate-x-1/2 -translate-y-full -mt-4 border border-indigo-500/40"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          <div className={`h-28 rounded-xl bg-gradient-to-br ${hoveredProject.previewGradient} flex flex-col items-center justify-center p-4 text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase font-mono tracking-widest opacity-80 block mb-1">
                {hoveredProject.category}
              </span>
              <p className="font-extrabold text-lg tracking-tight" style={{ fontFamily: "var(--font-d)" }}>
                {hoveredProject.name}
              </p>
              {hoveredProject.liveUrl && (
                <span className="text-[10px] font-mono text-emerald-300 flex items-center justify-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {hoveredProject.liveUrl.replace("https://", "").replace("http://", "").replace("/", "")}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
            {hoveredProject.metrics.slice(0, 2).map((m, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] p-2 rounded-lg border border-[var(--border-subtle)]">
                <span className="text-[var(--text-faint)] block">{m.label}</span>
                <span className="text-indigo-400 font-bold">{m.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 text-center text-[10px] font-mono text-[var(--text-faint)]">
            Click row to view architecture case study ↗
          </div>
        </div>
      )}

      {/* In-Depth Project Modal Drawer */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="pr-12">
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
                className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-d)" }}
              >
                {selectedProject.name}
              </h3>
              <p className="text-sm sm:text-base text-indigo-400 font-medium mt-1">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Live & GitHub Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
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
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  {selectedProject.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-main)] font-bold mb-3 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-400" />
                  Engineered With
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((s) => (
                    <span key={s} className="tech-pill text-xs">
                      {s}
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
