"use client";

import React, { useState, useEffect, useRef } from "react";

export interface ProductionProductItem {
  id: string;
  bulletColor: string;
  bulletGlow: string;
  title: string;
  description: string;
}

export const productionProductItems: ProductionProductItem[] = [
  {
    id: "business-management",
    bulletColor: "#38BDF8",
    bulletGlow: "rgba(56, 189, 248, 0.4)",
    title: "Business Management Platforms",
    description: "Centralize operations, workflows, data, and teams.",
  },
  {
    id: "customer-platforms",
    bulletColor: "#A855F7",
    bulletGlow: "rgba(168, 85, 247, 0.4)",
    title: "Customer Platforms",
    description: "Create connected digital experiences for customers and partners.",
  },
  {
    id: "internal-applications",
    bulletColor: "#34D399",
    bulletGlow: "rgba(52, 211, 153, 0.4)",
    title: "Internal Applications",
    description: "Simplify employee workflows and automate everyday operations.",
  },
  {
    id: "marketplace-booking",
    bulletColor: "#EC4899",
    bulletGlow: "rgba(236, 72, 153, 0.4)",
    title: "Marketplace & Booking Platforms",
    description: "Build scalable platforms for transactions, bookings, and digital commerce.",
  },
  {
    id: "workflow-automation",
    bulletColor: "#3B82F6",
    bulletGlow: "rgba(59, 130, 246, 0.4)",
    title: "Workflow & Automation Systems",
    description: "Turn repetitive processes into connected digital workflows.",
  },
  {
    id: "industry-specific",
    bulletColor: "#F59E0B",
    bulletGlow: "rgba(245, 158, 11, 0.4)",
    title: "Industry-Specific Solutions",
    description: "Build software tailored to the requirements of your industry.",
  },
];

export default function IdeaToProductionProduct() {
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
      aria-label="From Idea to Production-Ready Product"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (Sticky Heading & Description) */}
        <div 
          className={`lg:col-span-5 flex flex-col space-y-5 lg:sticky lg:top-28 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <h2 className="text-[32px] sm:text-[42px] lg:text-[48px] font-normal leading-[1.15] text-white font-duru">
            From Idea to Production-Ready Product
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA] font-light leading-relaxed font-intel max-w-md pt-1">
            Whether you&apos;re replacing a legacy system, launching a new product, or solving a complex operational challenge, we build technology that works around your business.
          </p>
        </div>

        {/* Right Column (Vertical Stack of 6 Cards) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5">
          {productionProductItems.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-[18px] bg-[#0C0C10] border border-white/[0.08] p-5 sm:p-6 flex flex-col space-y-2 transition-all duration-500 hover:border-white/20 hover:bg-[#111116] hover:-translate-y-0.5 shadow-lg transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${250 + idx * 90}ms` }}
            >
              {/* Card Title with Bullet Indicator */}
              <div className="flex items-center space-x-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                  style={{ 
                    backgroundColor: item.bulletColor,
                    boxShadow: `0 0 10px ${item.bulletGlow}`
                  }}
                />
                <h3 className="text-lg sm:text-[20px] font-normal text-white font-duru tracking-wide">
                  {item.title}
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-xs sm:text-[14.5px] font-light text-[#A1A1AA] font-intel pl-5.5 pt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
