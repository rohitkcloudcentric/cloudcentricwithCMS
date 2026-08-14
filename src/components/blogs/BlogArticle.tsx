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

  if (post.id === "1") {
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

            {/* Intro Paragraphs */}
            <div className="space-y-5 text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
              <p>
                Artificial intelligence is moving beyond chatbots and content generation. Businesses are increasingly looking at AI systems that can understand goals, make decisions, interact with business applications, and complete tasks with limited human intervention.
              </p>
              <p className="text-white font-medium border-l-2 border-[#3B82F6] pl-4 py-1 bg-white/[0.02]">
                This is where AI agents are becoming increasingly important.
              </p>
              <p>
                Unlike traditional automation, which typically follows predefined rules, AI agents can interpret information, reason through a task, use connected tools, and take action based on the objective they are given. This makes them particularly valuable for business processes that involve multiple steps, changing information, and decision-making.
              </p>
              <p>
                For organizations looking to improve efficiency and scale operations, AI agents can become an important part of the next generation of business automation.
              </p>
            </div>

            {/* Section 1: What Are AI Agents? */}
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                What Are AI Agents?
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                An AI agent is a software system designed to perform tasks or achieve specific goals with a certain level of autonomy.
              </p>
              
              <div className="rounded-2xl border border-white/10 bg-[#07070C] p-6 space-y-4">
                <p className="text-xs sm:text-sm lg:text-base text-white/90 font-medium">
                  An agent can typically:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-white/70 font-light">
                  {[
                    "Understand a business objective",
                    "Collect information from different sources",
                    "Analyze and interpret information",
                    "Decide what action should be taken",
                    "Use tools, applications, or APIs",
                    "Complete multiple steps in a workflow",
                    "Escalate decisions to humans when required",
                    "Adjust its actions based on new information"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="text-[#3B82F6] mt-1 select-none font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                For example, instead of a customer service employee manually checking an order, looking up customer information, reviewing the issue, and creating a response, an AI agent could coordinate these steps across connected systems and involve a human only when the situation requires judgment or approval.
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                This ability to reason, plan, and act is what makes AI agents different from simple rule-based automation.
              </p>
            </div>

            {/* Section 2: AI Agents vs Traditional Automation */}
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                How Are AI Agents Different From Traditional Automation?
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                Traditional automation is generally designed around predefined workflows.
              </p>
              
              <div className="p-5 rounded-2xl bg-[#09090E] border border-white/10 space-y-3 font-mono text-xs sm:text-sm text-white/80">
                <span className="text-[#3B82F6] font-bold">// Predefined Rule Example</span>
                <p className="pl-4 border-l border-white/20">
                  If A happens <span className="text-[#A855F7]">→</span> perform B <span className="text-[#A855F7]">→</span> then perform C.
                </p>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                This works well when processes are predictable and structured. However, many business processes are not that simple. They involve unstructured information, changing circumstances, multiple applications, and decisions that cannot always be represented through fixed rules.
              </p>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                AI agents can bring intelligence into these workflows. Instead of simply following a fixed sequence, an AI agent can assess the available information, determine the next appropriate action, use connected tools, and continue working toward the intended outcome.
              </p>

              {/* Comparison Table */}
              <div className="pt-4">
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#07070C]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="p-4 text-xs sm:text-sm font-semibold text-white/80 uppercase tracking-wider border-r border-white/10">Traditional Automation</th>
                        <th className="p-4 text-xs sm:text-sm font-semibold text-[#3B82F6] uppercase tracking-wider">AI Agents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs sm:text-sm text-white/70 font-light">
                      {[
                        ["Follows predefined rules", "Works toward defined objectives"],
                        ["Best for predictable processes", "Useful for dynamic processes"],
                        ["Requires workflows to be explicitly mapped", "Can determine steps within defined boundaries"],
                        ["Limited decision-making", "Can reason over available information"],
                        ["Usually handles structured inputs", "Can work with structured and unstructured information"],
                        ["Primarily task-focused", "Can coordinate multi-step workflows"]
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="p-4 border-r border-white/10">{row[0]}</td>
                          <td className="p-4 text-white/90">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                AI agents do not necessarily replace traditional automation. In many enterprise environments, the two can work together: traditional automation can handle predictable tasks while AI agents manage more dynamic decisions and workflows.
              </p>
            </div>

            {/* Section 3: Impact Areas */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                How AI Agents Can Transform Business Operations
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                The biggest opportunity is not simply automating individual tasks. It is connecting multiple activities into intelligent workflows. Recent enterprise research is increasingly focused on this shift from isolated AI applications toward interconnected, agentic workflows.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    num: "1",
                    title: "Customer Service",
                    desc: "AI agents can help customer service teams manage repetitive and multi-step requests. An agent could understand requests, retrieve information, verify order status, search knowledge bases, recommend resolutions, and escalate complex cases.",
                  },
                  {
                    num: "2",
                    title: "Sales Operations",
                    desc: "Sales teams spend significant time on pre- and post-conversation work. AI agents support lead research, qualification, data enrichment, follow-up preparation, summaries, and CRM updates across systems.",
                  },
                  {
                    num: "3",
                    title: "Marketing",
                    desc: "Marketing involves large data volumes and repetition. AI agents assist with audience research, content workflows, campaign analysis, lead segmentation, and customer journey tracking while humans steer creative strategy.",
                  },
                  {
                    num: "4",
                    title: "Finance",
                    desc: "Intelligent automation for invoice processing, expense review, financial document analysis, anomaly detection, and forecasting. All operations execute within strict human governance and approval limits.",
                  },
                  {
                    num: "5",
                    title: "Human Resources",
                    desc: "Supports onboarding workflows, answers policy questions, processes routine documents, and automates interview scheduling. This allows HR teams to dedicate time to employee experiences.",
                  },
                  {
                    num: "6",
                    title: "Operations & Procurement",
                    desc: "Coordinates multi-department procurement workflows, handles supplier research, processes purchase request documents, and tracks inventory order cycles directly inside existing corporate networks.",
                  }
                ].map((area, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-[#07070C] hover:border-white/20 transition-colors space-y-2">
                    <span className="text-xs font-bold text-[#3B82F6] font-mono">0{area.num}. {area.title.toUpperCase()}</span>
                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">{area.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Process Flow (Horizontal Process block) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">AI Agents Are Moving Beyond Individual Tasks</h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                One of the most important developments is the movement from single-task AI assistants toward connected AI workflows. For instance, when processing a customer request:
              </p>
              <div className="p-5 rounded-2xl bg-[#08080C] border border-white/10 overflow-x-auto">
                <div className="flex items-center space-x-3 min-w-[700px] text-xs font-mono text-[#3B82F6]">
                  {[
                    "Understand",
                    "Retrieve Data",
                    "Check Rules",
                    "Contact App",
                    "Recommend",
                    "Complete",
                    "Update Logs",
                    "Notify Team"
                  ].map((step, idx, arr) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-medium">
                        {step}
                      </div>
                      {idx < arr.length - 1 && <span className="text-white/40">➔</span>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                Organizations are increasingly exploring operating models where AI agents coordinate workflows across business functions rather than remaining isolated within individual departments.
              </p>
            </div>

            {/* Section 4: Benefits */}
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                What Are the Benefits of AI Agents?
              </h2>
              <div className="space-y-4 text-xs sm:text-sm lg:text-base text-white/70 font-light leading-relaxed">
                {[
                  { title: "Increased Productivity", desc: "Employees spend less time on manual search, data entry, and routing." },
                  { title: "Faster Operations", desc: "Orchestration runs continuously without waiting for human triggers at every step." },
                  { title: "Better Use of Business Data", desc: "Bridges legacy data siloes by fetching relevant contexts dynamically." },
                  { title: "Improved Customer Experiences", desc: "Shortens response loops and delivers contextual, personalized service." },
                  { title: "Scalability & Cost Control", desc: "Enables organizations to handle growing interaction volumes efficiently." },
                  { title: "Smart Decision Support", desc: "Aggregates intelligence so operators make faster and safer choices." }
                ].map((b, idx) => (
                  <p key={idx}>
                    <strong className="text-white font-medium">{b.title}</strong> — {b.desc}
                  </p>
                ))}
                <p className="text-xs sm:text-sm text-white/50 italic pt-2">
                  Governance remains an important foundation for scaling agentic operations safely.
                </p>
              </div>
            </div>

            {/* Section 5: Implementation Considerations */}
            <div className="space-y-5">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                What Businesses Should Consider Before Implementing AI Agents
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                AI agents should not be introduced simply because they are a new technology. Businesses should first identify where they can create measurable value.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Start With the Business Problem",
                    desc: "Don't ask: 'Where can we use AI?'. Start with: 'Which business process is creating the most friction, cost, delay, or manual effort?'"
                  },
                  {
                    title: "Choose the Right Workflow",
                    desc: "Processes with repetitive activities, decision boundaries, or large datasets are the best candidates."
                  },
                  {
                    title: "Connect the Right Data",
                    desc: "AI agents depend on secure, clean, and reliable data integrations. Fragmented inputs limit execution."
                  },
                  {
                    title: "Define Human Oversight",
                    desc: "Map boundaries to dictate where human approvals are mandatory, particularly for financial or legal actions."
                  },
                  {
                    title: "Establish Governance and Security",
                    desc: "Define access tokens, system constraints, audit logs, and compliance standards from day one."
                  }
                ].map((c, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 pl-2">
                    <span className="w-6 h-6 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-xs shrink-0 font-bold">{idx + 1}</span>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{c.title}</h4>
                      <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Future */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                The Future of AI Agents in Business
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                AI agents are shifting the automation paradigm from automating individual tasks to orchestrating entire end-to-end workflows. This doesn't mean operations will run fully autonomously; rather, success will look like an optimized loop combining human intelligence, agents, and governed enterprise software systems.
              </p>
            </div>

            {/* Section 7: CloudCentric Support */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                How CloudCentric Can Help
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                Implementing AI successfully requires process audits, backend integrations, security setups, and governance frameworks aligned to your business metrics. CloudCentric helps organizations audit automation opportunities, engineer data connections, and deploy secure agentic AI workflows.
              </p>
            </div>

            {/* Callout Quote Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#09090E] border border-white/10 border-l-4 border-l-[#3B82F6] my-8 shadow-lg">
              <p className="font-intel italic text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed">
                Ready to explore where AI agents could fit into your business? Connect with CloudCentric to discuss your requirements and identify practical opportunities for intelligent automation.
              </p>
            </div>

            {/* Conclusion */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-normal text-white font-duru tracking-tight leading-tight border-b border-white/10 pb-3">
                Conclusion
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-light">
                For modern businesses, the strategic focus is no longer simply whether AI can complete an isolated task, but how it can help redesign entire operational workflows. Approaching implementation with governance, clean data structures, and human oversight builds a scalable foundation for future enterprise growth.
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
