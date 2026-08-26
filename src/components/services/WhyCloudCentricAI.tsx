"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lightbulb, Briefcase, Network, Rocket } from "lucide-react";

export const whyCloudCentricCards = [
  {
    id: "ai-first-thinking",
    icon: Lightbulb,
    title: "AI-First Thinking",
    description: "We focus on practical AI opportunities that create measurable business value.",
  },
  {
    id: "business-tech-expertise",
    icon: Briefcase,
    title: "Business + Technology Expertise",
    description: "We understand both the business challenge and the technology required to solve it.",
  },
  {
    id: "enterprise-integration",
    icon: Network,
    title: "Enterprise Integration",
    description: "Our Salesforce and enterprise technology experience helps AI work within your existing ecosystem.",
  },
  {
    id: "end-to-end-delivery",
    icon: Rocket,
    title: "End-to-End Delivery",
    description: "From strategy and proof of concept to development, deployment, and optimization.",
  },
];

export default function WhyCloudCentricAI() {
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
      className="w-full bg-[#050505] text-white py-10 sm:py-12 lg:py-14 px-5 sm:px-8 z-10 overflow-hidden"
      aria-label="Why CloudCentric Section"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-10 lg:space-y-12">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col space-y-3 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[3px] text-[#A78BFA] font-intel">
            / WHY CLOUDCENTRIC
          </p>
          <h2 className="text-[30px] sm:text-[40px] lg:text-[48px] font-normal leading-[1.15] text-white max-w-4xl font-duru">
            AI Expertise With Enterprise<br className="hidden sm:inline" /> Technology Experience
          </h2>
        </header>

        {/* 2x2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {whyCloudCentricCards.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`group relative rounded-[20px] bg-[#0C0C10] border border-white/[0.08] p-7 sm:p-8 flex items-start space-x-5 transition-all duration-500 hover:border-[#7C3AED]/40 hover:bg-[#111118] hover:-translate-y-1 cursor-pointer shadow-lg transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${250 + idx * 100}ms` }}
              >
                {/* Left Icon Container */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#A855F7] shrink-0 group-hover:scale-105 group-hover:bg-[#7C3AED]/25 transition-all duration-300">
                  <IconComponent className="w-6 h-6 stroke-[1.75]" />
                </div>

                {/* Right Text Content */}
                <div className="flex flex-col space-y-1.5 pt-0.5">
                  <h3 className="text-lg sm:text-[21px] font-normal text-white tracking-wide font-duru group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[14.5px] font-light leading-relaxed text-[#A1A1AA] font-intel">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
