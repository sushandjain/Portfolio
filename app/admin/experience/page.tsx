"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminContext";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, Save, X, Loader2, Briefcase } from "lucide-react";

export default function AdminExperiencePage() {
  const { showToast } = useAdmin();
  const [experience, setExperience] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchExperience = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.content.experience)) {
          setExperience(data.content.experience);
        }
      }
    } catch {
      showToast("Failed to fetch experience records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const saveAll = async (updated: any[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "experience", data: updated }),
      });

      if (res.ok) {
        setExperience(updated);
        showToast("Experience timeline saved successfully!", "success");
      } else {
        showToast("Failed to save experience changes.", "error");
      }
    } catch {
      showToast("Network error saving experience.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= experience.length) return;

    const copy = [...experience];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    saveAll(reordered);
  };

  const handleTogglePublished = (index: number) => {
    const copy = [...experience];
    copy[index] = { ...copy[index], published: !copy[index].published };
    saveAll(copy);
  };

  const handleDelete = (id: string) => {
    const filtered = experience.filter((e) => e.id !== id).map((e, idx) => ({ ...e, order: idx + 1 }));
    setDeleteConfirmId(null);
    saveAll(filtered);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: any[];
    const exists = experience.some((e) => e.id === editingItem.id);

    if (exists) {
      updated = experience.map((e) => (e.id === editingItem.id ? editingItem : e));
    } else {
      updated = [...experience, { ...editingItem, order: experience.length + 1 }];
    }

    setEditingItem(null);
    saveAll(updated);
  };

  const createBlank = () => {
    setEditingItem({
      id: `exp-${Date.now()}`,
      role: "Software Engineer",
      company: "Company Name",
      location: "Bengaluru, India",
      period: "2026 – Present",
      status: "Current Enterprise Role",
      summary: "Overview of responsibilities and core accomplishments.",
      highlights: [
        "Architected enterprise-grade systems with 99.9% uptime",
        "Streamlined high-throughput REST APIs and data processing workflows",
      ],
      tags: ["REST APIs", "Node.js", "TypeScript"],
      published: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Experience...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            CAREER TIMELINE ({experience.length})
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            EXPERIENCE MANAGER
          </h1>
        </div>

        <button
          type="button"
          onClick={createBlank}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={15} />
          <span>Add Position</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {experience.map((item, index) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.published
                ? "bg-white/[0.02] border-white/10 hover:border-indigo-500/40"
                : "bg-slate-900/40 border-dashed border-white/10 opacity-60"
            }`}
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-indigo-400 font-bold">{item.period}</span>
                <span className="text-white/20">·</span>
                <span className="text-xs font-mono text-slate-400">{item.location}</span>
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
              <h3 className="text-base font-bold text-white">
                {item.role} <span className="text-indigo-400 font-normal">@ {item.company}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{item.summary}</p>
              <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                {(item.tags || []).map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, "up")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={index === experience.length - 1}
                onClick={() => handleMove(index, "down")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
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
                onClick={() => setEditingItem(item)}
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
              </button>

              {deleteConfirmId === item.id ? (
                <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-xl border border-rose-500/40">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-1 bg-white/10 text-white rounded-lg text-[10px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F17] border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {experience.some((e) => e.id === editingItem.id) ? "Edit Role" : "Add Experience"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Period (e.g. March 2026 – Present)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.period}
                    onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={editingItem.summary}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Bullet Points (one per line)
                </label>
                <textarea
                  rows={4}
                  value={(editingItem.highlights || []).join("\n")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      highlights: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Tech Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={(editingItem.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
