"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, BookOpen, ChevronRight, ArrowRight, Zap, CheckCircle2, ShieldCheck, Award, MoveRight, MessageSquare } from "lucide-react";
import { CaseStudyPost } from "./CaseStudyCard";
import { SAMPLE_CASE_STUDIES } from "./CaseStudyListing";
import { CASE_STUDY_CATEGORIES } from "./CaseStudyHero";

interface CaseStudyArticleProps {
  post: CaseStudyPost;
}

export default function CaseStudyArticle({ post }: CaseStudyArticleProps) {
  // Recent case studies for sidebar widget excluding current post
  const recentPosts = SAMPLE_CASE_STUDIES.filter((p) => p.id !== post.id).slice(0, 2);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

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

  // Compute actual posted case studies count per category
  const categories = CASE_STUDY_CATEGORIES.filter((cat) => cat !== "All").map((catName) => ({
    name: catName,
    count: SAMPLE_CASE_STUDIES.filter((cs) => cs.category === catName).length,
  }));

  const tags = ["AI Agents", "Salesforce", "Automation", "Cloud Infrastructure", "Enterprise", "Data Cloud", "LLMs", "DevOps"];

  return (
    <article className="w-full bg-[#050505] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14">
        
        {/* ── Left Main Column: Article Content ── */}
        <div className="flex-1 min-w-0 space-y-8 font-intel">
          {/* Back Navigation Button */}
          <div>
            <Link
              href="/case-studies"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to All Case Studies</span>
            </Link>
          </div>

          {/* Section 1: Executive Challenge */}
          {/* ── Section 1: The Challenge ── */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3.5 mb-2">
              {/* Message Bubble Icon in solid purple */}
             
              <h2 
                className="text-3xl sm:text-[36px] font-normal text-white tracking-tight"
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                The Challenge
              </h2>
            </div>
            
            <div className="space-y-5">
              <span 
                className="text-sm sm:text-base font-bold text-white block"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.challengeSubtitle || "Too Much Manual Work. Too Little Time."}
              </span>
              
              <p 
                className="text-sm sm:text-base text-white/70 leading-relaxed font-light"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.challengeParagraph || post.challenge}
              </p>

              {(post.challengeBullets || [
                "Repetitive manual processes",
                "Time-consuming data handling",
                "Disconnected workflows",
                "Delayed decision-making",
                "Limited operational visibility"
              ]).length > 0 && (
                <div className="space-y-3 pt-2">
                  <span 
                    className="text-sm sm:text-base font-bold text-white block"
                    style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                  >
                    Key Challenges
                  </span>
                  <ul className="space-y-2 pl-1">
                    {(post.challengeBullets || [
                      "Repetitive manual processes",
                      "Time-consuming data handling",
                      "Disconnected workflows",
                      "Delayed decision-making",
                      "Limited operational visibility"
                    ]).map((bullet) => (
                      <li 
                        key={bullet} 
                        className="flex items-start text-sm sm:text-base text-white/70 font-light leading-relaxed"
                        style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                      >
                        <span className="text-[#8B5CF6] mr-2">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 2: Our Approach ── */}
          <div className="space-y-4 pt-4">
            <h2 
              className="text-3xl sm:text-[36px] font-normal text-white tracking-tight"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Our Approach
            </h2>

            <div className="space-y-5">
              <span 
                className="text-sm sm:text-base font-bold text-white block"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.approachSubtitle || "Turning Manual Processes Into Intelligent Workflows"}
              </span>

              <p 
                className="text-sm sm:text-base text-white/70 leading-relaxed font-light"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.approachIntro || "We analyzed the existing workflows to identify where AI and automation could create the greatest impact."}
              </p>

              <div className="space-y-6 pt-2">
                <span 
                  className="text-sm sm:text-base font-bold text-white block"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  We focused on:
                </span>
                <div className="space-y-5 pl-1">
                  {(post.approachSteps || [
                    { number: "01", title: "Identify", desc: "Find repetitive, high-impact processes suitable for automation." },
                    { number: "02", title: "Design", desc: "Create intelligent workflows around real business requirements." },
                    { number: "03", title: "Integrate", desc: "Connect AI with existing applications, data, and business systems." }
                  ]).map((step) => (
                    <div 
                      key={step.number} 
                      className="flex flex-col space-y-1 text-sm sm:text-base"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      <span className="font-bold text-white">
                        {step.number} – {step.title}
                      </span>
                      <span className="text-white/70 leading-relaxed font-light pl-1">
                        {step.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: The Solution ── */}
          <div className="space-y-4 pt-4">
            <h2 
              className="text-3xl sm:text-[36px] font-normal text-white tracking-tight"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              The Solution
            </h2>

            <div className="space-y-5">
              <span 
                className="text-sm sm:text-base font-bold text-white block"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.solutionSubtitle || "AI That Works Across the Business"}
              </span>

              <p 
                className="text-sm sm:text-base text-white/70 leading-relaxed font-light"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.solutionIntro || post.solution}
              </p>

              <ul className="space-y-4 pl-1 pt-2">
                {(post.solutionBullets || [
                  { title: "Intelligent Workflow Automation", desc: "Automated repetitive processes and reduced unnecessary manual intervention." },
                  { title: "AI-Powered Decision Support", desc: "Provided teams with relevant information and insights when they needed them." }
                ]).map((bullet) => (
                  <li 
                    key={bullet.title} 
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                  >
                    <span className="font-bold text-white">
                      • {bullet.title}:{" "}
                    </span>
                    <span className="text-white/70 font-light">
                      {bullet.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Section 4: The Impact ── */}
          <div className="space-y-4 pt-4">
            <h2 
              className="text-3xl sm:text-[36px] font-normal text-white tracking-tight"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              The Impact
            </h2>

            <div className="space-y-5">
              <span 
                className="text-sm sm:text-base font-bold text-white block"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.impactSubtitle || "From Manual Operations to Intelligent Automation"}
              </span>

              <p 
                className="text-sm sm:text-base text-white/70 leading-relaxed font-light italic"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {post.impactQuote || "“The solution helped create a more efficient operating model by reducing repetitive work and enabling teams to focus on higher-value activities.”"}
              </p>

              <div className="space-y-3 pt-2">
                <span 
                  className="text-sm sm:text-base font-bold text-white block"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  Key Outcomes
                </span>
                <ul className="space-y-4 pl-1">
                  {(post.impactBullets || [
                    { title: "Reduced Manual Effort", desc: "More routine processes handled automatically." },
                    { title: "Faster Operations", desc: "Less time spent moving information between systems." }
                  ]).map((bullet) => (
                    <li 
                      key={bullet.title} 
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      <span className="font-bold text-white">
                        • {bullet.title}:{" "}
                      </span>
                      <span className="text-white/70 font-light">
                        {bullet.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Glowing Outline Callout Box */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1.5px] rounded-[14px] mt-8 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
                <div 
                  className="bg-[#050505] p-5 rounded-[13px] text-sm sm:text-base leading-relaxed font-light text-white/70 space-x-1"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  <span>Note: Use actual client metrics here once verified, such as </span>
                  <span className="font-bold text-white">“40% reduction in processing time”</span>
                  <span>, </span>
                  <span className="font-bold text-white">“60% fewer manual tasks”</span>
                  <span>, or </span>
                  <span className="font-bold text-white">“3x faster response time.”</span>
                  <span> Avoid publishing estimated numbers as case-study results.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 5: "Where Could AI Create..." CTA Banner ── */}
          <div className="p-8 sm:p-10 rounded-[24px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8 mt-12 z-10 relative overflow-hidden shadow-2xl">
            {/* Left Col: CTA Text & Button */}
            <div className="flex-1 flex flex-col items-start text-left">
              <h3 
                className="text-2xl sm:text-3xl font-normal leading-tight text-white max-w-md"
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                Where Could AI Create the Biggest Impact in Your Business?
              </h3>
              
              <p className="text-white/60 text-xs sm:text-sm mt-3 mb-6 max-w-lg">
                Let's identify your highest-value automation opportunities and create a practical roadmap for AI adoption.
              </p>

              <Link
                href="/contact-us"
                className="inline-flex items-center space-x-6 pl-7 pr-2 py-2 rounded-[20px] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/35 hover:border-[#7C3AED]/50 transition-all duration-300 font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-[0_0_25px_rgba(124,58,237,0.15)]"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                <span>TALK TO AN AI EXPERT</span>
                <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-white text-[#7C3AED] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                  <MoveRight className="w-5 h-5 stroke-[2] text-[#7C3AED]" />
                </div>
              </Link>
            </div>

            {/* Right Col: Testimony Speech Card */}
            <div className="flex flex-col items-start gap-4 shrink-0 relative z-10">
              <div 
                className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-lg shrink-0 relative before:content-[''] before:absolute before:bottom-[-8px] before:left-[30px] before:w-4 before:h-4 before:bg-gradient-to-r before:from-purple-900/40 before:to-blue-900/40 before:border-r before:border-b before:border-white/10 before:rotate-45 before:z-0"
              >
                {/* Testimonial Avatar */}
                <div className="w-14 h-14 rounded-full border-2 border-white/20 shadow-md relative overflow-hidden shrink-0">
                  <Image
                    src="/images/fateh-avatar.jpg"
                    alt="Fateh Bahadur Singh"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Testimony Info */}
                <div className="flex flex-col text-left">
                  <span className="text-white/40 text-[11px] font-intel tracking-wider uppercase mb-1">Feedback</span>
                  <span className="text-white/80 text-[13px] italic font-serif leading-snug">
                    "We are glad to welcome you!"
                  </span>
                  <span className="text-white font-bold text-xs sm:text-[13px] mt-2 leading-none">
                    Fateh Bahadur Singh
                  </span>
                  <span className="text-white/50 text-[10px] sm:text-xs mt-1">
                    Sales Manager
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 6: SHARE THIS CASE STUDY ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 p-6 rounded-2xl bg-[rgba(10,10,12,0.35)] border border-white/[0.06]">
            <div 
              className="flex flex-col text-left"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              <span className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-widest leading-none">SHARE</span>
              <span className="text-xs sm:text-sm text-white font-bold uppercase tracking-wider mt-1.5 leading-none">THIS CASE STUDY</span>
            </div>

            {/* Social Icons row */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleShare("facebook")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on Facebook"
              >
                {/* SVG Facebook */}
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </button>

              <button 
                onClick={() => handleShare("linkedin")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on LinkedIn"
              >
                {/* SVG LinkedIn */}
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>

              <button 
                onClick={() => handleShare("twitter")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on X (Twitter)"
              >
                {/* SVG X (Twitter) */}
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Copy link to share"
              >
                <Share2 className="w-[18px] h-[18px] text-white/75 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar Column: Overview & Technology ── */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col space-y-10">
          {/* Overview Section */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <h3 
                className="text-2xl font-bold text-white tracking-wide"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                Overview
              </h3>

              {/* Purple Circle Action Button */}
             
            </div>

            {/* Client and Industry pills */}
            <div className="flex flex-col items-start gap-4">
              <div 
                className="px-5 py-2.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                CLIENT : {post.clientName || "ABC PVT LTD"}
              </div>
              <div 
                className="px-5 py-2.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                INDUSTRY : {post.industry || "MANUFACTURING"}
              </div>
            </div>
          </div>

          {/* Categories Card Widget */}
          <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] space-y-4 shadow-xl flex flex-col">
            <h3 
              className="text-xl sm:text-2xl font-bold text-white text-center tracking-wide border-b border-white/10 pb-4"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Categories
            </h3>
            <div className="space-y-1 text-xs sm:text-sm text-white/70">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/case-studies?category=${encodeURIComponent(cat.name)}`}
                  className="flex items-center justify-between py-2.5 px-1 hover:text-white transition-colors border-b border-white/[0.06] last:border-0 group cursor-pointer"
                >
                  <span style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}>{cat.name}</span>
                  <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white/80 group-hover:bg-[#7C3AED] group-hover:text-white flex items-center justify-center text-[10px] font-mono transition-colors">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div className="flex flex-col space-y-5">
            <h3 
              className="text-2xl font-bold text-white tracking-wide"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Technology
            </h3>

            {/* Technologies flex wrap layout */}
            <div className="flex flex-wrap gap-3">
              {(post.technologies || ["GENERATIVE AI", "CRM", "INTELLIGENT WORKFLOWS", "BETTER SCALABILITY", "CLOUD INFRASTRUCTURE", "APIS"]).map((tech) => (
                <div 
                  key={tech}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs tracking-wider uppercase font-semibold"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Related Case Studies Section */}
          <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] space-y-6 shadow-xl flex flex-col mt-4">
            <h3 
              className="text-xl sm:text-2xl font-bold text-white text-center tracking-wide"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Related Case Studies
            </h3>
            
            <div className="border-b border-white/10 pb-4 w-full" />

            <div className="space-y-6 pt-2">
              {recentPosts.map((item, idx) => (
                <div key={item.id} className="flex flex-col">
                  {idx > 0 && <div className="border-t border-white/10 pt-6 mb-6" />}
                  <Link
                    href={`/case-studies/${item.slug}`}
                    className="group flex items-start space-x-5 cursor-pointer"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-lg overflow-hidden shrink-0 relative border border-white/10 bg-[#08080E]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-start">
                      <h4 
                        className="text-sm sm:text-base font-normal text-white/90 group-hover:text-white leading-snug line-clamp-2 transition-colors"
                        style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                      >
                        {item.title}
                      </h4>
                      <span 
                        className="text-[10px] sm:text-[11px] text-white/50 font-extrabold uppercase tracking-[0.15em] mt-2 block"
                        style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 5. NEWSLETTER Card Widget */}
          <div className="rounded-[24px] bg-[#050711] border border-white/15 p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden mt-4">
            {/* Middle left ambient blue glow */}
            <div className="absolute top-1/3 -left-10 w-48 h-48 rounded-full bg-[#2563EB]/25 blur-[50px] pointer-events-none z-0" />
            
            {/* Glowing bottom gradient lighting effect matching reference */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#7C3AED]/45 via-[#3B82F6]/25 to-transparent pointer-events-none z-0" />

            <span 
              className="text-xs font-intel uppercase tracking-[0.2em] text-white/50 font-bold block z-10 relative"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              NEWSLETTER
            </span>
            
            <h3 
              className="text-2xl sm:text-[26px] font-normal font-duru text-white leading-[1.2] z-10 relative"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Subcribe to Our Newsletter
            </h3>
            
            <p 
              className="text-xs sm:text-sm font-intel text-white/70 leading-relaxed font-light z-10 relative"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Join us and create bold, innovative agency that inspire change.
            </p>
            
            {subscribed ? (
              <div 
                className="py-6 text-center text-sm font-semibold text-[#8B5CF6] z-10 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl font-intel-one-mono animate-fade-in relative"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pt-4 space-y-6 z-10 relative flex flex-col">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/25 pb-2 text-xs sm:text-sm font-intel text-white placeholder-white/40 outline-none focus:border-white/70 transition-colors"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                />
                
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-[18px] bg-[rgba(60,70,140,0.35)] hover:bg-[rgba(60,70,140,0.45)] border border-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-intel font-medium tracking-[0.15em] uppercase flex items-center justify-between transition-all shadow-xl group cursor-pointer"
                >
                  <span style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}>SUBSCRIBE</span>
                  <div className="w-11 h-7 rounded-full bg-white text-[#4F8BFF] flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4 text-[#4F8BFF] stroke-[2]" />
                  </div>
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
