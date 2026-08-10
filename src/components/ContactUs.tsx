"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import ContactForm from "./ContactForm";

export default function ContactUs() {
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
    <div ref={sectionRef} className="relative min-h-screen w-full bg-[#050505] text-white pt-8 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-radial from-[#8B3DFF]/20 via-[#4F8BFF]/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-radial from-[#4F8BFF]/20 via-[#8B3DFF]/10 to-transparent blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col space-y-16">
        {/* Main Hero Header */}
        <div className={`text-center space-y-2 pt-4 transition-all duration-800 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h1
            className="text-4xl sm:text-6xl lg:text-[72px] font-black uppercase text-white leading-tight"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            READY TO BUILD <br className="hidden sm:inline" />
            SOMETHING INTELLIGENT?
          </h1>
        </div>

        {/* Form and Right Hologram Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Contact Form Card — Comes from Left */}
          <div className={`lg:col-span-7 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`} style={{ transitionDelay: "200ms" }}>
            <ContactForm />
          </div>

          {/* Right Information & Global Presence Card — Comes from Right */}
          <div className={`lg:col-span-5 flex flex-col space-y-6 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`} style={{ transitionDelay: "400ms" }}>
            {/* Hologram Card - Matching exact reference design */}
            <div className="relative rounded-[20px] bg-[#0E0E13] border border-white/[0.08] p-6 h-[420px] overflow-visible flex flex-col items-center justify-start text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
              {/* Vertical light stripe column lines background */}
              <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none flex justify-around opacity-30">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-full border-r border-white/[0.05] bg-gradient-to-b from-[#181824]/40 via-transparent to-[#4F8BFF]/20"
                  />
                ))}
              </div>

              {/* Floating Top Right 3D Glass Prism/Cube Image-1.png */}
              <div className="absolute -top-6 -right-6 w-32 h-32 z-30 pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/Image-1.png"
                  alt="3D Glass Crystal"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Center Frosted Glass Title Badge */}
              <div className="relative z-20 mt-6 w-full max-w-[280px] rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] px-4 py-5 shadow-lg">
                <h3
                  className="text-xl sm:text-2xl font-normal text-white tracking-wide leading-snug"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  Meet Your <br /> Technology Partner
                </h3>
                <p
                  className="text-xs text-white/70 font-normal mt-2"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  10+ Years of Experience
                </p>
              </div>

              {/* Bottom Glowing Ray Wave Effect */}
              <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#4F8BFF]/25 via-[#8B3DFF]/15 to-transparent pointer-events-none rounded-b-[20px]" />
            </div>

            {/* Our Global Presence Section — Comes from Right smoothly */}
            <div className={`transition-all duration-800 ease-out transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`} style={{ transitionDelay: "500ms" }}>
              <h4
                className="text-md font-bold text-white tracking-wider mb-2"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                Our Global Presence
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center items-end pt-2">
                {/* India */}
                <div className={`flex flex-col items-start space-y-3 group transition-all duration-700 ease-out transform ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`} style={{ transitionDelay: "600ms" }}>
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/india.png"
                      alt="India Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    INDIA
                  </span>
                </div>

                {/* USA */}
                <div className={`flex flex-col items-center space-y-3 group transition-all duration-700 ease-out transform ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`} style={{ transitionDelay: "750ms" }}>
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/usa.png"
                      alt="USA Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    USA
                  </span>
                </div>

                {/* UK */}
                <div className={`flex flex-col items-center space-y-3 group transition-all duration-700 ease-out transform ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                }`} style={{ transitionDelay: "900ms" }}>
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/uk.png"
                      alt="UK Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    UK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Strip - Matching exact reference image with clickable anchor tags */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 text-xs font-normal">
          {/* Phone section — Comes from Left */}
          <div className={`flex items-center space-x-2 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`} style={{ transitionDelay: "1000ms" }}>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black shadow-sm shrink-0">
              <Phone className="w-3.5 h-3.5 fill-black stroke-black" />
            </div>
            <div className="flex items-center space-x-2">
              {["+91-7042912244", "+1-3024060272", "+44 7842243933"].map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="bg-[#111116] text-sm border border-white/[0.06] text-[#8535FA] px-3 py-1.5 rounded-md hover:border-[#8B3DFF]/80 hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>

          {/* Email section — Comes from Right */}
          <div className={`flex items-center space-x-2 ml-0 sm:ml-4 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`} style={{ transitionDelay: "1150ms" }}>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black shadow-sm shrink-0">
              <Mail className="w-3.5 h-3.5 stroke-black" />
            </div>
            <div className="flex items-center space-x-2">
              {["support@cccinfotech.com", "sales@cccinfotech.com"].map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="bg-[#111116] text-sm border border-white/[0.06] text-[#8535FA] px-3 py-1.5 rounded-md hover:border-[#8B3DFF]/80 hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>

       
      </div>
       
    </div>
  );
}
