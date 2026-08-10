"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function OurAICapabilities() {
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 z-10"
      aria-label="Our AI Capabilities"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Section Header */}
        <div
          className={`flex flex-col space-y-3 transition-all duration-800 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Top Label */}
          <p
            className="text-xs font-semibold uppercase tracking-widest text-white/50"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            / OUR AI CAPABILITIES
          </p>

          {/* Section Heading */}
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight text-white max-w-3xl"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            AI Solutions Built for Real Business Impact
          </h2>
        </div>

        {/* Feature Card - AI Strategy & Consulting */}
        <div
          className={`relative rounded-[24px] bg-[#0E0E12]/90 border border-white/[0.08] p-3 sm:p-5 lg:p-8 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              {/* Feature Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center p-2.5 shadow-inner">
                <Image
                  src="/images/what we-do/ai-strategy-icon.svg"
                  alt="AI Strategy & Consulting Icon"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl font-normal text-white tracking-wide"
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                AI Strategy &amp; Consulting
              </h3>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  AI READINESS
                </span>
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  AI ROADMAP AND ROI MODELING
                </span>
              </div>

              {/* Supporting Description */}
              <p
                className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg pt-2"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                Identify the right AI opportunities, define a practical roadmap, and build an adoption strategy aligned with your business goals.
              </p>
            </div>

            {/* Right Illustration Area */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[340px] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/what we-do/ai-strategy-card-1.png"
                  alt="AI Strategy 3D Cone & Network Diagram"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Card - AI Automation Solutions */}
        <div
          className={`relative rounded-[24px] bg-[#0E0E12]/90 border border-white/[0.08] p-3 sm:p-5 lg:p-8 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Illustration Area */}
            <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-1">
              <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[340px] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/what we-do/ai-automation.png"
                  alt="AI Automation Infinity Loop & Network Diagram"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-6 flex flex-col space-y-6 order-1 lg:order-2">
              {/* Feature Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center p-2.5 shadow-inner">
                <Image
                  src="/images/what we-do/ai-automation-icon.svg"
                  alt="AI Automation Solutions Icon"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl font-normal text-white tracking-wide"
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                AI Automation Solutions
              </h3>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  AI AGENTS &amp; WORKFLOW
                </span>
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  INTELLIGENT PROCESS AUTOMATION
                </span>
              </div>

              {/* Supporting Description */}
              <p
                className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg pt-2"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                Automate repetitive work, streamline operations, and improve productivity with intelligent AI-powered workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Card - Custom AI Development */}
        <div
          className={`relative rounded-[24px] bg-[#0E0E12]/90 border border-white/[0.08] p-3 sm:p-5 lg:p-8 overflow-hidden hover:border-white/20 transition-all duration-300 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              {/* Feature Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center p-2.5 shadow-inner">
                <Image
                  src="/images/what we-do/custom-ai-dev-icon.svg"
                  alt="Custom AI Development Icon"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className="text-2xl sm:text-3xl font-normal text-white tracking-wide"
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                Custom AI Development
              </h3>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  GENERATIVE AI
                </span>
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  CUSTOM LLMS
                </span>
                <span
                  className="px-3.5 py-1.5 rounded-full bg-[#181621]/80 border border-white/15 text-[11px] font-medium tracking-wider text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  ENTERPRISE AI
                </span>
              </div>

              {/* Supporting Description */}
              <p
                className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg pt-2"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                Design and develop secure AI applications tailored to your business, powered by the latest language models and enterprise technologies.
              </p>
            </div>

            {/* Right Illustration Area */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[340px] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/what we-do/custom-ai-development.png"
                  alt="Custom AI Development Neural Brain Diagram"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
