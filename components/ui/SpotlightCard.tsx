"use client";

import React, { useRef, useState, useCallback } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

/**
 * High-performance Spotlight Card Component
 * Uses CSS variables (--mouse-x, --mouse-y) for 60fps GPU-accelerated cursor illumination
 * without causing React re-renders.
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.15)",
  borderColor = "rgba(129, 140, 248, 0.45)",
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cardRef.current.style.setProperty("--mouse-x", `${x}px`);
      cardRef.current.style.setProperty("--mouse-y", `${y}px`);

      if (onMouseMove) onMouseMove(e);
    },
    [onMouseMove]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      if (onMouseEnter) onMouseEnter(e);
    },
    [onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
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
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${className}`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          "--spotlight-color": spotlightColor,
          "--border-color": borderColor,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 60%)`,
        }}
      />

      {/* Reactive Glowing Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), var(--border-color), transparent 70%)`,
          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* Card Content */}
      <div className="relative z-30 w-full h-full">{children}</div>
    </div>
  );
}
