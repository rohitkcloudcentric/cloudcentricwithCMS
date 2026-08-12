"use client";

import Head from "next/head";
import { useRouter } from "next/router";
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

  return (
    <>
      <Head>
        <title>{`${post.title} - CloudCentric Blog`}</title>
        <meta name="description" content={post.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://cloudcentric.com/blogs/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
      </Head>

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
