"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import { BlogPost } from "./BlogCard";
import { SAMPLE_BLOG_POSTS } from "./BlogListing";

interface BlogArticleProps {
  post: BlogPost;
}

export default function BlogArticle({ post }: BlogArticleProps) {
  // Recent posts for sidebar widget excluding current post
  const recentPosts = SAMPLE_BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const categories = [
    { name: "AI & Automation", count: 5 },
    { name: "Salesforce", count: 3 },
    { name: "Digital Transformation", count: 2 },
    { name: "Technology", count: 5 },
    { name: "Product", count: 2 },
  ];

  const tags = ["Corporate", "Agency", "Creative", "Startup", "App", "Business", "Software", "Landing", "Art"];

  return (
    <article className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14">
        
        {/* ── Left Main Column: Article Content ── */}
        <div className="flex-1 min-w-0 space-y-8 font-intel">
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

          {/* Section 1: Introduction */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              Introduction
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Business automation is entering a new phase.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Traditional automation follows predefined rules: <strong className="text-white font-medium">when X happens, do Y</strong>. AI agents introduce a more flexible approach. They can understand context, work with information, make decisions, use connected tools, and complete multi-step tasks with less human intervention.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              For businesses, this creates an opportunity to move from simply automating processes to building <strong className="text-white font-medium">intelligent operations</strong>.
            </p>
          </div>

          {/* Section 2: What Are AI Agents? */}
          <div className="space-y-4 pt-4">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              What Are AI Agents?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              AI agents are software systems designed to understand a goal, reason through tasks, and take actions to achieve that goal.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              Unlike traditional chatbots that primarily respond to questions, AI agents can work across multiple steps.
            </p>
            
            <p className="text-xs sm:text-sm lg:text-base text-white/80 font-medium pt-2">
              An AI agent can:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm lg:text-base text-white/70 font-light pl-2">
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Understand user requests</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Analyze business information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Decide what action is needed</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Connect with business applications</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Execute tasks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-white/40 select-none">•</span>
                <span>Learn from context and feedback</span>
              </li>
            </ul>

            <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light pt-2">
              For example, instead of simply answering a customer&apos;s question, an AI agent could understand the request, check customer information, verify availability, create a service request, and notify the right team.
            </p>
          </div>

          {/* Section 3: Where AI Agents Can Make an Impact */}
          <div className="space-y-6 pt-6">
            <h2 className="text-3xl sm:text-[38px] font-normal text-white font-duru tracking-tight leading-tight">
              Where AI Agents Can Make an Impact
            </h2>

            <div className="space-y-6">
              {/* 01. Customer Support */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base text-white font-semibold font-intel">
                  01. Customer Support
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  AI agents can handle common customer requests, find relevant information, summarize conversations, and route complex issues to human teams.
                </p>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Result: Faster responses and reduced support workload.
                </p>
              </div>

              {/* 02. Sales Operations */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base text-white font-semibold font-intel">
                  02. Sales Operations
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  AI agents can assist with lead qualification, follow-ups, meeting preparation, CRM updates, and opportunity management.
                </p>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Result: Sales teams spend more time selling and less time on administrative work.
                </p>
              </div>

              {/* 03. Employee Productivity */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base text-white font-semibold font-intel">
                  03. Employee Productivity
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Employees can use AI agents to search internal knowledge, summarize documents, create reports, and complete routine tasks across business applications.
                </p>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Result: Less manual work and faster access to information.
                </p>
              </div>

              {/* 04. Business Operations */}
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base text-white font-semibold font-intel">
                  04. Business Operations
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  AI agents can coordinate workflows across systems, monitor processes, identify exceptions, and trigger appropriate actions.
                </p>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  Result: More efficient and connected operations.
                </p>
              </div>
            </div>
          </div>

          {/* Callout Quote Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#09090E] border border-white/10 border-l-4 border-l-[#7C3AED] my-8 shadow-lg">
            <p className="font-intel italic text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed">
              &quot;Ready to Explore AI Agents for Your Business? Let&apos;s identify the processes where AI can create the biggest impact and build a practical roadmap for implementation.&quot;
            </p>
          </div>

          {/* SHARE THIS POST Box */}
          <div className="rounded-2xl bg-[#08080C] border border-white/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <span className="text-xs sm:text-sm font-intel uppercase tracking-widest text-white/80 font-bold">
              SHARE THIS POST
            </span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                aria-label="Share on Facebook"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              >
                f
              </button>
              <button
                type="button"
                aria-label="Share on LinkedIn"
                className="w-9 h-9 rounded-lg bg-[#12121A] border border-white/10 text-white/70 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors text-xs font-mono cursor-pointer"
              >
                in
              </button>
              <button
                type="button"
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
              className="w-full bg-[#08080E] border border-white/15 rounded-[18px] px-5 py-3.5 text-xs sm:text-sm font-intel text-white placeholder-white/40 outline-none focus:border-[#7C3AED] transition-colors shadow-inner"
            />
          </div>

          {/* 2. Categories Card Widget */}
          <div className="rounded-[22px] bg-[#07070C] border border-white/15 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm sm:text-base font-medium text-white/90 text-center font-intel border-b border-white/10 pb-4">
              Categories
            </h3>
            <div className="space-y-1 font-intel text-xs sm:text-sm text-white/70">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center justify-between py-2.5 px-1 hover:text-white transition-colors border-b border-white/[0.06] last:border-0"
                >
                  <span>{cat.name}</span>
                  <span className="text-white/40 font-mono">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Recent Posts Card Widget */}
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
                      {recentPost.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Tags Card Widget */}
          <div className="rounded-[22px] bg-[#07070C] border border-white/15 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm sm:text-base font-medium text-white/90 text-center font-intel border-b border-white/10 pb-4">
              Tags
            </h3>
            <div className="grid grid-cols-3 gap-2.5 font-intel text-xs">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-[#101018] border border-white/10 text-white/70 hover:text-white hover:border-white/30 text-center transition-colors cursor-pointer select-none font-intel"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 5. NEWSLETTER Card Widget */}
          <div className="rounded-[24px] bg-[#050711] border border-white/15 p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Middle left ambient blue glow */}
            <div className="absolute top-1/3 -left-10 w-48 h-48 rounded-full bg-[#2563EB]/25 blur-[50px] pointer-events-none z-0" />
            
            {/* Glowing bottom gradient lighting effect matching reference */}
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
            
            <div className="pt-4 space-y-6 z-10 relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent border-b border-white/25 pb-2 text-xs sm:text-sm font-intel text-white placeholder-white/40 outline-none focus:border-white/70 transition-colors"
              />
              
              <button
                type="button"
                className="w-full py-3.5 px-5 rounded-[18px] bg-[rgba(60,70,140,0.35)] hover:bg-[rgba(60,70,140,0.45)] border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-intel font-medium tracking-[0.15em] uppercase flex items-center justify-between transition-all shadow-xl group cursor-pointer"
              >
                <span>SUBSCRIBE</span>
                <div className="w-11 h-7 rounded-full bg-white text-[#4F8BFF] flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4 text-[#4F8BFF] stroke-[2]" />
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
