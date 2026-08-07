"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WhatWeDoHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#050505] text-white overflow-hidden py-20 sm:py-28 lg:py-36 z-10">
      {/* ── Main Full-Width Hero Background Image ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image
          src="/images/what we-do/what-we-can-do-bg.png"
          alt="What We Do Background"
          fill
          className="object-cover object-center opacity-90"
          priority
        />
        {/* Subtle radial glow & dark fade overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
      </div>

      {/* ── Decorative Absolute Shape 1 (Top Right Metallic Coil / Ornament) ── */}
      <div className="absolute top-12 sm:top-16 right-4 sm:right-10 w-24 sm:w-36 h-auto pointer-events-none z-10 opacity-80 animate-pulse duration-3000">
        <Image
          src="/images/what we-do/shape-1.svg"
          alt="Decorative Shape 1"
          width={142}
          height={153}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* ── Decorative Absolute Shape 2 (Bottom Right Metallic 3D Sphere/Cage) ── */}
      <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-16 w-56 sm:w-80 md:w-[260px] h-auto pointer-events-none z-10 opacity-90 transition-transform duration-700 hover:scale-105">
        <Image
          src="/images/what we-do/shape-2.svg"
          alt="Decorative Shape 2"
          width={339}
          height={315}
          className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(124,58,237,0.3)]"
        />
      </div>

      {/* ── Hero Content Container ── */}
      <div
        className={`relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6 sm:space-y-8 transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Main Heading */}
        <h1
          className="text-3xl sm:text-5xl lg:text-[52px] font-normal leading-[1.15] text-white tracking-tight max-w-6xl"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          Intelligent Technology Solutions for{" "} <br />
          <span
            className="block sm:inline font-normal bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent"
          >
            Modern Businesses
          </span>
        </h1>

        {/* Supporting Description */}
        <p
          className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed max-w-5xl mx-auto tracking-wide"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          We help organizations harness the power of AI, Salesforce, enterprise software, cloud technologies, and digital engineering to automate operations, accelerate growth, and deliver exceptional customer experiences.
        </p>

        {/* CTA Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 sm:pt-4">
          {/* Button 1: Explore Our Services */}
          <Link
            href="#services"
            className="px-7 py-3 rounded-full bg-[#0A0A0E]/80 border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide hover:border-white/40 hover:bg-[#111116] transition-all duration-300 shadow-lg active:scale-95"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            Explore Our Services
          </Link>

          {/* Button 2: Talk to an Expert */}
          <Link
            href="#contact"
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] text-white text-xs sm:text-sm font-semibold tracking-wide hover:opacity-95 transition-all duration-300 shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            Talk to an Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
