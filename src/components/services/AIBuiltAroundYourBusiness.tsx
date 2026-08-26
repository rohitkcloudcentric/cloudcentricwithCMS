"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Compass, Bot, Cpu, Wand2, Network, Settings, ArrowRight } from "lucide-react";

export interface AIBusinessCardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export const aiBusinessCardsData: AIBusinessCardItem[] = [
  {
    id: "ai-strategy",
    icon: Compass,
    title: "AI Strategy & Consulting",
    description: "Identify high-value AI opportunities and create a practical roadmap aligned with your business goals.",
    linkText: "Explore AI Strategy",
    href: "/contact-us",
  },
  {
    id: "ai-agents",
    icon: Bot,
    title: "AI Agents",
    description: "Deploy intelligent agents that understand context, make decisions, and execute tasks across business workflows.",
    linkText: "Explore AI Agents",
    href: "/contact-us",
  },
  {
    id: "intelligent-automation",
    icon: Cpu,
    title: "Intelligent Automation",
    description: "Automate repetitive processes and connect workflows to reduce manual effort and improve operational efficiency.",
    linkText: "Explore Automation",
    href: "/contact-us",
  },
  {
    id: "generative-ai",
    icon: Wand2,
    title: "Generative AI",
    description: "Build intelligent applications that generate, summarize, search, analyze, and interact with your business knowledge.",
    linkText: "Explore Generative AI",
    href: "/contact-us",
  },
  {
    id: "ai-integration",
    icon: Network,
    title: "AI Integration",
    description: "Connect AI with Salesforce, CRM, cloud platforms, APIs, databases, and existing enterprise systems.",
    linkText: "Explore AI Integration",
    href: "/contact-us",
  },
  {
    id: "custom-ai-solutions",
    icon: Settings,
    title: "Custom AI Solutions",
    description: "Build AI applications tailored to your industry's workflows, data, security requirements, and business objectives.",
    linkText: "Explore Custom AI",
    href: "/contact-us",
  },
];

export default function AIBuiltAroundYourBusiness() {
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
      className="w-full bg-[#050505] text-white py-10 sm:py-12 lg:py-14 px-5 sm:px-8 z-10"
      aria-label="AI Built Around Your Business"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col space-y-10 lg:space-y-12">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col space-y-3 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[2px] text-[#9CA3AF] font-intel">
            / WHAT WE DO
          </p>
          <h2 className="text-[30px] sm:text-[40px] lg:text-[48px] font-normal leading-[1.15] text-white max-w-4xl font-duru">
            AI Built Around Your Business
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] font-light max-w-3xl leading-relaxed font-intel pt-1">
            We combine strategy, AI engineering, automation, and enterprise integration to create solutions that solve real business problems.
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {aiBusinessCardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`group relative rounded-[20px] bg-[#0A0A0E]/90 border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-500 hover:border-[#7C3AED]/40 hover:bg-[#0E0E14] hover:-translate-y-1.5 cursor-pointer shadow-lg transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${250 + idx * 100}ms` }}
              >
                <div className="flex flex-col space-y-4">
                  {/* Circular Icon Badge */}
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-[#A855F7] group-hover:border-[#7C3AED]/40 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-[22px] font-normal text-white tracking-wide font-duru group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-[14px] font-extralight leading-[1.75] text-[#A1A1AA] font-intel">
                    {item.description}
                  </p>
                </div>

                {/* Link Action */}
                <Link
                  href={item.href}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-normal text-[#A855F7] group-hover:text-[#C084FC] transition-colors font-intel pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
