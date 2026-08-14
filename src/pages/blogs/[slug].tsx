"use client";

import { useRouter } from "next/router";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogDetailsHero from "@/components/blogs/BlogDetailsHero";
import BlogArticle from "@/components/blogs/BlogArticle";
import YouMightLike from "@/components/blogs/YouMightLike";
import { SAMPLE_BLOG_POSTS } from "@/components/blogs/BlogListing";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function BlogDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  // Find post matching slug, fallback to first post
  const post = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug) || SAMPLE_BLOG_POSTS[0];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": post.image?.startsWith("http") ? post.image : `${SITE_URL}${post.image}`,
      "datePublished": post.date ? new Date(post.date).toISOString() : "2026-08-14T00:00:00.000Z",
      "author": {
        "@type": "Organization",
        "name": post.author || "CloudCentric Infotech"
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
        "@id": `${SITE_URL}/blogs/${post.slug}`
      }
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blogs", url: "/blogs" },
      { name: post.title, url: `/blogs/${post.slug}` }
    ])
  ];

  return (
    <>
      <SEOHead
        title={`${post.title} - CloudCentric Blog`}
        description={post.description}
        canonical={`${SITE_URL}/blogs/${post.slug}`}
        ogType="article"
        ogImage={post.image}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Blog Details Hero */}
          <BlogDetailsHero post={post} />

          {/* Main Article Content */}
          <BlogArticle post={post} />

          {/* You Might Like Recommended Articles Section */}
          <YouMightLike currentPostId={post.id} />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
