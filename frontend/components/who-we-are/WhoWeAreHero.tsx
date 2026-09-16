"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WhoWeAreHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full max-w-7xl mx-auto px-6 pt-28 sm:pt-16 md:pt-16 pb-28 md:pb-40 lg:pb-48 z-10">
      {/* Top Text Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-12 md:mb-16 lg:mb-20">
        {/* Left Column: Heading — Comes from Left */}
        <div className={`md:col-span-7 transition-all duration-800 ease-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
        }`} style={{ transitionDelay: "150ms" }}>
          <h1 
            className="text-3xl sm:text-[44px] md:text-[50px] lg:text-[54px] font-normal leading-[1.12] text-white tracking-tight font-duru"
          >
            Engineering Intelligent <br className="hidden sm:inline" />
            Businesses Through AI & <br className="hidden sm:inline" />
            Innovation
          </h1>
        </div>

        {/* Right Column: Description — Comes from Right */}
        <div className={`md:col-span-5 md:pt-4 transition-all duration-800 ease-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
        }`} style={{ transitionDelay: "300ms" }}>
          <p 
            className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed max-w-[500px] font-intel"
          >
            For over a decade, CloudCentric has helped businesses embrace digital transformation through AI, Salesforce, enterprise software, and cloud technologies. We create secure, scalable, and future-ready solutions that solve real business challenges and accelerate growth.
          </p>
        </div>
      </div>

      {/* Image & Overlapping Card Container */}
      <div className="relative w-full">
        {/* Workspace Photo Card Wrapper — Comes from Bottom */}
        <div className={`relative w-full aspect-[16/10] md:aspect-[2.35/1] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/[0.08] transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`} style={{ transitionDelay: "450ms" }}>
          <Image
            src="/images/how-we-are/how-we-hero-card.png"
            alt="CloudCentric Team Collaboration Workspace"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlapping Info Card — Comes from Right */}
        <div className={`absolute bottom-0 translate-y-1/2 left-1/2 w-[92%] sm:w-[90%] max-w-[1020px] bg-white text-[#0f172a] rounded-[24px] md:rounded-[32px] p-6 sm:p-8 md:p-10 lg:py-12 lg:px-14 shadow-[0_25px_50px_rgba(0,0,0,0.75)] z-20 border border-slate-100 flex flex-col md:flex-row md:justify-between gap-6 md:gap-12 lg:gap-16 items-center transition-all duration-900 ease-out transform ${
          isVisible ? "opacity-100 -translate-x-1/2" : "opacity-0 -translate-x-[35%]"
        }`} style={{ transitionDelay: "650ms" }}>
          {/* Card Left: Label & Title */}
          <div className="flex-1 space-y-2">
            <span 
              className="text-[10px] sm:text-sm font-black tracking-[0.15em] text-[#000000] uppercase block font-intel"
            >
              ABOUT CLOUDCENTRIC
            </span>
            <h2 
              className="text-xl sm:text-2xl md:text-[28px] lg:text-[40px] font-normal text-[#0f172a] leading-[1.2] tracking-tight font-sans"
            >
              Building The Future Of <br className="hidden sm:inline" />
              <span className="font-semibold">Business With AI</span>
            </h2>
          </div>

          {/* Card Right: Description & Action Link */}
          <div className="flex-1 flex flex-col justify-between h-full md:pt-6">
            <p 
              className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal font-intel"
            >
              CloudCentric is an AI-first technology company empowering organizations with intelligent automation, Salesforce expertise, enterprise software, and innovative digital products. We partner with businesses to transform ideas into scalable, high-impact solutions.
            </p>
            <div className="mt-4 md:mt-6">
              <Link 
                href="/discover"
                className="inline-flex items-center space-x-2 text-sm md:text-[15px] font-normal text-[#0f172a] border-b border-[#0f172a] pb-1 hover:text-[#7C3AED] hover:border-[#7C3AED] transition-all duration-300 group"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
