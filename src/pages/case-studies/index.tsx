"use client";

import { useState } from "react";
import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyHero, { CaseStudyCategory } from "@/components/case-studies/CaseStudyHero";
import CaseStudyListing from "@/components/case-studies/CaseStudyListing";
import RankedSection from "@/components/common/RankedSection";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState<CaseStudyCategory>("All");

  return (
    <>
      <Head>
        <title>Case Studies &amp; Success Stories - CloudCentric</title>
        <meta
          name="description"
          content="Explore real-world case studies and success stories demonstrating how CloudCentric delivers AI, Salesforce, cloud infrastructure, and enterprise software solutions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/case-studies" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Case Studies & Success Stories - CloudCentric" />
        <meta
          property="og:description"
          content="Explore real-world case studies and success stories demonstrating how CloudCentric delivers AI, Salesforce, cloud infrastructure, and enterprise software solutions."
        />
      </Head>

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Case Study Hero Section */}
          <CaseStudyHero
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Case Study Listing Section */}
          <CaseStudyListing activeCategory={activeCategory} />

          {/* Ranked Section */}
          <RankedSection />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
