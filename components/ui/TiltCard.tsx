"use client";

import React, { useRef, useCallback, useEffect } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;
}

/**
 * 60fps Zero-Rerender Spring-Interpolated 3D Tilt Card
 * Uses RequestAnimationFrame LERP physics for silky smooth damping without React re-renders.
 * Automatically respects prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.015,
  perspective = 1000,
  glare = true,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, gOp: 0 });
  const current = useRef({ rx: 0, ry: 0, s: 1, gx: 50, gy: 50, gOp: 0 });
  const isHovered = useRef(false);
  const rafId = useRef<number>(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion.current) return;

    const tick = () => {
      const ease = 0.12;
      current.current.rx += (target.current.rx - current.current.rx) * ease;
      current.current.ry += (target.current.ry - current.current.ry) * ease;
      current.current.s += (target.current.s - current.current.s) * ease;
      current.current.gOp += (target.current.gOp - current.current.gOp) * ease;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${current.current.rx.toFixed(2)}deg) rotateY(${current.current.ry.toFixed(2)}deg) scale3d(${current.current.s.toFixed(3)}, ${current.current.s.toFixed(3)}, 1)`;
      }

      if (glareRef.current && glare) {
        glareRef.current.style.opacity = current.current.gOp.toFixed(3);
        glareRef.current.style.background = `radial-gradient(circle at ${target.current.gx}% ${target.current.gy}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [perspective, glare]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion.current || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / rect.width - 0.5;
      const yPct = mouseY / rect.height - 0.5;

      target.current.rx = -yPct * maxTilt;
      target.current.ry = xPct * maxTilt;
      target.current.s = scale;
      target.current.gx = Math.round((mouseX / rect.width) * 100);
      target.current.gy = Math.round((mouseY / rect.height) * 100);
      target.current.gOp = 0.28;

      if (onMouseMove) onMouseMove(e);
    },
    [maxTilt, scale, onMouseMove]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isHovered.current = true;
      if (onMouseEnter) onMouseEnter(e);
    },
    [onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isHovered.current = false;
      target.current.rx = 0;
      target.current.ry = 0;
      target.current.s = 1;
      target.current.gOp = 0;

      if (onMouseLeave) onMouseLeave(e);
    },
    [onMouseLeave]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {/* Glare Sheen Layer */}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-3xl z-20 mix-blend-overlay transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
      )}

      {/* Card Content with 3D Depth Layer */}
      <div className="w-full h-full relative z-10" style={{ transform: "translateZ(0px)" }}>
        {children}
      </div>
    </div>
  );
}
