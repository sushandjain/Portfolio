"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to reset password. The link may have expired.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 2500);
    } catch {
      setError("An unexpected network error occurred.");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300">
        <p className="font-bold text-sm">Missing reset token.</p>
        <p className="text-xs font-mono mt-1 text-rose-400">Please request a valid password reset link.</p>
        <Link
          href="/admin/forgot-password"
          className="mt-4 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold"
        >
          Request Reset Link →
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-2xl">
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
            <CheckCircle2 size={26} />
          </div>
          <h2 className="text-lg font-bold text-emerald-300">Password Updated Successfully!</h2>
          <p className="text-xs font-mono text-[var(--text-muted)]">
            Redirecting to admin login in 2 seconds...
          </p>
          <Link
            href="/admin/login"
            className="inline-block mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-mono font-bold"
          >
            Go to Login Now →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold mb-2">
              New Password (min 8 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-[var(--text-main)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-faint)] hover:text-[var(--text-main)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-faint)]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-indigo-500 focus:outline-none text-xs sm:text-sm text-[var(--text-main)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Save &amp; Activate Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            CREATE NEW PASSWORD
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
            Enter your new secure administrator password below.
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">Loading reset session...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
