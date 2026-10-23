"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("sushandjain@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Successful login -> navigate to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network or server error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mb-4 shadow-lg shadow-indigo-600/20">
            <ShieldCheck size={28} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            PORTFOLIO ADMIN
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
            Authorized administrator access only. Server-protected console.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm animate-fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Admin Email Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sushandjain@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-[var(--text-main)] transition-colors placeholder:text-[var(--text-faint)]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold">
                  Secret Key / Password
                </label>
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-[var(--text-main)] transition-colors placeholder:text-[var(--text-faint)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
            <span className="text-[11px] font-mono text-[var(--text-faint)] block">
              Default password on first run: <code className="text-indigo-400 font-bold">SushanAdmin@2026!</code>
            </span>
            <span className="text-[10px] font-mono text-[var(--text-faint)] block mt-1">
              (Can be updated inside Admin Settings anytime)
            </span>
          </div>
        </div>

        {/* Public Portfolio Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-mono text-[var(--text-muted)] hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
