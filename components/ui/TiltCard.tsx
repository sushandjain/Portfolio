"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  glare?: boolean;
}

/**
 * 3D Interactive Tilt Card Component
 * Provides smooth micro-tilt, perspective depth, and an optional reflective glare sheen.
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
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("");
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      const rotateX = (-yPct * maxTilt).toFixed(2);
      const rotateY = (xPct * maxTilt).toFixed(2);

      setTransform(
        `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, 1)`
      );

      if (glare) {
        const glareX = (mouseX / width) * 100;
        const glareY = (mouseY / height) * 100;
        setGlareStyle({
          opacity: 0.25,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
        });
      }

      if (onMouseMove) onMouseMove(e);
    },
    [reducedMotion, maxTilt, scale, perspective, glare, onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
      if (glare) {
        setGlareStyle({ opacity: 0 });
      }
      if (onMouseLeave) onMouseLeave(e);
    },
    [perspective, glare, onMouseLeave]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {/* Glare Sheen Layer */}
      {glare && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20 mix-blend-overlay"
          style={glareStyle}
        />
      )}

      {/* Card Content */}
      <div className="w-full h-full relative z-10">{children}</div>
    </div>
  );
}
