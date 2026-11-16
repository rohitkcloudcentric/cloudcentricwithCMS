import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Set by the Reset Password page after a successful reset
  const resetDone = router.query.reset === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      setError("Please enter your admin email address.");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("loginSuccess", "true");
        }
        router.push("/admin?loginSuccess=true");
      } else {
        setError(data.error || "Authentication failed. Invalid email or password.");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-[#7c3aed] selection:text-white relative overflow-hidden font-sans">
      {/* Background Animated Gradient Orbs matching Frontend */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-linear-to-tr from-[#7c3aed]/20 to-[#4f8bff]/15 rounded-full blur-[120px] pointer-events-none animate-slow-pulse"></div>
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#2563eb]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0e0e12]/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(124,58,237,0.15)] backdrop-blur-2xl relative z-10 space-y-7 transition-all">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="CloudCentric Logo"
              className="h-12 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]"
            />
          </div>
          <div>
            {/* <h1 className="text-2xl font-bold tracking-tight text-white font-manrope">
              CloudCentric CMS
            </h1> */}
            <p className="text-xs text-[#a1a1aa] font-intel mt-1">
              Enterprise Headless Content Management Portal
            </p>
          </div>
        </div>

        {/* Password reset confirmation */}
        {resetDone && !error && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-emerald-400 text-xs font-medium animate-fade-in" role="status">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Your password has been reset. Please sign in with your new password.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-400 text-xs font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-intel font-semibold text-[#b6b6c2] uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-11 pr-4 py-3 bg-[#14141a] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-intel font-semibold text-[#b6b6c2] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#14141a] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all font-sans"
              />
            </div>
            <div className="flex justify-end">
              <Link href="/admin/forgot-password" className="text-xs font-intel text-[#a855f7] hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#7c3aed] via-[#2563eb] to-[#4f8bff] text-white text-sm font-intel font-extrabold hover:opacity-95 transition-all shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer tracking-wider"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

      </div>
    </div>
  );
}
