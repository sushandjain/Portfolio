"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "./AdminContext";
import {
  FolderGit2,
  Cpu,
  Award,
  Mail,
  Clock,
  Sparkles,
  ArrowUpRight,
  Plus,
  FileText,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { showToast } = useAdmin();
  const [content, setContent] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [contentRes, messagesRes] = await Promise.all([
        fetch("/api/admin/content"),
        fetch("/api/admin/messages"),
      ]);

      if (contentRes.ok) {
        const cData = await contentRes.json();
        if (cData.success) setContent(cData.content);
      }

      if (messagesRes.ok) {
        const mData = await messagesRes.json();
        if (mData.success && Array.isArray(mData.messages)) {
          setMessages(mData.messages);
        }
      }
    } catch {
      showToast("Failed to fetch dashboard data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleOpenToWork = async () => {
    if (!content?.profile) return;
    setIsUpdatingStatus(true);
    const nextStatus = !content.profile.isOpenToWork;

    try {
      const updatedProfile = {
        ...content.profile,
        isOpenToWork: nextStatus,
        status: nextStatus ? "Available for high-impact opportunities" : "Currently engaged in core initiatives",
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "profile", data: updatedProfile }),
      });

      if (res.ok) {
        setContent((prev: any) => ({ ...prev, profile: updatedProfile }));
        showToast(
          nextStatus ? "Status updated: Open to Work (Active)" : "Status updated: Focused on Existing Roles",
          "success"
        );
      } else {
        showToast("Failed to update status.", "error");
      }
    } catch {
      showToast("Network error updating status.", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Portfolio Control Deck...</span>
      </div>
    );
  }

  const projectCount = content?.projects?.length || 0;
  const skillCount = content?.skills?.reduce((acc: number, g: any) => acc + (g.items?.length || 0), 0) || 0;
  const certificateCount = content?.certificates?.length || 0;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const lastUpdated = content?.lastUpdatedAt
    ? new Date(content.lastUpdatedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Just now";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider mb-1">
            <span>COMMAND CENTER</span>
            <span>✦</span>
            <span>SUSHAN JAIN PORTFOLIO</span>
          </div>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SYSTEM DASHBOARD
          </h1>
        </div>

        {/* Live Availability Switch Pill */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
          <div className="flex items-center gap-2 pl-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                content?.profile?.isOpenToWork ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-mono font-bold text-white">
              {content?.profile?.isOpenToWork ? "OPEN TO WORK" : "BUSY / ENGAGED"}
            </span>
          </div>
          <button
            type="button"
            disabled={isUpdatingStatus}
            onClick={handleToggleOpenToWork}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              content?.profile?.isOpenToWork
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {isUpdatingStatus ? "Updating..." : "Toggle"}
          </button>
        </div>
      </div>

      {/* =========================================================================
          KEY STATS METRICS GRID
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Projects Card */}
        <Link
          href="/admin/projects"
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-indigo-400">
            <FolderGit2 size={20} />
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
            {projectCount}
          </span>
          <span className="text-xs font-mono text-slate-400 block mt-1">Flagship Projects</span>
        </Link>

        {/* Skills Arsenal Card */}
        <Link
          href="/admin/skills"
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-cyan-400">
            <Cpu size={20} />
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
            {skillCount}
          </span>
          <span className="text-xs font-mono text-slate-400 block mt-1">Technical Skills</span>
        </Link>

        {/* Credentials Card */}
        <Link
          href="/admin/certificates"
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-amber-400">
            <Award size={20} />
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
            {certificateCount}
          </span>
          <span className="text-xs font-mono text-slate-400 block mt-1">Certifications &amp; Honors</span>
        </Link>

        {/* Contact Messages Card */}
        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all group"
        >
          <div className="flex items-center justify-between mb-3 text-emerald-400">
            <Mail size={20} />
            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
              {unreadMessages}
            </span>
            <span className="text-xs font-mono text-slate-500">/ {messages.length} total</span>
          </div>
          <span className="text-xs font-mono text-slate-400 block mt-1">Unread Inquiries</span>
        </Link>
      </div>

      {/* =========================================================================
          QUICK ACTIONS DOCK
          ========================================================================= */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-3">
          QUICK OPERATIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/resume"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Upload Resume</span>
              <span className="text-[10px] font-mono text-slate-400">Replace public PDF</span>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Plus size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Add / Edit Projects</span>
              <span className="text-[10px] font-mono text-slate-400">Reorder &amp; showcase</span>
            </div>
          </Link>

          <Link
            href="/admin/profile"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <UserCheck size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Hero &amp; Profile</span>
              <span className="text-[10px] font-mono text-slate-400">Taglines &amp; social links</span>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Backup JSON</span>
              <span className="text-[10px] font-mono text-slate-400">Export &amp; import store</span>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RECENT INBOX MESSAGES & SYSTEM STATUS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Preview (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All ({messages.length}) →
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No contact submissions yet. Incoming messages will appear here in real time.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    !msg.read
                      ? "bg-indigo-950/20 border-indigo-500/30"
                      : "bg-white/[0.02] border-white/5 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{msg.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-indigo-300 mb-1">{msg.email}</div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Health Information (1 col) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Clock size={16} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Engine Telemetry</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Atomic JSON / Local Store
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Authentication:</span>
              <span className="text-white font-bold">HS256 JWT + Bcrypt</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Image Pipeline:</span>
              <span className="text-white font-bold">Sharp WebP 82%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Content Update:</span>
              <span className="text-indigo-300 truncate max-w-[130px]" title={lastUpdated}>
                {lastUpdated}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Public ISR Cache:</span>
              <span className="text-emerald-400 font-bold">Enabled (Auto-Sync)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Test Public Portfolio</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
