"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  currentAlpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

/**
 * Global Interactive Ambient Constellation Mesh & Kinetic Particle Field
 * - Stretches across the entire portfolio background seamlessly
 * - Dynamic connective filaments between nodes based on proximity
 * - Fluid cursor & touch gravitational warp & filament connection anywhere on the site
 * - Lightweight, batched GPU draw calls for locked 60/120fps
 * - Automatic visibilitychange sleep (0% CPU when tab is hidden)
 * - Automatic prefers-reduced-motion compliance
 */
export default function HeroCanvasMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mouse tracking relative to viewport
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 170, // Magnetic influence radius
      isActive: false,
    };

    // Curated ethereal palette matching the obsidian void design tokens
    const colors = [
      "rgba(99, 102, 241, ", // Electric Indigo
      "rgba(6, 182, 212, ",  // Cyber Cyan
      "rgba(16, 185, 129, ", // Emerald Harvest
      "rgba(255, 176, 0, ",  // Neon Amber
    ];

    let particles: Particle[] = [];

    const initDimensions = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const isMobile = width < 768;
      // High-framerate calibrated density: 22 nodes on mobile, ~65 on desktop
      const count = isMobile
        ? Math.max(18, Math.min(24, Math.floor((width * height) / 22000)))
        : Math.max(35, Math.min(70, Math.floor((width * height) / 16000)));

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const speed = prefersReducedMotion ? 0.08 : 0.22 + Math.random() * 0.35;
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() > 0.85 ? 2.4 : 1.2 + Math.random() * 1.0,
          baseAlpha: 0.25 + Math.random() * 0.45,
          currentAlpha: 0.25 + Math.random() * 0.45,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseSpeed: 0.015 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const onPointerMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const onPointerLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isActive = true;
      }
    };

    const onTouchEnd = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Animate loop
    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;

      // Smooth mouse lerp
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      const connectionDistance = isMobile ? 92 : 125;
      const connectionDistanceSq = connectionDistance * connectionDistance;
      const mouseDistanceSq = mouse.radius * mouse.radius;

      // 1. Update particle physics & draw nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic harmonic pulsation
        p.pulsePhase += p.pulseSpeed;
        p.currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport borders smoothly
        if (p.x < 0) {
          p.x = width;
        } else if (p.x > width) {
          p.x = 0;
        }

        if (p.y < 0) {
          p.y = height;
        } else if (p.y > height) {
          p.y = 0;
        }

        // Magnetic cursor interaction
        if (mouse.isActive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseDistanceSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            // Repulsion force decaying with distance
            const force = (1 - dist / mouse.radius) * 1.8;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;

            // Illuminate particles near cursor
            p.currentAlpha = Math.min(0.9, p.currentAlpha + 0.35);

            // Draw glowing filament from cursor to nearby particles
            const cursorAlpha = (1 - dist / mouse.radius) * 0.4;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${cursorAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0.1, p.currentAlpha).toFixed(2)})`;
        ctx.fill();

        // Subtle glow halo for larger nodes
        if (p.radius > 2.0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(p.currentAlpha * 0.12).toFixed(3)})`;
          ctx.fill();
        }
      }

      // 2. Batched connective filaments between adjacent nodes (single path & stroke for 60/120fps)
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistanceSq) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.strokeStyle = "rgba(165, 180, 252, 0.12)";
      ctx.lineWidth = 0.65;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    // Resize handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initDimensions();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Pause rendering when tab is hidden in background to save 100% CPU
    const onVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Defer canvas particle calculations until after initial paint
    const startTimer = setTimeout(() => {
      initDimensions();
      animationFrameId = requestAnimationFrame(render);
    }, 280);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background ambient lighting anchors matching the obsidian void design tokens */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] h-[240px] sm:h-[350px] bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-4 sm:right-10 w-[240px] sm:w-[350px] h-[240px] sm:h-[350px] bg-amber-500/15 rounded-full blur-3xl" />
      <div className="absolute top-2/3 left-6 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-cyan-500/15 rounded-full blur-3xl" />

      {/* Global Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-85 transition-opacity duration-700"
      />
    </div>
  );
}
