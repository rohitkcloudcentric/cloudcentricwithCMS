"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function SalesforceServiceHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] flex flex-col justify-center -mt-[96px] sm:-mt-[104px] pt-[130px] sm:pt-[150px] lg:pt-[160px] pb-16 px-6 sm:px-10 lg:px-16 bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Background Hero Image & Gradient Treatment (Matches Blog Hero BG) ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/blogs/blog-hero-bg.png"
          alt="Salesforce Services Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-all duration-1000 ease-out ${
            mounted ? "opacity-95 scale-100" : "opacity-0 scale-105"
          }`}
        />
        {/* Top, Bottom & Radial Glow Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* ── Left Column: Text & CTAs (7 Cols) ── */}
        <div className="lg:col-span-7 flex flex-col space-y-6 sm:space-y-7">
          
          {/* Subtitle / Category Badge */}
          <div 
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.2em] text-white uppercase font-intel">
              SALESFORCE SERVICES
            </span>
          </div>

          {/* Main Title & Tagline */}
          <div 
            className={`flex flex-col space-y-3 transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-normal text-white leading-[1.1] tracking-tight font-duru">
              Grow Faster With Salesforce
            </h1>
            
            <p className="text-sm sm:text-lg lg:text-[19px] font-normal text-white leading-snug font-intel">
              Transform Your CRM. Automate Your Business. Accelerate Growth.
            </p>
          </div>

          {/* Body Description */}
          <p 
            className={`text-xs sm:text-sm lg:text-base text-white leading-relaxed max-w-2xl font-intel font-light transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            We help businesses maximize Salesforce with strategy, implementation, development, integration, and intelligent automation. From optimizing your existing CRM to building a connected Salesforce ecosystem, we turn Salesforce into a powerful engine for growth.
          </p>

          {/* Feature Bullet Points */}
          <ul 
            className={`space-y-3 pt-1 transition-all text-white duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            {[
              "10+ Years Salesforce Expertise",
              "400+ Successful Projects",
              "Certified Salesforce Experts",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3 text-xs sm:text-sm text-white/90 font-intel group cursor-default">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#38BDF8] group-hover:scale-125 transition-transform duration-300" />
                <span className="font-medium tracking-wide group-hover:text-white transition-colors duration-300">{item}</span>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div 
            className={`pt-3 flex flex-wrap items-center gap-4 sm:gap-5 transition-all duration-1000 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            {/* Primary Gradient Button */}
            <Link
              href="/contact-us"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#A855F7] hover:from-[#2563EB] hover:to-[#9333EA] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-intel cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
              <span>Talk to a Salesforce Expert</span>
            </Link>

            {/* Secondary Button with Gradient Border & Text */}
            <Link
              href="/contact-us"
              className="inline-flex flex-row items-center justify-center w-[242px] h-[48px] p-[1px] gap-2 rounded-[5px] bg-gradient-to-r from-[#2F89FF] to-[#B021F0] shadow-md hover:shadow-[0_0_20px_rgba(47,137,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            >
              <span className="w-full h-full bg-white rounded-[4px] flex items-center justify-center px-3 py-2 gap-2">
                <span className="w-[182px] h-[22px] font-duru font-normal text-base leading-[22px] tracking-[-0.05em] flex items-center justify-center text-center bg-gradient-to-r from-[#2F89FF] to-[#B021F0] bg-clip-text text-transparent">
                  Schedule a Consultation
                </span>
              </span>
            </Link>
          </div>

        </div>

        {/* ── Right Column: Salesforce Browser & Dashboard Graphic (5 Cols) ── */}
        <div 
          className={`lg:col-span-5 relative w-full flex justify-center lg:justify-end transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-16 scale-95"
          }`}
        >
          <div className="relative w-full max-w-[580px] lg:max-w-none group animate-float">
          
            {/* Salesforce UI Image Graphic */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(47,137,255,0.3)]">
              <Image
                src="/images/services/salesforce-landing-page_hero-image-1 1.png"
                alt="Salesforce Platform and Ecosystem Showcase"
                width={800}
                height={600}
                priority
                className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
