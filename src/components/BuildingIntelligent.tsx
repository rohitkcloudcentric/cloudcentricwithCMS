"use client";

import React, { useState, useEffect, useRef } from "react";

export default function BuildingIntelligent() {
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
    <section 
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8 overflow-hidden"
    >
      {/* Animated Background Image coming from bottom */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
        }`}
        style={{
          backgroundImage: "url('/images/building-intelligent/building-intelligent-bg.png')",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
        }}
      />

      {/* Glow Effect / Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 flex flex-col items-center">
        
        {/* Header Container */}
        <div className={`flex flex-col items-center transition-all duration-800 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`} style={{ transitionDelay: "150ms" }}>
          {/* About Tag with decorative lines */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#7C3AED]" />
            <span 
              className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-[#7C3AED] px-1 font-intel"
            >
              [About]
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#7C3AED]" />
          </div>

          {/* Heading */}
          <h2 
            className="text-3xl md:text-4xl font-normal text-center text-white leading-tight max-w-5xl mb-6 px-4 font-duru"
          >
            Building Intelligent Businesses with AI &<br className="hidden md:inline" /> Cloud Technology
          </h2>

          {/* Description */}
          <p 
            className="text-md md:text-md text-[#94A3B8]/90 text-center max-w-4xl leading-relaxed mb-16 px-4 font-intel"
          >
            We help businesses automate operations, improve customer experiences, and accelerate growth through AI, Salesforce, enterprise software, and cloud solutions.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full px-4">
          
          {/* Card 1 — Comes from Left */}
          <article 
            className={`relative aspect-[477/663] w-full rounded-[24px] border border-white/10 overflow-hidden flex flex-col justify-start p-8 transition-all duration-800 ease-out hover:-translate-y-2 hover:border-[#7C3AED]/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] group transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
            }`}
            style={{
              backgroundImage: "url('/images/building-intelligent/Container-1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transitionDelay: "200ms",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <h3 
                className="text-lg md:text-xl font-medium text-white group-hover:text-[#A78BFA] transition-colors duration-300 font-duru"
              >
                AI-First Innovation
              </h3>
              <p 
                className="text-xs md:text-[13px] text-[#94A3B8] leading-relaxed font-intel"
              >
                We build intelligent AI solutions that automate repetitive work, improve productivity, and help businesses make faster, smarter decisions.
              </p>
            </div>
          </article>

          {/* Card 2 — Comes from Bottom */}
          <article 
            className={`relative aspect-[477/663] w-full rounded-[24px] border border-white/10 overflow-hidden flex flex-col justify-start p-8 transition-all duration-800 ease-out hover:-translate-y-2 hover:border-[#7C3AED]/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] group transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
            style={{
              backgroundImage: "url('/images/building-intelligent/Container-2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transitionDelay: "400ms",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <h3 
                className="text-lg md:text-xl font-medium text-white group-hover:text-[#A78BFA] transition-colors duration-300 font-duru"
              >
                Enterprise Technology
              </h3>
              <p 
                className="text-xs md:text-[13px] text-[#94A3B8] leading-relaxed font-intel"
              >
                From Salesforce CRM to custom software and cloud applications, we deliver scalable technology tailored to your business goals.
              </p>
            </div>
          </article>

          {/* Card 3 — Comes from Right */}
          <article 
            className={`relative aspect-[477/663] w-full rounded-[24px] border border-white/10 overflow-hidden flex flex-col justify-start p-8 transition-all duration-800 ease-out hover:-translate-y-2 hover:border-[#7C3AED]/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] group transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
            style={{
              backgroundImage: "url('/images/building-intelligent/Container-3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transitionDelay: "600ms",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <h3 
                className="text-lg md:text-xl font-medium text-white group-hover:text-[#A78BFA] transition-colors duration-300 font-duru"
              >
                Trusted Partnership
              </h3>
              <p 
                className="text-xs md:text-[13px] text-[#94A3B8] leading-relaxed font-intel"
              >
                More than a technology provider—we become your long-term innovation partner with continuous support and optimization.
              </p>
            </div>
          </article>

        </div>

      </div>
    </section>
  );
}
