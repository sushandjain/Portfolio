"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Copy, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("sushandjain@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to initiate password reset.");
        return;
      }

      setMessage(data.message || "Reset link generated.");
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setError("An unexpected network error occurred.");
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!resetUrl) return;
    const fullUrl = `${window.location.origin}${resetUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-4 shadow-lg shadow-amber-500/20">
            <KeyRound size={28} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            RESET ADMIN ACCESS
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
            Enter your designated admin email address to generate a recovery key.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl backdrop-blur-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <p className="font-semibold">{message}</p>
                {resetUrl && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20 space-y-2">
                    <span className="text-[11px] font-mono text-emerald-200/70 block">
                      Direct Recovery Link (valid for 60 minutes):
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={resetUrl}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-500 transition-colors inline-block"
                      >
                        Click to Reset Password →
                      </Link>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 rounded-xl bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!resetUrl && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-faint)] font-bold mb-2">
                  Admin Email Address
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Request...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Reset Key</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] text-center">
            <Link
              href="/admin/login"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
