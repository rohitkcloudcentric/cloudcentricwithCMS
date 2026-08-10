"use client";

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
      className="flex items-center gap-4 px-5 py-5 shrink-0 self-stretch"
      style={{ width: LEFT_W }}
    >
      <div className="w-11 h-11 rounded-[10px] overflow-hidden shrink-0 mt-0.5">
        <Image src={icon} alt={iconAlt} width={44} height={44} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold tracking-wider uppercase text-white leading-snug font-intel">
          {title}
        </p>
        <p className="text-sm text-white/45 leading-snug font-intel">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HowWeBuild() {
  return (
    <section className="w-full bg-[#050505] py-20 px-4 md:px-8 lg:px-12 text-white overflow-hidden">
      <div
        className="max-w-7xl mx-auto  overflow-hidden"

      >

        {/* ── Section Header ── */}
        <div className="mb-8">
          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: "linear-gradient(90deg, #2F89FF, #B021F0)" }} />
            <span
              className="text-xs tracking-widest uppercase font-intel text-[#A78BFA]"
            >
              How We Build
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-6" style={{ background: BORDER_COLOR }} />

          {/* Heading + Description row */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
            <h2
              className="text-3xl md:text-4xl font-normal text-white leading-snug shrink-0 md:w-[45%] font-duru"
            >
              Building the Future with AI<br />& Modern Engineering
            </h2>
            <p
              className="text-md text-white/50 leading-relaxed md:pt-1 font-intel"
            >
              We combine AI, Salesforce, cloud platforms, and modern
              development frameworks to build secure, scalable, and
              future-ready digital solutions.
            </p>
          </div>
        </div>

        {/* ── ROW 1: AI Models & Intelligence ── */}
        <div className="flex items-stretch mb-3 rounded-[8px]" style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}` }}>
          <LeftPanel
            icon="/images/how-we-build/ai-models.png"
            iconAlt="AI Models"
            title={"AI Models &\nIntelligence"}
            subtitle={"Leverage the world's\nleading AI models"}
          />
          {/* 2×4 logo grid — glassmorphism bg */}
          <div
            className="flex-1 grid grid-cols-4 grid-rows-2 p-2"
            
          >
            {aiModels.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  borderRight: (i + 1) % 4 !== 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                  borderBottom: i < 4 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt={m.alt} className="object-contain w-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 2: AI Capabilities ── */}
        <div
          className="flex items-stretch my-3 rounded-[8px]"
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}` }}
        >
          <LeftPanel
            icon="/images/how-we-build/ai-capabilites.png"
            iconAlt="AI Capabilities"
            title={"AI Capabilities"}
            subtitle={"From AI assistants to\nadvanced analytics"}
          />
          {/* 6 capability tiles — dark glassmorphism */}
          <div className="flex-1 grid grid-cols-6 p-2 gap-1.5">
            {aiCapabilities.map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} className="" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 3: Business Solutions ── */}
        <div
          className="flex items-stretch mb-3 rounded-[8px]"
          style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}` }}
        >
          <LeftPanel
            icon="/images/how-we-build/business-solutions.png"
            iconAlt="Business Solutions"
            title={"Business Solutions"}
            subtitle={"End-to-end digital\nbusiness platforms"}
          />
          {/* 6 solution tiles — dark glassmorphism */}
          <div className="flex-1 grid grid-cols-6 p-2 gap-1.5">
            {businessSolutions.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} className="" />
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 4: Development Technologies ── */}
        <div className="flex items-stretch rounded-[8px] mt-4" style={{ background: "rgba(255, 255, 255, 0.06)", border: `1px solid ${BORDER_COLOR}` }}>
          <LeftPanel
            icon="/images/how-we-build/development-tecgnologies.png"
            iconAlt="Development Technologies"
            title={"Development\nTechnologies"}
            subtitle={"Built with enterprise-\ngrade technologies"}
          />
          {/* 2×4 tech logo grid — glassmorphism bg */}
          <div className="flex-1 grid grid-cols-4 grid-rows-2 p-2">
            {devTech.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  borderRight: (i + 1) % 4 !== 0 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                  borderBottom: i < 4 ? "0.5px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.src} alt={t.alt} className="object-contain w-auto" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
