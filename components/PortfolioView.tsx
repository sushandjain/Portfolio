"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";
import PageLoader from "@/components/ui/PageLoader";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileHomeHub from "@/components/mobile/MobileHomeHub";

// Dynamic imports for performance
const Projects = dynamic(() => import("@/components/Projects"), { ssr: true });
const Experience = dynamic(() => import("@/components/Experience"), { ssr: true });
const SkillsMatrix = dynamic(() => import("@/components/SkillsMatrix"), { ssr: true });
const Education = dynamic(() => import("@/components/Education"), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true });

export type PortfolioSection = "home" | "work" | "experience" | "credentials" | "arsenal" | "contact";

interface PortfolioViewProps {
  activeSection?: PortfolioSection;
  content: any;
}

export default function PortfolioView({ activeSection = "home", content }: PortfolioViewProps) {
  const visibility = content.settings?.sectionsVisibility || {
    hero: true,
    work: true,
    experience: true,
    credentials: true,
    arsenal: true,
    contact: true,
  };

  // On desktop / laptop, auto-scroll to the requested section if visiting a direct route
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (activeSection === "home") return;

    const sectionMap: Record<PortfolioSection, string> = {
      home: "home",
      work: "work",
      experience: "experience",
      credentials: "education",
      arsenal: "stack",
      contact: "contact",
    };

    const targetId = sectionMap[activeSection];
    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  return (
    <>
      {/* Editorial Cinematic Shutter Loader */}
      <PageLoader />

      {/* Global Interactive Constellation Mesh & Ambient Glowing Background */}
      <HeroCanvasMesh />

      {/* Top Reading Progress Bar */}
      <ProgressBar />

      {/* Interactive Velocity-Stretching Cursor & Sound FX */}
      <CursorSound />

      {/* Global Navigation Header */}
      <Header profile={content.profile} />

      {/* =========================================================================
          DESKTOP / LAPTOP LAYOUT (>= 768px):
          100% UNCHANGED FULL SINGLE-PAGE KINETIC PORTFOLIO WITH PINNED GALLERIES
          ========================================================================= */}
      <div className="hidden md:block">
        <main className="relative z-10 scroll-skew-layer">
          {visibility.hero !== false && <Hero profile={content.profile} />}
          <Ticker />
          {visibility.work !== false && <Projects projects={content.projects} />}
          {visibility.experience !== false && (
            <Experience
              experience={content.experience}
              achievements={content.achievements}
            />
          )}
          {visibility.arsenal !== false && <SkillsMatrix skills={content.skills} />}
          {visibility.credentials !== false && (
            <Education
              education={content.education}
              certificates={content.certificates}
            />
          )}
          {visibility.contact !== false && <Contact profile={content.profile} />}
        </main>
        <Footer settings={content.settings} profile={content.profile} />
      </div>

      {/* =========================================================================
          MOBILE LAYOUT (< 768px):
          MODULAR MULTI-PAGE ROUTING WITH NATIVE DOCKED BOTTOM TAB BAR
          Eliminates endless scrolling by rendering ONLY the active route section
          ========================================================================= */}
      <div className="block md:hidden pb-24">
        <main className="relative z-10">
          {activeSection === "home" && (
            <MobileHomeHub
              profile={content.profile}
              projects={content.projects}
              experience={content.experience}
            />
          )}

          {activeSection === "work" && (
            <div className="pt-16">
              <Projects projects={content.projects} />
            </div>
          )}

          {activeSection === "experience" && (
            <div className="pt-16">
              <Experience
                experience={content.experience}
                achievements={content.achievements}
              />
            </div>
          )}

          {activeSection === "credentials" && (
            <div className="pt-16">
              <Education
                education={content.education}
                certificates={content.certificates}
              />
            </div>
          )}

          {activeSection === "arsenal" && (
            <div className="pt-16">
              <SkillsMatrix skills={content.skills} />
            </div>
          )}

          {activeSection === "contact" && (
            <div className="pt-16">
              <Contact profile={content.profile} />
            </div>
          )}
        </main>

        <Footer settings={content.settings} profile={content.profile} />

        {/* Native Mobile Floating Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>
    </>
  );
}
