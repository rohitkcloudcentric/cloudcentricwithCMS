"use client";

import { useState, useEffect } from "react";
import CaseStudyCard, { CaseStudyPost } from "./CaseStudyCard";
import { CaseStudyCategory } from "./CaseStudyHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SAMPLE_CASE_STUDIES: CaseStudyPost[] = [
  {
    id: "cs-1",
    title: "AI-Powered Automation for Faster, Smarter Business Operations",
    slug: "automating-business-operations-with-ai",
    category: "AI & Automation",
    challenge: "We helped transform manual, repetitive business processes into intelligent workflows using AI-powered automation–reducing operational effort, improving productivity, and creating a more scalable way of working.",
    solution: "AI-powered automation connected key processes and reduced repetitive work.",
    impacts: ["FASTER OPERATIONS", "HIGHER PRODUCTIVITY", "BETTER SCALABILITY"],
    image: "/images/case-studies/case-studies-1.png",
    clientName: "ABC PVT LTD",
    industry: "MANUFACTURING",
    technologies: ["GENERATIVE AI", "CRM", "INTELLIGENT WORKFLOWS", "BETTER SCALABILITY", "CLOUD INFRASTRUCTURE", "APIS"],
    clientUrl: "/contact-us",
    challengeSubtitle: "Too Much Manual Work. Too Little Time.",
    challengeParagraph: "Too Much Manual Work. Too Little Time. The business relied on repetitive manual processes across teams, resulting in delays, duplicated effort, inconsistent data, and limited visibility. As operations grew, these challenges became harder to manage and created unnecessary pressure on teams.",
    challengeBullets: [
      "Repetitive manual processes",
      "Time-consuming data handling",
      "Disconnected workflows",
      "Delayed decision-making",
      "Limited operational visibility"
    ],
    approachSubtitle: "Turning Manual Processes Into Intelligent Workflows",
    approachIntro: "We analyzed the existing workflows to identify where AI and automation could create the greatest impact. Rather than replacing existing systems, we connected intelligent automation with the business's existing processes and technology ecosystem.",
    approachSteps: [
      { number: "01", title: "Identify", desc: "Find repetitive, high-impact processes suitable for automation." },
      { number: "02", title: "Design", desc: "Create intelligent workflows around real business requirements." },
      { number: "03", title: "Integrate", desc: "Connect AI with existing applications, data, and business systems." },
      { number: "04", title: "Automate", desc: "Deploy AI-powered workflows with appropriate human oversight." },
      { number: "05", title: "Optimize", desc: "Monitor performance and continuously improve the solution." }
    ],
    solutionSubtitle: "AI That Works Across the Business",
    solutionIntro: "We designed an intelligent automation layer capable of understanding requests, processing information, triggering workflows, and assisting teams with routine operational tasks.",
    solutionBullets: [
      { title: "Intelligent Workflow Automation", desc: "Automated repetitive processes and reduced unnecessary manual intervention." },
      { title: "AI-Powered Decision Support", desc: "Provided teams with relevant information and insights when they needed them." },
      { title: "Connected Business Systems", desc: "Integrated automation with existing applications and data sources." },
      { title: "Human-in-the-Loop", desc: "Kept people involved in important decisions while allowing AI to handle routine work." }
    ],
    impactSubtitle: "From Manual Operations to Intelligent Automation",
    impactQuote: "“The solution helped create a more efficient operating model by reducing repetitive work and enabling teams to focus on higher-value activities.”",
    impactBullets: [
      { title: "Reduced Manual Effort", desc: "More routine processes handled automatically." },
      { title: "Faster Operations", desc: "Less time spent moving information between systems." },
      { title: "Better Visibility", desc: "Improved access to operational information and insights." },
      { title: "Scalable Processes", desc: "Automation designed to support future business growth." }
    ]
  },
  {
    id: "cs-2",
    title: "Building a Scalable Salesforce Ecosystem",
    slug: "scaling-enterprise-support-salesforce-agentforce",
    category: "AI & Automation",
    challenge: "High ticket volumes and delayed support responses were impacting customer satisfaction scores.",
    solution: "Deployed autonomous Salesforce Agentforce assistants to handle complex tier-1 queries in real time.",
    impacts: ["64% DEFLECTION", "SUB-MINUTE RESOLUTION", "24/7 AVAILABILITY"],
    image: "/images/case-studies/case-studies-2.png",
    clientName: "GLOBAL TELECOM",
    industry: "TELECOMMUNICATIONS",
    technologies: ["SALESFORCE", "AGENTFORCE", "CRM INTEGRATION", "AI AGENTS", "CUSTOMER SERVICE"],
    clientUrl: "/contact-us"
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
    clientName: "FINTECH SOLUTIONS",
    industry: "FINANCIAL SERVICES",
    technologies: ["CLOUD NATIVE", "MICROSERVICES", "KUBERNETES", "DOCKER", "AWS"],
    clientUrl: "/contact-us"
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
    clientName: "NEURAL NETWORKS INC",
    industry: "TECHNOLOGY / AI",
    technologies: ["LLM INFERENCE", "GPU ORCHESTRATION", "KUBERNETES", "PYTORCH"],
    clientUrl: "/contact-us"
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
    clientName: "SAASIFY CORP",
    industry: "SOFTWARE AS A SERVICE",
    technologies: ["CONVERSATIONAL UI", "AI COCOPILOT", "UX RESEARCH", "REACT"],
    clientUrl: "/contact-us"
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
    clientName: "RETAIL METRICS GROUP",
    industry: "RETAIL & E-COMMERCE",
    technologies: ["PREDICTIVE ANALYTICS", "DATA STREAMING", "MACHINE LEARNING", "APIS"],
    clientUrl: "/contact-us"
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
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
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
