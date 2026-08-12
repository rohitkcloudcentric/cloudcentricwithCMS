"use client";

import { useState } from "react";
import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogHero, { BlogCategory } from "@/components/blogs/BlogHero";
import BlogListing from "@/components/blogs/BlogListing";
import RankedSection from "@/components/common/RankedSection";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  return (
    <>
      <Head>
        <title>Articles &amp; Insights - CloudCentric</title>
        <meta
          name="description"
          content="Explore insights, ideas, and practical perspectives on AI, Salesforce, digital transformation, and emerging technologies from CloudCentric."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/blogs" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Articles & Insights - CloudCentric" />
        <meta
          property="og:description"
          content="Explore insights, ideas, and practical perspectives on AI, Salesforce, digital transformation, and emerging technologies."
        />
      </Head>

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
