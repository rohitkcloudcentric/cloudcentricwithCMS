"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import CaseStudyImage from "./CaseStudyImage";

export interface TitleDescItem {
  title: string;
  desc: string;
}

/** Case study as consumed by the public UI (built from the CMS in src/lib/case-study-data.ts). */
export interface CaseStudyPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  /** Short description */
  excerpt: string;
  /** Short challenge text for the card */
  challenge: string;
  /** Short solution text for the card */
  solution: string;
  /** Impact pills */
  impacts: string[];
  technologies: string[];
  tags: string[];
  /** Thumbnail for cards */
  image: string;
  clientName: string;
  industry: string;
  metaDescription: string;
  /** ISO date */
  date: string;
  // ── Detail-page fields ──
  seoTitle?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  overview?: string;
  challengeTitle?: string;
  /** Sanitized HTML */
  challengeHtml?: string;
  keyChallenges?: string[];
  approachTitle?: string;
  approachHtml?: string;
  approachSteps?: TitleDescItem[];
  solutionTitle?: string;
  solutionHtml?: string;
  solutionHighlights?: TitleDescItem[];
  impactTitle?: string;
  impactHtml?: string;
  impactHighlights?: TitleDescItem[];
  galleryImages?: string[];
}

interface CaseStudyCardProps {
  post: CaseStudyPost;
  index: number;
}

export default function CaseStudyCard({ post, index }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEvenCard = index % 2 === 1;

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${(index % 3) * 140}ms` }}
      className={`group w-full rounded-[24px] bg-[#07070C] border border-white/[0.1] hover:border-white/[0.25] hover:-translate-y-1.5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_60px_rgba(0,0,0,0.9)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(124,58,237,0.15)] p-7 sm:p-9 lg:p-11 overflow-hidden relative ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-[0.97]"
      }`}
    >
      {/* Soft Purple Radial Glow (Bottom-Left for Odd cards, Bottom-Right for Even cards) */}
      <div 
        className={`absolute bottom-0 w-[450px] h-[350px] pointer-events-none z-0 opacity-80 ${
          isEvenCard ? "right-0 rounded-br-[24px]" : "left-0 rounded-bl-[24px]"
        }`}
        style={{
          background: isEvenCard
            ? "radial-gradient(circle at bottom right, rgba(88, 38, 133, 0.35) 0%, rgba(35, 14, 60, 0.15) 50%, transparent 75%)"
            : "radial-gradient(circle at bottom left, rgba(88, 38, 133, 0.35) 0%, rgba(35, 14, 60, 0.15) 50%, transparent 75%)",
        }}
      />

      <div className={`relative z-10 flex flex-col items-center justify-between gap-8 lg:gap-12 ${
        isEvenCard ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}>
        {/* Text Details Column */}
        <div className={`flex-1 flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : isEvenCard 
              ? "opacity-0 translate-x-12 sm:translate-x-16" 
              : "opacity-0 -translate-x-12 sm:-translate-x-16"
        }`}>
          {/* Title */}
          <h2 className="text-2xl sm:text-[32px] lg:text-[35px] font-normal text-white leading-[1.2] font-duru mb-6">
            {post.title}
          </h2>

          {/* Short Description (optional) */}
          {post.excerpt && (
            <p
              className="text-xs sm:text-[13px] text-white/60 leading-relaxed font-intel-one-mono max-w-xl -mt-2 mb-5"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Challenge Section */}
          {post.challenge && (
          <div className="flex flex-col mb-5">
            <span 
              className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] font-intel-one-mono mb-1"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Challenge:
            </span>
            <p 
              className="text-xs sm:text-[13px] text-white/50 leading-relaxed font-intel-one-mono max-w-xl"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {post.challenge}
            </p>
          </div>
          )}

          {/* Solution Section */}
          {post.solution && (
          <div className="flex flex-col mb-6">
            <span 
              className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] font-intel-one-mono mb-1"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Solution:
            </span>
            <p 
              className="text-xs sm:text-[13px] text-white/50 leading-relaxed font-intel-one-mono max-w-xl"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {post.solution}
            </p>
          </div>
          )}

          {/* Impact Section */}
          {post.impacts.length > 0 && (
          <div className="flex flex-col mb-7">
            <span 
              className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] font-intel-one-mono mb-2"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Impact:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {post.impacts.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-white/75 border border-white/20 bg-white/[0.02] font-intel-one-mono"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          )}

          {/* Read Case Study Button */}
          <div>
            <Link
              href={`/case-studies/${post.slug}`}
              aria-label={`Read case study: ${post.title}`}
              className="inline-flex items-center space-x-5 pl-6 pr-1.5 py-1.5 rounded-[14px] bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-md"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              <span>READ CASE STUDY</span>
              <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-white text-[#3B82F6] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                <MoveRight className="w-5 h-5 stroke-[2] text-[#3B82F6]" />
              </div>
            </Link>
          </div>
        </div>

        {/* Image Graphics Column */}
        <div className={`w-full lg:w-[480px] xl:w-[530px] h-[280px] sm:h-[340px] lg:h-[370px] rounded-[18px] overflow-hidden shrink-0 relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : isEvenCard 
              ? "opacity-0 -translate-x-12 sm:-translate-x-16" 
              : "opacity-0 translate-x-12 sm:translate-x-16"
        }`}>
          <CaseStudyImage
            src={post.image}
            alt={post.title}
            sizes="(max-width: 1024px) 100vw, 530px"
            className="object-cover object-center rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
}
