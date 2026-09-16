"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { CaseStudyPost } from "./CaseStudyCard";

interface CaseStudyDetailsHeroProps {
  post: CaseStudyPost;
}

const getSubtags = (post: CaseStudyPost) => {
  switch (post.id) {
    case "cs-1":
      return "AI & Automation  •  Business Transformation";
    case "cs-2":
      return "Salesforce  •  Customer Support";
    case "cs-3":
      return "Digital Transformation  •  Core Modernization";
    case "cs-4":
      return "Technology  •  Cloud Infrastructure";
    case "cs-5":
      return "Product  •  Intelligent Workflows";
    case "cs-6":
      return "AI & Automation  •  Real-Time Analytics";
    default:
      return `${post.category}  •  Business Transformation`;
  }
};

export default function CaseStudyDetailsHero({ post }: CaseStudyDetailsHeroProps) {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center -mt-[96px] sm:-mt-[104px] pt-[130px] sm:pt-[150px] pb-12 px-6 sm:px-10  bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Soft Purple Radial Spotlight Glow (Bottom-Left) ── */}
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[500px] pointer-events-none z-0 opacity-70"
        style={{
          background: "radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.35) 0%, rgba(35, 14, 60, 0.1) 50%, transparent 75%)",
        }}
      />

      {/* ── Hero Content (Directly on Background) ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* Left Column: Title, Subtags, Description & CTA */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h1 
              className="text-3xl sm:text-5xl lg:text-[46px] font-normal text-white leading-[1.12] tracking-tight max-w-2xl"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              {post.title}
            </h1>
            
            <div 
              className="text-[11px] sm:text-xs tracking-[0.2em] font-extrabold uppercase text-[#C2BDCF] opacity-90 pt-1"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {getSubtags(post)}
            </div>

            <p 
              className="text-xs sm:text-[13.5px] text-[#8E8A9F] leading-relaxed font-light max-w-xl pt-2"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {post.challenge}
            </p>
          </div>

          {/* CTA Action Button */}
          <div className="pt-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center space-x-6 pl-7 pr-2 py-2 rounded-[20px] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/35 hover:border-[#7C3AED]/50 transition-all duration-300 font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-[0_0_25px_rgba(124,58,237,0.15)] hover:shadow-[0_0_35px_rgba(124,58,237,0.25)]"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              <span>TALK TO AN AI EXPERT</span>
              <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-white text-[#7C3AED] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                <MoveRight className="w-5 h-5 stroke-[2] text-[#7C3AED]" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Diagram Box */}
        <div className="w-full lg:w-[540px] xl:w-[580px] h-[300px] sm:h-[380px] lg:h-[400px] rounded-[24px] overflow-hidden shrink-0 relative border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-cover object-center"
          />
        </div>

      </div>
    </section>
  );
}
