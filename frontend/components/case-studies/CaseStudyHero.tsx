"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const CASE_STUDY_CATEGORIES = [
  "All",
  "AI & Automation",
  "Salesforce",
  "Digital Transformation",
  "Technology",
  "Product",
] as const;

export type CaseStudyCategory = (typeof CASE_STUDY_CATEGORIES)[number];

interface CaseStudyHeroProps {
  activeCategory: CaseStudyCategory;
  onSelectCategory: (category: CaseStudyCategory) => void;
}

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

function CountUp({ end, duration = 1800, suffix = "", decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic formula for smooth slowdown at end
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeOutProgress * end;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function CaseStudyHero({ activeCategory, onSelectCategory }: CaseStudyHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] flex flex-col justify-between -mt-[96px] sm:-mt-[104px] pt-[130px] sm:pt-[150px] pb-10 px-6 sm:px-10  bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Background Hero Image & Gradient Treatment ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/case-studies/case-studies-hero-bg.png"
          alt="Our Work in Action Hero Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center rounded-2xl transition-all duration-1000 ease-out ${
            mounted ? "opacity-95 scale-100" : "opacity-0 scale-105"
          }`}
        />
        {/* Top & Bottom gradient fade overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      </div>

      {/* ── Main Hero Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col space-y-8">
        {/* Main Heading & Intro Subtitle */}
        <div className="flex flex-col space-y-4 max-w-3xl">
          <h1 
            className={`text-4xl sm:text-5xl lg:text-[62px] font-normal text-white leading-[1.1] tracking-tight font-duru transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Our Work in Action
          </h1>

          <p 
            className={`text-xs sm:text-sm lg:text-base text-white/70 max-w-2xl leading-relaxed font-normal font-intel-one-mono transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            Explore how we help businesses use AI, Salesforce, and modern technology to solve complex challenges, improve operations, and accelerate growth.
          </p>
        </div>

        {/* ── Key Statistics Row with CountUp Animation ── */}
        <div 
          className={`grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-2 pb-4 max-w-4xl transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white font-duru">
              <CountUp end={10} suffix="+" />
            </span>
            <span 
              className="text-xs sm:text-sm text-white/60 font-intel-one-mono"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Years of Innovation
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white font-duru">
              <CountUp end={400} suffix="+" />
            </span>
            <span 
              className="text-xs sm:text-sm text-white/60 font-intel-one-mono"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Projects Delivered
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white font-duru">
              <CountUp end={100} suffix="+" />
            </span>
            <span 
              className="text-xs sm:text-sm text-white/60 font-intel-one-mono"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Technology Experts
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white font-duru">
              <CountUp end={4.9} decimals={1} suffix="★" />
            </span>
            <span 
              className="text-xs sm:text-sm text-white/60 font-intel-one-mono"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Client Satisfaction
            </span>
          </div>
        </div>

        {/* ── Book Consultation Button ── */}
        <div 
          className={`pt-1 transition-all duration-1000 delay-450 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/contact-us"
            className="inline-flex items-center space-x-5 pl-6 pr-1.5 py-1.5 rounded-[14px] bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-md"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            <span>BOOK AN CONSULTATION</span>
            <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-white text-[#3B82F6] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
              <MoveRight className="w-5 h-5 stroke-[2] text-[#3B82F6]" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── Category Navigation Bar at Bottom of Hero ── */}
      <div 
        className={`relative z-10 max-w-7xl mx-auto w-full pt-16 sm:pt-20 transition-all duration-1000 delay-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex items-center justify-center space-x-8 sm:space-x-12 overflow-x-auto no-scrollbar py-3 border-t border-white/5">
          {CASE_STUDY_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                aria-pressed={isActive}
                className={`relative whitespace-nowrap text-xs sm:text-sm transition-all duration-200 cursor-pointer py-1 font-intel-one-mono ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/50 hover:text-white/80 font-normal"
                }`}
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {isActive && (
                  <span className="absolute -top-[13px] left-0 right-0 h-[2.5px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
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
