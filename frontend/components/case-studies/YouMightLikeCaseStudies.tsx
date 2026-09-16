"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CaseStudyCard, { CaseStudyPost } from "./CaseStudyCard";
import { SAMPLE_CASE_STUDIES } from "./CaseStudyListing";

interface YouMightLikeCaseStudiesProps {
  currentPostId?: string;
}

export default function YouMightLikeCaseStudies({ currentPostId }: YouMightLikeCaseStudiesProps) {
  // Filter out current post and take top 2 recommended case studies
  const recommendedPosts = SAMPLE_CASE_STUDIES.filter(
    (post) => post.id !== currentPostId
  ).slice(0, 2);

  return (
    <section className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 z-10 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* ── Section Header Row ── */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-normal font-duru text-white tracking-tight">
            You Might Like
          </h2>

          <Link
            href="/case-studies"
            className="px-5 py-2.5 rounded-full bg-[#12121A] border border-white/20 hover:border-white/40 text-xs sm:text-sm font-intel tracking-[0.18em] uppercase text-white font-extrabold flex items-center space-x-3 transition-colors cursor-pointer group shadow-lg"
          >
            <span>VIEW ALL</span>
            <div className="w-8 h-8 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4 text-[#7C3AED] stroke-[2.5]" />
            </div>
          </Link>
        </div>

        {/* ── Recommended Case Study Cards ── */}
        <div className="flex flex-col space-y-10">
          {recommendedPosts.map((post, idx) => (
            <CaseStudyCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
