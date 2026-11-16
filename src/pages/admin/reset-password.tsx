import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Lock, AlertCircle, ArrowRight, ArrowLeft, Check, X, Eye, EyeOff } from "lucide-react";
import AuthShell, { AUTH_BUTTON, AUTH_ERROR, AUTH_INPUT, AUTH_LABEL } from "@/components/admin/AuthShell";
import { PASSWORD_RULES, passwordProblem } from "@/lib/password-policy";

type LinkState = "checking" | "valid" | "invalid";

const EXPIRED_MESSAGE = "Your password reset link has expired. Please request a new one.";
const INVALID_MESSAGE = "This password reset link is invalid or has already been used. Please request a new one.";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [linkMessage, setLinkMessage] = useState(INVALID_MESSAGE);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Read the token from the URL fragment (#token=...), then remove it from the address bar/history.
  // Then check the link before showing the form, so an expired/used link is explained up front.
  useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    let alive = true;
    const settle = (state: LinkState) => alive && setLinkState(state);
    if (!fromHash) {
      queueMicrotask(() => settle("invalid"));
    } else {
      fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fromHash, checkOnly: true }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          setToken(fromHash);
          if (!d.valid) setLinkMessage(d.reason === "expired" ? EXPIRED_MESSAGE : INVALID_MESSAGE);
          settle(d.valid ? "valid" : "invalid");
        })
        .catch(() => {
          if (!alive) return;
          setToken(fromHash);
          settle("valid"); // network hiccup: let the submit report the real result
        });
    }
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        router.replace("/admin/login?reset=success");
        return;
      }
      if (data.expired) {
        // The link expired (or was used) while this page was open
        setLinkMessage(data.reason === "expired" ? EXPIRED_MESSAGE : INVALID_MESSAGE);
        setLinkState("invalid");
        return;
      }
      setError(data.error || "We couldn't reset your password. Please try again.");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const matches = confirm.length > 0 && password === confirm;

  return (
    <AuthShell title="Reset Password" subtitle="Choose a new password for your admin account">
      {linkState === "checking" && <p className="text-center text-xs font-intel text-[#a1a1aa]">Checking your reset link...</p>}

      {linkState === "invalid" && (
        <div className="space-y-5">
          <div className={AUTH_ERROR} role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{linkMessage}</span>
          </div>
          <Link href="/admin/forgot-password" className={AUTH_BUTTON}>
            <span>Request a New Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {linkState === "valid" && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <div className={AUTH_ERROR} role="alert">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="reset-password" className={AUTH_LABEL}>New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="reset-password"
                type={show ? "text" : "password"}
                required
                autoComplete="new-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className={`${AUTH_INPUT} pr-11`}
                aria-describedby="reset-rules"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                aria-label={show ? "Hide passwords" : "Show passwords"}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <ul id="reset-rules" className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px] font-intel">
              {PASSWORD_RULES.map((r) => {
                const ok = r.test(password);
                return (
                  <li key={r.label} className={`flex items-center gap-1.5 ${ok ? "text-emerald-400" : "text-[#77778B]"}`}>
                    {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {r.label}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="space-y-2">
            <label htmlFor="reset-confirm" className={AUTH_LABEL}>Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="reset-confirm"
                type={show ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className={AUTH_INPUT}
              />
            </div>
            {confirm.length > 0 && (
              <p className={`text-[11px] font-intel ${matches ? "text-emerald-400" : "text-red-400"}`}>
                {matches ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>
          <button type="submit" disabled={loading} className={AUTH_BUTTON}>
            <span>{loading ? "Updating..." : "Reset Password"}</span>
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
