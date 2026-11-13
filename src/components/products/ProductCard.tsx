"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, MoveRight } from "lucide-react";
import CaseStudyImage from "@/components/case-studies/CaseStudyImage";
import type { ProductPost } from "./product-types";

const ACCENT = "#3B82F6";
const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;

interface ProductCardProps {
  product: ProductPost;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
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
  const features = product.features.slice(0, 4);

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
          <h2 className="text-2xl sm:text-[32px] lg:text-[35px] font-normal text-white leading-[1.2] font-duru mb-6">
            <span style={{ color: ACCENT }}>{product.name}{product.subtitle ? " : " : ""}</span>
            {product.subtitle}
          </h2>

          {product.shortDescription && (
            <div className="flex flex-col mb-5">
              <span className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] mb-1" style={MONO}>
                Overview:
              </span>
              <p className="text-xs sm:text-[13px] text-white/50 leading-relaxed max-w-xl" style={MONO}>
                {product.shortDescription}
              </p>
            </div>
          )}

          {features.length > 0 && (
            <div className="flex flex-col mb-7">
              <span className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] mb-2" style={MONO}>
                Key Features:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-white/75 border border-white/20 bg-white/[0.02]"
                    style={MONO}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Details button disabled for now (product detail page not linked from the listing)
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center space-x-5 pl-6 pr-1.5 py-1.5 rounded-[14px] bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-md"
              style={MONO}
            >
              <span>View Details</span>
              <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-white text-[#3B82F6] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                <MoveRight className="w-5 h-5 stroke-[2] text-[#3B82F6]" />
              </div>
            </Link>
            */}

            {product.websiteUrl && (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[14px] border border-white/15 hover:border-white/30 text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white/80 hover:text-white transition-colors"
                style={MONO}
              >
                <span>Visit Website</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
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
          {product.image ? (
            <CaseStudyImage
              src={product.image}
              alt={product.name}
              sizes="(max-width: 1024px) 100vw, 530px"
              className="object-contain object-center rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03] rounded-2xl text-6xl font-duru text-white/30" aria-hidden="true">
              {product.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
