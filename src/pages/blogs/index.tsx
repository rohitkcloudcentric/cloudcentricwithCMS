import { useState } from "react";
import type { GetServerSideProps } from "next";
import { getPublishedBlogPosts, getBlogCategories } from "@/lib/blog-data";
import type { BlogPost } from "@/components/blogs/BlogCard";
import { useRouter } from "next/router";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogHero, { BlogCategory } from "@/components/blogs/BlogHero";
import BlogListing from "@/components/blogs/BlogListing";
import OurExcellence from "@/components/common/OurExcellence";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

interface BlogPageProps {
  posts: BlogPost[];
  /** All CMS category names, alphabetical */
  categories: string[];
}

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async () => {
  const [posts, categories] = await Promise.all([getPublishedBlogPosts(), getBlogCategories()]);
  return { props: { posts, categories: categories.map((c) => c.name) } };
};

export default function BlogPage({ posts, categories = [] }: BlogPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);

  // Support /blogs?category=Name links (e.g. from the article sidebar)
  const queryCategory = router.isReady && typeof router.query.category === "string" && categories.includes(router.query.category)
    ? router.query.category
    : null;

  const activeCategory = selectedCategory ?? queryCategory ?? "All";

  // Support /blogs?tag=Name links from the article sidebar
  const activeTag = router.isReady && typeof router.query.tag === "string" ? router.query.tag : null;
  const visiblePosts = activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts;

  const clearTag = () => {
    router.push({ pathname: router.pathname }, undefined, { shallow: true });
  };

  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blogs", url: "/blogs" }
  ]);

  return (
    <>
      <SEOHead
        title="Articles & Insights - CloudCentric"
        description="Explore insights, ideas, and practical perspectives on AI, Salesforce, digital transformation, and emerging technologies from CloudCentric."
        canonical={`${SITE_URL}/blogs`}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Blog Hero Section */}
          <BlogHero
            activeCategory={activeCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
          />

          {/* Blog Articles Listing Section */}
          {activeTag && (
            <div className="w-full px-6 sm:px-10 pt-6 relative z-10">
              <div className="max-w-7xl mx-auto flex items-center gap-3 font-intel text-xs sm:text-sm text-white/70">
                <span>
                  Tagged: <strong className="text-white">{activeTag}</strong>
                </span>
                <button
                  type="button"
                  onClick={clearTag}
                  className="px-3 py-1 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Clear tag ×
                </button>
              </div>
            </div>
          )}
          <BlogListing activeCategory={activeCategory} posts={visiblePosts} />

          {/* Ranked Section */}
          {/* <RankedSection /> */}
          <OurExcellence />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
