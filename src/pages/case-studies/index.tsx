"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyHero, { CASE_STUDY_CATEGORIES, CaseStudyCategory } from "@/components/case-studies/CaseStudyHero";
import CaseStudyListing from "@/components/case-studies/CaseStudyListing";
import RankedSection from "@/components/common/RankedSection";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function CaseStudiesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CaseStudyCategory>("All");

  useEffect(() => {
    if (router.isReady && router.query.category) {
      const cat = router.query.category as CaseStudyCategory;
      if (CASE_STUDY_CATEGORIES.includes(cat)) {
        setActiveCategory(cat);
      }
    }
  }, [router.isReady, router.query.category]);

  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Case Studies", url: "/case-studies" }
  ]);

  return (
    <>
      <SEOHead
        title="Case Studies & Success Stories - CloudCentric"
        description="Explore real-world case studies and success stories demonstrating how CloudCentric delivers AI, Salesforce, cloud infrastructure, and enterprise software solutions."
        canonical={`${SITE_URL}/case-studies`}
        jsonLd={jsonLd}
      />

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
