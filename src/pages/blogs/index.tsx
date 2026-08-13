"use client";

import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogHero, { BlogCategory } from "@/components/blogs/BlogHero";
import BlogListing from "@/components/blogs/BlogListing";
import RankedSection from "@/components/common/RankedSection";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

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
            onSelectCategory={setActiveCategory}
          />

          {/* Blog Articles Listing Section */}
          <BlogListing activeCategory={activeCategory} />

          {/* Ranked Section */}
          <RankedSection />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
