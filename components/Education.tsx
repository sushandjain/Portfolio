"use client";

import { education } from "@/lib/data";
import { GraduationCap, Award, Calendar, MapPin, BookOpen } from "lucide-react";

export default function Education() {
  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>05 / ACADEMIC FOUNDATION</span>
            <span>✦</span>
            <span>COMPUTER SCIENCE & SPECIALIZATION</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            EDUCATION
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Award size={14} />
          <span>BCA CGPA: 8.92 / 10 (High Distinction)</span>
        </div>
      </div>

      {/* Education Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {education.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel p-6 sm:p-7 rounded-3xl border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Top meta */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  {item.grade}
                </span>
                <span className="text-xs font-mono text-[var(--text-faint)] flex items-center gap-1">
                  <Calendar size={12} />
                  {item.period}
                </span>
              </div>

              {/* Degree Title */}
              <h3 className="font-extrabold text-xl text-[var(--text-main)] group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                {item.degree}
              </h3>

              {/* Institution */}
              <p className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] mb-1">
                {item.institution}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)] mb-4">
                <MapPin size={12} className="text-indigo-400" />
                <span>{item.location}</span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-4">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-faint)]">
              <span>VERIFIED CREDENTIAL</span>
              <span className="text-emerald-400">AUTHENTIC</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
