"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "./AdminContext";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Cpu,
  Award,
  FileText,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Profile & Hero", href: "/admin/profile", icon: User },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Skills Arsenal", href: "/admin/skills", icon: Cpu },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Resume PDF", href: "/admin/resume", icon: FileText },
  { label: "Contact Inbox", href: "/admin/messages", icon: Mail, hasBadge: true },
  { label: "SEO & Settings", href: "/admin/settings", icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminEmail, unreadCount, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[var(--text-main)] flex flex-col md:flex-row antialiased selection:bg-indigo-600 selection:text-white pb-20 md:pb-0">
      {/* =========================================================================
          DESKTOP SIDEBAR
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-white/10 bg-[#0C0E14] shrink-0 sticky top-0 h-screen select-none">
        {/* Brand / Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              SJ
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block text-white group-hover:text-indigo-400 transition-colors">
                PORTFOLIO ADMIN
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Control Engine
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.hasBadge && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#090B10]">
          {/* Quick view public portfolio */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all border border-white/10"
          >
            <span>View Public Site</span>
            <ExternalLink size={12} className="text-indigo-400" />
          </Link>

          {/* Admin Email & Logout */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]" title={adminEmail || ""}>
              {adminEmail || "sushandjain@gmail.com"}
            </span>
            <button
              type="button"
              onClick={logout}
              title="Log out of admin console"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE TOP BAR (Visible only on < 768px)
          ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0C0E14]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            SJ
          </div>
          <div>
            <span className="font-bold text-xs tracking-tight block text-white">PORTFOLIO ADMIN</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Link
              href="/admin/messages"
              className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1"
            >
              <Mail size={11} />
              <span>{unreadCount}</span>
            </Link>
          )}

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            title="Open Live Portfolio"
          >
            <ExternalLink size={15} />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTENT AREA
          ========================================================================= */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* =========================================================================
          MOBILE BOTTOM DOCK / TAB BAR (Visible on screens < 768px for easy thumb navigation)
          ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0E14]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around overflow-x-auto no-scrollbar">
        {[
          { label: "Home", href: "/admin", icon: LayoutDashboard },
          { label: "Profile", href: "/admin/profile", icon: User },
          { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
          { label: "Inbox", href: "/admin/messages", icon: Mail, badge: unreadCount },
          { label: "Resume", href: "/admin/resume", icon: FileText },
          { label: "Settings", href: "/admin/settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[54px] py-1.5 px-2 rounded-xl transition-all relative ${
                isActive ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon size={18} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono mt-1">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
