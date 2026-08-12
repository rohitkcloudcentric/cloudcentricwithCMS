"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroCard from "./HeroCard";
import AIChatBar from "@/components/common/AIChatBar";

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const expertiseItems = [
    "AI STRATEGY",
    "AI AGENTS",
    "INTELLIGENT AUTOMATION",
    "GENERATIVE AI",
    "AI INTEGRATION",
    "CUSTOM AI SOLUTIONS",
  ];

  return (
    <section 
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col justify-around pt-8 pb-16 px-6 md:px-12 lg:px-20 bg-transparent"
    >
      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Headline Section */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-tight max-w-4xl tracking-tight font-duru transition-all duration-1000 ease-out transform ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            Where Artificial Intelligence <br />
            Meets Business Innovation
          </h1>

          <p 
            className={`text-xs md:text-sm text-[#C6C6D1] max-w-[580px] leading-relaxed font-normal font-intel transition-all duration-1000 ease-out transform ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            We help modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems powered by Salesforce and next-generation technologies.
          </p>

          <div className="pt-2">
            <Link 
              href="/contact-us"
              className={`group inline-flex items-center justify-between gap-5 py-2 pl-6 pr-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold tracking-wider hover:border-white/20 hover:bg-white/[0.08] transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)] font-intel duration-1000 ease-out transform cursor-pointer ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              <span className="tracking-widest uppercase">BOOK AN AI STRATEGY SESSION</span>
              <div className="flex items-center justify-center w-14 h-8 bg-white rounded-l-3xl rounded-r-xl transition-transform group-hover:translate-x-1">
                <svg className="w-8 h-4 text-[#7C3AED]" viewBox="0 0 32 16" fill="none" aria-hidden="true">
                  <path d="M4 8H26M26 8L20 3M26 8L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

     
      </div>

      {/* Lower Hero Grid: Expertise Menu & AI Chat Input Bar */}
      <div className={`relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2 md:mt-16 justify-center items-center transition-all duration-1000 ease-out transform ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`} style={{ transitionDelay: "750ms" }}>
        {/* Left Expertise Vertical List */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-2">
          <span 
            className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase mb-2 font-intel"
          >
            /OUR EXPERTISE
          </span>
          <div className="relative flex flex-col space-y-2">
            {/* Sliding Highlight Pill */}
            <div 
              className="absolute left-0 w-full bg-[#7C3AED]/10 border-l-2 border-[#7C3AED] rounded-r-md transition-transform duration-300 ease-in-out pointer-events-none"
              style={{
                height: "36px",
                transform: `translateY(${activeIdx * 44}px)`,
              }}
            />
            {expertiseItems.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={item}
                  onClick={() => setActiveIdx(idx)}
                  className="text-left text-xs font-bold tracking-wider transition-all duration-300 relative z-10 w-full h-[36px] px-4 flex items-center rounded-r-md font-intel"
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)",
                    textShadow: isActive ? "0 0 10px rgba(124, 58, 237, 0.5)" : "none",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        {/* Right Hero Floating Card */}
        <div className="lg:col-span-8 flex justify-end w-full">
          <HeroCard activeIdx={activeIdx} setActiveIdx={setActiveIdx} />
        </div>

      </div>

      {/* Floating AI Chat Bar */}
      <AIChatBar />
    </section>
  );
}
