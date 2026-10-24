"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, Activity } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import SpotlightCard from "@/components/ui/SpotlightCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface KineticVideoCardProps {
  videoUrl: string;
  poster?: string;
  title: string;
  tagline: string;
  badge?: string;
  accentColor?: string;
  aspectRatio?: string;
  containerAnimation?: gsap.core.Tween | gsap.core.Timeline;
  className?: string;
  onFullscreen?: () => void;
}

/**
 * KINETIC VIDEO CARD COMPONENT
 * Implements high-end scroll movement effect on video:
 * - GSAP ScrollTrigger scale & parallax scrub
 * - 3D physics-based micro-tilt with reflective glare
 * - Continuous ambient autoplay with user sound & play/pause toggles
 * - Live telemetry HUD (1080p, 60fps, timecode, status)
 * - IntersectionObserver: Zero initial byte buffering until scrolled near view
 */
export default function KineticVideoCard({
  videoUrl,
  poster,
  title,
  tagline,
  badge = "1080P DEMO WALKTHROUGH",
  accentColor = "#6366F1",
  aspectRatio = "aspect-[16/10]",
  containerAnimation,
  className = "",
  onFullscreen,
}: KineticVideoCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [progress, setProgress] = useState(0);

  // Auto-detect poster frame if not passed
  const resolvedPoster =
    poster ||
    (videoUrl.includes("henjodi")
      ? "/henjodi/henjodi-poster.jpg"
      : videoUrl.includes("malnad")
      ? "/malnaddirect/malnad-poster.jpg"
      : videoUrl.includes("tunexia")
      ? "/tunexia/tunexia-poster.jpg"
      : "/projects/kheti-bazaar-poster.jpg");

  // Lazy load video only when scrolled within 250px of viewport
  useEffect(() => {
    if (!cardRef.current || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (videoRef.current && isPlaying) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  // Scroll movement parallax and scale effect
  useEffect(() => {
    if (typeof window === "undefined" || !cardRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = cardRef.current;

    const ctx = gsap.context(() => {
      // Parallax scale & Y-movement on vertical scroll
      gsap.fromTo(
        el,
        { scale: 0.94, y: 15 },
        {
          scale: 1.02,
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            containerAnimation: containerAnimation,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [containerAnimation]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(formatTime(cur));
    setProgress((cur / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  return (
    <div ref={cardRef} className={`relative w-full h-full will-change-transform ${className}`}>
      <TiltCard maxTilt={5} scale={1.015} glare={true} className="w-full h-full">
        <SpotlightCard
          className="relative rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-main)] shadow-2xl flex flex-col justify-between group h-full"
          spotlightColor={`${accentColor}25`}
          borderColor={`${accentColor}60`}
        >
          {/* Top Browser Frame HUD */}
          <div className="p-3 sm:p-4 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] ml-2 flex items-center gap-1.5">
                <Film size={12} style={{ color: accentColor }} />
                <span>{badge}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                <Activity size={10} className="animate-spin" />
                <span>60 FPS SCROLL-LINKED</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 rounded">
                {currentTime} / {duration}
              </span>
            </div>
          </div>

          {/* Video Container with Kinetic Ambient Motion */}
          <div className={`relative w-full ${aspectRatio} overflow-hidden bg-black flex-1`}>
            <video
              ref={videoRef}
              src={isInView ? videoUrl : undefined}
              poster={resolvedPoster}
              preload="none"
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

            {/* Floating Action Controls Overlay */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                title={isPlaying ? "Pause video" : "Play video"}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5 text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Unmute audio" : "Mute audio"}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
              >
                {isMuted ? <VolumeX size={14} className="text-amber-400" /> : <Volume2 size={14} className="text-indigo-400" />}
              </button>
              {onFullscreen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFullscreen();
                  }}
                  title="Expand to Fullscreen Cinema Lightbox"
                  className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg hidden sm:flex"
                >
                  <Maximize2 size={14} />
                </button>
              )}
            </div>

            {/* Bottom Caption & Scrubber bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
              <div className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full inline-block mb-1.5"
                    style={{
                      backgroundColor: `${accentColor}25`,
                      color: accentColor,
                      border: `1px solid ${accentColor}50`,
                    }}
                  >
                    LIVE ARCHITECTURE DEMO
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black uppercase text-white tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono line-clamp-1">
                    {tagline}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`,
                  }}
                />
              </div>
            </div>
          </div>
        </SpotlightCard>
      </TiltCard>
    </div>
  );
}
