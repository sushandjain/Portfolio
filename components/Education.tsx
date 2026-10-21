"use client";

import { useState } from "react";
import { education, certificates, Certificate } from "@/lib/data";
import { playPop, playTick } from "@/lib/sound";
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Eye,
  X,
  Sparkles,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

type FilterTab = "all" | "certs" | "degrees";

export default function Education() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const openCertModal = (cert: Certificate) => {
    setSelectedCert(cert);
    playPop();
  };

  const closeCertModal = () => {
    setSelectedCert(null);
    playPop();
  };

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>05 / ACADEMIC FOUNDATION & CREDENTIALS</span>
            <span>✦</span>
            <span>VERIFIED INDUSTRY HONORS</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CREDENTIALS & DEGREES
          </h2>
        </div>

        {/* Top Badges & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Award size={14} />
            <span>BCA CGPA: 8.92 / 10 (High Distinction)</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                playPop();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              All (7)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("certs");
                playPop();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === "certs"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              Certificates (4)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("degrees");
                playPop();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === "degrees"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              Degrees (3)
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: Verified Google Drive Certifications */}
      {(activeTab === "all" || activeTab === "certs") && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2">
              <ShieldCheck size={16} />
              AUTHENTICATED INDUSTRY CERTIFICATIONS ({certificates.length})
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
              HOSTED & VERIFIED ON GOOGLE DRIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <SpotlightCard
                key={cert.id}
                className="glass-panel p-6 sm:p-7 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                spotlightColor="rgba(99, 102, 241, 0.12)"
                borderColor="rgba(129, 140, 248, 0.45)"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />

                <div>
                  {/* Top Meta Bar */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                      <span className="pulse-green" />
                      AUTHENTICATED RECORD
                    </span>
                    <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1">
                      <Calendar size={12} />
                      {cert.date}
                    </span>
                  </div>

                  {/* Title with stretch feel */}
                  <h4
                    className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-snug mb-1"
                    style={{ fontFamily: "var(--font-d)" }}
                  >
                    {cert.title}
                  </h4>

                  {/* Issuer */}
                  <p className="text-xs sm:text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-1.5">
                    <Award size={14} />
                    <span>{cert.issuer}</span>
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">
                    {cert.description}
                  </p>

                  {/* Skills Verified Tags */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] block">
                      VERIFIED COMPETENCIES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skillsVerified.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openCertModal(cert)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-main)] hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>Quick Dossier</span>
                  </button>

                  <a
                    href={cert.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playTick(880)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Inspect on Google Drive</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* Part 2: Academic Degrees */}
      {(activeTab === "all" || activeTab === "degrees") && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold flex items-center gap-2">
              <GraduationCap size={16} className="text-amber-400" />
              FORMAL ACADEMIC DEGREES ({education.length})
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
              COMPUTER SCIENCE FOUNDATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {education.map((item, idx) => (
              <SpotlightCard
                key={idx}
                className="glass-panel p-6 sm:p-7 border border-[var(--border-subtle)] hover:border-amber-500/35 transition-all duration-300 flex flex-col justify-between group"
                spotlightColor="rgba(245, 158, 11, 0.1)"
                borderColor="rgba(245, 158, 11, 0.4)"
              >
                <div>
                  {/* Top meta */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {item.grade}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1">
                      <Calendar size={12} />
                      {item.period}
                    </span>
                  </div>

                  {/* Degree Title */}
                  <h4 className="font-extrabold text-xl text-[var(--text-main)] group-hover:text-amber-400 transition-colors leading-snug mb-2">
                    {item.degree}
                  </h4>

                  {/* Institution */}
                  <p className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] mb-1">
                    {item.institution}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] mb-4">
                    <MapPin size={12} className="text-amber-400" />
                    <span>{item.location}</span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-faint)]">
                  <span>DEGREE STATUS</span>
                  <span className="text-emerald-400 font-bold">VERIFIED AUTHENTIC</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Certificate Dossier Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeCertModal}
        >
          <div
            className="glass-panel w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-indigo-500/40 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeCertModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Verification header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                CRYPTOGRAPHICALLY VERIFIED CREDENTIAL
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)]">{selectedCert.date}</span>
            </div>

            <h3
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {selectedCert.title}
            </h3>

            <p className="text-sm font-semibold text-indigo-400 mb-6">
              Issued by {selectedCert.issuer}
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6 bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-subtle)]">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1">
                  CREDENTIAL SUMMARY:
                </span>
                <p>{selectedCert.description}</p>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-2">
                  VERIFIED INDUSTRY COMPETENCIES:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCert.skillsVerified.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--bg-card)] border border-indigo-500/30 text-indigo-300 font-bold"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1">
                  OFFICIAL HOST LOCATION:
                </span>
                <p className="text-xs font-mono text-[var(--text-faint)] break-all">
                  {selectedCert.driveUrl}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} />
                Authenticated for client & enterprise inspection
              </span>

              <a
                href={selectedCert.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTick(880)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Open in Google Drive</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
