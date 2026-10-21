import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import ScrollMotion from "@/components/ScrollMotion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import SkillsMatrix from "@/components/SkillsMatrix";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Top Reading Progress Bar */}
      <ProgressBar />

      {/* Kinetic Inertia Scroll Skew & Velocity Engine */}
      <ScrollMotion />

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
