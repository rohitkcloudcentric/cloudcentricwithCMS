"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Users, Cpu, LineChart, ArrowUpRight } from "lucide-react";

export interface AIGrowthCardItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  tag: string;
}

export const aiGrowthCardsData: AIGrowthCardItem[] = [
  {
    id: "ai-content-assistance",
    icon: Sparkles,
    iconColor: "#F472B6",
    title: "AI Content Assistance",
    description: "Accelerate market research, content ideation, copy generation, and asset creation.",
    tag: "SMART ADVANTAGE",
  },
  {
    id: "personalized-experiences",
    icon: Users,
    iconColor: "#60A5FA",
    title: "Personalized Experiences",
    description: "Deliver dynamic, personalized digital experiences tailored to user segments and real-time behavior.",
    tag: "SMART ADVANTAGE",
  },
  {
    id: "marketing-automation",
    icon: Cpu,
    iconColor: "#A78BFA",
    title: "Marketing Automation",
    description: "Automate repetitive campaign triggers, audience segmentation, and multi-channel workflows.",
    tag: "SMART ADVANTAGE",
  },
  {
    id: "intelligent-insights",
    icon: LineChart,
    iconColor: "#34D399",
    title: "Intelligent Insights",
    description: "Use predictive analytics and machine learning to understand customer behavior and optimize campaign ROI.",
    tag: "SMART ADVANTAGE",
  },
];

export default function AIGrowthExperienceSection() {
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
      aria-label="Make Your Growth Smarter With AI"
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
          <p className="font-mono font-semibold text-xs text-[#C084FC] tracking-[3px] uppercase">
            / AI + DIGITAL EXPERIENCE
          </p>

          {/* Main Heading */}
          <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[50px] leading-[1.1] text-white max-w-3xl">
            Make Your Growth Smarter With AI
          </h2>

          {/* Paragraph */}
          <p className="font-mono font-normal text-sm sm:text-base text-white/60 max-w-2xl leading-[26px]">
            Bring AI into your marketing and digital experience to create personalized content, automate workflows, and gain predictive insights.
          </p>
        </header>

        {/* 4 Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiGrowthCardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <article
                key={item.id}
                className={`group relative rounded-[16px] bg-[#0D0D14] border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-[#12121B] hover:-translate-y-1.5 shadow-xl transform ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
                }`}
                style={{ transitionDelay: `${250 + idx * 90}ms` }}
              >
                <div className="flex flex-col space-y-4">
                  {/* Square Rounded Icon Badge */}
                  <div className="w-[48px] h-[48px] rounded-[12px] bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-white/20" aria-hidden="true">
                    <IconComponent 
                      className="w-[24px] h-[24px] stroke-[1.85]" 
                      style={{ color: item.iconColor }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-duru text-xl sm:text-[20px] font-normal text-white leading-[28px]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-mono text-xs sm:text-sm text-white/60 leading-[23px]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Border Tag */}
                <div className="border-t border-white/[0.06] pt-4 mt-2">
                  <span className="font-mono text-[12px] font-normal tracking-[1.2px] uppercase text-white/40">
                    {item.tag}
                  </span>
                </div>

              </article>
            );
          })}
        </div>

        {/* Bottom Link Row: Explore AI Solutions */}
        <div className="pt-2">
          <Link
            href="/service/ai-solutions"
            aria-label="Explore AI Solutions - CloudCentric AI Services"
            className="inline-flex items-center space-x-2 font-mono font-semibold text-sm text-[#C084FC] hover:text-[#D8B4FE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md"
          >
            <span>Explore AI Solutions</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </section>
  );
}
