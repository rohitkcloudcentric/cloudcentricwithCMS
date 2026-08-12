"use client";

import { useState, useEffect } from "react";
import CaseStudyCard, { CaseStudyPost } from "./CaseStudyCard";
import { CaseStudyCategory } from "./CaseStudyHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SAMPLE_CASE_STUDIES: CaseStudyPost[] = [
  {
    id: "cs-1",
    title: "Automating Business Operations With AI",
    slug: "automating-business-operations-with-ai",
    category: "AI & Automation",
    challenge: "Manual workflows were slowing teams down and creating operational bottlenecks.",
    solution: "AI-powered automation connected key processes and reduced repetitive work.",
    impacts: ["FASTER OPERATIONS", "HIGHER PRODUCTIVITY", "BETTER SCALABILITY"],
    image: "/images/case-studies/case-studies-1.png",
  },
  {
    id: "cs-2",
    title: "Scaling Enterprise Support with Salesforce Agentforce",
    slug: "scaling-enterprise-support-salesforce-agentforce",
    category: "Salesforce",
    challenge: "High ticket volumes and delayed support responses were impacting customer satisfaction scores.",
    solution: "Deployed autonomous Salesforce Agentforce assistants to handle complex tier-1 queries in real time.",
    impacts: ["64% DEFLECTION", "SUB-MINUTE RESOLUTION", "24/7 AVAILABILITY"],
    image: "/images/case-studies/case-studies-2.png",
  },
  {
    id: "cs-3",
    title: "Modernizing Core Architecture for Digital Transformation",
    slug: "modernizing-core-architecture-digital-transformation",
    category: "Digital Transformation",
    challenge: "Legacy monolithic systems struggled to handle peak traffic demands and rapid feature rollouts.",
    solution: "Migrated legacy infrastructure to cloud-native microservices with automated event-driven pipelines.",
    impacts: ["99.99% UPTIME", "10X DEPLOYMENT SPEED", "ZERO DOWNTIME"],
    image: "/images/case-studies/case-studies-3.png",
  },
  {
    id: "cs-4",
    title: "Architecting Cloud Infrastructure for Generative AI Models",
    slug: "architecting-cloud-infrastructure-generative-ai",
    category: "Technology",
    challenge: "High latency and unoptimized GPU cloud infrastructure increased AI operational costs significantly.",
    solution: "Engineered auto-scaling multi-region Kubernetes clusters optimized for LLM inference workloads.",
    impacts: ["40% COST REDUCTION", "SUB-50MS LATENCY", "ENTERPRISE SECURITY"],
    image: "/images/case-studies/case-studies-1.png",
  },
  {
    id: "cs-5",
    title: "Building Intelligent B2B SaaS Product Workflows",
    slug: "building-intelligent-b2b-saas-product-workflows",
    category: "Product",
    challenge: "Complex user onboarding flows resulted in user drop-offs and lower feature adoption rates.",
    solution: "Redesigned conversational UX interfaces driven by context-aware AI copilots for enterprise users.",
    impacts: ["3.5X ADOPTION", "ENHANCED RETENTION", "INTUITIVE UX"],
    image: "/images/case-studies/case-studies-2.png",
  },
  {
    id: "cs-6",
    title: "AI-Powered Real-Time Data Pipeline & Analytics",
    slug: "ai-powered-real-time-data-pipeline-analytics",
    category: "AI & Automation",
    challenge: "Fragmented data silos delayed operational decision-making across international market branches.",
    solution: "Unified streaming data pipelines with predictive machine learning forecasting models.",
    impacts: ["REAL-TIME INSIGHTS", "99.8% ACCURACY", "SEAMLESS INTEGRATION"],
    image: "/images/case-studies/case-studies-3.png",
  },
];

interface CaseStudyListingProps {
  activeCategory?: CaseStudyCategory;
  posts?: CaseStudyPost[];
}

export default function CaseStudyListing({ activeCategory = "All", posts = SAMPLE_CASE_STUDIES }: CaseStudyListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Filter posts based on selected category
  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((post) => post.category === activeCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <section className="w-full bg-[#050505] text-white py-12 sm:py-16 px-6 sm:px-10 lg:px-16 z-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {currentPosts.length > 0 ? (
          <div className="flex flex-col space-y-10">
            {currentPosts.map((post, idx) => (
              <CaseStudyCard key={post.id} post={post} index={(currentPage - 1) * postsPerPage + idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <p className="text-lg text-white/60 font-intel-one-mono">No case studies found in {activeCategory}.</p>
            <p className="text-xs text-white/40 font-intel-one-mono">Check back soon for new case studies!</p>
          </div>
        )}

        {/* ── Pagination Bar Centered ── */}
        {filteredPosts.length > 0 && (
          <div className="pt-4 flex items-center justify-center space-x-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
              className="w-9 h-9 rounded-md border border-white/20 hover:border-white/50 disabled:opacity-30 disabled:hover:border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-md border text-xs font-mono transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? "border-white bg-white text-black font-bold"
                    : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="w-9 h-9 rounded-md border border-white/20 hover:border-white/50 disabled:opacity-30 disabled:hover:border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
