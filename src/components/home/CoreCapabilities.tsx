"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CapabilityItem {
  id: string;
  iconSrc: string;
  title: string;
  technologies: string;
  description: string;
  link?: string;
}

export const capabilitiesData: CapabilityItem[] = [
  {
    id: "salesforce-ecosystem",
    iconSrc: "/images/salesforce-logo.svg",
    title: "Salesforce",
    technologies: "Consulting • Development • Agentforce",
    description:
      "Maximize Salesforce with consulting, implementation, customization, integrations, and managed services.",
    link: "/services",
  },
  {
    id: "enterprise-software",
    iconSrc: "/images/what we-do/enterprise-software.svg",
    title: "Custom Software Development",
    technologies: "Custom Software • ERP • Business Applications",
    description:
      "Build scalable custom software designed around your workflows, operations, and long-term business goals.",
    link: "/salesforce/custom-development",
  },
  // {
  //   id: "digital-engineering",
  //   iconSrc: "/images/what we-do/digital-engineering.svg",
  //   title: "Digital Engineering",
  //   technologies: "Web • Mobile • Cloud Applications",
  //   description:
  //     "Design and develop modern web, mobile, and cloud-native applications with exceptional user experiences.",
  //   link: "/what-we-do",
  // },
  {
    id: "cloud-integration",
    iconSrc: "/images/what we-do/cloud-integration.svg",
    title: "Cloud & Integration",
    technologies: "AWS • Azure • APIs • DevOps",
    description:
      "Connect systems, migrate workloads, and build secure cloud infrastructure that grows with your business.",
    link: "/salesforce/cloud-integration",
  },
  // {
  //   id: "data-analytics",
  //   iconSrc: "/images/what we-do/data-analytics-intelligence.svg",
  //   title: "Data, Analytics & Intelligence",
  //   technologies: "Business Intelligence • Predictive Analytics",
  //   description:
  //     "Transform business data into actionable insights with intelligent dashboards and AI-powered decision making.",
  //   link: "/what-we-do",
  // },
  {
    id: "growth-digital-experience",
    iconSrc: "/images/what we-do/growth-digital-experience.svg",
    title: "Growth & Digital Experience",
    technologies: "Branding • UI/UX • SEO • Digital Marketing",
    description:
      "Create exceptional digital experiences that increase visibility, engage customers, and accelerate business growth.",
    link: "/salesforce/growth-digital-experience",
  },

];

interface CapabilityCardProps {
  capability: CapabilityItem;
  index: number;
  isVisible: boolean;
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({ capability, index, isVisible }) => {
  const cardContent = (
    <article 
      className={`group relative flex flex-col sm:flex-row items-center gap-6 pb-7 transition-all duration-700 transform hover:-translate-y-1.5 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${250 + index * 120}ms` }}
    >
      {/* SVG Icon — Floating up and down smoothly */}
      <div 
        className="relative w-[130px] h-[130px] flex-shrink-0 transition-transform duration-300 group-hover:scale-105 animate-float-slow"
        style={{ animationDelay: `${(index % 3) * 0.7}s` }}
      >
        <Image
          src={capability.iconSrc}
          alt={`${capability.title} Icon`}
          width={130}
          height={130}
          className="w-full h-full object-contain"
          unoptimized
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col space-y-2 flex-grow">
        {/* Title */}
        <h3
          className="text-lg sm:text-xl font-normal text-white tracking-wide transition-colors duration-300 group-hover:text-white font-duru"
        >
          {capability.title}
        </h3>

        {/* Technology Tags */}
        <p
          className="text-[13px] font-normal text-[#A855F7] tracking-wide font-intel"
        >
          {capability.technologies}
        </p>

        {/* Description */}
        <p
          className="text-[14px] font-extralight leading-[1.8] text-[#A1A1AA] pt-1 max-w-xl font-intel"
        >
          {capability.description}
        </p>
      </div>

      {/* Hover Arrow Action Button */}
      <div className="absolute right-0 bottom-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-lg" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>

      {/* Bottom Border / Hover Underline (only visible on hover) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#A855F7] group-hover:to-[#3B82F6] transition-all duration-300" />
    </article>
  );

  if (capability.link) {
    return (
      <Link href={capability.link} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default function CoreCapabilities() {
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
      className="w-full bg-[#000000] text-white py-16 sm:py-20 lg:py-[120px] px-5 sm:px-8 z-10"
      aria-label="Core Capabilities"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col space-y-12 lg:space-y-16">
        {/* Section Header — Comes from Left */}
        <header 
          className={`flex flex-col space-y-4 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <p
            className="text-[12px] font-medium uppercase tracking-[2px] text-[#9CA3AF] font-intel"
          >
            / CORE CAPABILITIES
          </p>
          <h2
            className="text-[30px] sm:text-[40px] lg:text-[50px] font-medium leading-[1.1] text-white max-w-4xl font-duru"
          >
            Everything You Need to Build,
            <br />
            Automate &amp; Scale
          </h2>
        </header>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[70px] gap-y-[45px]">
          {capabilitiesData.map((item, idx) => (
            <CapabilityCard key={item.id} capability={item} index={idx} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
