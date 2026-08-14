"use client";

import { useState, useEffect } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import { BlogCategory } from "./BlogHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "How AI Agents Are Changing Business Operations",
    slug: "how-ai-agents-are-changing-business-automation",
    category: "AI & Automation",
    description: "Artificial intelligence is moving beyond chatbots and content generation. Businesses are increasingly looking at AI systems that can understand goals, make decisions, and complete tasks.",
    readTime: "5 MIN READ",
    image: "/images/blogs/how-ai-agents-are-changing-business-automation.png",
    date: "2026-08-14",
    author: "CloudCentric"
  },
  {
    id: "2",
    title: "AI Agents vs Traditional Automation: What's the Difference?",
    slug: "ai-agents-vs-traditional-automation",
    category: "AI & Automation",
    description: "Understand where AI agents fit into modern business automation compared to traditional rule-based workflows and RPA systems...",
    readTime: "5 MIN READ",
    image: "/images/blogs/ai-agents-vs-traditional-automation.png",
    date: "2026-08-14",
    author: "CloudCentric"
  },
  {
    id: "3",
    title: "Why AI Integration Matters for Modern Businesses",
    slug: "why-ai-integration-matters-for-modern-businesses",
    category: "AI & Automation",
    description: "Artificial intelligence is no longer limited to standalone chatbots, content generation tools, or experimental applications. Learn why connecting AI with your existing systems is key to business growth.",
    readTime: "6 MIN READ",
    image: "/images/blogs/why-ai-integration-matters-for-modern-businesses.png",
    date: "2026-08-14",
    author: "CloudCentric"
  },
  {
    id: "4",
    title: "How to Choose an AI Development Company",
    slug: "how-to-choose-an-ai-development-company",
    category: "AI & Automation",
    description: "Selecting the right AI development company is critical to your project's success. Learn the key factors to evaluate, from business understanding to integration capabilities.",
    readTime: "7 MIN READ",
    image: "/images/blogs/how-to-choose-an-ai-development-company.png",
    date: "2026-08-14",
    author: "CloudCentric"
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
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
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
