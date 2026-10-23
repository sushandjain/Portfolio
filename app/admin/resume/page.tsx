"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminContext";
import {
  FileText,
  Upload,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  History,
  FileCheck,
} from "lucide-react";

export default function AdminResumePage() {
  const { showToast } = useAdmin();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content.profile) {
          setProfile(data.content.profile);
        }
      })
      .catch(() => showToast("Failed to load resume settings.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Only PDF documents are permitted for the resume.", "error");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      showToast("PDF file size exceeds 12MB limit.", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "resume");

    try {
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.success) {
        showToast(uploadData.error || "Failed to upload resume.", "error");
        setIsUploading(false);
        return;
      }

      // Update profile with new resume URL
      const updatedProfile = {
        ...profile,
        resumeUrl: uploadData.url,
        resumeFileName: uploadData.originalName || file.name,
        resumeUpdatedAt: new Date().toISOString(),
      };

      const saveRes = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "profile", data: updatedProfile }),
      });

      if (saveRes.ok) {
        setProfile(updatedProfile);
        showToast("Resume PDF successfully updated! Public download link is live.", "success");
      } else {
        showToast("Uploaded file, but failed to save profile reference.", "error");
      }
    } catch {
      showToast("Network error uploading resume.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Resume Manager...</span>
      </div>
    );
  }

  const currentResumeUrl = profile.resumeUrl || "/uploads/SUSHAN_D_JAIN_RESUME.pdf";
  const currentFileName = profile.resumeFileName || "SUSHAN_D_JAIN_RESUME.pdf";
  const updatedAtFormatted = profile.resumeUpdatedAt
    ? new Date(profile.resumeUpdatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently verified";

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            DOCUMENT DISTRIBUTION
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            RESUME MANAGER
          </h1>
        </div>

        {/* Upload Button */}
        <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 w-fit">
          {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          <span>{isUploading ? "Uploading PDF..." : "Upload / Replace PDF"}</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Active File Card */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <FileText size={28} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">{currentFileName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Active Public Version
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-indigo-400" />
                Updated: {updatedAtFormatted}
              </span>
              <span>·</span>
              <span className="text-slate-500">PDF format</span>
            </div>
          </div>
        </div>

        {/* Direct Action Links */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink size={14} />
            <span>Open in New Tab</span>
          </a>

          <a
            href={currentResumeUrl}
            download={currentFileName}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded In-Browser Preview */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck size={16} className="text-indigo-400" />
            <span>Document Preview</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Public visitors receive this exact document
          </span>
        </div>

        <div className="w-full h-[600px] sm:h-[750px] rounded-2xl overflow-hidden bg-slate-950 border border-white/10 relative">
          <iframe
            src={`${currentResumeUrl}#toolbar=0`}
            title="Resume PDF Preview"
            className="w-full h-full border-0"
            onError={() => setPreviewError(true)}
          />
        </div>
      </div>
    </div>
  );
}
