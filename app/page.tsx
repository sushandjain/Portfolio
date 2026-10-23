import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroCanvasMesh from "@/components/HeroCanvasMesh";
import PageLoader from "@/components/ui/PageLoader";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

// Code-split below-the-fold heavy sections for ultra-fast initial bundle hydration
const Projects = dynamic(() => import("@/components/Projects"));
const Experience = dynamic(() => import("@/components/Experience"));
const SkillsMatrix = dynamic(() => import("@/components/SkillsMatrix"));
const Education = dynamic(() => import("@/components/Education"));
const Contact = dynamic(() => import("@/components/Contact"));

export default function Home() {
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
      <Header />

      {/* Main Content Sections with Fluid Scroll Skew */}
      <main className="relative z-10 scroll-skew-layer">
        {/* Konrad Makowski Stretch Folio Hero */}
        <Hero />

        {/* Kinetic Tech Marquee Ticker */}
        <Ticker />

        {/* Selected Works - Stretch Folio Showcase */}
        <Projects />

        {/* Enterprise Experience & Hackathon Honors */}
        <Experience />

        {/* Technical Arsenal & Skills Matrix */}
        <SkillsMatrix />

        {/* Academic Foundation & Specialization */}
        <Education />

        {/* Kinetic Stretch Contact & Dispatch */}
        <Contact />
      </main>

      {/* Polished Footer */}
      <Footer />
    </>
  );
}
