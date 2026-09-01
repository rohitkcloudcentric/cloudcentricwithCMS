"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Compass, RotateCw, Cpu, Link as LinkIcon, Terminal, ShieldCheck, ArrowUpRight } from "lucide-react";

export interface CloudTechCardItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export interface CloudTechForBusinessNeedProps {
  eyebrow?: string;
  title?: string | React.ReactNode;
  subtitle?: string;
  cardsData?: CloudTechCardItem[];
}

export const defaultCloudTechCardsData: CloudTechCardItem[] = [
  {
    id: "cloud-strategy-consulting",
    icon: Compass,
    iconColor: "#60A5FA",
    title: "Cloud Strategy & Consulting",
    description: "Define the right cloud architecture, migration strategy, and technology roadmap for your business.",
    linkText: "Cloud Assessment · Architecture · Roadmaps",
    href: "/contact-us",
  },
  {
    id: "cloud-migration",
    icon: RotateCw,
    iconColor: "#A78BFA",
    title: "Cloud Migration",
    description: "Move applications, workloads, and data to the cloud with a structured approach designed to minimize disruption.",
    linkText: "Migration · Modernization · Optimization",
    href: "/contact-us",
  },
  {
    id: "cloud-app-development",
    icon: Cpu,
    iconColor: "#38BDF8",
    title: "Cloud Application Development",
    description: "Build scalable, secure, cloud-native applications designed for performance and flexibility.",
    linkText: "Cloud-Native · Microservices · Serverless",
    href: "/contact-us",
  },
  {
    id: "api-system-integration",
    icon: LinkIcon,
    iconColor: "#C084FC",
    title: "API & System Integration",
    description: "Connect your applications, platforms, databases, and third-party services through reliable integrations.",
    linkText: "REST APIs · Third-Party APIs · Middleware",
    href: "/contact-us",
  },
  {
    id: "devops-automation",
    icon: Terminal,
    iconColor: "#818CF8",
    title: "DevOps & Automation",
    description: "Automate development and deployment processes to release faster, improve reliability, and reduce operational effort.",
    linkText: "CI/CD · Infrastructure Automation · Monitoring",
    href: "/contact-us",
  },
  {
    id: "cloud-security-optimization",
    icon: ShieldCheck,
    iconColor: "#34D399",
    title: "Cloud Security & Optimization",
    description: "Improve security, reliability, performance, and cloud efficiency across your technology environment.",
    linkText: "Security · Monitoring · Cost Optimization",
    href: "/contact-us",
  },
];

export default function CloudTechForBusinessNeed({
  eyebrow = "/ WHAT WE DO",
  title = (
    <>
      Build a Connected, Cloud-<br className="hidden sm:inline" />Ready Business
    </>
  ),
  subtitle = "From cloud migration to API integration and DevOps automation, we create the technology foundation your business needs to operate and scale.",
  cardsData = defaultCloudTechCardsData,
}: CloudTechForBusinessNeedProps) {
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
      id="solutions"
      className="w-full bg-[#050505] text-white py-12 sm:py-16 lg:py-20 px-6 sm:px-10 lg:px-16 z-10"
      aria-label="Cloud & Integration Solutions Grid"
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
          <p className="text-[12px] font-semibold uppercase tracking-[3px] text-[#A78BFA] font-mono">
            {eyebrow}
          </p>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-normal leading-[1.1] text-white max-w-3xl font-duru">
            {title}
          </h2>

          {/* Paragraph */}
          <p className="text-sm sm:text-base text-white/60 font-normal max-w-2xl leading-[26px] font-mono pt-1">
            {subtitle}
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cardsData.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <article
                key={item.id}
                className={`group relative rounded-[18.6px] bg-[#0B0B10] border border-white/[0.08] p-7 sm:p-[37.2px] flex flex-col justify-between space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-[#101017] hover:-translate-y-1.5 shadow-xl transform ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
                }`}
                style={{ transitionDelay: `${250 + idx * 90}ms` }}
              >
                <div className="flex flex-col space-y-5">
                  {/* Square Rounded Icon Badge */}
                  <div className="w-[55.8px] h-[55.8px] rounded-[13.95px] bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-white/20" aria-hidden="true">
                    <IconComponent 
                      className="w-[27.9px] h-[27.9px] stroke-[1.85]" 
                      style={{ color: item.iconColor }}
                    />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-[23.25px] font-normal text-white leading-[32px] font-duru">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm sm:text-[16.27px] font-normal leading-[26px] text-white/60 font-mono">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Link Row with Border Top */}
                <div className="border-t border-white/[0.06] pt-3.5 mt-2 flex items-center justify-between">
                  <Link
                    href={item.href}
                    aria-label={`${item.title} - ${item.linkText}`}
                    className="inline-flex items-center space-x-2 text-xs sm:text-[13.95px] font-normal transition-colors font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md"
                    style={{ color: item.iconColor }}
                  >
                    <span>{item.linkText}</span>
                  </Link>

                  <ArrowUpRight className="w-[18.6px] h-[18.6px] text-white/40 group-hover:text-white transition-colors" aria-hidden="true" />
                </div>

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
