"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdmin } from "../AdminContext";
import {
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Save,
  X,
  Loader2,
  Award,
  Trophy,
} from "lucide-react";

export default function AdminCertificatesPage() {
  const { showToast } = useAdmin();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"certificates" | "achievements">("certificates");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.content.certificates)) setCertificates(data.content.certificates);
          if (Array.isArray(data.content.achievements)) setAchievements(data.content.achievements);
        }
      }
    } catch {
      showToast("Failed to fetch certificates data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveCertificates = async (newCerts: any[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "certificates", data: newCerts }),
      });

      if (res.ok) {
        setCertificates(newCerts);
        showToast("Certificates updated successfully!", "success");
      } else {
        showToast("Failed to save certificates.", "error");
      }
    } catch {
      showToast("Network error saving certificates.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAchievements = async (newAchs: any[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "achievements", data: newAchs }),
      });

      if (res.ok) {
        setAchievements(newAchs);
        showToast("Achievements updated successfully!", "success");
      } else {
        showToast("Failed to save achievements.", "error");
      }
    } catch {
      showToast("Network error saving achievements.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (activeTab === "certificates") {
      if (target < 0 || target >= certificates.length) return;
      const copy = [...certificates];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      const reordered = copy.map((c, idx) => ({ ...c, order: idx + 1 }));
      saveCertificates(reordered);
    } else {
      if (target < 0 || target >= achievements.length) return;
      const copy = [...achievements];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      const reordered = copy.map((a, idx) => ({ ...a, order: idx + 1 }));
      saveAchievements(reordered);
    }
  };

  const handleTogglePublished = (index: number) => {
    if (activeTab === "certificates") {
      const copy = [...certificates];
      copy[index] = { ...copy[index], published: !copy[index].published };
      saveCertificates(copy);
    } else {
      const copy = [...achievements];
      copy[index] = { ...copy[index], published: !copy[index].published };
      saveAchievements(copy);
    }
  };

  const handleDelete = (id: string) => {
    if (activeTab === "certificates") {
      const filtered = certificates.filter((c) => c.id !== id).map((c, idx) => ({ ...c, order: idx + 1 }));
      saveCertificates(filtered);
    } else {
      const filtered = achievements.filter((a) => a.id !== id).map((a, idx) => ({ ...a, order: idx + 1 }));
      saveAchievements(filtered);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCert) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "certificate");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingCert({ ...editingCert, badgeImage: data.url });
        showToast("Certificate badge uploaded & optimized!", "success");
      } else {
        showToast(data.error || "Failed to upload image.", "error");
      }
    } catch {
      showToast("Network error uploading image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (activeTab === "certificates") {
      let updated: any[];
      const exists = certificates.some((c) => c.id === editingCert.id);
      if (exists) {
        updated = certificates.map((c) => (c.id === editingCert.id ? editingCert : c));
      } else {
        updated = [...certificates, { ...editingCert, order: certificates.length + 1 }];
      }
      setEditingCert(null);
      saveCertificates(updated);
    } else {
      let updated: any[];
      const exists = achievements.some((a) => a.id === editingCert.id);
      if (exists) {
        updated = achievements.map((a) => (a.id === editingCert.id ? editingCert : a));
      } else {
        updated = [...achievements, { ...editingCert, order: achievements.length + 1 }];
      }
      setEditingCert(null);
      saveAchievements(updated);
    }
  };

  const createBlank = () => {
    if (activeTab === "certificates") {
      setEditingCert({
        id: `cert-${Date.now()}`,
        title: "Certification Title",
        issuer: "Issuing Organization",
        date: "2026",
        badge: "Verified Credential",
        credlyUrl: "",
        badgeImage: "/claude-badge.png",
        accentColor: "#CC5500",
        isFeatured: true,
        published: true,
        description: "Official credential verifying advanced engineering capabilities.",
        skillsVerified: ["Systems Architecture", "REST APIs"],
      });
    } else {
      setEditingCert({
        id: `ach-${Date.now()}`,
        title: "Achievement / Award Title",
        issuer: "Competition or Organization",
        date: "2026",
        badge: "Award Winner",
        icon: "trophy",
        driveUrl: "",
        published: true,
        description: "Honored for superior technical engineering execution.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Credentials...</span>
      </div>
    );
  }

  const items = activeTab === "certificates" ? certificates : achievements;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            CREDENTIALS &amp; RECOGNITION
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CERTIFICATES &amp; HONORS
          </h1>
        </div>

        <button
          type="button"
          onClick={createBlank}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={15} />
          <span>Add {activeTab === "certificates" ? "Certificate" : "Achievement"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("certificates")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === "certificates"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Certificates ({certificates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeTab === "achievements"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Achievements &amp; Hackathons ({achievements.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.published
                ? "bg-white/[0.02] border-white/10 hover:border-indigo-500/40"
                : "bg-slate-900/40 border-dashed border-white/10 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                {item.badgeImage ? (
                  <Image src={item.badgeImage} alt={item.title} fill className="object-contain p-1.5" />
                ) : (
                  <Award size={22} className="text-amber-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-indigo-400 font-bold">{item.date}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs font-mono text-slate-400">{item.issuer}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      item.published
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white truncate mt-0.5">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, "up")}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => handleMove(index, "down")}
                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ArrowDown size={14} />
              </button>

              <button
                type="button"
                onClick={() => handleTogglePublished(index)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  item.published
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              <button
                type="button"
                onClick={() => setEditingCert(item)}
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F17] border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Edit Credential Record</h2>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Issuer</label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Credly URL</label>
                  <input
                    type="url"
                    value={editingCert.credlyUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, credlyUrl: e.target.value })}
                    placeholder="https://credly.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Drive / Document Link</label>
                  <input
                    type="url"
                    value={editingCert.driveUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, driveUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Badge Image Upload */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Badge Image URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingCert.badgeImage || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, badgeImage: e.target.value })}
                    placeholder="/claude-badge.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload Badge</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCert.description}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Save size={15} />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
