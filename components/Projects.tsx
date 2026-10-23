"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { projects, Project, ScreenshotItem } from "@/lib/data";
import { playPop, playTick, playSuccess } from "@/lib/sound";
import {
  ArrowUpRight,
  ExternalLink,
  X,
  Layers,
  Zap,
  CheckCircle2,
  Globe,
  LayoutGrid,
  List,
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import ProjectShowcase from "@/components/showcase/ProjectShowcase";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TiltCard from "@/components/ui/TiltCard";

const projectPosters: Record<string, string> = {
  "malnad-direct": "/malnaddirect/malnad-poster.jpg",
  "henjodi-stores": "/henjodi/henjodi-poster.jpg",
  "tunexia": "/tunexia/tunexia-poster.jpg",
  "kheti-bazaar": "/projects/kheti-bazaar-poster.jpg",
};

function DeferredCardMedia({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const poster = projectPosters[project.id] || project.previewImage;

  useEffect(() => {
    if (!project.videoUrl) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.videoUrl]);

  return (
    <div ref={containerRef} className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/40">
      {project.videoUrl ? (
        <video
          ref={videoRef}
          src={shouldLoadVideo ? project.videoUrl : undefined}
          poster={poster}
          preload="none"
          autoPlay={shouldLoadVideo}
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : project.previewImage ? (
        <Image
          src={project.previewImage}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${project.previewGradient}`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85 pointer-events-none" />

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

        <div className="flex items-center gap-2">
          {project.videoUrl && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-indigo-600/85 backdrop-blur-md text-white flex items-center gap-1 shadow-sm">
              <Film size={11} /> 1 VIDEO
            </span>
          )}
          {project.screenshots && project.screenshots.length > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/75 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
              {project.screenshots.length} SCREENS
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "grid" | "showcase">("showcase");
  const [modalTab, setModalTab] = useState<"cinema" | "live" | "architecture">("cinema");
  const [activeMediaIdx, setActiveMediaIdx] = useState<number>(0);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);
  const [videoMuted, setVideoMuted] = useState<boolean>(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const reelContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const categories = ["All", "Live Production", "E-Commerce & Logistics", "Media & Cloud"];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Live Production") return p.status === "Live Production";
    if (activeCategory === "E-Commerce & Logistics")
      return p.category.includes("E-Commerce") || p.category.includes("Logistics");
    if (activeCategory === "Media & Cloud") return p.category.includes("Media");
    return true;
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Handle keyboard navigation inside modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        navigateMedia("prev");
      } else if (e.key === "ArrowRight") {
        navigateMedia("next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, activeMediaIdx]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const openModal = (p: Project, initialTab: "cinema" | "live" = "cinema") => {
    setSelectedProject(p);
    setModalTab(initialTab);
    setActiveMediaIdx(0);
    setVideoPlaying(true);
    setVideoMuted(true);
    playPop();
  };

  const closeModal = () => {
    setSelectedProject(null);
    playPop();
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
    playPop();
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoMuted;
    videoRef.current.muted = nextMuted;
    setVideoMuted(nextMuted);
    playPop();
  };

  const totalMediaItems = (p: Project) => {
    return (p.videoUrl ? 1 : 0) + (p.screenshots?.length || 0);
  };

  const navigateMedia = (direction: "prev" | "next") => {
    if (!selectedProject) return;
    const total = totalMediaItems(selectedProject);
    if (total <= 1) return;

    let nextIdx = direction === "next" ? activeMediaIdx + 1 : activeMediaIdx - 1;
    if (nextIdx >= total) nextIdx = 0;
    if (nextIdx < 0) nextIdx = total - 1;

    selectMedia(nextIdx);
  };

  const selectMedia = (idx: number) => {
    setActiveMediaIdx(idx);
    playTick(650 + idx * 40);

    // Smoothly scroll the selected reel card into view
    if (reelContainerRef.current) {
      const cards = reelContainerRef.current.children;
      if (cards[idx]) {
        (cards[idx] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const scrollReel = (direction: "left" | "right") => {
    if (!reelContainerRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    reelContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    playPop();
  };

  // Determine current active media item in spotlight
  const getActiveSpotlightMedia = () => {
    if (!selectedProject) return null;
    const hasVideo = !!selectedProject.videoUrl;

    if (hasVideo && activeMediaIdx === 0) {
      return {
        type: "video" as const,
        url: selectedProject.videoUrl!,
        title: "Official 1080p HD Walkthrough Video",
        caption: "Live architecture walkthrough demonstrating core UI workflows, responsive layout, and backend integrations.",
      };
    }

    const screenshotIdx = hasVideo ? activeMediaIdx - 1 : activeMediaIdx;
    const screenshot = selectedProject.screenshots?.[screenshotIdx];
    if (screenshot) {
      return {
        type: "screenshot" as const,
        url: screenshot.url,
        title: screenshot.title,
        caption: screenshot.caption,
        index: screenshotIdx + 1,
        total: selectedProject.screenshots.length,
      };
    }

    return null;
  };

  const spotlight = getActiveSpotlightMedia();

  return (
    <section id="work" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" onMouseMove={handleMouseMove}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>02 / SELECTED WORKS</span>
            <span>✦</span>
            <span>LIVE PRODUCTION &amp; MEDIA</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CLIENT PROJECTS &amp; APPS
          </h2>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* List vs Visual Grid vs Kinetic Showcase Toggle */}
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
            <button
              type="button"
              onClick={() => {
                setViewMode("showcase");
                playPop();
                setTimeout(() => {
                  if (typeof window !== "undefined") {
                    ScrollTrigger.refresh();
                  }
                }, 150);
              }}
              title="Kinetic Scroll Showcase (Awwwards Moving Reel & Stacked Cards)"
              className={`p-2 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "showcase"
                  ? "bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-sm shadow-indigo-500/25 font-bold"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Sparkles size={14} className={viewMode === "showcase" ? "text-amber-300 animate-pulse" : "text-indigo-400"} />
              <span className="hidden sm:inline">Kinetic Showcase</span>
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
                        sizes="96px"
                        loading="lazy"
                        className="object-cover object-top"
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

              {/* Bottom Metadata & Media Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-8 sm:pl-12">
                <div className="flex flex-wrap gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
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

                {/* Media Showcase Indicators */}
                <div className="flex items-center gap-2">
                  {project.videoUrl && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      <Film size={11} className="text-indigo-400" />
                      1 HD Video
                    </span>
                  )}
                  {project.screenshots && project.screenshots.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] group-hover:border-indigo-500/30">
                      <span>📸</span>
                      {project.screenshots.length} Screenshots
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Reel ↗
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: Visual Media Showcase (Mockups & Screenshots) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              maxTilt={6}
              scale={1.015}
              glare={true}
              className="cursor-pointer h-full"
              onClick={() => openModal(project)}
            >
              <SpotlightCard
                className="glass-panel border border-[var(--border-subtle)] hover:border-indigo-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10"
                spotlightColor="rgba(99, 102, 241, 0.12)"
                borderColor="rgba(129, 140, 248, 0.5)"
              >
                {/* Browser Window Frame Mockup Header */}
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

              {/* Real Project Video Demo or Image with Pan Zoom on hover */}
              <DeferredCardMedia project={project} />

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
            </SpotlightCard>
          </TiltCard>
          ))}
        </div>
      )}

      {/* View Mode 3: Kinetic Motion Showcase (Awwwards Moving Image Scroll, Stacked Cards, Bento Matrix) */}
      {viewMode === "showcase" && (
        <div className="mt-8 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#090B10]">
          <ProjectShowcase enableLenis={false} id="kinetic-works" />
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
          {/* Screenshot preview in floating card */}
          <div className="relative h-44 w-full bg-black/60 overflow-hidden">
            {hoveredProject.previewImage ? (
              <Image
                src={hoveredProject.previewImage}
                alt={hoveredProject.name}
                fill
                sizes="384px"
                loading="lazy"
                className="object-cover object-top"
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
              Click row to launch Cinema Reel (1 Video + 7 Screenshots) ↗
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          INTERACTIVE CINEMA LIGHTBOX MODAL WITH MOVING IMAGE SCROLLABLE REELS
          ========================================================================== */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto glass-panel p-5 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close Cinema Modal"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer z-30 shadow-md"
            >
              <X size={18} />
            </button>

            {/* Modal Header Bar */}
            <div className="pr-12 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                  style={{
                    backgroundColor: `${selectedProject.badgeColor}15`,
                    borderColor: `${selectedProject.badgeColor}40`,
                    color: selectedProject.badgeColor,
                  }}
                >
                  {selectedProject.status} · {selectedProject.date}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  {selectedProject.category}
                </span>
                {selectedProject.videoUrl && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 flex items-center gap-1">
                    <Film size={11} /> 1 HD Video
                  </span>
                )}
                {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30">
                    {selectedProject.screenshots.length} Screenshots
                  </span>
                )}
              </div>

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

            {/* Modal View Selector Tabs & Live Link Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setModalTab("cinema");
                    playPop();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === "cinema"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <Film size={13} />
                  <span>Cinema Reel ({totalMediaItems(selectedProject)} Assets)</span>
                </button>

                {selectedProject.liveUrl && selectedProject.id !== "henjodi-stores" && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalTab("live");
                      playPop();
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      modalTab === "live"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-[var(--text-muted)] hover:text-white"
                    }`}
                  >
                    <Globe size={13} />
                    <span>Live Interactive Embed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setModalTab("architecture");
                    playPop();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === "architecture"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  <Zap size={13} />
                  <span>Architecture &amp; Specs</span>
                </button>
              </div>

              {/* Direct External Links */}
              <div className="flex items-center gap-2">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playPop()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/25 transition-all"
                  >
                    <Globe size={12} />
                    <span>Open Live Site</span>
                    <ExternalLink size={11} />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playPop()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white text-xs font-mono transition-all"
                  >
                    <GithubIcon size={12} />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* TAB CONTENT 1: CINEMA REEL WITH MOVING IMAGES WHILE SCROLLING */}
            {modalTab === "cinema" && (
              <div className="space-y-6">
                {/* 1. Main Media Spotlight Screen */}
                <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 bg-black shadow-2xl">
                  {/* Browser Window Chrome Top Header */}
                  <div className="h-8 px-4 bg-[#0B0E17] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[11px] text-[var(--text-faint)] ml-2 hidden sm:inline">
                        cinema-media-spotlight // {selectedProject.name.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-indigo-400 font-bold">
                        {activeMediaIdx + 1} / {totalMediaItems(selectedProject)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => navigateMedia("prev")}
                          className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                          title="Previous Media (← Arrow)"
                        >
                          <ChevronLeft size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateMedia("next")}
                          className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                          title="Next Media (→ Arrow)"
                        >
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Spotlight Display Body */}
                  <div className="relative aspect-video w-full bg-[#05070B] flex items-center justify-center overflow-hidden">
                    {spotlight?.type === "video" ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video
                          ref={videoRef}
                          src={spotlight.url}
                          autoPlay
                          loop
                          playsInline
                          muted={videoMuted}
                          className="w-full h-full object-contain"
                        />

                        {/* Overlaid Playback Controls Bar */}
                        <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 p-2.5 sm:p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono text-white z-20">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={toggleVideoPlayback}
                              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                              title={videoPlaying ? "Pause Video" : "Play Video"}
                            >
                              {videoPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={toggleVideoMute}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                              title={videoMuted ? "Unmute Audio" : "Mute Audio"}
                            >
                              {videoMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
                            </button>

                            <div className="hidden sm:flex flex-col">
                              <span className="font-bold text-white text-[12px]">{spotlight.title}</span>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                AUTOPLAYING HD WALKTHROUGH
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-[var(--text-muted)] font-mono">
                            {videoMuted ? "Audio Muted (Click to Unmute)" : "Stereo Audio Active"}
                          </div>
                        </div>
                      </div>
                    ) : spotlight?.type === "screenshot" ? (
                      <div className="relative w-full h-full bg-black/90">
                        <Image
                          src={spotlight.url}
                          alt={spotlight.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 1024px"
                          className="object-contain p-2"
                        />

                        {/* Architectural Caption Pill */}
                        <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white z-20">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-indigo-300">
                                Screenshot {spotlight.index} of {spotlight.total}:
                              </span>
                              <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {spotlight.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 line-clamp-1">
                              {spotlight.caption}
                            </p>
                          </div>

                          <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                            100% VERIFIED ARTIFACT
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* 2. Interactive Moving Image Filmstrip Reel (Scrollable / Draggable) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                      <SlidersHorizontal size={13} className="text-indigo-400" />
                      <span>Interactive Media Reel (Scroll or Drag Horizontally)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => scrollReel("left")}
                        className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-indigo-600 border border-[var(--border-subtle)] hover:border-indigo-600 text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Scroll Left"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollReel("right")}
                        className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-indigo-600 border border-[var(--border-subtle)] hover:border-indigo-600 text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        title="Scroll Right"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Track */}
                  <div
                    ref={reelContainerRef}
                    className="cinema-reel-container no-scrollbar"
                  >
                    {/* Item 0: Video Walkthrough Card (if project has video) */}
                    {selectedProject.videoUrl && (
                      <div
                        onClick={() => selectMedia(0)}
                        className={`cinema-reel-card group/card ${
                          activeMediaIdx === 0 ? "active-media" : ""
                        }`}
                      >
                        <div className="h-6 px-3 bg-[#0B0E17] border-b border-indigo-500/20 flex items-center justify-between text-[10px] font-mono">
                          <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                            <Film size={11} />
                            <span>01 // WALKTHROUGH</span>
                          </div>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            HD VIDEO
                          </span>
                        </div>

                        <div className="relative h-44 w-full bg-black overflow-hidden flex items-center justify-center">
                          <video
                            src={selectedProject.videoUrl}
                            poster={projectPosters[selectedProject.id]}
                            preload="none"
                            playsInline
                            muted
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                              <Play size={16} className="ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#0D111D] border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-white">Full HD Video Walkthrough</span>
                          <span className="text-indigo-400 text-[10px]">Autoplay</span>
                        </div>
                      </div>
                    )}

                    {/* Items 1..7: The 7 Screenshots */}
                    {selectedProject.screenshots?.map((screenshot, sIdx) => {
                      const itemIdx = (selectedProject.videoUrl ? 1 : 0) + sIdx;
                      const isActive = activeMediaIdx === itemIdx;

                      return (
                        <div
                          key={sIdx}
                          onClick={() => selectMedia(itemIdx)}
                          className={`cinema-reel-card group/card ${
                            isActive ? "active-media" : ""
                          }`}
                        >
                          <div className="h-6 px-3 bg-[#0B0E17] border-b border-white/10 flex items-center justify-between text-[10px] font-mono">
                            <div className="flex items-center gap-1.5 text-white/70">
                              <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="text-white/50">
                              0{sIdx + 1} / 0{selectedProject.screenshots.length}
                            </span>
                          </div>

                          <div className="relative h-44 w-full bg-black/80 overflow-hidden">
                            <Image
                              src={screenshot.url}
                              alt={screenshot.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              loading="lazy"
                              className="object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                            <div className="absolute bottom-2 left-2 right-2 text-white">
                              <span className="text-[11px] font-mono font-bold block truncate">
                                {screenshot.title}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-[#0D111D] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                            <span className="truncate max-w-[260px]">{screenshot.caption}</span>
                            <span className="text-indigo-400 font-bold shrink-0 ml-1">
                              {isActive ? "ACTIVE" : "VIEW ↗"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: LIVE EMBED (Interactive Iframe) */}
            {modalTab === "live" && selectedProject.liveUrl && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shadow-2xl">
                  {/* Browser Window Bar */}
                  <div className="h-9 px-4 bg-[#0B0E17] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>

                    <div className="px-4 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <Globe size={12} />
                      <span>{selectedProject.liveUrl}</span>
                    </div>

                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-white flex items-center gap-1"
                    >
                      <span>New Tab</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="relative h-[520px] w-full bg-black">
                    <iframe
                      src={selectedProject.liveUrl}
                      title={selectedProject.name}
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: ARCHITECTURE & SPECS */}
            <div className={`space-y-8 ${modalTab === "architecture" ? "mt-4" : "mt-8 pt-8 border-t border-[var(--border-subtle)]"}`}>
              {/* Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedProject.metrics.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
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
        </div>
      )}
    </section>
  );
}
