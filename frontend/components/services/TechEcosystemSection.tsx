"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cloud, Terminal, Link as LinkIcon, Database, Activity } from "lucide-react";

export interface TechEcosystemCardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  pills: string[];
}

export const techEcosystemCardsData: TechEcosystemCardItem[] = [
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud",
    pills: ["AWS", "Microsoft Azure", "Google Cloud", "Salesforce Cloud"],
  },
  {
    id: "devops",
    icon: Terminal,
    title: "DevOps",
    pills: ["Docker", "CI/CD", "Git", "Infrastructure Automation"],
  },
  {
    id: "apis-integration",
    icon: LinkIcon,
    title: "APIs & Integration",
    pills: ["REST", "JSON", "Webhooks", "Microservices"],
  },
  {
    id: "databases",
    icon: Database,
    title: "Databases",
    pills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    id: "monitoring",
    icon: Activity,
    title: "Monitoring",
    pills: ["Application Monitoring", "Infrastructure Monitoring", "Logging"],
  },
];

export default function TechEcosystemSection() {
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
      className="w-full bg-[#050505] text-white py-12 sm:py-16 lg:py-20 px-6 sm:px-10  relative overflow-hidden z-10"
      aria-label="Powered by Modern Cloud & Integration Technologies"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
        
        {/* Section Header (Centered) */}
        <header 
          className={`flex flex-col items-center text-center space-y-4 max-w-3xl transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          {/* Eyebrow */}
          <p className="font-mono font-semibold text-xs text-[#60A5FA] tracking-[3px] uppercase">
            / TECH ECOSYSTEM
          </p>

          {/* Main Heading */}
          <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[46px] leading-[1.15] text-white">
            Powered by Modern Cloud & Integration Technologies
          </h2>

          {/* Paragraph */}
          <p className="font-mono font-normal text-sm sm:text-base text-white/60 leading-[23px]">
            We leverage industry-standard frameworks, tools, and platforms to build secure, robust environments.
          </p>
        </header>

        {/* 5 Cards Grid Layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {techEcosystemCardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <article
                key={item.id}
                className={`group relative rounded-[18.6px] bg-[#0D0D14] border border-white/[0.07] p-7 sm:p-8 flex flex-col space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-[#12121B] hover:-translate-y-1.5 shadow-xl transform ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
                }`}
                style={{ transitionDelay: `${250 + idx * 90}ms` }}
              >
                {/* Header Row: Icon + Title */}
                <div className="flex items-center space-x-3.5 pb-4 border-b border-white/[0.06]">
                  <IconComponent className="w-6 h-6 text-[#60A5FA] stroke-[1.75]" aria-hidden="true" />
                  <h3 className="font-duru text-xl sm:text-[21px] font-normal text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Pills Row */}
                <div className="flex flex-wrap gap-2.5 pt-1" aria-label={`${item.title} technologies`}>
                  {item.pills.map((pillText, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-3.5 py-1.5 rounded-[9.3px] bg-white/[0.04] border border-white/[0.08] font-mono text-xs sm:text-[14px] text-white/80 transition-colors group-hover:border-white/15"
                    >
                      {pillText}
                    </span>
                  ))}
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
