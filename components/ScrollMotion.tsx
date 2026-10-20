"use client";

import { useEffect, useRef } from "react";

export default function ScrollMotion() {
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const velocity = useRef(0);
  const currentSkew = useRef(0);

  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      lastTime.current = now;

      const deltaY = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;

      // Calculate scroll velocity (pixels per ms)
      const rawVelocity = deltaY / dt * 16;
      velocity.current = Math.max(-40, Math.min(40, rawVelocity));
    };

    const updateLoop = () => {
      // Decay velocity back to 0
      velocity.current *= 0.88;

      // Map velocity to a subtle, premium skew angle (-2deg to +2deg)
      const targetSkew = Math.max(-2.2, Math.min(2.2, velocity.current * 0.07));
      currentSkew.current += (targetSkew - currentSkew.current) * 0.14;

      // Update root CSS variable
      document.documentElement.style.setProperty("--scroll-skew", `${currentSkew.current.toFixed(2)}deg`);
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        Math.abs(velocity.current).toFixed(1)
      );

      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
