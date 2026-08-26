"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Globe, Smartphone, Building2, Layers, Network, Sparkles, ArrowRight } from "lucide-react";

export interface CustomTechCardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export const customTechCardsData: CustomTechCardItem[] = [
  {
    id: "custom-web-apps",
    icon: Globe,
    title: "Custom Web Applications",
    description: "Build secure, scalable web applications designed around your unique workflows and user needs.",
    linkText: "Explore Web Development",
    href: "/contact-us",
  },
  {
    id: "mobile-apps",
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Create intuitive iOS and Android experiences that connect customers, employees, and business operations.",
    linkText: "Explore App Development",
    href: "/contact-us",
  },
  {
    id: "enterprise-software",
    icon: Building2,
    title: "Enterprise Software",
    description: "Modernize complex business processes with scalable applications built for enterprise environments.",
    linkText: "Explore Enterprise Development",
    href: "/contact-us",
  },
  {
    id: "saas-digital-products",
    icon: Layers,
    title: "SaaS & Digital Products",
    description: "Turn your product idea into a scalable SaaS platform with the architecture, features, and experience needed for growth.",
    linkText: "Build Your Product",
    href: "/contact-us",
  },
  {
    id: "api-system-integration",
    icon: Network,
    title: "API & System Integration",
    description: "Connect applications, platforms, databases, and third-party services to create a unified technology ecosystem.",
    linkText: "Explore Integrations",
    href: "/contact-us",
  },
  {
    id: "ai-powered-apps",
    icon: Sparkles,
    title: "AI-Powered Applications",
    description: "Bring intelligence into your software with AI agents, Generative AI, automation, analytics, and intelligent workflows.",
    linkText: "Explore AI Solutions",
    href: "/salesforce/ai-solutions",
  },
];

export default function CustomTechForBusinessNeed() {
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
      aria-label="Custom Technology for Every Business Need"
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
            Custom Technology for Every<br className="hidden sm:inline" /> Business Need
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] font-light max-w-3xl leading-relaxed font-intel pt-1">
            From a focused business application to a complete digital platform, our engineering teams build solutions around your goals, users, and processes.
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {customTechCardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className={`group relative rounded-[20px] bg-[#0A0A0E]/90 border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#7C3AED]/40 hover:bg-[#0E0E14] hover:-translate-y-1.5 hover:shadow-[0_0_35px_rgba(124,58,237,0.18)] cursor-pointer shadow-lg transform ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
                }`}
                style={{ transitionDelay: `${250 + idx * 90}ms` }}
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
