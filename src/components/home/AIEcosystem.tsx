"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AIEcosystem() {
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
    <section ref={sectionRef} className="w-full bg-[#050505] py-24 px-4 overflow-hidden text-white">
      <div className={`max-w-5xl mx-auto flex flex-col items-center text-center space-y-4 transition-all duration-800 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>

        {/* Label */}
        <p
          className="text-sm font-bold tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-intel-one-mono), monospace",
            background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          AI Ecosystem
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl md:text-4xl font-normal text-white leading-snug max-w-5xl"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          Build Smarter Businesses Through Connected AI Connected to Everything.
        </h2>

        {/* CTA Button */}
        <Link
          href="/contact-us"
          className="mt-2 inline-block px-8 py-3 rounded-xl text-white text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:opacity-90 hover:scale-[1.03] active:scale-95 shadow-[0_0_28px_rgba(47,137,255,0.4)] cursor-pointer"
          style={{
            fontFamily: "var(--font-intel-one-mono), monospace",
            background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
          }}
        >
          Explore AI Solutions
        </Link>

        {/* Ecosystem Network Diagram — using actual image */}
        <div className={`relative w-full max-w-4xl mt-6 transition-all duration-1000 transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`} style={{ transitionDelay: "200ms" }}>
          <Image
            src="/images/build-smarter-1.png"
            alt="AI Ecosystem - Connected integrations diagram"
            width={1400}
            height={780}
            className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.01]"
            priority
          />
        </div>

      </div>
    </section>
  );
}
