"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminContext";
import {
  Settings,
  Save,
  Download,
  Upload,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Sliders,
  FileJson,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useAdmin();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setContent(data.content);
        }
      })
      .catch(() => showToast("Failed to fetch settings.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content?.settings) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "settings", data: content.settings }),
      });

      if (res.ok) {
        showToast("Site settings & SEO updated successfully!", "success");
      } else {
        showToast("Failed to save settings.", "error");
      }
    } catch {
      showToast("Network error saving settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDirectChange: true,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Admin password updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.error || "Failed to update password.", "error");
      }
    } catch {
      showToast("Network error changing password.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportJson = () => {
    window.location.href = "/api/admin/backup";
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setContent(data.content);
        showToast("Portfolio content successfully restored from backup!", "success");
      } else {
        showToast(data.error || "Invalid backup file format.", "error");
      }
    } catch {
      showToast("Failed to parse JSON file.", "error");
    }
  };

  if (isLoading || !content) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Settings Console...</span>
      </div>
    );
  }

  const settings = content.settings || {};
  const visibility = settings.sectionsVisibility || {
    hero: true,
    work: true,
    experience: true,
    credentials: true,
    arsenal: true,
    contact: true,
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            SITE CONFIGURATION &amp; SECURITY
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SETTINGS &amp; BACKUP
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          <span>{isSaving ? "Saving Settings..." : "Save Settings"}</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION VISIBILITY TOGGLES
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10 flex items-center gap-2">
          <Sliders size={14} className="text-indigo-400" />
          <span>PUBLIC SECTIONS VISIBILITY</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Toggle sections to show or hide them from the public website in real time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {[
            { id: "hero", label: "Hero & Canvas Mesh" },
            { id: "work", label: "Works & Showcase" },
            { id: "experience", label: "Career Experience" },
            { id: "credentials", label: "Education & Credentials" },
            { id: "arsenal", label: "Skills Arsenal" },
            { id: "contact", label: "Contact & Direct Channels" },
          ].map((sec) => {
            const isVisible = visibility[sec.id] !== false;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  const updatedVis = { ...visibility, [sec.id]: !isVisible };
                  setContent({
                    ...content,
                    settings: { ...settings, sectionsVisibility: updatedVis },
                  });
                }}
                className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                  isVisible
                    ? "bg-indigo-600/15 border-indigo-500/40 text-white font-bold"
                    : "bg-white/[0.02] border-white/5 text-slate-500"
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isVisible ? "bg-emerald-400" : "bg-slate-600"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SEO & METADATA
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-5">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10">
          SEO &amp; SEARCH ENGINE METADATA
        </h3>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Page Title Tag</label>
          <input
            type="text"
            value={settings.pageTitle || ""}
            onChange={(e) =>
              setContent({
                ...content,
                settings: { ...settings, pageTitle: e.target.value },
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={settings.metaDescription || ""}
            onChange={(e) =>
              setContent({
                ...content,
                settings: { ...settings, metaDescription: e.target.value },
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Open Graph Image URL</label>
            <input
              type="text"
              value={settings.ogImageUrl || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  settings: { ...settings, ogImageUrl: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Footer Copyright Line</label>
            <input
              type="text"
              value={settings.footerText || ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  settings: { ...settings, footerText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHANGE ADMIN PASSWORD
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-5">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10 flex items-center gap-2">
          <Lock size={14} className="text-indigo-400" />
          <span>CHANGE ADMIN PASSWORD</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">New Password (min 8 chars)</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
            </button>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          DATA BACKUP & RESTORE
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10 flex items-center gap-2">
          <FileJson size={14} className="text-indigo-400" />
          <span>DATA BACKUP &amp; DISASTER RECOVERY</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Download a complete, offline JSON snapshot of your entire portfolio (profile, flagships, career experience, education, skills, certificates, settings). You can restore from this file anytime.
        </p>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Export All Content as JSON</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
            <Upload size={15} className="text-indigo-400" />
            <span>Import / Restore from JSON</span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
