"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, BookOpen } from "lucide-react";
import { BlogPost } from "./BlogCard";
import NewsletterSignup from "@/components/common/NewsletterSignup";

export interface SidebarCategory {
  name: string;
  /** Number of published posts in the category */
  count: number;
}

interface BlogArticleProps {
  post: BlogPost;
  /** Sanitized CMS article HTML (see sanitizeArticleHtml). */
  contentHtml: string;
  /** Published posts from the CMS, used for the sidebar widgets. */
  allPosts: BlogPost[];
  /** All CMS categories with published-post counts. */
  categories: SidebarCategory[];
}

// Default styles only target elements WITHOUT their own class attribute, so plain HTML
// gets the article typography while HTML authored with Tailwind classes keeps its exact look.
const CMS_CONTENT_CLASSES = [
  "space-y-4 text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light",
  "[&_h1:not([class])]:text-3xl [&_h1:not([class])]:sm:text-[38px] [&_h1:not([class])]:font-normal [&_h1:not([class])]:text-white [&_h1:not([class])]:font-duru [&_h1:not([class])]:tracking-tight [&_h1:not([class])]:leading-tight [&_h1:not([class]):not(:first-child)]:pt-6",
  "[&_h2:not([class])]:text-3xl [&_h2:not([class])]:sm:text-[38px] [&_h2:not([class])]:font-normal [&_h2:not([class])]:text-white [&_h2:not([class])]:font-duru [&_h2:not([class])]:tracking-tight [&_h2:not([class])]:leading-tight [&_h2:not([class]):not(:first-child)]:pt-6",
  "[&_h3:not([class])]:text-sm [&_h3:not([class])]:sm:text-base [&_h3:not([class])]:text-white [&_h3:not([class])]:font-semibold [&_h3:not([class])]:pt-2",
  "[&_h4:not([class])]:text-sm [&_h4:not([class])]:text-white [&_h4:not([class])]:font-semibold",
  "[&_strong:not([class])]:text-white [&_strong:not([class])]:font-medium [&_b:not([class])]:text-white [&_b:not([class])]:font-medium",
  "[&_a:not([class])]:text-[#A855F7] [&_a:not([class])]:underline hover:[&_a:not([class])]:text-white",
  "[&_ul:not([class])]:space-y-2 [&_ul:not([class])]:pl-6 [&_ul:not([class])]:list-disc [&_ul:not([class])]:marker:text-white/40",
  "[&_ol:not([class])]:space-y-2 [&_ol:not([class])]:pl-6 [&_ol:not([class])]:list-decimal [&_ol:not([class])]:marker:text-white/40",
  "[&_blockquote:not([class])]:p-6 [&_blockquote:not([class])]:sm:p-8 [&_blockquote:not([class])]:rounded-2xl [&_blockquote:not([class])]:bg-[#09090E] [&_blockquote:not([class])]:border [&_blockquote:not([class])]:border-white/10 [&_blockquote:not([class])]:border-l-4 [&_blockquote:not([class])]:border-l-[#7C3AED] [&_blockquote:not([class])]:my-8 [&_blockquote:not([class])]:shadow-lg [&_blockquote:not([class])]:italic [&_blockquote:not([class])]:text-white/90",
  "[&_img:not([class])]:rounded-2xl [&_img:not([class])]:max-w-full [&_img:not([class])]:h-auto [&_img:not([class])]:border [&_img:not([class])]:border-white/10",
  "[&_pre:not([class])]:bg-[#09090E] [&_pre:not([class])]:border [&_pre:not([class])]:border-white/10 [&_pre:not([class])]:p-4 [&_pre:not([class])]:rounded-xl [&_pre:not([class])]:overflow-x-auto",
  "[&_table:not([class])]:w-full [&_th:not([class])]:text-left [&_th:not([class])]:text-white [&_th:not([class])]:p-2 [&_th:not([class])]:border-b [&_th:not([class])]:border-white/20 [&_td:not([class])]:p-2 [&_td:not([class])]:border-b [&_td:not([class])]:border-white/10",
  "[&_hr:not([class])]:border-white/10",
].join(" ");

export default function BlogArticle({ post, contentHtml, allPosts, categories }: BlogArticleProps) {
  // Tags assigned to this article in the CMS
  const postTags = post.tags ?? [];
  // Recent posts for sidebar widget excluding current post
  const recentPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const handleShare = (platform: "facebook" | "linkedin" | "twitter") => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;
    const shareTitle = post.title;

    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
    }

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14">

        {/* ── Left Main Column: Article Content ── */}
        <div className="flex-1 min-w-0 space-y-10 font-intel">
          {/* Back Navigation Button */}
          <div>
            <Link
              href="/blogs"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to All Articles</span>
            </Link>
          </div>

          {/* CMS-managed article body (sanitized server-side) */}
          <div className={CMS_CONTENT_CLASSES} dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {/* SHARE THIS POST Box */}
          <div className="rounded-2xl bg-[#08080C] border border-white/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <span className="text-xs sm:text-sm font-intel uppercase tracking-widest text-white/80 font-bold">
              SHARE THIS POST
            </span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleShare("facebook")}
                aria-label="Share on Facebook"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              >
                f
              </button>
              <button
                type="button"
                onClick={() => handleShare("linkedin")}
                aria-label="Share on LinkedIn"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              >
                in
              </button>
              <button
                type="button"
                onClick={() => handleShare("twitter")}
                aria-label="Share on X"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              >
                x
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  }
                }}
                aria-label="Share Link"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Category Bar */}
          <div className="pt-6 flex items-center space-x-2 text-xs text-white/60">
            <BookOpen className="w-4 h-4 text-[#A855F7]" />
            <span>Category: <strong className="text-white">{post.category}</strong></span>
          </div>
        </div>

        {/* ── Right Sidebar: Search, Categories, Recent Posts, Tags & Newsletter ── */}
        <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 space-y-6">
          {/* 1. Search Box Widget */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search articles"
              className="w-full bg-[#08080E] border border-white/15 rounded-[18px] px-5 py-3.5 text-xs sm:text-sm font-intel text-white placeholder-white/40 outline-none focus:border-[#7C3AED] transition-colors shadow-inner"
            />
          </div>

          {/* 2. Categories Card Widget */}
          {categories.length > 0 && (
            <div className="rounded-[22px] bg-[#07070C] border border-white/15 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-medium text-white/90 text-center font-intel border-b border-white/10 pb-4">
                Categories
              </h3>
              <div className="space-y-1 font-intel text-xs sm:text-sm text-white/70">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                    className="flex items-center justify-between py-2.5 px-1 hover:text-white transition-colors border-b border-white/[0.06] last:border-0"
                  >
                    <span>{cat.name}</span>
                    <span className="text-white/40 font-mono">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. Recent Posts Card Widget */}
          {recentPosts.length > 0 && (
            <div className="rounded-[22px] bg-[#07070C] border border-white/15 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-medium text-white/90 text-center font-intel border-b border-white/10 pb-4">
                Post
              </h3>
              <div className="space-y-4 font-intel">
                {recentPosts.map((recentPost) => (
                  <Link
                    key={recentPost.id}
                    href={`/blogs/${recentPost.slug}`}
                    className="flex items-center space-x-3.5 group pb-3.5 border-b border-white/[0.06] last:border-0 last:pb-0"
                  >
                    <div className="w-[72px] h-[52px] rounded-xl relative overflow-hidden bg-[#07070B] border border-white/10 shrink-0">
                      <Image
                        src={recentPost.image}
                        alt={recentPost.title}
                        fill
                        sizes="72px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs sm:text-[13px] text-white font-medium line-clamp-2 leading-tight group-hover:text-white/90 transition-colors">
                        {recentPost.title}
                      </h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-extrabold">
                        {recentPost.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Tags Card Widget */}
          {/* Only this post's own tags; hidden when the post has none */}
          {postTags.length > 0 && (
            <div className="rounded-[22px] bg-[#07070C] border border-white/15 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm sm:text-base font-medium text-white/90 text-center font-intel border-b border-white/10 pb-4">
                Tags
              </h3>
              <div className="grid grid-cols-3 gap-2.5 font-intel text-xs">
                {postTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-2 rounded-xl bg-[#101018] border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-center transition-colors font-intel truncate"
                    title={tag}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 5. NEWSLETTER Card Widget */}
          <div className="rounded-[24px] bg-[#050711] border border-white/15 p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/3 -left-10 w-48 h-48 rounded-full bg-[#2563EB]/25 blur-[50px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 right-0 h-auto bg-gradient-to-t from-[#7C3AED]/45 via-[#3B82F6]/25 to-transparent pointer-events-none z-0" />

            <span className="text-xs font-intel uppercase tracking-[0.2em] text-white/50 font-bold block z-10 relative">
              NEWSLETTER
            </span>

            <h3 className="text-2xl sm:text-[26px] font-normal font-duru text-white leading-[1.2] z-10 relative">
              Subcribe to Our Newsletter
            </h3>

            <p className="text-xs sm:text-sm font-intel text-white/70 leading-relaxed font-light z-10 relative">
              Join us and create bold, innovative agency that inspire change.
            </p>

            <NewsletterSignup sourceType="BLOG" sourceSlug={post.slug} />
          </div>
        </aside>
      </div>
    </article>
  );
}
