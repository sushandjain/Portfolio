"use client";

import { useState } from "react";
import Image from "next/image";
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
  Trophy,
  Code2,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CredlyBadgeEmbed from "@/components/ui/CredlyBadgeEmbed";

type FilterTab = "all" | "certs" | "degrees";

const getCertTheme = (cert: Certificate) => {
  if (cert.id === "claude-certified-associate") {
    return {
      border: "border-orange-500/35 hover:border-orange-500/65 shadow-lg shadow-orange-500/5",
      spotlight: "rgba(204, 85, 0, 0.16)",
      borderColor: "rgba(204, 85, 0, 0.55)",
      glow: "bg-orange-500/10 group-hover:bg-orange-500/20",
      tag: "bg-orange-500/15 border-orange-500/30 text-orange-400",
      ping: "bg-orange-400",
      tagLabel: "OFFICIAL CREDLY ACCREDITATION",
      titleHover: "group-hover:text-orange-400",
      issuerColor: "text-orange-400 font-bold",
      badgeTag: "border-orange-500/25 text-orange-300",
      actionBg: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/30",
      actionText: "Verify on Credly",
      iconType: "badge",
    };
  }
  if (cert.id === "tcs-ai-friday") {
    return {
      border: "border-amber-500/35 hover:border-amber-500/65 shadow-lg shadow-amber-500/5",
      spotlight: "rgba(245, 158, 11, 0.16)",
      borderColor: "rgba(245, 158, 11, 0.55)",
      glow: "bg-amber-500/10 group-hover:bg-amber-500/20",
      tag: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      ping: "bg-amber-400",
      tagLabel: "TCS ENTERPRISE 2ND PLACE HONORS",
      titleHover: "group-hover:text-amber-400",
      issuerColor: "text-amber-400 font-bold",
      badgeTag: "border-amber-500/25 text-amber-300",
      actionBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30",
      actionText: "Inspect on Google Drive",
      iconType: "trophy",
    };
  }
  if (cert.id === "jspiders-mern") {
    return {
      border: "border-emerald-500/35 hover:border-emerald-500/65 shadow-lg shadow-emerald-500/5",
      spotlight: "rgba(16, 185, 129, 0.16)",
      borderColor: "rgba(16, 185, 129, 0.55)",
      glow: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
      tag: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      ping: "bg-emerald-400",
      tagLabel: "FULL-STACK MERN ARCHITECTURE",
      titleHover: "group-hover:text-emerald-400",
      issuerColor: "text-emerald-400 font-bold",
      badgeTag: "border-emerald-500/25 text-emerald-300",
      actionBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30",
      actionText: "Inspect on Google Drive",
      iconType: "code",
    };
  }
  return {
    border: "border-indigo-500/20 hover:border-indigo-500/50",
    spotlight: "rgba(99, 102, 241, 0.12)",
    borderColor: "rgba(129, 140, 248, 0.45)",
    glow: "bg-indigo-500/5 group-hover:bg-indigo-500/10",
    tag: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    ping: "",
    tagLabel: "AUTHENTICATED RECORD",
    titleHover: "group-hover:text-indigo-400",
    issuerColor: "text-indigo-400",
    badgeTag: "border-[var(--border-subtle)] text-[var(--text-muted)]",
    actionBg: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30",
    actionText: "Inspect on Google Drive",
    iconType: "award",
  };
};

export default function Education({
  education: initialEdu,
  certificates: initialCerts,
}: {
  education?: any[];
  certificates?: Certificate[];
} = {}) {
  const certsList = (initialCerts && initialCerts.length > 0 ? initialCerts : certificates).filter(
    (c: any) => c.published !== false
  );
  const eduList = (initialEdu && initialEdu.length > 0 ? initialEdu : education).filter(
    (e: any) => e.published !== false
  );
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

  if (certsList.length === 0 && eduList.length === 0) return null;

  return (
    <section id="education" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                playPop();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              All ({certsList.length + eduList.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("certs");
                playPop();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "certs"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              Certificates ({certsList.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("degrees");
                playPop();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "degrees"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              Degrees ({eduList.length})
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: Verified Certifications */}
      {(activeTab === "all" || activeTab === "certs") && certsList.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2">
              <ShieldCheck size={16} />
              AUTHENTICATED INDUSTRY CERTIFICATIONS ({certsList.length})
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
              VERIFIED VIA CREDLY &amp; GOOGLE DRIVE
            </span>
          </div>

          {/* Highlight Featured Credly Badge Banner */}
          <div className="mb-6">
            <CredlyBadgeEmbed />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certsList.map((cert) => {
              const theme = getCertTheme(cert);
              return (
                <SpotlightCard
                  key={cert.id}
                  className={`glass-panel p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${theme.border}`}
                  spotlightColor={theme.spotlight}
                  borderColor={theme.borderColor}
                >
                  {/* Subtle background glow */}
                  <div
                    className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all ${theme.glow}`}
                  />

                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${theme.tag}`}
                      >
                        {theme.ping ? (
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.ping} animate-ping`} />
                        ) : (
                          <span className="pulse-green" />
                        )}
                        {theme.tagLabel}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1">
                        <Calendar size={12} />
                        {cert.date}
                      </span>
                    </div>

                    {/* Title and Badge Icon */}
                    <div className="flex items-start gap-3.5 mb-2">
                      {cert.badgeImage ? (
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-md shadow-orange-500/15">
                          <Image
                            src={cert.badgeImage}
                            alt={cert.title}
                            width={44}
                            height={44}
                            loading="lazy"
                            decoding="async"
                            className="object-contain"
                          />
                        </div>
                      ) : theme.iconType === "trophy" ? (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-md shadow-amber-500/15">
                          <Trophy size={24} />
                        </div>
                      ) : theme.iconType === "code" ? (
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-md shadow-emerald-500/15">
                          <Code2 size={24} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 p-2 flex items-center justify-center shrink-0 text-indigo-400 group-hover:scale-105 transition-all">
                          <Award size={24} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-xl sm:text-2xl font-extrabold transition-colors uppercase tracking-tight leading-snug mb-1 text-[var(--text-main)] ${theme.titleHover}`}
                          style={{ fontFamily: "var(--font-d)" }}
                        >
                          {cert.title}
                        </h4>
                        <p
                          className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${theme.issuerColor}`}
                        >
                          <Award size={14} />
                          <span>{cert.issuer}</span>
                        </p>
                      </div>
                    </div>

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
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[var(--bg-secondary)] border ${theme.badgeTag}`}
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
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-main)] hover:text-indigo-400 transition-colors cursor-pointer min-h-[44px]"
                    >
                      <Eye size={13} />
                      <span>Quick Dossier</span>
                    </button>

                    <a
                      href={cert.credlyUrl || cert.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playTick(880)}
                      className={`inline-flex items-center gap-1 px-3.5 py-2.5 min-h-[44px] rounded-xl text-white text-xs font-mono font-bold shadow-sm transition-all cursor-pointer ${theme.actionBg}`}
                    >
                      <span>{theme.actionText}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Part 2: Academic Degrees */}
      {(activeTab === "all" || activeTab === "degrees") && eduList.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--text-faint)] font-bold flex items-center gap-2">
              <GraduationCap size={16} className="text-amber-400" />
              FORMAL ACADEMIC DEGREES ({eduList.length})
            </h3>
            <span className="text-[11px] font-mono text-[var(--text-faint)] hidden sm:inline">
              COMPUTER SCIENCE FOUNDATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eduList.map((item, idx) => (
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={closeCertModal}
        >
          <div
            className="glass-panel w-full max-w-2xl p-5 sm:p-7 md:p-8 rounded-3xl border border-indigo-500/40 relative max-h-[88vh] overflow-y-auto overscroll-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with comfortable mobile touch target */}
            <button
              type="button"
              onClick={closeCertModal}
              aria-label="Close dossier"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-90 z-20"
            >
              <X size={18} />
            </button>

            {/* Verification header */}
            <div className="flex flex-wrap items-center gap-2 mb-4 pr-10">
              <span
                className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold border flex items-center gap-1.5 ${
                  selectedCert.credlyUrl
                    ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                }`}
              >
                <CheckCircle2 size={13} />
                {selectedCert.credlyUrl ? "OFFICIAL CREDLY ACCREDITATION" : "CRYPTOGRAPHICALLY VERIFIED CREDENTIAL"}
              </span>
              <span className="text-xs font-mono text-[var(--text-faint)]">{selectedCert.date}</span>
            </div>

            {/* Highlight Showcase Banner in Modal */}
            {selectedCert.badgeImage ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30">
                <div className="w-14 h-14 sm:w-16 sm:h-16 relative shrink-0">
                  <Image
                    src={selectedCert.badgeImage}
                    alt={selectedCert.title}
                    width={64}
                    height={64}
                    className="object-contain drop-shadow-[0_4px_12px_rgba(204,85,0,0.5)]"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 font-bold block">
                    PEARSON CREDLY ACCREDITATION
                  </span>
                  <p className="text-xs font-mono text-white font-bold truncate">
                    Badge ID: {selectedCert.credlyBadgeId || "Official Verified"}
                  </p>
                  <p className="text-[11px] font-mono text-[var(--text-faint)]">
                    Earned by Sushan Jain &bull; Issued by Anthropic
                  </p>
                </div>
              </div>
            ) : selectedCert.id === "tcs-ai-friday" ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-lg shadow-amber-500/20">
                  <Trophy size={26} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    TATA CONSULTANCY SERVICES HACKATHON WINNER
                  </span>
                  <p className="text-xs font-mono text-white font-bold">
                    2nd Place — Pan-TCS AI-Friday Innovation Track
                  </p>
                  <p className="text-[11px] font-mono text-[var(--text-faint)]">
                    Recognized for AI automated requirement decomposition
                  </p>
                </div>
              </div>
            ) : selectedCert.id === "jspiders-mern" ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border border-emerald-500/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <Code2 size={26} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    JSPIDERS HEBBAL FULL STACK DIPLOMA
                  </span>
                  <p className="text-xs font-mono text-white font-bold">
                    MERN Full-Stack Professional Development Immersion
                  </p>
                  <p className="text-[11px] font-mono text-[var(--text-faint)]">
                    React.js, Node.js, Express, MongoDB &amp; AWS Deployment
                  </p>
                </div>
              </div>
            ) : null}

            <h3
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2"
              style={{ fontFamily: "var(--font-d)" }}
            >
              {selectedCert.title}
            </h3>

            <p
              className={`text-sm font-semibold mb-6 ${
                selectedCert.credlyUrl
                  ? "text-orange-400 font-bold"
                  : selectedCert.id === "tcs-ai-friday"
                  ? "text-amber-400 font-bold"
                  : selectedCert.id === "jspiders-mern"
                  ? "text-emerald-400 font-bold"
                  : "text-indigo-400"
              }`}
            >
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
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                        selectedCert.credlyUrl
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-300"
                          : selectedCert.id === "tcs-ai-friday"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : selectedCert.id === "jspiders-mern"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-[var(--bg-card)] border-indigo-500/30 text-indigo-300"
                      }`}
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-faint)] block mb-1">
                  OFFICIAL VERIFICATION LOCATION:
                </span>
                <p className="text-xs font-mono text-[var(--text-faint)] break-all">
                  {selectedCert.credlyUrl || selectedCert.driveUrl}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} />
                Authenticated for client & enterprise inspection
              </span>

              {selectedCert.credlyUrl ? (
                <a
                  href={selectedCert.credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTick(880)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  <span>Verify Credential on Credly</span>
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <a
                  href={selectedCert.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTick(880)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                    selectedCert.id === "tcs-ai-friday"
                      ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                      : selectedCert.id === "jspiders-mern"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                  }`}
                >
                  <span>Open in Google Drive</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
