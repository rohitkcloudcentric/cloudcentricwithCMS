"use client";

import { useState } from "react";
import CaseStudyCard, { CaseStudyPost } from "./CaseStudyCard";
import { CaseStudyCategory } from "./CaseStudyHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CaseStudyListingProps {
  activeCategory?: CaseStudyCategory;
  /** Published case studies loaded from the CMS (server-side) */
  posts: CaseStudyPost[];
}

const POSTS_PER_PAGE = 3;

export default function CaseStudyListing({ activeCategory = "All", posts }: CaseStudyListingProps) {
  // Page is tracked per category so switching category always starts on page 1
  const [pageState, setPageState] = useState<{ category: string; page: number }>({ category: activeCategory, page: 1 });
  const currentPage = pageState.category === activeCategory ? pageState.page : 1;
  const setCurrentPage = (page: number) => setPageState({ category: activeCategory, page });

  // Filter posts based on selected category
  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((post) => post.category === activeCategory);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <section className="w-full bg-[#050505] text-white py-12 sm:py-16 px-6 sm:px-10  z-10 relative">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12">
        {currentPosts.length > 0 ? (
          <div className="flex flex-col space-y-10">
            {currentPosts.map((post, idx) => (
              <CaseStudyCard key={post.id} post={post} index={(currentPage - 1) * POSTS_PER_PAGE + idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <p className="text-lg text-white/60 font-intel-one-mono">
              {activeCategory === "All" ? "No case studies published yet." : `No case studies found in ${activeCategory}.`}
            </p>
            <p className="text-xs text-white/40 font-intel-one-mono">Check back soon for new case studies!</p>
          </div>
        )}

        {/* ── Pagination Bar Centered ── */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <nav aria-label="Case study pages" className="pt-4 flex items-center justify-center space-x-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                aria-current={currentPage === pageNum ? "page" : undefined}
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
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
              className="w-9 h-9 rounded-md border border-white/20 hover:border-white/50 disabled:opacity-30 disabled:hover:border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
