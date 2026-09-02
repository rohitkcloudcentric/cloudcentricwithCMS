"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export interface ServiceHeroBullet {
  title: string;
  subtitle: string;
  dotColor?: string;
}

export interface ServiceHeroCta {
  text: string;
  href: string;
  ariaLabel?: string;
  icon?: React.ElementType;
}

export interface CommonServiceHeroProps {
  eyebrow: string;
  eyebrowColor?: string;
  title: React.ReactNode;
  tagline?: string;
  description: React.ReactNode;
  primaryCta?: ServiceHeroCta;
  secondaryCta?: ServiceHeroCta;
  showcaseImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  bullets?: ServiceHeroBullet[] | string[];
  bulletsGridCols?: string;
  bgImage?: string;
  sectionAriaLabel?: string;
  minHeightClass?: string;
}

export default function CommonServiceHero({
  eyebrow,
  eyebrowColor = "#38BDF8",
  title,
  tagline,
  description,
  primaryCta = {
    text: "Start Your Project",
    href: "/contact-us",
  },
  secondaryCta,
  showcaseImage,
  bullets,
  bulletsGridCols,
  bgImage = "/images/blogs/blog-hero-bg.png",
  sectionAriaLabel = "Service Hero Section",
  minHeightClass = "min-h-[580px] sm:min-h-[640px] lg:min-h-[700px]",
}: CommonServiceHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const PrimaryIcon = primaryCta?.icon || Sparkles;

  return (
    <section
      className={`relative w-full ${minHeightClass} flex flex-col justify-center -mt-[96px] sm:-mt-[104px] pt-[135px] sm:pt-[150px] lg:pt-[160px] pb-8 sm:pb-12 px-6 sm:px-10 lg:px-16 bg-[#030306] text-white overflow-hidden z-0`}
      aria-label={sectionAriaLabel}
    >
      {/* ── Background Hero Image & Ambient Glowing Gradients ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0" aria-hidden="true">
        <Image
          src={bgImage}
          alt=""
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

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6">
        
        {/* ── Left Column: Text & CTAs ── */}
        <div className={showcaseImage ? "lg:col-span-7 flex flex-col space-y-6 sm:space-y-7" : "lg:col-span-12 flex flex-col space-y-6 sm:space-y-7 max-w-4xl"}>

          
          {/* Eyebrow / Sub-label */}
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <p
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] font-mono flex items-center space-x-2"
              style={{ color: eyebrowColor }}
            >
              <span style={{ color: eyebrowColor }}>/</span>
              <span>{eyebrow}</span>
            </p>
          </div>

          {/* Main Title */}
          <div
            className={`flex flex-col space-y-2 transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-[46px] xl:text-[54px] font-medium leading-[1.12] text-white tracking-tight font-duru">
              {title}
            </h1>
          </div>

          {/* Optional Tagline Sub-heading */}
          {tagline && (
            <div
              className={`transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
              }`}
            >
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-200 tracking-wide font-mono">
                {tagline}
              </p>
            </div>
          )}

          {/* Body Paragraph(s) */}
          <div
            className={`text-xs sm:text-sm lg:text-base text-[#94A3B8] leading-relaxed max-w-2xl font-intel font-light transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>

          {/* Action Buttons Row */}
          <div
            className={`pt-2 flex flex-wrap items-center gap-4 sm:gap-5 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-14"
            }`}
          >
            {primaryCta && (
              <Link
                href={primaryCta.href}
                aria-label={primaryCta.ariaLabel || primaryCta.text}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#A855F7] hover:from-[#2563EB] hover:to-[#9333EA] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.45)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-intel cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <PrimaryIcon className="w-4 h-4 text-cyan-200" aria-hidden="true" />
                <span>{primaryCta.text}</span>
              </Link>
            )}

            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                aria-label={secondaryCta.ariaLabel || secondaryCta.text}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-white/95 text-[#6366F1] text-xs sm:text-sm font-medium tracking-wide shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-intel cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent font-semibold">
                  {secondaryCta.text}
                </span>
              </Link>
            )}
          </div>

        </div>

        {/* ── Right Column: Showcase Graphic (5 Cols) ── */}
        {showcaseImage && (
          <div
            className={`lg:col-span-5 relative w-full flex justify-center lg:justify-end transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-16 scale-95"
            }`}
          >
            <div className="relative w-full max-w-[580px] lg:max-w-none group animate-float">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(47,137,255,0.3)]">
                <Image
                  src={showcaseImage.src}
                  alt={showcaseImage.alt}
                  width={showcaseImage.width || 800}
                  height={showcaseImage.height || 600}
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Bullets Highlights ── */}
      {bullets && bullets.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 sm:pt-6">
          {typeof bullets[0] === "string" ? (
            /* String array layout (like AI solutions) */
            <div
              className={`pt-6 pb-2 border-t border-white/[0.08] transition-all duration-1000 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className={bulletsGridCols || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-white/80 font-intel font-light"}>
                {(bullets as string[]).map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-[2px] bg-[#A855F7] shrink-0 shadow-[0_0_8px_#A855F7]" aria-hidden="true" />
                    <span className="tracking-wide text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Structured bullets layout (like Growth & Cloud integration) */
            <div
              className={`grid ${bulletsGridCols || "grid-cols-1 sm:grid-cols-3"} gap-6 max-w-3xl border-t border-white/10 pt-6 transition-all duration-1000 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {(bullets as ServiceHeroBullet[]).map((bullet, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{
                        backgroundColor: bullet.dotColor || "#38BDF8",
                        color: bullet.dotColor || "#38BDF8",
                      }}
                      aria-hidden="true"
                    />
                    <h3 className="text-xs sm:text-sm font-semibold text-white font-intel">{bullet.title}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#94A3B8] font-mono pl-4">{bullet.subtitle}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
