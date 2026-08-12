"use client";

import { useState, useEffect, useRef } from "react";

export default function RankedSection() {
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

  const badgeImages = [
    { name: "Badge 1", src: "/images/ranked-images/Container.png", width: 60, height: 60 },
    { name: "Badge 2", src: "/images/ranked-images/Container-1.png", width: 140, height: 48 },
    { name: "Badge 3", src: "/images/ranked-images/container-2.png", width: 80, height: 50 },
    { name: "Badge 4", src: "/images/ranked-images/container-3.png", width: 65, height: 65 },
    { name: "Badge 5", src: "/images/ranked-images/container-4.png", width: 60, height: 65 },
    { name: "Badge 6", src: "/images/ranked-images/Container-5.png", width: 65, height: 65 },
    { name: "Badge 7", src: "/images/ranked-images/container-6.png", width: 60, height: 65 },
    { name: "Badge 8", src: "/images/ranked-images/container-7.png", width: 65, height: 65 },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] py-14 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-10 text-center">
        {/* Section Heading */}
        <h2
          className={`text-2xl sm:text-3xl md:text-5xl font-normal text-white tracking-wide font-duru transition-all duration-800 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          #1 Ranked AI Development Firm
        </h2>

        {/* Badges Container Strip — All images come from right side smoothly */}
        <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-14 pt-2">
          {badgeImages.map((badge, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center transition-all duration-700 ease-out transform cursor-pointer hover:scale-110 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
              style={{ transitionDelay: `${150 + idx * 100}ms` }}
            >
              <img
                src={badge.src}
                alt={badge.name}
                width={badge.width}
                height={badge.height}
                loading="lazy"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain image-render-crisp"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
