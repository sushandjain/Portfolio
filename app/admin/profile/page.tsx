"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdmin } from "../AdminContext";
import { Save, Upload, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const { showToast } = useAdmin();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newRotatingTitle, setNewRotatingTitle] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content.profile) {
          setProfile(data.content.profile);
        }
      })
      .catch(() => showToast("Failed to load profile data.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "profile", data: profile }),
      });

      if (res.ok) {
        showToast("Profile information saved successfully!", "success");
      } else {
        showToast("Failed to save profile changes.", "error");
      }
    } catch {
      showToast("Network error while saving profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "image");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProfile((prev: any) => ({ ...prev, avatarUrl: data.url }));
        showToast("Profile avatar uploaded and compressed to WebP!", "success");
      } else {
        showToast(data.error || "Failed to upload avatar.", "error");
      }
    } catch {
      showToast("Network error uploading avatar.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddRotatingTitle = () => {
    if (!newRotatingTitle.trim()) return;
    const current = profile.rotatingTitles || [];
    setProfile({
      ...profile,
      rotatingTitles: [...current, newRotatingTitle.trim()],
    });
    setNewRotatingTitle("");
  };

  const handleRemoveRotatingTitle = (index: number) => {
    const current = [...(profile.rotatingTitles || [])];
    current.splice(index, 1);
    setProfile({ ...profile, rotatingTitles: current });
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Profile Data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            IDENTITY &amp; HERO CONTROLLER
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            PROFILE &amp; HERO
          </h1>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
        >
          {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          <span>{isSaving ? "Saving Changes..." : "Save Profile"}</span>
        </button>
      </div>

      {/* Profile Photo & Availability Card */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 shadow-xl shrink-0 bg-slate-900">
          <Image
            src={profile.avatarUrl || "/sushan.jpg"}
            alt="Profile Avatar"
            fill
            className="object-cover object-top"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-indigo-400" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">Profile Photo</h3>
          <p className="text-xs text-slate-400 font-mono">
            JPG, PNG, or WebP. Automatically converted and compressed to WebP for top performance.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer active:scale-95">
            <Upload size={14} className="text-indigo-400" />
            <span>Upload New Photo</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Availability Toggle */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center sm:items-end gap-2 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Availability Banner
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-mono font-bold ${
                profile.isOpenToWork ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {profile.isOpenToWork ? "Open to Work" : "Engaged"}
            </span>
            <button
              type="button"
              onClick={() =>
                setProfile({ ...profile, isOpenToWork: !profile.isOpenToWork })
              }
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.isOpenToWork ? "bg-emerald-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.isOpenToWork ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Identity Information */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10">
          CORE IDENTITY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Short Name (Navbar)</label>
            <input
              type="text"
              value={profile.shortName || ""}
              onChange={(e) => setProfile({ ...profile, shortName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Initials (Logo)</label>
            <input
              type="text"
              value={profile.initials || ""}
              onChange={(e) => setProfile({ ...profile, initials: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Primary Professional Title</label>
          <input
            type="text"
            value={profile.title || ""}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white font-medium"
          />
        </div>

        {/* Rotating Taglines */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">
            Rotating Titles / Hero Subtitles
          </label>
          <div className="space-y-2 mb-3">
            {(profile.rotatingTitles || []).map((t: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={t}
                  onChange={(e) => {
                    const current = [...profile.rotatingTitles];
                    current[idx] = e.target.value;
                    setProfile({ ...profile, rotatingTitles: current });
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRotatingTitle(idx)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRotatingTitle}
              onChange={(e) => setNewRotatingTitle(e.target.value)}
              placeholder="e.g. Distributed Systems & High-Throughput APIs"
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={handleAddRotatingTitle}
              className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Title</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Hero Subtitle / Short Bio</label>
          <textarea
            rows={3}
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-white font-medium leading-relaxed"
          />
        </div>
      </div>

      {/* Location & Social Direct Lines */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold pb-2 border-b border-white/10">
          LOCATION &amp; CONTACT CHANNELS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Location Name</label>
            <input
              type="text"
              value={profile.location || ""}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Coordinates</label>
            <input
              type="text"
              value={profile.coordinates || ""}
              onChange={(e) => setProfile({ ...profile, coordinates: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Timezone</label>
            <input
              type="text"
              value={profile.timezone || ""}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Primary Email</label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Phone Number (WhatsApp)</label>
            <input
              type="text"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={profile.linkedin || ""}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={profile.github || ""}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
