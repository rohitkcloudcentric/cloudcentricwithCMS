"use client";

import React, { useState, useEffect, useRef } from "react";

export interface TechCategory {
  id: string;
  category: string;
  categoryColor: string;
  bulletColor: string;
  bulletGlow: string;
  pills: string[];
}

export const techCategoriesData: TechCategory[] = [
  {
    id: "frontend",
    category: "FRONTEND",
    categoryColor: "#38BDF8",
    bulletColor: "#38BDF8",
    bulletGlow: "rgba(56, 189, 248, 0.4)",
    pills: ["React", "Next.js", "Angular", "HTML", "CSS"],
  },
  {
    id: "backend",
    category: "BACKEND",
    categoryColor: "#A78BFA",
    bulletColor: "#A78BFA",
    bulletGlow: "rgba(167, 139, 250, 0.4)",
    pills: ["Laravel", "Node.js", "Python", "PHP", ".NET", "Java"],
  },
  {
    id: "mobile",
    category: "MOBILE",
    categoryColor: "#34D399",
    bulletColor: "#34D399",
    bulletGlow: "rgba(52, 211, 153, 0.4)",
    pills: ["Flutter", "React Native", "iOS", "Android"],
  },
  {
    id: "cloud-devops",
    category: "CLOUD & DEVOPS",
    categoryColor: "#EC4899",
    bulletColor: "#EC4899",
    bulletGlow: "rgba(236, 72, 153, 0.4)",
    pills: ["AWS", "Azure", "Google Cloud", "Heroku", "Docker"],
  },
  {
    id: "data",
    category: "DATA",
    categoryColor: "#F59E0B",
    bulletColor: "#F59E0B",
    bulletGlow: "rgba(245, 158, 11, 0.4)",
    pills: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    id: "ai",
    category: "AI",
    categoryColor: "#06B6D4",
    bulletColor: "#06B6D4",
    bulletGlow: "rgba(6, 182, 212, 0.4)",
    pills: ["Generative AI", "AI Agents", "LLMs", "RAG", "AI Automation"],
  },
];

export default function BuiltWithTechThatScale() {
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
      aria-label="Built With Technologies That Scale"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12 lg:space-y-14 items-center text-center">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col items-center space-y-3 max-w-3xl transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[3px] text-[#38BDF8] font-intel">
            / ENGINEERING EXPERTISE
          </p>
          <h2 className="text-[32px] sm:text-[42px] lg:text-[48px] font-normal leading-[1.15] text-white font-duru">
            Built With Technologies That Scale
          </h2>
        </header>

        {/* 3-Column Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 text-left">
          {techCategoriesData.map((cat, idx) => (
            <div
              key={cat.id}
              className={`group relative rounded-[20px] bg-[#0C0C10] border border-white/[0.08] p-7 sm:p-8 flex flex-col space-y-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#38BDF8]/40 hover:bg-[#111116] hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(56,189,248,0.18)] shadow-lg transform ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
              }`}
              style={{ transitionDelay: `${250 + idx * 90}ms` }}
            >
              {/* Category Title with Bullet Indicator */}
              <div className="flex items-center space-x-2.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                  style={{ 
                    backgroundColor: cat.bulletColor,
                    boxShadow: `0 0 10px ${cat.bulletGlow}`
                  }}
                />
                <h3 
                  className="text-xs sm:text-[13px] font-semibold uppercase tracking-[2px] font-intel"
                  style={{ color: cat.categoryColor }}
                >
                  {cat.category}
                </h3>
              </div>

              {/* Technology Pills */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {cat.pills.map((pill, pIdx) => (
                  <span
                    key={pIdx}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80 font-intel font-normal hover:bg-white/[0.08] hover:border-white/25 hover:text-white transition-all cursor-default"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
