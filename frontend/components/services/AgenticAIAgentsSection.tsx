"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, Cpu, Zap, UserCheck } from "lucide-react";

export const agenticCardsData = [
  {
    id: "01",
    stepNumber: "01",
    title: "Understand",
    titleColor: "#60A5FA",
    iconBg: "rgba(96, 165, 250, 0.07)",
    iconBorder: "rgba(96, 165, 250, 0.19)",
    iconColor: "#60A5FA",
    icon: Brain,
    description: "Interpret requests, context, and business intent with precision.",
  },
  {
    id: "02",
    stepNumber: "02",
    title: "Reason",
    titleColor: "#A78BFA",
    iconBg: "rgba(167, 139, 250, 0.07)",
    iconBorder: "rgba(167, 139, 250, 0.19)",
    iconColor: "#A78BFA",
    icon: Cpu,
    description: "Determine the right steps to accomplish a goal autonomously.",
  },
  {
    id: "03",
    stepNumber: "03",
    title: "Act",
    titleColor: "#34D399",
    iconBg: "rgba(52, 211, 153, 0.07)",
    iconBorder: "rgba(52, 211, 153, 0.19)",
    iconColor: "#34D399",
    icon: Zap,
    description: "Use APIs, applications, and business systems to complete tasks.",
  },
  {
    id: "04",
    stepNumber: "04",
    title: "Escalate",
    titleColor: "#FBBF24",
    iconBg: "rgba(251, 191, 36, 0.07)",
    iconBorder: "rgba(251, 191, 36, 0.19)",
    iconColor: "#FBBF24",
    icon: UserCheck,
    description: "Bring humans into the loop when decisions require oversight.",
  },
];

export default function AgenticAIAgentsSection() {
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
      aria-label="Agentic AI Section"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-12 lg:space-y-14">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col space-y-4 max-w-3xl transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          {/* Eyebrow */}
          <p className="text-[12px] font-semibold uppercase tracking-[3px] text-[#A78BFA] font-intel">
            / AGENTIC AI
          </p>

          {/* Heading */}
          <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-normal leading-[1.1] text-white font-duru">
            AI Agents That Don&apos;t Just Respond.{" "}
            <span className="block sm:inline bg-gradient-to-r from-[#60A5FA] via-[#8999FA] to-[#A78BFA] bg-clip-text text-transparent">
              They Act.
            </span>
          </h2>

          {/* Paragraph */}
          <p className="text-sm sm:text-base text-white/60 leading-[1.62] font-intel font-normal pt-1">
            Move beyond traditional chatbots with intelligent agents that can understand goals, reason through tasks, use connected tools, and take action across your business workflows.
          </p>
        </header>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {agenticCardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`relative rounded-[18.6px] bg-[#0C0C10] border border-white/[0.07] p-7 sm:p-[32.55px] flex flex-col justify-between space-y-6 transition-all duration-500 hover:border-white/20 hover:bg-[#111116] hover:-translate-y-1.5 shadow-lg group transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${250 + idx * 100}ms` }}
              >
                {/* Step Number in Top Right */}
                <span className="absolute top-6 right-7 text-xs sm:text-[13.95px] font-medium text-white/20 font-intel">
                  {item.stepNumber}
                </span>

                {/* Top Icon Badge */}
                <div 
                  className="w-[55.8px] h-[55.8px] rounded-[13.95px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{ 
                    backgroundColor: item.iconBg,
                    border: `0.93px solid ${item.iconBorder}`
                  }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: item.iconColor }} />
                </div>

                {/* Title and Description */}
                <div className="flex flex-col space-y-2.5 pt-2">
                  <h3 
                    className="text-xl sm:text-[20.9px] font-normal leading-[1.56] font-duru"
                    style={{ color: item.titleColor }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[15px] font-normal leading-[1.63] text-white/55 font-intel">
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
