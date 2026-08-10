"use client";

import { useEffect, useState, useRef } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

function CountUp({ end, duration = 1500, suffix = "", decimals = 0 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + progress * (end - startValue);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return (
    <span ref={elementRef}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function OurFoundation() {
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

  const stats = [
    { end: 10, suffix: "+", label: "Years of Innovation", decimals: 0 },
    { end: 400, suffix: "+", label: "Projects Delivered", decimals: 0 },
    { end: 100, suffix: "+", label: "Technology Experts", decimals: 0 },
    { end: 4.9, suffix: "★", label: "Client Satisfaction", decimals: 1 },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full max-w-7xl mx-auto px-6 py-6 md:py-14 lg:py-18 z-10"
    >
      <div>
        {/* Top Badge & Heading — Comes from Left */}
        <div className={`transition-all duration-800 ease-out transform ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
        }`} style={{ transitionDelay: "150ms" }}>
          {/* Top Badge */}
          <div className="inline-flex items-center">
            <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest text-white uppercase bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              OUR FOUNDATION
            </span>
          </div>

          {/* Heading */}
          <h2 
            className="mt-6 md:mt-8 text-xl sm:text-3xl md:text-4xl lg:text-[38px] font-normal leading-[1.3] text-white tracking-tight max-w-[1100px] font-duru"
          >
            At CloudCentric, We Combine AI Innovation, Enterprise Technology, And Business Expertise To Help Organizations Automate Operations, Enhance Customer Experiences, And Accelerate Digital Growth.
          </h2>
        </div>

        {/* Responsive Stats Grid — All counts come from Right smoothly */}
        <div className="mt-8 md:mt-10 lg:mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col space-y-2 transition-all duration-800 ease-out transform ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
              style={{ transitionDelay: `${350 + idx * 120}ms` }}
            >
              <span className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-none">
                {isVisible ? (
                  <CountUp 
                    end={stat.end} 
                    suffix={stat.suffix} 
                    decimals={stat.decimals} 
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </span>
              <span 
                className="text-[11px] sm:text-xs text-[#BDBDC8] tracking-wider font-medium font-intel uppercase"
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
