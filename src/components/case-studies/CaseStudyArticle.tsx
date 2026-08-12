"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, BookOpen, ChevronRight, ArrowRight, Zap, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { CaseStudyPost } from "./CaseStudyCard";
import { SAMPLE_CASE_STUDIES } from "./CaseStudyListing";

interface CaseStudyArticleProps {
  post: CaseStudyPost;
}

export default function CaseStudyArticle({ post }: CaseStudyArticleProps) {
  // Recent case studies for sidebar widget excluding current post
  const recentPosts = SAMPLE_CASE_STUDIES.filter((p) => p.id !== post.id).slice(0, 2);

  const categories = [
    { name: "AI & Automation", count: 5 },
    { name: "Salesforce", count: 3 },
    { name: "Digital Transformation", count: 4 },
    { name: "Technology", count: 5 },
    { name: "Product", count: 2 },
  ];

  const tags = ["AI Agents", "Salesforce", "Automation", "Cloud Infrastructure", "Enterprise", "Data Cloud", "LLMs", "DevOps"];

  return (
    <article className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14">
        
        {/* ── Left Main Column: Article Content ── */}
        <div className="flex-1 min-w-0 space-y-8 font-intel">
          {/* Back Navigation Button */}
          <div>
            <Link
              href="/case-studies"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to All Case Studies</span>
            </Link>
          </div>

          {/* Section 1: Executive Challenge */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              Executive Challenge
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Enterprise operations were facing significant friction due to manual bottlenecks and disconnected legacy systems.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              {post.challenge}
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Prior to partnering with CloudCentric, the organization required scalable automation to streamline cross-departmental operations and maintain high compliance standards.
            </p>
          </div>

          {/* Section 2: Technical Architecture & Solution */}
          <div className="space-y-4 pt-4">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              Technical Solution
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              {post.solution}
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              CloudCentric deployed custom AI workflow engines integrated directly with core enterprise applications, featuring real-time feedback loops and role-based security governance.
            </p>
            
            <p className="text-xs sm:text-sm lg:text-base text-white/80 font-medium pt-2">
              Key Engineering Highlights:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm lg:text-base text-white/70 font-light pl-2">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#A855F7] shrink-0 mt-0.5" />
                <span>Multi-step autonomous agent execution with human-in-the-loop review.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#A855F7] shrink-0 mt-0.5" />
                <span>Sub-second API latency across distributed multi-region cloud backends.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#A855F7] shrink-0 mt-0.5" />
                <span>Built-in SOC2 Type II compliance, zero-trust data protection, and full audit logs.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#A855F7] shrink-0 mt-0.5" />
                <span>Continuous observability pipelines monitoring model accuracy and system throughput.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Measurable Business Results */}
          <div className="space-y-4 pt-4">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              Business Results &amp; Impact
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Within 90 days of initial deployment, the platform delivered immediate ROI and established a resilient foundation for long-term digital growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {post.impacts.map((impact, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 text-[#A855F7]">
                    <Zap className="w-4 h-4" />
                    <span className="text-[11px] uppercase tracking-wider font-semibold font-intel">Outcome {idx + 1}</span>
                  </div>
                  <span className="text-xl font-bold font-duru text-white">{impact}</span>
                  <span className="text-xs text-white/50 font-intel">Verified Performance</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Banner */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#2563EB]/20 via-[#7C3AED]/20 to-[#A855F7]/20 border border-[#7C3AED]/40 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
            <div className="flex flex-col space-y-2">
              <h3 className="text-xl sm:text-2xl font-duru text-white">Ready for similar results in your organization?</h3>
              <p className="text-xs sm:text-sm text-white/70 font-intel">Schedule a strategic consultation with our AI &amp; enterprise architects today.</p>
            </div>
            <Link
              href="/contact-us"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-white/90 transition-all shrink-0 font-intel shadow-lg"
            >
              Contact Architect
            </Link>
          </div>
        </div>

        {/* ── Right Sidebar Column: Widgets ── */}
        <aside className="w-full lg:w-[360px] shrink-0 space-y-8 font-intel">
          {/* Widget 1: Recent Case Studies */}
          <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(14,14,20,0.8)] border border-white/15 space-y-6 shadow-xl">
            <h3 className="text-xl font-normal text-white font-duru tracking-tight pb-3 border-b border-white/10">
              Recent Case Studies
            </h3>

            <div className="space-y-5">
              {recentPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/case-studies/${item.slug}`}
                  className="group flex items-start space-x-4 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 border border-white/15 bg-[#08080E]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 flex flex-col space-y-1">
                    <h4 className="text-xs sm:text-sm text-white/90 group-hover:text-white font-normal line-clamp-2 leading-snug font-duru">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#A855F7] font-semibold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 2: Categories List */}
          <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(14,14,20,0.8)] border border-white/15 space-y-5 shadow-xl">
            <h3 className="text-xl font-normal text-white font-duru tracking-tight pb-3 border-b border-white/10">
              Categories
            </h3>

            <div className="space-y-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href="/case-studies"
                  className="flex items-center justify-between py-1.5 text-xs sm:text-sm text-white/70 hover:text-white transition-colors group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80 font-mono">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 3: Popular Tags Cloud */}
          <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(14,14,20,0.8)] border border-white/15 space-y-5 shadow-xl">
            <h3 className="text-xl font-normal text-white font-duru tracking-tight pb-3 border-b border-white/10">
              Popular Tags
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] text-white/70 border border-white/15 bg-white/[0.03] hover:border-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
