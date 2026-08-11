"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
}

export default function TrustedClients() {
  const [headerRef, isHeaderVisible] = useInView(0.1);
  const [photoRef, isPhotoVisible] = useInView(0.1);
  const [card1Ref, isCard1Visible] = useInView(0.1);
  const [card2Ref, isCard2Visible] = useInView(0.1);
  const [card3Ref, isCard3Visible] = useInView(0.1);

  return (
    <section className="w-full bg-[#030304] pb-12 md:pb-20 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden text-white relative">
      <div className="max-w-[1280px] mx-auto flex flex-col relative z-10">
        
        {/* Top Header: Responsive Positioning */}
        <div className="w-full flex justify-end mb-6 md:mb-10">
          <div 
            ref={headerRef}
            className={`w-full max-w-[660px] flex flex-col items-start text-left z-20 transition-all duration-800 transform lg:absolute lg:top-16 lg:right-12 ${
              isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#8673F6]/50 bg-[#8673F6]/10 text-[#C4B5FD] text-[10px] tracking-[0.25em] uppercase font-intel mb-3">
              TRUSTED &amp; RECOGNIZED
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal text-white leading-[1.2] tracking-tight font-duru">
              Trusted by Clients.<br />
              Recognized by the Industry.
            </h2>
          </div>
        </div>

        {/* Overlapping Hero Layout Container */}
        <div className="relative w-full min-h-0 lg:min-h-[580px] pt-2 lg:pt-8">
          
          {/* Left Office Team Photo Box */}
          <div 
            ref={photoRef}
            className={`w-full lg:w-[42%] h-[280px] sm:h-[360px] md:h-[480px] lg:h-[620px] rounded-[24px] overflow-hidden relative shadow-2xl z-0 transition-all duration-1000 transform mb-8 lg:mb-0 ${
              isPhotoVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <Image
              src="/images/trusted-clients/trusted-clients.png"
              alt="Trusted Clients Team"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* 3 Main Cards: Responsive Grid & Desktop Overlap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-end relative lg:absolute lg:bottom-0 lg:left-[25%] lg:right-0 z-20">

            {/* Card 1: CSAT Card */}
            <div
              ref={card1Ref}
              className={`relative p-4 sm:p-5 lg:p-7 flex flex-col justify-between min-h-[240px] sm:h-[280px] lg:h-[440px] w-full border border-white/10 transition-all duration-800 ease-out transform hover:-translate-y-2 ${
                isCard1Visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
              }`}
              style={{
                borderRadius: "22.6px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #7D2E91 37.82%, #000000 100%)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* CSAT Ribbon Badge */}
              <div className="absolute -top-5 right-4 w-11 sm:w-12 h-15 sm:h-16 z-30 drop-shadow-lg">
                <img
                  src="/images/trusted-clients/csat.svg"
                  alt="CSAT Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-normal text-white tracking-wide mb-3 sm:mb-4 lg:mb-8 font-duru">
                  CSAT
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-white/90 uppercase tracking-wider mb-2 font-intel">
                  4.9★ Customer Satisfaction
                </p>
                <p className="text-xs sm:text-[13px] text-white/70 leading-[1.6] font-normal font-intel">
                  Consistently delivering quality solutions with exceptional client experiences.
                </p>
              </div>

              <div className="text-xs sm:text-[13px] font-normal text-white/80 font-intel pb-1">
                4.9/5 Customer Satisfaction
              </div>
            </div>

            {/* Card 2: Great Place to Work® Certified */}
            <div
              ref={card2Ref}
              className={`relative p-4 sm:p-5 lg:p-7 flex flex-col justify-between min-h-[240px] sm:h-[280px] lg:h-[440px] w-full border border-white/10 transition-all duration-800 ease-out transform hover:-translate-y-2 ${
                isCard2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
              }`}
              style={{
                borderRadius: "22.6px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #3C2E91 37.82%, #000000 100%)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Badge Ribbon Top Right */}
              <div className="absolute -top-4 right-4 w-11 sm:w-12 h-15 sm:h-16 z-30 drop-shadow-lg">
                <img
                  src="/images/trusted-clients/greate-place-to-work.svg"
                  alt="Great Place to Work Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl lg:text-[25px] font-normal text-white tracking-wide leading-[1.25] mb-3 sm:mb-4 lg:mb-8 pr-4 font-duru">
                  Great Place to Work® Certified
                </h3>
                <p className="text-xs sm:text-[13px] text-white/70 leading-[1.6] font-normal font-intel">
                  An innovation-driven culture that empowers people to build extraordinary technology.
                </p>
              </div>

              <div className="text-xs sm:text-[13px] font-normal text-white/80 leading-snug font-intel pb-1">
                Certified Great Place to Work® <br />
                Innovation-Driven Culture
              </div>
            </div>

            {/* Card 3: Clutch */}
            <div
              ref={card3Ref}
              className={`relative p-4 sm:p-5 lg:p-7 flex flex-col justify-between min-h-[240px] sm:h-[280px] lg:h-[440px] w-full border border-white/10 transition-all duration-800 ease-out transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1 ${
                isCard3Visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
              }`}
              style={{
                borderRadius: "22.6px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #7D2E91 37.82%, #000000 100%)",
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
              }}
            >
              {/* Clutch Logo Top Right */}
              <div className="absolute -top-3 right-4 w-11 sm:w-12 h-13 sm:h-14 z-30 drop-shadow-lg">
                <img
                  src="/images/trusted-clients/clutch.svg"
                  alt="Clutch Logo Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-normal text-white tracking-wide mb-3 sm:mb-4 lg:mb-5 font-duru">
                  Clutch
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-white/90 uppercase tracking-wider mb-2 font-intel">
                  Top Rated Technology Partner
                </p>
                <p className="text-xs sm:text-[13px] text-white/70 leading-[1.6] font-normal font-intel">
                  Recognized for delivering secure, scalable, and business-focused digital solutions.
                </p>
              </div>

              <div className="space-y-2 lg:space-y-3.5 text-xs sm:text-[13px] font-normal text-white/90 font-intel pb-1">
                <div>
                  <p className="text-white/60 text-[10.5px]">Average Review Rating</p>
                  <p className="font-semibold text-white text-xs sm:text-[13px] mt-0.5">4.9 (57 reviews)</p>
                </div>
                <div>
                  <p className="text-white/60 text-[10.5px]">Average Referral Rating</p>
                  <p className="font-bold text-white text-lg sm:text-[22px] mt-0.5">5.0 / 5</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
