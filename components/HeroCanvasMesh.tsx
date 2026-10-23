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
 * Interactive Ambient Constellation Mesh & Kinetic Particle Field for Hero
 * - Dynamic connective filaments between nodes based on proximity
 * - Fluid cursor gravitational warp & filament connection
 * - Retina DPI crisp rendering
 * - IntersectionObserver lifecycle (0% CPU/GPU overhead when scrolled out of view)
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

    // Mouse tracking relative to canvas
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
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;

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
      // Dynamic density based on screen area: ~22 on mobile, ~75 on desktop for high framerate
      const count = isMobile
        ? Math.max(18, Math.min(26, Math.floor((width * height) / 22000)))
        : Math.max(35, Math.min(80, Math.floor((width * height) / 14000)));

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
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const onPointerLeave = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    };

    const onTouchEnd = () => {
      mouse.isActive = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Animate loop
    const render = (time: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      const connectionDistance = 125;
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

        // Bounce gently off borders
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > height) {
          p.y = height;
          p.vy *= -1;
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

        // 2. Connective filaments between adjacent nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistanceSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connectionDistance) * 0.18;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    initDimensions();

    // Resize handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initDimensions();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // Track mouse and touch on hero parent container
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", onPointerMove);
      parent.addEventListener("mouseleave", onPointerLeave);
      parent.addEventListener("touchstart", onTouchMove, { passive: true });
      parent.addEventListener("touchmove", onTouchMove, { passive: true });
      parent.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    // IntersectionObserver to pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      if (parent) {
        parent.removeEventListener("mousemove", onPointerMove);
        parent.removeEventListener("mouseleave", onPointerLeave);
        parent.removeEventListener("touchstart", onTouchMove);
        parent.removeEventListener("touchmove", onTouchMove);
        parent.removeEventListener("touchend", onTouchEnd);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
