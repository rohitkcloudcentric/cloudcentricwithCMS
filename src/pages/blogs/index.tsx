"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogHero, { BLOG_CATEGORIES, BlogCategory } from "@/components/blogs/BlogHero";
import BlogListing from "@/components/blogs/BlogListing";
import OurExcellence from "@/components/common/OurExcellence";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function BlogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);

  const queryCategory = router.isReady && typeof router.query.category === "string" && BLOG_CATEGORIES.includes(router.query.category as BlogCategory)
    ? (router.query.category as BlogCategory)
    : null;

  const activeCategory = selectedCategory ?? queryCategory ?? "All";

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
          />

          {/* Blog Articles Listing Section */}
          <BlogListing activeCategory={activeCategory} />

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
