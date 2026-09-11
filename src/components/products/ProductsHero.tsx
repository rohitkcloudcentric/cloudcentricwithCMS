"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductsHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[440px] sm:min-h-[500px] flex flex-col justify-between -mt-[96px] sm:-mt-[104px] pt-[120px] sm:pt-[140px] pb-8 px-6 sm:px-10  bg-[#050505] text-white overflow-hidden z-0">
      {/* Background Hero Image & Gradient Treatment */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/blogs/blog-hero-bg.png"
          alt="Products Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-all duration-1000 ease-out ${
            mounted ? "opacity-95 scale-100" : "opacity-0 scale-105"
          }`}
        />
        {/* Top & Bottom gradient fade overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-10 sm:pt-14 flex flex-col space-y-6">
        <h1 
          className={`text-3xl sm:text-5xl lg:text-[48px] font-normal text-white leading-[1.15] tracking-tight font-duru transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Innovative Solutions Tailored for Your Business Growth
        </h1>

        <p 
          className={`text-sm sm:text-base lg:text-lg text-white/70 max-w-3xl leading-relaxed font-light font-intel transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Explore our suite of Salesforce-powered and custom-built products designed to streamline operations, improve productivity, and scale your business.
        </p>
      </div>
      
      {/* Simple Bottom Spacing block */}
      <div className="h-6 sm:h-12" />
    </section>
  );
}
