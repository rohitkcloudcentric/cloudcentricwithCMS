"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OurValues() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const valuesList = [
    {
      icon: "/images/how-we-are/our-values/ai-first-icon.svg",
      title: "AI-First Innovation",
      desc: "We leverage the latest AI technologies to build smarter, faster, and future-ready business solutions.",
    },
    {
      icon: "/images/how-we-are/our-values/customer-success-icon.svg",
      title: "Customer Success",
      desc: "Your business goals drive every decision we make-from strategy and implementation to ongoing support.",
    },
    {
      icon: "/images/how-we-are/our-values/enterprise-trust-icon.svg",
      title: "Enterprise Trust",
      desc: "We specialize in custom AI development to precisely meet and exceed the unique needs of your organization.",
    },
    {
      icon: "/images/how-we-are/our-values/continuous-growth-icon.svg",
      title: "Continuous Growth",
      desc: "We specialize in custom AI development to precisely meet and exceed the unique needs of your organization.",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 z-10"
    >
      <div 
        className={`w-full rounded-[24px] md:rounded-[32px] bg-[#0A0A0C] border border-white/[0.06] p-8 md:p-12 lg:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-1000 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      >
        {/* Glow effect in background */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-radial from-[#7C3AED]/5 to-transparent blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
          {/* Left Column: Heading, badge & CTA — Comes from Left */}
          <div className={`lg:col-span-5 flex flex-col items-start space-y-6 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`} style={{ transitionDelay: "200ms" }}>
            {/* Gradient Badge */}
            <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-normal tracking-widest text-white uppercase bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              OUR VALUES
            </span>

            {/* Heading */}
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold text-white leading-[1.2] tracking-tight font-sans"
            >
              The Principles <br className="hidden sm:inline" />
              Behind Every <br className="hidden sm:inline" />
              Solution We Build
            </h2>

            {/* Supporting Paragraph */}
            <p 
              className="text-xs sm:text-sm text-[#BDBDC8] leading-relaxed max-w-sm font-intel"
            >
              Our success is built on trust, innovation, and long-term partnerships. Every project we deliver is guided by values that help businesses innovate with confidence.
            </p>

            {/* CTA Button */}
            <Link 
              href="/approach"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white rounded-full text-sm font-bold shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-slate-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group mt-4"
            >
              <span className="bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-intel">
                Explore Our Approach
              </span>
              <ArrowRight className="w-4 h-4 text-[#A855F7] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column: 2x2 Feature Grid — All items come from Right smoothly */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 w-full">
            {valuesList.map((item, idx) => {
              
              // Define border classes for the 2x2 layout on desktop
              let borderClasses = "";
              if (idx === 0) {
                borderClasses = "sm:pl-6 sm:pb-8 sm:border-l border-white/[0.08] pb-8 ";
              } else if (idx === 1) {
                borderClasses = "sm:pl-6 sm:pb-8 border-white/[0.08] py-8 sm:py-0 sm:pb-8  sm:border-l";
              } else if (idx === 2) {
                borderClasses = "sm:pl-6 sm:pt-8 sm:border-l border-white/[0.08] py-8 sm:py-0 sm:pt-8";
              } else {
                borderClasses = "sm:pl-6 sm:pt-8 pt-8 sm:border-l border-white/[0.08]";
              }

              return (
                <div 
                  key={idx} 
                  className={`flex flex-col items-start space-y-4 hover:bg-white/[0.01] mb-8 transition-all duration-800 ease-out transform group ${borderClasses} ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
                  }`}
                  style={{ transitionDelay: `${350 + idx * 150}ms` }}
                >
                  {/* Outlined Icon Container */}
                  <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.12] text-white flex items-center justify-center group-hover:bg-[#7C3AED]/10 group-hover:border-[#7C3AED]/40 transition-colors">
                    <img 
                      src={item.icon} 
                      alt={`${item.title} Icon`} 
                      className="w-5 h-5 object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-xl font-normal text-white tracking-tight font-duru"
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-sm sm:text-base text-[#9A9AAA] leading-relaxed font-intel"
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
