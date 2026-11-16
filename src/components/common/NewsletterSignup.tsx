"use client";

import React, { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getPublicIp } from "@/lib/public-ip-client";

interface NewsletterSignupProps {
  /** Page the user is subscribing from; the server resolves the real title from the slug */
  sourceType: "BLOG" | "CASE_STUDY";
  sourceSlug: string;
  /** Use the monospace font (case study pages) */
  mono?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;

/** Email field + Subscribe button for the sidebar newsletter card (same markup as the original design). */
export default function NewsletterSignup({ sourceType, sourceSlug, mono = false }: NewsletterSignupProps) {
  const inputId = useId();
  const statusId = useId();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const font = mono ? MONO : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setState("error");
      setMessage("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value) || value.length > 254) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setState("loading");
    setMessage("");
    try {
      const clientIp = await getPublicIp();
      const res = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, sourceType, sourceSlug, website, clientIp }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setState("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "We couldn't complete your subscription. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  if (state === "success") {
    return (
      <div
        className="pt-4 z-10 relative py-6 px-4 text-center text-sm font-semibold text-[#A78BFA] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl"
        style={font}
        role="status"
      >
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="pt-4 space-y-6 z-10 relative flex flex-col" aria-describedby={message ? statusId : undefined}>
      <label htmlFor={inputId} className="sr-only">Email address</label>
      <input
        id={inputId}
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="Email address"
        value={email}
        maxLength={254}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        aria-invalid={state === "error"}
        className="w-full bg-transparent border-b border-white/25 pb-2 text-xs sm:text-sm font-intel text-white placeholder-white/40 outline-none focus:border-white/70 transition-colors aria-[invalid=true]:border-red-400/70"
        style={font}
      />

      {/* Honeypot: hidden from people, filled in by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {message && state === "error" && (
        <p id={statusId} role="alert" className="-mt-3 text-[11px] sm:text-xs text-red-400" style={font}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3.5 px-5 rounded-[18px] bg-[rgba(60,70,140,0.35)] hover:bg-[rgba(60,70,140,0.45)] border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-intel font-medium tracking-[0.15em] uppercase flex items-center justify-between transition-all shadow-xl group cursor-pointer disabled:opacity-70 disabled:cursor-wait"
      >
        <span style={font}>{state === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}</span>
        <div className="w-11 h-7 rounded-full bg-white text-[#4F8BFF] flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="w-4 h-4 text-[#4F8BFF] stroke-[2]" aria-hidden="true" />
        </div>
      </button>
    </form>
  );
}
