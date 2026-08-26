"use client";

import React, { useState, useEffect, useRef } from "react";

export interface IdeaToImpactStep {
  id: string;
  stepNumber: string;
  numberGradient: string;
  title: string;
  description: string;
}

export const ideaToImpactSteps: IdeaToImpactStep[] = [
  {
    id: "01-discover",
    stepNumber: "01",
    numberGradient: "from-[#60A5FA] to-[#3B82F6]",
    title: "Discover",
    description: "Understand your business, users, processes, challenges, and goals.",
  },
  {
    id: "02-define",
    stepNumber: "02",
    numberGradient: "from-[#818CF8] to-[#6366F1]",
    title: "Define",
    description: "Shape the product requirements, technical architecture, and development roadmap.",
  },
  {
    id: "03-design",
    stepNumber: "03",
    numberGradient: "from-[#A78BFA] to-[#8B5CF6]",
    title: "Design",
    description: "Create intuitive user experiences and scalable product architecture.",
  },
  {
    id: "04-develop",
    stepNumber: "04",
    numberGradient: "from-[#C084FC] to-[#A855F7]",
    title: "Develop",
    description: "Build, integrate, test, and continuously refine the solution.",
  },
  {
    id: "05-launch",
    stepNumber: "05",
    numberGradient: "from-[#E879F9] to-[#D946EF]",
    title: "Launch",
    description: "Deploy your product securely and prepare it for real-world users.",
  },
  {
    id: "06-scale",
    stepNumber: "06",
    numberGradient: "from-[#F0ABFC] to-[#EC4899]",
    title: "Scale",
    description: "Monitor, optimize, enhance, and evolve the product as your business grows.",
  },
];

export default function FromIdeaToImpactProcess() {
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
      aria-label="From Idea to Impact Process"
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
            / HOW WE BUILD
          </p>
          <h2 className="text-[30px] sm:text-[40px] lg:text-[48px] font-normal leading-[1.15] text-white max-w-4xl font-duru">
            From Idea to Impact
          </h2>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {ideaToImpactSteps.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-[20px] bg-[#0C0C10] border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between space-y-5 transition-all duration-500 hover:border-white/20 hover:bg-[#111116] hover:-translate-y-1 cursor-pointer shadow-lg transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${250 + idx * 90}ms` }}
            >
              {/* Step Number */}
              <span className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${item.numberGradient} bg-clip-text text-transparent font-intel tracking-tight`}>
                {item.stepNumber}
              </span>

              {/* Title & Description */}
              <div className="flex flex-col space-y-2 pt-1">
                <h3 className="text-xl sm:text-[22px] font-normal text-white font-duru tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[14.5px] font-light leading-relaxed text-[#A1A1AA] font-intel">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
