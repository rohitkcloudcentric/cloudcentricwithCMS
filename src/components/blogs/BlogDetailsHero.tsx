"use client";

import Image from "next/image";
import BlogMeta from "./BlogMeta";
import { BlogPost } from "./BlogCard";

interface BlogDetailsHeroProps {
  post: BlogPost;
}

export default function BlogDetailsHero({ post }: BlogDetailsHeroProps) {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center -mt-[96px] sm:-mt-[104px] pt-[130px] sm:pt-[150px] pb-12 px-4 sm:px-6 lg:px-12 bg-[#050505] text-white overflow-hidden z-0">
      {/* ── Background Hero Image & Gradient Treatment (Extends behind Header) ── */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/images/blogs/blog-hero-bg.png"
          alt="Blog Details Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-95"
        />
        {/* Top & Bottom gradient fade overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      </div>

      {/* ── Centered Glassmorphic Blog Content Hero Card ── */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full">
        <div className="w-full rounded-[28px] bg-[rgba(12,12,18,0.55)] backdrop-blur-xl border border-white/15 p-7 sm:p-12 lg:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 relative overflow-hidden">
          {/* Left Column: Title, Description & Metadata */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-normal text-white leading-[1.12] tracking-tight font-duru max-w-xl">
                {post.title}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-white/75 font-intel font-light leading-relaxed max-w-xl">
                {post.description}
              </p>
            </div>

            {/* Metadata Pills Row */}
            <div className="pt-4 sm:pt-6">
              <BlogMeta
                category={post.category}
                readTime={post.readTime}
                author={post.author || "BY GARGI SHUKLA"}
                date={post.date || "AUGUST 12, 2026"}
              />
            </div>
          </div>

          {/* Right Column: Featured AI Diagram Box */}
          <div className="w-full lg:w-[480px] xl:w-[510px] h-[280px] sm:h-[360px] lg:h-[380px] rounded-[22px] overflow-hidden shrink-0 border border-white/15 relative bg-[#07070B] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 510px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
