import { useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getPublishedCaseStudies, getCaseStudyCategories } from "@/lib/case-study-data";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyHero, { CaseStudyCategory } from "@/components/case-studies/CaseStudyHero";
import CaseStudyListing from "@/components/case-studies/CaseStudyListing";
import type { CaseStudyPost } from "@/components/case-studies/CaseStudyCard";
import OurExcellence from "@/components/common/OurExcellence";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

interface CaseStudiesPageProps {
  posts: CaseStudyPost[];
  categories: string[];
}

export const getServerSideProps: GetServerSideProps<CaseStudiesPageProps> = async () => {
  const [posts, categories] = await Promise.all([getPublishedCaseStudies(), getCaseStudyCategories()]);
  return { props: { posts, categories: categories.map((c) => c.name) } };
};

export default function CaseStudiesPage({ posts = [], categories = [] }: CaseStudiesPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CaseStudyCategory | null>(null);

  // Support /case-studies?category=Name links from the detail sidebar
  const queryCategory = router.isReady && typeof router.query.category === "string" && categories.includes(router.query.category)
    ? router.query.category
    : null;

  const activeCategory = selectedCategory ?? queryCategory ?? "All";

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
            onSelectCategory={setSelectedCategory}
            categories={categories}
          />

          {/* Case Study Listing Section */}
          <CaseStudyListing activeCategory={activeCategory} posts={posts} />

          <OurExcellence />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
