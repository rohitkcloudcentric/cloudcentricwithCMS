"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export interface LegacyComparisonItem {
  id: string;
  legacyText: string;
  modernText: string;
  description: string;
}

export const legacyComparisonsData: LegacyComparisonItem[] = [
  {
    id: "infrastructure",
    legacyText: "Legacy Infrastructure",
    modernText: "Cloud Architecture",
    description: "Move from rigid on-premise hardware to scalable, cost-effective cloud services.",
  },
  {
    id: "deployment",
    legacyText: "Manual Deployment",
    modernText: "Automated CI/CD",
    description: "Eliminate human deployment errors with automated pipelines and version control.",
  },
  {
    id: "systems",
    legacyText: "Disconnected Systems",
    modernText: "Connected APIs",
    description: "Replace siloed databases with unified, event-driven API integrations.",
  },
  {
    id: "visibility",
    legacyText: "Limited Visibility",
    modernText: "Real-Time Monitoring",
    description: "Gain complete observability across servers, applications, and network latency.",
  },
  {
    id: "scaling",
    legacyText: "Scaling Challenges",
    modernText: "Elastic Infrastructure",
    description: "Auto-scale resources dynamically to meet surging traffic spikes with zero downtime.",
  },
];

export default function MoveBeyondLegacySection() {
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
      className="w-full bg-[#050505] text-white py-12 sm:py-16 lg:py-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden z-10"
      aria-label="Move Beyond Legacy Infrastructure Section"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-10 lg:space-y-12">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col space-y-4 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          {/* Eyebrow */}
          <p className="font-mono font-semibold text-xs text-[#60A5FA] tracking-[3px] uppercase">
            / MODERNIZE
          </p>

          {/* Main Heading */}
          <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[50px] leading-[1.1] text-white max-w-3xl">
            Move Beyond Legacy Infrastructure
          </h2>

          {/* Paragraph */}
          <p className="font-mono font-normal text-sm sm:text-base text-white/60 max-w-2xl leading-[26px]">
            Modernize aging applications and infrastructure to improve performance, security, scalability, and operational efficiency.
          </p>
        </header>

        {/* 5 Comparison Rows List */}
        <div className="flex flex-col space-y-4 sm:space-y-5" aria-label="Legacy versus Cloud Modernization Comparison">
          {legacyComparisonsData.map((item, idx) => (
            <article
              key={item.id}
              className={`group relative rounded-[18px] bg-[#0D0D14] border border-white/[0.08] p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-[#12121B] hover:-translate-y-0.5 shadow-lg transform ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.99]"
              }`}
              style={{ transitionDelay: `${250 + idx * 80}ms` }}
            >
              {/* Left & Middle Comparison Container */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-14 flex-1">
                
                {/* 1. Legacy Red Dot & Strike-through Text */}
                <div className="flex items-center space-x-3.5 min-w-[220px] sm:min-w-[250px]">
                  <span className="w-3 h-3 rounded-full bg-[#FF6467]/80 flex-shrink-0" aria-hidden="true" />
                  <span className="font-mono text-base sm:text-[18.6px] font-normal line-through text-white/60">
                    {item.legacyText}
                  </span>
                </div>

                {/* 2. Transition Arrow Badge */}
                <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#00D3F2] flex-shrink-0 group-hover:border-[#00D3F2]/40 transition-colors" aria-hidden="true">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* 3. Modern Green Dot & Text */}
                <div className="flex items-center space-x-3.5 min-w-[200px] sm:min-w-[230px]">
                  <span className="w-3 h-3 rounded-full bg-[#00D492] shadow-[0_0_9px_#34D399] flex-shrink-0" aria-hidden="true" />
                  <h3 className="font-duru text-base sm:text-[18.6px] font-normal text-white">
                    {item.modernText}
                  </h3>
                </div>

              </div>

              {/* Far Right Description */}
              <div className="lg:text-right max-w-md flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                <p className="font-mono text-xs sm:text-[15px] font-normal text-white/60 leading-[23px]">
                  {item.description}
                </p>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
