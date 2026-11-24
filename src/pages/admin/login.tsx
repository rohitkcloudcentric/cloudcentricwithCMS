import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { ACCESS_DENIED_MESSAGE } from "@/lib/ip-constants";
import { extractClientIp } from "@/lib/ip-utils";
import { checkAdminIpAccess } from "@/lib/admin-ip-guard";
import { getPublicIp } from "@/lib/public-ip-client";

interface AdminLoginProps {
  accessDenied: boolean;
  clientIp: string;
  reason?: string | null;
}

export default function AdminLogin({ accessDenied, clientIp, reason }: AdminLoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamic state for IP verification
  const [isAccessDenied, setIsAccessDenied] = useState(accessDenied);
  const [currentClientIp, setCurrentClientIp] = useState(clientIp);
  const [accessReason, setAccessReason] = useState<string | null>(reason || null);
  const [rechecking, setRechecking] = useState(false);

  // Set by the Reset Password page after a successful reset
  const resetDone = router.query.reset === "success";

  // Client-side public IP detection & dynamic verification
  useEffect(() => {
    let isMounted = true;

    getPublicIp(3000).then(async (pubIp) => {
      if (!isMounted || !pubIp) return;

      // Store in cookie for subsequent requests
      document.cookie = `admin_client_ip=${encodeURIComponent(pubIp)}; path=/; max-age=86400; SameSite=Lax`;
      setCurrentClientIp(pubIp);

      try {
        const res = await fetch(`/api/v1/auth/check-ip?ip=${encodeURIComponent(pubIp)}`, {
          headers: { "X-Client-Public-IP": pubIp },
        });
        const data = await res.json();
        if (!isMounted) return;

        if (data.allowed) {
          setIsAccessDenied(false);
          setAccessReason(null);
        } else {
          setIsAccessDenied(true);
          setAccessReason(data.reason || null);
        }
      } catch {
        // Keep current state on network failure
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRecheck = async () => {
    setRechecking(true);
    try {
      const pubIp = await getPublicIp(3000);
      const ipToCheck = pubIp || currentClientIp;
      if (ipToCheck) {
        document.cookie = `admin_client_ip=${encodeURIComponent(ipToCheck)}; path=/; max-age=86400; SameSite=Lax`;
        setCurrentClientIp(ipToCheck);
      }
      const res = await fetch(`/api/v1/auth/check-ip${ipToCheck ? `?ip=${encodeURIComponent(ipToCheck)}` : ""}`, {
        headers: ipToCheck ? { "X-Client-Public-IP": ipToCheck } : {},
      });
      const data = await res.json();
      if (data.allowed) {
        setIsAccessDenied(false);
        setAccessReason(null);
      } else {
        setIsAccessDenied(true);
        setAccessReason(data.reason || null);
      }
    } catch {
      // Re-check failed
    } finally {
      setRechecking(false);
    }
  };

  // If IP check denied access
  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-[#ef4444] selection:text-white relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-radial from-[#ef4444]/20 via-[#7c3aed]/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-lg bg-[#0e0e12]/95 border border-red-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_60px_rgba(239,68,68,0.15)] backdrop-blur-2xl relative z-10 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/15 border border-red-500/30 text-red-400">
            403 Forbidden
          </div>

          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-manrope">
              {ACCESS_DENIED_MESSAGE}
            </h1>
            <p className="text-xs md:text-sm text-[#a1a1aa] font-intel">
              This administrative console is restricted to authorized IP addresses only.
              Your connection attempt has been recorded for security auditing.
            </p>
          </div>

          <div className="bg-[#14141a] border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#71717a]">Detected Client IP:</span>
              <span className="font-mono text-white font-semibold">{currentClientIp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#71717a]">Access Status:</span>
              <span className="text-red-400 font-semibold">Unauthorized / Blocked</span>
            </div>
            {accessReason && (
              <div className="flex justify-between items-center">
                <span className="text-[#71717a]">Details:</span>
                <span className="text-red-300 text-[11px] font-mono">{accessReason}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleRecheck}
            disabled={rechecking}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${rechecking ? "animate-spin" : ""}`} />
            <span>{rechecking ? "Re-verifying IP..." : "Re-check Access"}</span>
          </button>

          <p className="text-[11px] text-[#71717a] font-intel leading-relaxed">
            If you need access to this portal, please contact your Super Administrator to authorize your IP address.
          </p>
        </div>
      </div>
    );
  }

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
        headers: {
          "Content-Type": "application/json",
          "X-Client-Public-IP": currentClientIp,
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();
      if (res.status === 403) {
        setIsAccessDenied(true);
        setError(data.error || ACCESS_DENIED_MESSAGE);
      } else if (data.success) {
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
            <p className="text-xs text-[#a1a1aa] font-intel mt-1">
              Enterprise Headless Content Management Portal
            </p>
          </div>
        </div>

        {/* Detected Client IP Security Badge */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#14141a] border border-emerald-500/20 text-xs">
          <span className="text-[#a1a1aa] flex items-center gap-1.5 font-intel">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            Detected Client IP:
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-300 font-semibold">{currentClientIp}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Authorized
            </span>
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

export const getServerSideProps: GetServerSideProps<AdminLoginProps> = async (context) => {
  const clientIp = extractClientIp(context.req);
  const check = await checkAdminIpAccess(clientIp);

  if (!check.allowed) {
    context.res.statusCode = 403;
    return {
      props: {
        accessDenied: true,
        clientIp,
        reason: check.reason || null,
      },
    };
  }

  return {
    props: {
      accessDenied: false,
      clientIp,
      reason: null,
    },
  };
};
