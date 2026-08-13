"use client";

import SEOHead from "@/components/seo/SEOHead";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import Link from "next/link";
import { ArrowLeft, Home, Search, AlertCircle } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <SEOHead
        title="404 - Page Not Found | CloudCentric"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full min-h-screen justify-between">
          <div>
            <AnnouncementBar />
            <Navbar />
          </div>

          {/* Centered 404 Content Section */}
          <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 max-w-4xl mx-auto w-full my-auto">
            {/* Ambient Background Radial Glow strictly contained within section */}
            <div 
              className="absolute inset-0 pointer-events-none -z-10 opacity-60"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(124, 58, 237, 0.25) 0%, transparent 70%)",
              }}
            />

            {/* Glowing Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/80 text-xs font-mono tracking-widest uppercase mb-6 shadow-inner">
              <AlertCircle className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>/ ERROR 404 - PAGE NOT FOUND</span>
            </div>

            {/* Giant Graphic 404 Display */}
            <div className="relative mb-4">
              <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 select-none font-duru">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 sm:w-56 sm:h-56 bg-[#7C3AED]/20 rounded-full filter blur-[60px] -z-10" />
              </div>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white mb-3 font-duru">
              Lost in the Digital Cloud?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[#C6C6D1] max-w-lg mb-8 leading-relaxed font-intel">
              The page or resource you are looking for has been relocated, moved, or deleted. Let us get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/"
                className="group inline-flex items-center justify-between gap-5 py-2.5 pl-6 pr-2 rounded-xl bg-white/[0.06] border border-white/15 text-white text-xs font-semibold tracking-wider hover:border-white/30 hover:bg-white/[0.12] transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)] font-intel cursor-pointer"
              >
                <span className="tracking-widest uppercase flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" /> RETURN HOME
                </span>
                <div className="flex items-center justify-center w-12 h-8 bg-white rounded-l-2xl rounded-r-xl transition-transform group-hover:translate-x-1">
                  <svg className="w-6 h-4 text-[#7C3AED]" viewBox="0 0 32 16" fill="none" aria-hidden="true">
                    <path d="M4 8H26M26 8L20 3M26 8L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.05] hover:border-white/20 text-white/90 text-xs font-semibold tracking-wider uppercase font-intel transition-all"
              >
                <Search className="w-3.5 h-3.5 text-white/60" />
                <span>EXPLORE INSIGHTS</span>
              </Link>
            </div>
          </section>

          <Footer />
        </div>
        <FloatingButtons />
      </main>
    </>
  );
}
