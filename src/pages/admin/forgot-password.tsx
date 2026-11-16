import React, { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthShell, { AUTH_BUTTON, AUTH_ERROR, AUTH_INPUT, AUTH_LABEL, AUTH_SUCCESS } from "@/components/admin/AuthShell";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) return setError("Please enter your admin email address.");
    if (!EMAIL_RE.test(trimmed)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) setSent(data.message);
      else setError(data.error || "We couldn't send the reset link. Please try again.");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Forgot Password" subtitle="Enter your admin email and we'll send you a reset link">
      {error && (
        <div className={AUTH_ERROR} role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {sent ? (
        <div className="space-y-5">
          <div className={AUTH_SUCCESS} role="status">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{sent} The link expires in 10 minutes.</span>
          </div>
          <button type="button" onClick={() => setSent("")} className="w-full text-xs font-intel text-[#a1a1aa] hover:text-white transition-colors cursor-pointer">
            Didn&apos;t get it? Send another link
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="forgot-email" className={AUTH_LABEL}>Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={AUTH_INPUT}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className={AUTH_BUTTON}>
            <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      )}

      <div className="text-center">
        <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs font-intel text-[#a855f7] hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </AuthShell>
  );
}
