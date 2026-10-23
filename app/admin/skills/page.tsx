"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminContext";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Loader2, Cpu, CheckCircle2 } from "lucide-react";

export default function AdminSkillsPage() {
  const { showToast } = useAdmin();
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingSkillToCategory, setAddingSkillToCategory] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Advanced");

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.content.skills)) {
          setSkillGroups(data.content.skills);
        }
      }
    } catch {
      showToast("Failed to fetch skills data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const saveAll = async (updated: any[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "skills", data: updated }),
      });

      if (res.ok) {
        setSkillGroups(updated);
        showToast("Skills arsenal saved successfully!", "success");
      } else {
        showToast("Failed to save skills.", "error");
      }
    } catch {
      showToast("Network error saving skills.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= skillGroups.length) return;

    const copy = [...skillGroups];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    const reordered = copy.map((g, idx) => ({ ...g, order: idx + 1 }));
    saveAll(reordered);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newGroup = {
      id: `skill-group-${Date.now()}`,
      category: newCategoryName.trim(),
      items: [],
      order: skillGroups.length + 1,
      published: true,
    };
    const updated = [...skillGroups, newGroup];
    setNewCategoryName("");
    saveAll(updated);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = skillGroups.filter((g) => g.id !== id);
    saveAll(updated);
  };

  const handleAddSkillItem = (groupId: string) => {
    if (!newSkillName.trim()) return;

    const updated = skillGroups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        items: [
          ...(g.items || []),
          { name: newSkillName.trim(), level: newSkillLevel },
        ],
      };
    });

    setNewSkillName("");
    setAddingSkillToCategory(null);
    saveAll(updated);
  };

  const handleRemoveSkillItem = (groupId: string, itemIndex: number) => {
    const updated = skillGroups.map((g) => {
      if (g.id !== groupId) return g;
      const copyItems = [...g.items];
      copyItems.splice(itemIndex, 1);
      return { ...g, items: copyItems };
    });
    saveAll(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Skills Arsenal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            ARSENAL &amp; CAPABILITIES ({skillGroups.length} Categories)
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SKILLS MATRIX
          </h1>
        </div>

        {/* Add New Category Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category (e.g. Cloud & DevOps)"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* Skill Groups */}
      <div className="space-y-6">
        {skillGroups.map((group, groupIdx) => (
          <div
            key={group.id}
            className="p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-indigo-400" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  {group.category}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  ({(group.items || []).length} skills)
                </span>
              </div>

              {/* Category Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={groupIdx === 0}
                  onClick={() => handleMoveCategory(groupIdx, "up")}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Category Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  disabled={groupIdx === skillGroups.length - 1}
                  onClick={() => handleMoveCategory(groupIdx, "down")}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Category Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(group.id)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Skill Pills */}
            <div className="flex flex-wrap gap-2.5">
              {(group.items || []).map((skill: any, itemIdx: number) => (
                <div
                  key={itemIdx}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono group"
                >
                  <span className="font-bold text-white">{skill.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      skill.level === "Expert"
                        ? "bg-indigo-500/20 text-indigo-300"
                        : skill.level === "Certified"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {skill.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillItem(group.id, itemIdx)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill to this Category */}
            {addingSkillToCategory === group.id ? (
              <div className="pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. Next.js 15, PostgreSQL)"
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono flex-1 min-w-[180px]"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                >
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Certified">Certified</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleAddSkillItem(group.id)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setAddingSkillToCategory(null)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-400 text-xs font-mono"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setAddingSkillToCategory(group.id)}
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Skill to {group.category}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
