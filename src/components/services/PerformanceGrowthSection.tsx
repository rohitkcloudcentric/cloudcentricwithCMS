"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Globe, Share2, TrendingUp } from "lucide-react";

export interface PerformanceGrowthCardItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  tags: string;
  description: string;
}

export const performanceGrowthCardsData: PerformanceGrowthCardItem[] = [
  {
    id: "organic-growth",
    icon: Search,
    iconColor: "#34D399",
    title: "Organic Growth",
    tags: "SEO · Content · Search Visibility",
    description: "Build sustainable inbound organic traffic through technical SEO, keyword research, and high-value content architecture.",
  },
  {
    id: "paid-growth",
    icon: Globe,
    iconColor: "#60A5FA",
    title: "Paid Growth",
    tags: "Google · Meta · Performance Campaigns",
    description: "Acquire high-intent customers with data-optimized search, display, retargeting, and social advertising campaigns.",
  },
  {
    id: "social-growth",
    icon: Share2,
    iconColor: "#F472B6",
    title: "Social Growth",
    tags: "Social Strategy · Content · Community",
    description: "Cultivate an engaged audience across LinkedIn, Instagram, X, and YouTube with consistent, creative brand storytelling.",
  },
  {
    id: "conversion-growth",
    icon: TrendingUp,
    iconColor: "#FB923C",
    title: "Conversion Growth",
    tags: "Landing Pages · CRO · Analytics",
    description: "Maximize the value of every visitor with conversion rate optimization, rapid A/B testing, and deep behavioral analytics.",
  },
];

export default function PerformanceGrowthSection() {
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
      aria-label="Turn Digital Visibility Into Business Growth"
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
            / PERFORMANCE & GROWTH
          </p>

          {/* Main Heading */}
          <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[50px] leading-[1.1] text-white max-w-3xl">
            Turn Digital Visibility Into Business Growth
          </h2>

          {/* Subtitle Paragraph */}
          <p className="font-mono font-normal text-sm sm:text-base text-white/60 max-w-2xl leading-[26px]">
            We connect strategy, content, search, social, and paid acquisition to create a growth engine—not disconnected marketing activities.
          </p>
        </header>

        {/* 4 Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceGrowthCardsData.map((item, idx) => {
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
                  <h3 className="font-duru text-xl sm:text-[22px] font-normal text-white">
                    {item.title}
                  </h3>

                  {/* Tags */}
                  <p 
                    className="font-mono text-xs sm:text-[13px] font-semibold"
                    style={{ color: item.iconColor }}
                  >
                    {item.tags}
                  </p>

                  {/* Description */}
                  <p className="font-mono text-xs sm:text-sm text-white/60 leading-[23px]">
                    {item.description}
                  </p>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
