import ProgressBar from "@/components/ProgressBar";
import CursorSound from "@/components/CursorSound";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Projects from "@/components/Projects";
import ApiConsole from "@/components/ApiConsole";
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

      {/* Interactive Cursor & Sound FX Synthesizer */}
      <CursorSound />

      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Konrad Makowski Stretch Folio Hero */}
        <Hero />

        {/* Kinetic Tech Marquee Ticker */}
        <Ticker />

        {/* Selected Works - Stretch Folio Showcase */}
        <Projects />

        {/* Interactive REST API & Systems Playground */}
        <ApiConsole />

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
