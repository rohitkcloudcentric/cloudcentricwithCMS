"use client";

import { useState, useEffect } from "react";
import BlogCard, { BlogPost } from "./BlogCard";
import { BlogCategory } from "./BlogHero";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogListingProps {
  activeCategory?: BlogCategory;
  /** Published posts loaded from the CMS (server-side) */
  posts: BlogPost[];
}

export default function BlogListing({ activeCategory = "All", posts }: BlogListingProps) {
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
    <section className="w-full bg-[#050505] text-white py-10 sm:py-14 px-6 sm:px-10  z-10 relative">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 items-stretch">
            {currentPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <p className="text-lg text-white/60 font-intel">
              {activeCategory === "All" ? "No articles published yet." : `No articles found in ${activeCategory}.`}
            </p>
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
