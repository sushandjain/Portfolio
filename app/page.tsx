import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";
import PageLoader from "@/components/ui/PageLoader";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

import { getContent, getDefaultContent } from "@/lib/server/db";

// Code-split below-the-fold heavy sections for ultra-fast initial bundle hydration
const Projects = dynamic(() => import("@/components/Projects"));
const Experience = dynamic(() => import("@/components/Experience"));
const SkillsMatrix = dynamic(() => import("@/components/SkillsMatrix"));
const Education = dynamic(() => import("@/components/Education"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
  const content = getContent() || getDefaultContent();
  const visibility = content.settings?.sectionsVisibility || {
    hero: true,
    work: true,
    experience: true,
    credentials: true,
    arsenal: true,
    contact: true,
  };

  return (
    <>
      {/* Studio Olimpo-Inspired Editorial Cinematic Shutter Loader */}
      <PageLoader />

      {/* Global Interactive Constellation Mesh & Ambient Glowing Background */}
      <HeroCanvasMesh />

      {/* Top Reading Progress Bar */}
      <ProgressBar />

      {/* Interactive Velocity-Stretching Cursor & Sound FX */}
      <CursorSound />

      {/* Global Navigation Header */}
      <Header profile={content.profile} />

      {/* Main Content Sections with Fluid Scroll Skew */}
      <main className="relative z-10 scroll-skew-layer">
        {/* Konrad Makowski Stretch Folio Hero */}
        {visibility.hero !== false && <Hero profile={content.profile} />}

        {/* Kinetic Tech Marquee Ticker */}
        <Ticker />

        {/* Selected Works - Stretch Folio Showcase */}
        {visibility.work !== false && <Projects projects={content.projects} />}

        {/* Enterprise Experience & Hackathon Honors */}
        {visibility.experience !== false && (
          <Experience
            experience={content.experience}
            achievements={content.achievements}
          />
        )}

        {/* Technical Arsenal & Skills Matrix */}
        {visibility.arsenal !== false && <SkillsMatrix skills={content.skills} />}

        {/* Academic Foundation & Specialization */}
        {visibility.credentials !== false && (
          <Education
            education={content.education}
            certificates={content.certificates}
          />
        )}

        {/* Kinetic Stretch Contact & Dispatch */}
        {visibility.contact !== false && <Contact profile={content.profile} />}
      </main>

      {/* Polished Footer */}
      <Footer settings={content.settings} profile={content.profile} />
    </>
  );
}
