"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

export default function WhoWeAreCTA() {
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

  return (
    <section 
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-12 lg:py-16 z-10"
    >
      <div 
        className={`w-full rounded-[24px] md:rounded-[32px] bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] p-8 sm:p-12 md:py-10 md:px-6 text-center shadow-[0_20px_50px_rgba(124,58,237,0.25)] relative overflow-hidden transition-all duration-1000 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Subtle decorative grid/glow pattern inside card */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
          {/* Main Heading — Comes from Bottom */}
          <h2 
            className={`text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.15] tracking-tight font-sans transition-all duration-800 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Let's Build The Future Of Your <br className="hidden sm:inline" />
            Business Together
          </h2>

          {/* Description — Comes from Bottom */}
          <p 
            className={`text-xs sm:text-base text-white/90 leading-relaxed max-w-2xl tracking-wide font-intel transition-all duration-800 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Whether you&apos;re exploring AI, modernizing Salesforce, or building enterprise software, our experts are ready to help you transform ideas into scalable digital solutions.
          </p>

          {/* Action Buttons — Come from Bottom */}
          <div 
            className={`pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full transition-all duration-800 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Button 1: Book a Free Consultation */}
            <Link 
              href="/contact-us"
              className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-white text-[#0f172a] rounded-full text-sm font-normal shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-slate-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group w-full sm:w-auto cursor-pointer"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#0f172a] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Button 2: Talk to Our Experts */}
            <Link 
              href="/contact-us"
              className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-transparent border font-normal border-white/40 text-white rounded-full text-sm hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Talk to Our Experts</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
