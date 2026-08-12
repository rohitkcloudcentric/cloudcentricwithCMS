"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyDetailsHero from "@/components/case-studies/CaseStudyDetailsHero";
import CaseStudyArticle from "@/components/case-studies/CaseStudyArticle";
import YouMightLikeCaseStudies from "@/components/case-studies/YouMightLikeCaseStudies";
import { SAMPLE_CASE_STUDIES } from "@/components/case-studies/CaseStudyListing";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function CaseStudyDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Find post matching slug, fallback to first post
  const post = SAMPLE_CASE_STUDIES.find((p) => p.slug === slug) || SAMPLE_CASE_STUDIES[0];

  return (
    <>
      <Head>
        <title>{`${post.title} - Case Study | CloudCentric`}</title>
        <meta name="description" content={post.challenge} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://cloudcentric.com/case-studies/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.challenge} />
        <meta property="og:image" content={post.image} />
      </Head>

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Case Study Details Hero */}
          <CaseStudyDetailsHero post={post} />

          {/* Main Case Study Article Content */}
          <CaseStudyArticle post={post} />

          {/* Recommended Case Studies Section */}
          <YouMightLikeCaseStudies currentPostId={post.id} />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
