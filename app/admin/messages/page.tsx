"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../AdminContext";
import {
  Mail,
  MailOpen,
  Trash2,
  Star,
  Search,
  Reply,
  Calendar,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function AdminMessagesPage() {
  const { showToast, refreshUnreadCount } = useAdmin();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch {
      showToast("Failed to fetch inbox messages.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: !currentRead });
        }
        refreshUnreadCount();
      }
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  const handleToggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, starred: !currentStarred }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, starred: !currentStarred } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, starred: !currentStarred });
        }
      }
    } catch {
      showToast("Failed to star message.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
        showToast("Message deleted.", "info");
        refreshUnreadCount();
      }
    } catch {
      showToast("Failed to delete message.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
        <span className="text-xs font-mono text-slate-400">Loading Messages Inbox...</span>
      </div>
    );
  }

  const filteredMessages = messages
    .filter((m) => {
      if (filter === "unread") return !m.read;
      if (filter === "starred") return m.starred;
      return true;
    })
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
            COMMUNICATION DISPATCH
          </span>
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CONTACT INBOX
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "unread", "starred"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
              filter === tab
                ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {tab} (
            {tab === "all"
              ? messages.length
              : tab === "unread"
              ? messages.filter((m) => !m.read).length
              : messages.filter((m) => m.starred).length}
            )
          </button>
        ))}
      </div>

      {/* Messages Grid: List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-slate-500">
              No inquiries found matching this filter.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.read) handleToggleRead(msg.id, false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage?.id === msg.id
                    ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40"
                    : !msg.read
                    ? "bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                    <span className="font-bold text-white truncate max-w-[160px]">{msg.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs font-mono text-indigo-300 truncate mb-1">{msg.email}</div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View (7 cols on lg) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
              {/* Message Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4 flex-wrap">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedMessage.name}</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors block mt-0.5"
                  >
                    {selectedMessage.email}
                  </a>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                    <Calendar size={11} />
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStar(selectedMessage.id, selectedMessage.starred)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      selectedMessage.starred
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Star size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={selectedMessage.read ? "Mark unread" : "Mark read"}
                  >
                    {selectedMessage.read ? <MailOpen size={15} /> : <Mail size={15} />}
                  </button>

                  {deleteConfirmId === selectedMessage.id ? (
                    <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-xl border border-rose-500/40">
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedMessage.id)}
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
                      onClick={() => setDeleteConfirmId(selectedMessage.id)}
                      className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-black/30 p-4 rounded-2xl border border-white/5 min-h-[140px]">
                {selectedMessage.message}
              </div>

              {/* Reply CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: Inquiry from ${selectedMessage.name}`
                  )}`}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Reply size={14} />
                  <span>Reply via Email</span>
                </a>

                <span className="text-[10px] font-mono text-slate-500">
                  ID: {selectedMessage.id}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-slate-500">
              Select an inquiry from the left to read full details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
