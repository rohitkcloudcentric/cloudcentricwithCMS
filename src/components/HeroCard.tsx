"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    image: "/images/build-the-right.png",
    title: "Build the Right AI Strategy Before You Build AI",
    description: "Identify the highest-impact AI opportunities for your business with a clear roadmap tailored to your goals.",
    btnText: "Start Your AI Journey",
  },
  {
    image: "/images/build-the-right.png",
    title: "Deploy Custom AI Agents to Automate Operations",
    description: "Deploy autonomous intelligent agents that automate workflows, eliminate bottlenecks, and scale operations.",
    btnText: "Explore AI Agents",
  },
  {
    image: "/images/build-the-right.png",
    title: "Integrate Intelligent Automation in Systems",
    description: "Connect legacy databases, CRM systems, and AI models to automate end-to-end business operations seamlessly.",
    btnText: "See Automation",
  },
  {
    image: "/images/build-the-right.png",
    title: "Transform Customer Service with Generative AI",
    description: "Build next-generation support systems that understand intent, resolve issues, and delight users.",
    btnText: "Learn More",
  },
  {
    image: "/images/build-the-right.png",
    title: "Build Connected Ecosystems via AI Integration",
    description: "Integrate Salesforce, cloud platforms, and modern APIs to orchestrate data flows and trigger real-time actions.",
    btnText: "View Integration",
  },
  {
    image: "/images/build-the-right.png",
    title: "Tailor Custom AI Solutions for Your Business",
    description: "Design and train bespoke models suited specifically to your industry requirements, compliance, and metrics.",
    btnText: "Get Bespoke AI",
  },
];

// Append the first slide to the end for seamless infinite loop right-to-left scrolling
const extendedSlides = [...slides, slides[0]];

interface HeroCardProps {
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
}

export default function HeroCard({ activeIdx, setActiveIdx }: HeroCardProps) {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeIdx === slides.length) return; // wait for transition jump
      
      setIsTransitioning(true);
      setActiveIdx((activeIdx + 1) % (slides.length + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIdx, setActiveIdx]);

  useEffect(() => {
    // If we transitioned to the cloned slide (index 6), jump back to index 0 seamlessly
    if (activeIdx === slides.length) {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIdx(0);
      }, 500); // 500ms duration of the slide transition animation

      return () => clearTimeout(resetTimer);
    }
  }, [activeIdx, setActiveIdx]);

  const handleIndicatorClick = (idx: number) => {
    setIsTransitioning(true);
    setActiveIdx(idx);
  };

  const activeIndicator = activeIdx === slides.length ? 0 : activeIdx;

  return (
    <div className="w-full rounded-[24px] bg-[rgba(15,15,20,0.45)] backdrop-blur-[24px] border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-[#7C3AED]/40 transition-all duration-300 relative group overflow-hidden">
      
      {/* Slides Container */}
      <div className="w-full overflow-hidden relative">
        <div 
          className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${activeIdx * 100}%)` }}
        >
          {extendedSlides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 flex items-center space-x-6">
              {/* Left Phone / Robot Visual */}
              <div className="relative w-[150px] h-[160px] rounded-2xl overflow-hidden shrink-0 border border-white/10 flex items-center justify-center bg-black/20">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={150}
                  height={160}
                  className="object-cover w-full h-full transform group-hover:scale-[1.03] transition-transform duration-500"
                  priority={idx === 0}
                />
              </div>

              {/* Right content details */}
              <div className="flex flex-col justify-between flex-1 py-1 space-y-4">
                <div className="space-y-2">
                  <h3 
                    className="text-base md:text-3xl font-normal text-white leading-snug tracking-tight"
                    style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                  >
                    {slide.title}
                  </h3>
                  <p 
                    className="text-md text-[#C6C6D1] leading-relaxed font-light"
                    style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                  >
                    {slide.description}
                  </p>
                </div>
                <div>
                  <button 
                    className="px-5 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95"
                    style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                  >
                    {slide.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators - aligned perfectly with the text area start */}
      <div className="flex space-x-2.5 mt-4 ml-[174px]">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleIndicatorClick(idx)}
            className={`h-[2px] transition-all duration-300 ${
              activeIndicator === idx ? "w-16 bg-white" : "w-12 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>

    
  );
}
