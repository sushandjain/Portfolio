"use client";

import { useEffect, useRef, useState } from "react";
import { playTick } from "@/lib/sound";

export default function CursorSound() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hasPointer, setHasPointer] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);

  useEffect(() => {
    // Only enable custom cursor on fine pointers (desktops/laptops)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setHasPointer(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(0.75)`;
      }
    };

    const onMouseUp = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${isHovered.current ? 1.8 : 1})`;
      }
    };

    // Smooth animation loop for trailing ring
    let rafId = 0;
    const tick = () => {
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        const scale = isHovered.current ? 1.8 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Detect interactive elements for cursor expansion
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, input, [role='button'], .stretch-char, .project-row, .cursor-interactive");
      if (interactive) {
        isHovered.current = true;
        if (ringRef.current) {
          ringRef.current.style.borderColor = "var(--accent-primary)";
          ringRef.current.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
        }
        if (target.classList.contains("stretch-char")) {
          playTick(600 + Math.random() * 400);
        }
      } else {
        isHovered.current = false;
        if (ringRef.current) {
          ringRef.current.style.borderColor = "var(--border-focus)";
          ringRef.current.style.backgroundColor = "transparent";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  if (!hasPointer) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          backgroundColor: "var(--accent-primary)",
          boxShadow: "0 0 10px var(--accent-primary)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-colors duration-200"
        style={{
          backdropFilter: "invert(10%)",
        }}
      />
    </>
  );
}
