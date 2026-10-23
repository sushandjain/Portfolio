"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminToast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AdminContextType {
  adminEmail: string | null;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const refreshUnreadCount = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.messages)) {
          const unread = data.messages.filter((m: any) => !m.read).length;
          setUnreadCount(unread);
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthRoute) return;

    // Check session
    fetch("/api/admin/auth/session")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.authenticated) {
          setAdminEmail(data.email);
          refreshUnreadCount();
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, isAuthRoute, router]);

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("Logged out successfully.", "info");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminEmail,
        unreadCount,
        refreshUnreadCount,
        showToast,
        logout,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs sm:text-sm font-medium flex items-center gap-3 transition-all animate-fade-in ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
                : "bg-indigo-950/90 border-indigo-500/40 text-indigo-200"
            }`}
          >
            <span className="text-base">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
