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
  Star,
  ExternalLink,
  Upload,
  Save,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function AdminProjectsPage() {
  const { showToast } = useAdmin();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.content.projects)) {
          setProjects(data.content.projects);
        }
      }
    } catch {
      showToast("Failed to fetch projects.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveAllProjects = async (newProjects: any[]) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "projects", data: newProjects }),
      });

      if (res.ok) {
        setProjects(newProjects);
        showToast("Projects saved successfully!", "success");
      } else {
        showToast("Failed to save projects.", "error");
      }
    } catch {
      showToast("Network error saving projects.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index order property
    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    saveAllProjects(reordered);
  };

  const handleTogglePublished = (index: number) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], published: !updated[index].published };
    saveAllProjects(updated);
  };

  const handleToggleFeatured = (index: number) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], featured: !updated[index].featured };
    saveAllProjects(updated);
  };

  const handleDelete = (id: string) => {
    const filtered = projects
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, order: idx + 1 }));
    setDeleteConfirmId(null);
    saveAllProjects(filtered);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated: any[];
    const exists = projects.some((p) => p.id === editingProject.id);

    if (exists) {
      updated = projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    } else {
      updated = [...projects, { ...editingProject, order: projects.length + 1 }];
    }

    setEditingProject(null);
    saveAllProjects(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

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
        setEditingProject({
          ...editingProject,
          previewImage: data.url,
        });
        showToast("Project thumbnail compressed to WebP and updated!", "success");
      } else {
        showToast(data.error || "Failed to upload image.", "error");
      }
    } catch {
      showToast("Network error uploading thumbnail.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const createBlankProject = () => {
    setEditingProject({
      id: `project-${Date.now()}`,
      name: "New Flagship Project",
      tagline: "High-performance full-stack web application",
      category: "Full-Stack Development",
      date: "2026",
      status: "Live Production",
      featured: true,
      published: true,
      description: "Brief summary of the architecture and business impact.",
      points: ["High-throughput API architecture", "Responsive modern frontend with fluid UX"],
      stack: ["Next.js 15", "TypeScript", "Tailwind CSS"],
      metrics: [{ label: "Throughput", value: "99.9%" }],
      liveUrl: "",
      githubUrl: "",
      previewGradient: "from-indigo-950 via-slate-900 to-purple-950",
      badgeColor: "#6366F1",
      accentHex: "#6366F1",
      previewImage: "/projects/malnad-direct.png",
      videoUrl: "",
      screenshots: [],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            WORK &amp; FLAGSHIPS ({projects.length})
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            PROJECTS MANAGER
          </h1>
        </div>

        <button
          type="button"
          onClick={createBlankProject}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              project.published
                ? "bg-white/[0.02] border-white/10 hover:border-indigo-500/40"
                : "bg-slate-900/40 border-dashed border-white/10 opacity-60"
            }`}
          >
            {/* Left: Thumbnail & Project Meta */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                {project.previewImage ? (
                  <Image
                    src={project.previewImage}
                    alt={project.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-slate-500">
                    No Img
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white truncate">{project.name}</h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      ★ Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      project.published
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {project.published ? "Published" : "Draft (Hidden)"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{project.tagline}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {(project.stack || []).slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Actions & Reordering */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/10 w-full sm:w-auto justify-end">
              {/* Up / Down Reorder */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, "up")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                disabled={index === projects.length - 1}
                onClick={() => handleMove(index, "down")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>

              {/* Toggle Published */}
              <button
                type="button"
                onClick={() => handleTogglePublished(index)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  project.published
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-white/5 text-slate-500 hover:text-slate-300"
                }`}
                title={project.published ? "Hide from public site" : "Publish to site"}
              >
                {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>

              {/* Toggle Featured */}
              <button
                type="button"
                onClick={() => handleToggleFeatured(index)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  project.featured
                    ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                    : "bg-white/5 text-slate-500 hover:text-slate-300"
                }`}
                title="Toggle Featured status"
              >
                <Star size={14} />
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => setEditingProject(project)}
                className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Edit2 size={14} />
              </button>

              {/* Delete with Confirmation */}
              {deleteConfirmId === project.id ? (
                <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-xl border border-rose-500/40">
                  <span className="text-[10px] font-mono text-rose-300 px-1">Delete?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                  >
                    Yes
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
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          PROJECT EDIT MODAL
          ========================================================================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D0F17] border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {projects.some((p) => p.id === editingProject.id) ? "Edit Project" : "Add Project"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Status Badge</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, status: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                  >
                    <option value="Live Production">Live Production</option>
                    <option value="Deployed App">Deployed App</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Commercial Client">Commercial Client</option>
                  </select>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Live URL</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Thumbnail Image */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingProject.previewImage || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, previewImage: e.target.value })
                    }
                    placeholder="/projects/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white leading-relaxed"
                />
              </div>

              {/* Tech Stack Comma-Separated */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={(editingProject.stack || []).join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              {/* Save & Cancel Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
