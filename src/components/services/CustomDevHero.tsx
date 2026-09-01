"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function CustomDevHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-center -mt-[96px] sm:-mt-[104px] pt-[135px] sm:pt-[150px] lg:pt-[160px] pb-8 px-6 sm:px-10 lg:px-16 bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Background Hero Image & Glowing Gradients ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/blogs/blog-hero-bg.png"
          alt="Custom Development Hero Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-all duration-1000 ease-out ${
            mounted ? "opacity-95 scale-100" : "opacity-0 scale-105"
          }`}
        />
        {/* Dark Overlays & Ambient Glowing Orbs */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      </div>

      {/* ── Main Content Grid (2 Columns: Left Text, Right Image) ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6">
        
        {/* ── Left Column: Text & CTAs (7 Cols) ── */}
        <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-7">
          
          {/* Eyebrow / Sub-label */}
          <div 
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-[#9CA3AF] font-intel">
              / CUSTOM DEVELOPMENT
            </p>
          </div>

          {/* Main Title */}
          <div 
            className={`flex flex-col space-y-2 transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] xl:text-[56px] font-normal leading-[1.1] text-white tracking-tight font-duru">
              Software Built Around{" "}
              <span className="block font-normal bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                Your Business
              </span>
            </h1>
          </div>

          {/* Body Paragraph */}
          <p 
            className={`text-xs sm:text-sm lg:text-base text-[#D1D5DB] leading-relaxed max-w-2xl font-intel font-light transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            We design and develop custom software that fits your workflows, connects your systems, and scales with your business—from web and mobile applications to enterprise platforms and intelligent solutions.
          </p>

          {/* Action Buttons Row */}
          <div 
            className={`pt-2 flex flex-wrap items-center gap-4 sm:gap-5 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            {/* Primary Action: Start Your Project */}
            <Link
              href="/contact-us"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#A855F7] hover:from-[#2563EB] hover:to-[#9333EA] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-intel cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Your Project</span>
            </Link>

            {/* Secondary Action: Talk to an Expert */}
            <Link
              href="/contact-us"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-white/95 text-[#6366F1] text-xs sm:text-sm font-medium tracking-wide shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-intel cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent font-semibold">
                Talk to an Expert
              </span>
            </Link>
          </div>

        </div>

        {/* ── Right Column: Showcase Graphic (5 Cols, Same as AI Solutions) ── */}
        <div 
          className={`lg:col-span-5 relative w-full flex justify-center lg:justify-end transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-16 scale-95"
          }`}
        >
          <div className="relative w-full max-w-[580px] lg:max-w-none group animate-float">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(47,137,255,0.3)]">
              <Image
                src="/images/services/salesforce-landing-page_hero-image-1-1.png"
                alt="Custom Development Platform Showcase"
                width={800}
                height={600}
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

      </div>

     
    </section>
  );
}
