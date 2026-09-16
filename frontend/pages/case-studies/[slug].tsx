"use client";

import { useRouter } from "next/router";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyDetailsHero from "@/components/case-studies/CaseStudyDetailsHero";
import CaseStudyArticle from "@/components/case-studies/CaseStudyArticle";
import { SAMPLE_CASE_STUDIES } from "@/components/case-studies/CaseStudyListing";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function CaseStudyDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Find post matching slug, fallback to first post
  const post = SAMPLE_CASE_STUDIES.find((p) => p.slug === slug) || SAMPLE_CASE_STUDIES[0];
  const metaDescription = post.metaDescription || post.challenge;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": metaDescription,
      "image": post.image?.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
      "author": {
        "@type": "Organization",
        "name": "CloudCentric Infotech"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CloudCentric Infotech",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/images/Logo.svg`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}/case-studies/${post.slug}`
      }
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Case Studies", url: "/case-studies" },
      { name: post.title, url: `/case-studies/${post.slug}` }
    ])
  ];

  return (
    <>
      <SEOHead
        title={`${post.title} - Case Study | CloudCentric`}
        description={metaDescription}
        canonical={`${SITE_URL}/case-studies/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Case Study Details Hero */}
          <CaseStudyDetailsHero post={post} />

          {/* Main Case Study Article Content */}
          <CaseStudyArticle post={post} />



          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
