"use client";

import { useState, useEffect } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import { BlogCategory } from "./BlogHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "How AI Agents Are Changing Business Automation",
    slug: "how-ai-agents-are-changing-business-automation",
    category: "AI & Automation",
    description: "AI agents are moving beyond simple chatbots to automate complex multi-step tasks, decision-making, and end-to-end workflows...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-1.png",
  },
  {
    id: "2",
    title: "AI Agents vs Traditional Automation: What's the Difference?",
    slug: "ai-agents-vs-traditional-automation",
    category: "AI & Automation",
    description: "Understand where AI agents fit into modern business automation compared to traditional rule-based workflows and RPA systems...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-1.png",
  },
  {
    id: "3",
    title: "How Agentforce Is Transforming Customer Engagement",
    slug: "how-agentforce-is-transforming-customer-engagement",
    category: "Salesforce",
    description: "Explore how AI-powered agents can help Salesforce users automate interactions and deliver more intelligent customer experiences...",
    readTime: "6 MIN READ",
    image: "/images/what we-do/ai-automation.png",
  },
  {
    id: "4",
    title: "Architecting Scalable Cloud Infrastructure for Generative AI",
    slug: "architecting-scalable-cloud-infrastructure-for-generative-ai",
    category: "Technology",
    description: "Explore best practices for designing low-latency, resilient cloud backend architecture tailored for LLM workloads...",
    readTime: "7 MIN READ",
    image: "/images/what we-do/custom-ai-development.png",
  },
  {
    id: "5",
    title: "Digital Transformation Strategies for Modern Enterprises",
    slug: "digital-transformation-strategies-for-modern-enterprises",
    category: "Digital Transformation",
    description: "How legacy enterprise companies can systematically adopt AI, cloud systems, and modern digital platforms efficiently...",
    readTime: "4 MIN READ",
    image: "/images/build-smarter-1.png",
  },
  {
    id: "6",
    title: "Building High-Impact AI SaaS Products in 2026",
    slug: "building-high-impact-ai-saas-products-in-2026",
    category: "Product",
    description: "Key insights on product design, user experience, and scalable software architecture when launching AI-powered SaaS solutions...",
    readTime: "6 MIN READ",
    image: "/images/build-the-right.png",
  },
  {
    id: "7",
    title: "The Future of Autonomous Enterprise AI Solutions",
    slug: "the-future-of-autonomous-enterprise-ai-solutions",
    category: "Insights",
    description: "Emerging trends and strategic roadmaps for enterprise leaders looking to stay ahead with next-generation AI innovation...",
    readTime: "5 MIN READ",
    image: "/images/what we-do/ai-strategy-card-1.png",
  },
  {
    id: "8",
    title: "Optimizing Salesforce Data Clouds for Real-Time Analytics",
    slug: "optimizing-salesforce-data-clouds-for-real-time-analytics",
    category: "Salesforce",
    description: "Unify customer data streams and power predictive AI models with modern Salesforce Data Cloud integrations...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-2.png",
  },
  {
    id: "9",
    title: "Maximizing ROI with Custom AI Models & Fine-Tuning",
    slug: "maximizing-roi-with-custom-ai-models",
    category: "AI & Automation",
    description: "Learn how tailored small language models and domain-specific fine-tuning deliver superior accuracy and privacy...",
    readTime: "6 MIN READ",
    image: "/images/build-smarter.png",
  },
  {
    id: "10",
    title: "Zero-Trust Security Frameworks for AI Data Pipelines",
    slug: "zero-trust-security-frameworks-for-ai-data-pipelines",
    category: "Technology",
    description: "Protect sensitive customer data and prevent prompt injection vulnerabilities across enterprise AI infrastructure...",
    readTime: "8 MIN READ",
    image: "/images/building-intelligent/Container-3.png",
  },
  {
    id: "11",
    title: "Scaling Intelligent Workflows Across Global Teams",
    slug: "scaling-intelligent-workflows-across-global-teams",
    category: "Digital Transformation",
    description: "Streamline cross-departmental operations and eliminate operational bottlenecks with autonomous workflow engines...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-1.png",
  },
  {
    id: "12",
    title: "Designing Conversational Interfaces for Enterprise Users",
    slug: "designing-conversational-interfaces-for-enterprise-users",
    category: "Product",
    description: "UI/UX principles for building natural, intuitive conversational interfaces that drive real business productivity...",
    readTime: "4 MIN READ",
    image: "/images/what we-do/ai-automation.png",
  },
  {
    id: "13",
    title: "Salesforce Einstein AI Integration: A Complete Implementation Guide",
    slug: "salesforce-einstein-ai-integration-guide",
    category: "Salesforce",
    description: "Step-by-step best practices for integrating Einstein AI predictions into Service Cloud and custom Lightning apps...",
    readTime: "7 MIN READ",
    image: "/images/what we-do/custom-ai-development.png",
  },
  {
    id: "14",
    title: "Autonomous Supply Chain Optimization Powered by AI",
    slug: "autonomous-supply-chain-optimization-powered-by-ai",
    category: "AI & Automation",
    description: "Leverage predictive analytics and intelligent agents to forecast inventory demand and optimize global logistics...",
    readTime: "6 MIN READ",
    image: "/images/build-smarter-1.png",
  },
  {
    id: "15",
    title: "Key AI Trends Shaping Enterprise Software Development",
    slug: "key-ai-trends-shaping-enterprise-software-development",
    category: "Insights",
    description: "A comprehensive look at how AI coding assistants, automated testing, and synthetic data are reshaping dev teams...",
    readTime: "5 MIN READ",
    image: "/images/build-the-right.png",
  },
  {
    id: "16",
    title: "Modernizing Legacy Backends with Microservices & Cloud Native AI",
    slug: "modernizing-legacy-backends-with-microservices",
    category: "Technology",
    description: "Migrate monolithic architectures to cloud-native microservices equipped with event-driven AI endpoints...",
    readTime: "8 MIN READ",
    image: "/images/what we-do/ai-strategy-card-1.png",
  },
  {
    id: "17",
    title: "Customer Experience Automation: Elevating Retention with AI",
    slug: "customer-experience-automation-elevating-retention",
    category: "Digital Transformation",
    description: "Personalize every customer touchpoint with automated real-time recommendations and proactive customer support...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-2.png",
  },
  {
    id: "18",
    title: "Creating Seamless Omni-Channel Portals on Salesforce Experience Cloud",
    slug: "creating-seamless-omni-channel-portals-on-salesforce",
    category: "Salesforce",
    description: "Build branded, lightning-fast customer and partner portals backed by Salesforce CRM and automated AI chat...",
    readTime: "6 MIN READ",
    image: "/images/build-smarter.png",
  },
  {
    id: "19",
    title: "Product Roadmap Planning in the Era of Fast-Paced AI Tech",
    slug: "product-roadmap-planning-in-the-era-of-fast-paced-ai-tech",
    category: "Product",
    description: "How product managers can balance long-term vision with rapid iteration cycles when building AI software...",
    readTime: "5 MIN READ",
    image: "/images/building-intelligent/Container-3.png",
  },
  {
    id: "20",
    title: "Ethical AI Governance & Compliance for Enterprise Leadership",
    slug: "ethical-ai-governance-compliance-for-enterprise-leadership",
    category: "Insights",
    description: "Navigate AI safety, data privacy regulations, and auditability guidelines when deploying AI across large enterprises...",
    readTime: "7 MIN READ",
    image: "/images/building-intelligent/Container-1.png",
  },
];

interface BlogListingProps {
  activeCategory?: BlogCategory;
  posts?: BlogPost[];
}

export default function BlogListing({ activeCategory = "All", posts = SAMPLE_BLOG_POSTS }: BlogListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

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
    <section className="w-full bg-[#050505] text-white py-10 sm:py-14 px-6 sm:px-10 lg:px-16 z-10 relative">
      <div className="max-w-7xl mx-auto space-y-10">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 items-stretch">
            {currentPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <p className="text-lg text-white/60 font-intel">No articles found in {activeCategory}.</p>
            <p className="text-xs text-white/40 font-intel">Check back soon for new insights!</p>
          </div>
        )}

        {/* ── Pagination Bar at Bottom Left ── */}
        {filteredPosts.length > 0 && (
          <div className="pt-4 flex items-center justify-start space-x-2">
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
