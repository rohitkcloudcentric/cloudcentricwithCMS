"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const aiModels = [
  { src: "/images/how-we-build/open-ai.png",    alt: "OpenAI" },
  { src: "/images/how-we-build/anthropc.png",   alt: "Anthropic" },
  { src: "/images/how-we-build/llama.png",      alt: "Llama" },
  { src: "/images/how-we-build/qwen.png",       alt: "Qwen" },
  { src: "/images/how-we-build/deepseek.png",   alt: "DeepSeek" },
  { src: "/images/how-we-build/gemini.png",     alt: "Gemini" },
  { src: "/images/how-we-build/mistral-ai.png", alt: "Mistral AI" },
  { src: "/images/how-we-build/cohere.png",     alt: "Cohere" },
];

const aiCapabilities = [
  { src: "/images/how-we-build/agents.png",           alt: "Agents",          label: "Agents" },
  { src: "/images/how-we-build/rags.png",             alt: "RAG",             label: "RAG" },
  { src: "/images/how-we-build/tuning.png",           alt: "Tuning",          label: "Tuning" },
  { src: "/images/how-we-build/computer-vision.png",  alt: "Computer Vision", label: "Computer Vision" },
  { src: "/images/how-we-build/machine-learning.png", alt: "Machine Learning",label: "Machine Learning" },
  { src: "/images/how-we-build/and-more.png",         alt: "and More",        label: "and More" },
];

const businessSolutions = [
  { src: "/images/how-we-build/web.png",      alt: "Web",      label: "Web" },
  { src: "/images/how-we-build/mobile.png",   alt: "Mobile",   label: "Mobile" },
  { src: "/images/how-we-build/cloud.png",    alt: "Cloud",    label: "Cloud" },
  { src: "/images/how-we-build/data.png",     alt: "Data",     label: "Data" },
  { src: "/images/how-we-build/voice.png",    alt: "Voice",    label: "Voice" },
  { src: "/images/how-we-build/and-more.png", alt: "and More", label: "and More" },
];

const devTech = [
  { src: "/images/how-we-build/python.png",   alt: "Python" },
  { src: "/images/how-we-build/php.png",      alt: "PHP" },
  { src: "/images/how-we-build/java.png",     alt: "Java" },
  { src: "/images/how-we-build/rails.png",    alt: "Rails" },
  { src: "/images/how-we-build/go.png",       alt: "Go" },
  { src: "/images/how-we-build/node-js.png",  alt: "Node.js" },
  { src: "/images/how-we-build/c-sharp.png",  alt: "C#" },
  { src: "/images/how-we-build/c-sharp-icon.png", alt: "and More" },
];

const LEFT_W = 230;
const LEFT_BG = "#0d0d11";
const BORDER_COLOR = "#1E1E2A";
const MONO = "var(--font-intel-one-mono), monospace";

interface LeftPanelProps {
  icon: string;
  iconAlt: string;
  title: string;
  subtitle: string;
}

function LeftPanel({ icon, iconAlt, title, subtitle }: LeftPanelProps) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-4 sm:px-5 sm:py-5 shrink-0 self-stretch w-full lg:w-[290px] "
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] overflow-hidden shrink-0 mt-0.5">
        <Image src={icon} alt={iconAlt} width={44} height={44} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white leading-snug font-intel whitespace-pre-line">
          {title}
        </p>
        <p className="text-xs sm:text-sm text-white/45 leading-snug font-intel whitespace-pre-line">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HowWeBuild() {
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
    <section ref={sectionRef} className="w-full bg-[#050505] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto overflow-hidden">

        {/* ── Section Header ── */}
        <div className={`mb-8 sm:mb-10 transition-all duration-800 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`} style={{ transitionDelay: "150ms" }}>
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "linear-gradient(90deg, #2F89FF, #B021F0)" }} />
            <span className="text-xs tracking-widest uppercase font-intel text-[#A78BFA]">
              How We Build
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-6" style={{ background: BORDER_COLOR }} />

          {/* Heading + Description row */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white leading-snug shrink-0 lg:w-[45%] font-duru">
              Building the Future with AI<br className="hidden sm:inline" /> &amp; Modern Engineering
            </h2>
            <p className="text-sm sm:text-base text-white/50 leading-relaxed lg:pt-1 font-intel">
              We combine AI, Salesforce, cloud platforms, and modern development frameworks to build secure, scalable, and future-ready digital solutions.
            </p>
          </div>
        </div>

        {/* ── ROW 1: AI Models & Intelligence (Comes from Left) ── */}
        <div 
          className={`flex flex-col lg:flex-row items-stretch mb-4 rounded-[8px] overflow-hidden transition-all duration-800 ease-out transform hover:border-white/20 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`} 
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}`, transitionDelay: "200ms" }}
        >
          <LeftPanel
            icon="/images/how-we-build/ai-models.png"
            iconAlt="AI Models"
            title={"AI Models &\nIntelligence"}
            subtitle={"Leverage the world's\nleading AI models"}
          />
          {/* logo grid */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 lg:grid-rows-2 p-2">
            {aiModels.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-center min-h-[55px] sm:min-h-[70px] transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt={m.alt} className="transition-opacity duration-300 hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 2: AI Capabilities (Comes from Right) ── */}
        <div
          className={`flex flex-col lg:flex-row items-stretch my-4 rounded-[8px] overflow-hidden transition-all duration-800 ease-out transform hover:border-white/20 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}`, transitionDelay: "400ms" }}
        >
          <LeftPanel
            icon="/images/how-we-build/ai-capabilites.png"
            iconAlt="AI Capabilities"
            title={"AI Capabilities"}
            subtitle={"From AI assistants to\nadvanced analytics"}
          />
          {/* capability tiles */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 p-2 gap-2 sm:gap-1.5 items-center justify-items-center">
            {aiCapabilities.map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center min-h-[60px] transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} className="max-w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: Business Solutions (Comes from Left) ── */}
        <div
          className={`flex flex-col lg:flex-row items-stretch mb-4 rounded-[8px] overflow-hidden transition-all duration-800 ease-out transform hover:border-white/20 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}`, transitionDelay: "600ms" }}
        >
          <LeftPanel
            icon="/images/how-we-build/business-solutions.png"
            iconAlt="Business Solutions"
            title={"Business Solutions"}
            subtitle={"End-to-end digital\nbusiness platforms"}
          />
          {/* solution tiles */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 p-2 gap-2 items-center justify-items-center">
            {businessSolutions.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center min-h-[60px] transition-transform duration-300 hover:scale-105 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} className="max-w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 4: Development Technologies (Comes from Right) ── */}
        <div
          className={`flex flex-col lg:flex-row items-stretch rounded-[8px] mt-4 p-2 gap-2 overflow-hidden transition-all duration-800 ease-out transform hover:border-white/20 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}`, transitionDelay: "800ms" }}
        >
          <LeftPanel
            icon="/images/how-we-build/development-tecgnologies.png"
            iconAlt="Development Technologies"
            title={"Development\nTechnologies"}
            subtitle={"Built with enterprise-\ngrade technologies"}
          />
          {/* tech logo grid */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 lg:grid-rows-2 p-2">
            {devTech.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-center min-h-[55px] sm:min-h-[70px] transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt={t.alt} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
