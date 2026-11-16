import React from "react";
import Head from "next/head";

/** Same full-screen background, card and brand header as the Admin Login page. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-[#7c3aed] selection:text-white relative overflow-hidden font-sans">
      <Head>
        <title>{`${title} | CloudCentric Admin`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-linear-to-tr from-[#7c3aed]/20 to-[#4f8bff]/15 rounded-full blur-[120px] pointer-events-none animate-slow-pulse"></div>
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-[#2563eb]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="w-full max-w-md bg-[#0e0e12]/90 border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(124,58,237,0.15)] backdrop-blur-2xl relative z-10 space-y-7 transition-all">
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
            <h1 className="text-lg font-bold tracking-tight text-white font-manrope">{title}</h1>
            <p className="text-xs text-[#a1a1aa] font-intel mt-1">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Field / button classes copied from the login form so the pages look identical. */
export const AUTH_INPUT =
  "w-full pl-11 pr-4 py-3 bg-[#14141a] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all font-sans";
export const AUTH_LABEL = "text-xs font-intel font-semibold text-[#b6b6c2] uppercase tracking-wider";
export const AUTH_BUTTON =
  "w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#7c3aed] via-[#2563eb] to-[#4f8bff] text-white text-sm font-intel font-extrabold hover:opacity-95 transition-all shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer tracking-wider";
export const AUTH_ERROR =
  "p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3 text-red-400 text-xs font-medium animate-fade-in";
export const AUTH_SUCCESS =
  "p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3 text-emerald-400 text-xs font-medium animate-fade-in";
