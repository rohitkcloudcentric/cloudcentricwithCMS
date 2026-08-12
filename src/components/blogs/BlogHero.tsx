"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export const BLOG_CATEGORIES = [
  "All",
  "AI & Automation",
  "Salesforce",
  "Digital Transformation",
  "Technology",
  "Product",
  "Insights",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

interface BlogHeroProps {
  activeCategory: BlogCategory;
  onSelectCategory: (category: BlogCategory) => void;
}

export default function BlogHero({ activeCategory, onSelectCategory }: BlogHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[540px] flex flex-col justify-between -mt-[96px] sm:-mt-[104px] pt-[120px] sm:pt-[140px] pb-8 px-6 sm:px-10 lg:px-16 bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Background Hero Image & Gradient Treatment ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/blogs/blog-hero-bg.png"
          alt="Articles & Insights Background"
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

      {/* ── Main Hero Content with Staggered Entrance Animations ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-6 sm:pt-10 flex flex-col space-y-6">
        <h1 
          className={`text-3xl sm:text-5xl lg:text-[58px] font-normal text-white leading-[1.1] tracking-tight font-duru transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Articles &amp; Insights
        </h1>

        <p 
          className={`text-xs sm:text-sm lg:text-base text-white/75 max-w-3xl leading-relaxed font-normal font-intel transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Explore insights, ideas, and practical perspectives on AI, Salesforce, digital transformation, and emerging technologies helping businesses make smarter technology decisions.
        </p>
      </div>

      {/* ── Category Navigation Bar at Bottom of Hero ── */}
      <div 
        className={`relative z-10 max-w-7xl mx-auto w-full pt-12 sm:pt-16 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar pt-3 pb-2">
          {BLOG_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                aria-pressed={isActive}
                className={`relative whitespace-nowrap text-xs sm:text-sm font-intel transition-all duration-200 cursor-pointer pt-3 ${
                  isActive
                    ? "text-white font-medium"
                    : "text-white/50 hover:text-white/80 font-normal"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-[2px] bg-white/90 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
