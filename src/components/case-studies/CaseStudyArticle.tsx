"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, MoveRight } from "lucide-react";
import { CaseStudyPost, TitleDescItem } from "./CaseStudyCard";
import CaseStudyImage from "./CaseStudyImage";
import NewsletterSignup from "@/components/common/NewsletterSignup";

export interface CaseStudySidebarCategory {
  name: string;
  count: number;
}

interface CaseStudyArticleProps {
  post: CaseStudyPost;
  /** Related published case studies (hand-picked in the CMS, then same category / latest) */
  related: CaseStudyPost[];
  /** Categories with published case study counts */
  categories: CaseStudySidebarCategory[];
}

const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;
const DURU = { fontFamily: "var(--font-duru-sans), sans-serif" } as const;

const H2 = "text-3xl sm:text-[36px] font-normal text-white tracking-tight";
const SUBTITLE = "text-sm sm:text-base font-bold text-white block";
const PILL = "px-5 py-2.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs tracking-wider uppercase font-semibold";

/**
 * Styles CMS rich-text HTML to match the section typography.
 * Defaults only apply to elements without their own class attribute.
 */
const RICH_TEXT = [
  "space-y-4 text-sm sm:text-base text-white/70 leading-relaxed font-light",
  "[&_strong:not([class])]:text-white [&_strong:not([class])]:font-bold [&_b:not([class])]:text-white [&_b:not([class])]:font-bold",
  "[&_h3:not([class])]:text-sm [&_h3:not([class])]:sm:text-base [&_h3:not([class])]:font-bold [&_h3:not([class])]:text-white [&_h3:not([class])]:pt-2",
  "[&_h4:not([class])]:text-sm [&_h4:not([class])]:font-bold [&_h4:not([class])]:text-white",
  "[&_ul:not([class])]:space-y-2 [&_ul:not([class])]:pl-5 [&_ul:not([class])]:list-disc [&_ul:not([class])]:marker:text-[#8B5CF6]",
  "[&_ol:not([class])]:space-y-2 [&_ol:not([class])]:pl-5 [&_ol:not([class])]:list-decimal [&_ol:not([class])]:marker:text-[#8B5CF6]",
  "[&_a:not([class])]:text-[#A855F7] [&_a:not([class])]:underline hover:[&_a:not([class])]:text-white",
  "[&_blockquote:not([class])]:italic [&_blockquote:not([class])]:border-l-2 [&_blockquote:not([class])]:border-[#7C3AED] [&_blockquote:not([class])]:pl-4",
  "[&_img:not([class])]:rounded-2xl [&_img:not([class])]:max-w-full [&_img:not([class])]:h-auto [&_img:not([class])]:border [&_img:not([class])]:border-white/10 [&_img:not([class])]:my-4",
].join(" ");

function RichText({ html }: { html?: string }) {
  if (!html) return null;
  return <div className={RICH_TEXT} style={MONO} dangerouslySetInnerHTML={{ __html: html }} />;
}

function HighlightList({ items }: { items: TitleDescItem[] }) {
  return (
    <ul className="space-y-4 pl-1 pt-2">
      {items.map((item, idx) => (
        <li key={`${item.title}-${idx}`} className="text-sm sm:text-base leading-relaxed" style={MONO}>
          {item.title && <span className="font-bold text-white">• {item.title}{item.desc ? ": " : ""}</span>}
          {item.desc && <span className="text-white/70 font-light">{item.desc}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function CaseStudyArticle({ post, related, categories }: CaseStudyArticleProps) {
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

  const keyChallenges = post.keyChallenges ?? [];
  const approachSteps = post.approachSteps ?? [];
  const solutionHighlights = post.solutionHighlights ?? [];
  const impactHighlights = post.impactHighlights ?? [];
  const gallery = post.galleryImages ?? [];

  const hasChallenge = Boolean(post.challengeTitle || post.challengeHtml || keyChallenges.length);
  const hasApproach = Boolean(post.approachTitle || post.approachHtml || approachSteps.length);
  const hasSolution = Boolean(post.solutionTitle || post.solutionHtml || solutionHighlights.length);
  const hasImpact = Boolean(post.impactTitle || post.impactHtml || impactHighlights.length);

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

          {/* ── Section 1: The Challenge ── */}
          {hasChallenge && (
            <section className="space-y-4" aria-labelledby="cs-challenge">
              <h2 id="cs-challenge" className={H2} style={DURU}>The Challenge</h2>
              <div className="space-y-5">
                {post.challengeTitle && <span className={SUBTITLE} style={MONO}>{post.challengeTitle}</span>}
                <RichText html={post.challengeHtml} />

                {keyChallenges.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className={SUBTITLE} style={MONO}>Key Challenges</h3>
                    <ul className="space-y-2 pl-1">
                      {keyChallenges.map((bullet, idx) => (
                        <li
                          key={`${bullet}-${idx}`}
                          className="flex items-start text-sm sm:text-base text-white/70 font-light leading-relaxed"
                          style={MONO}
                        >
                          <span className="text-[#8B5CF6] mr-2" aria-hidden="true">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Section 2: Our Approach ── */}
          {hasApproach && (
            <section className="space-y-4 pt-4" aria-labelledby="cs-approach">
              <h2 id="cs-approach" className={H2} style={DURU}>Our Approach</h2>
              <div className="space-y-5">
                {post.approachTitle && <span className={SUBTITLE} style={MONO}>{post.approachTitle}</span>}
                <RichText html={post.approachHtml} />

                {approachSteps.length > 0 && (
                  <div className="space-y-6 pt-2">
                    <h3 className={SUBTITLE} style={MONO}>We focused on:</h3>
                    <ol className="space-y-5 pl-1">
                      {approachSteps.map((step, idx) => (
                        <li
                          key={`${step.title}-${idx}`}
                          className="flex flex-col space-y-1 text-sm sm:text-base"
                          style={MONO}
                        >
                          <span className="font-bold text-white">
                            {String(idx + 1).padStart(2, "0")} – {step.title}
                          </span>
                          {step.desc && (
                            <span className="text-white/70 leading-relaxed font-light pl-1">{step.desc}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Section 3: The Solution ── */}
          {hasSolution && (
            <section className="space-y-4 pt-4" aria-labelledby="cs-solution">
              <h2 id="cs-solution" className={H2} style={DURU}>The Solution</h2>
              <div className="space-y-5">
                {post.solutionTitle && <span className={SUBTITLE} style={MONO}>{post.solutionTitle}</span>}
                <RichText html={post.solutionHtml} />
                {solutionHighlights.length > 0 && <HighlightList items={solutionHighlights} />}
              </div>
            </section>
          )}

          {/* ── Uploaded images from the CMS ── */}
          {gallery.length > 0 && (
            <section aria-label="Case study images" className="pt-4">
              <div className={`grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {gallery.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden border border-white/[0.08] bg-[#08080E]"
                  >
                    <CaseStudyImage
                      src={src}
                      alt={`${post.title} – image ${idx + 1}`}
                      sizes={gallery.length > 1 ? "(max-width: 640px) 100vw, 400px" : "(max-width: 1024px) 100vw, 800px"}
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Section 4: Business Impact ── */}
          {hasImpact && (
            <section className="space-y-4 pt-4" aria-labelledby="cs-impact">
              <h2 id="cs-impact" className={H2} style={DURU}>The Impact</h2>
              <div className="space-y-5">
                {post.impactTitle && <span className={SUBTITLE} style={MONO}>{post.impactTitle}</span>}
                <RichText html={post.impactHtml} />

                {impactHighlights.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className={SUBTITLE} style={MONO}>Key Outcomes</h3>
                    <HighlightList items={impactHighlights} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── "Where Could AI Create..." CTA Banner ── */}
          <div className="p-8 sm:p-10 rounded-[24px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8 mt-12 z-10 relative overflow-hidden shadow-2xl">
            <div className="flex-1 flex flex-col items-start text-left">
              <h3 className="text-2xl sm:text-3xl font-normal leading-tight text-white max-w-md" style={DURU}>
                Where Could AI Create the Biggest Impact in Your Business?
              </h3>

              <p className="text-white/60 text-xs sm:text-sm mt-3 mb-6 max-w-lg">
                Let&apos;s identify your highest-value automation opportunities and create a practical roadmap for AI adoption.
              </p>

              <Link
                href="/contact-us"
                className="inline-flex items-center space-x-6 pl-7 pr-2 py-2 rounded-[20px] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/35 hover:border-[#7C3AED]/50 transition-all duration-300 font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-[0_0_25px_rgba(124,58,237,0.15)]"
                style={MONO}
              >
                <span>TALK TO AN AI EXPERT</span>
                <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-white text-[#7C3AED] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                  <MoveRight className="w-5 h-5 stroke-[2] text-[#7C3AED]" />
                </div>
              </Link>
            </div>

            <div className="flex flex-col items-start gap-4 shrink-0 relative z-10">
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-lg shrink-0 relative before:content-[''] before:absolute before:bottom-[-8px] before:left-[30px] before:w-4 before:h-4 before:bg-gradient-to-r before:from-purple-900/40 before:to-blue-900/40 before:border-r before:border-b before:border-white/10 before:rotate-45 before:z-0">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 shadow-md relative overflow-hidden shrink-0">
                  <Image src="/images/fateh-avatar.jpg" alt="Fateh Bahadur Singh" fill sizes="56px" className="object-cover object-center" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white/40 text-[11px] font-intel tracking-wider uppercase mb-1">Feedback</span>
                  <span className="text-white/80 text-[13px] italic font-serif leading-snug">
                    &quot;We are glad to welcome you!&quot;
                  </span>
                  <span className="text-white font-bold text-xs sm:text-[13px] mt-2 leading-none">Fateh Bahadur Singh</span>
                  <span className="text-white/50 text-[10px] sm:text-xs mt-1">Sales Manager</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── SHARE THIS CASE STUDY ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 p-6 rounded-2xl bg-[rgba(10,10,12,0.35)] border border-white/[0.06]">
            <div className="flex flex-col text-left" style={MONO}>
              <span className="text-[10px] sm:text-[11px] text-white/50 font-bold uppercase tracking-widest leading-none">SHARE</span>
              <span className="text-xs sm:text-sm text-white font-bold uppercase tracking-wider mt-1.5 leading-none">THIS CASE STUDY</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleShare("facebook")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on Facebook"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleShare("linkedin")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleShare("twitter")}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Share on X (Twitter)"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="w-10 h-10 rounded-lg border border-white/15 bg-white/[0.02] flex items-center justify-center text-white/75 hover:text-white hover:border-white/35 transition-all hover:bg-white/[0.06] cursor-pointer"
                aria-label="Copy link to share"
              >
                <Share2 className="w-[18px] h-[18px] text-white/75" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar Column: Overview & Technology ── */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col space-y-10">
          {/* Overview Section */}
          {(post.clientName || post.industry) && (
            <div className="flex flex-col space-y-5">
              <h3 className="text-2xl font-bold text-white tracking-wide" style={MONO}>Overview</h3>
              <div className="flex flex-col items-start gap-4">
                {post.clientName && <div className={PILL} style={MONO}>CLIENT : {post.clientName}</div>}
                {post.industry && <div className={PILL} style={MONO}>INDUSTRY : {post.industry}</div>}
              </div>
            </div>
          )}

          {/* Categories Card Widget */}
          {categories.length > 0 && (
            <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] space-y-4 shadow-xl flex flex-col">
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center tracking-wide border-b border-white/10 pb-4" style={MONO}>
                Categories
              </h3>
              <div className="space-y-1 text-xs sm:text-sm text-white/70">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/case-studies?category=${encodeURIComponent(cat.name)}`}
                    className="flex items-center justify-between py-2.5 px-1 hover:text-white transition-colors border-b border-white/[0.06] last:border-0 group cursor-pointer"
                  >
                    <span style={MONO}>{cat.name}</span>
                    <span className="w-5 h-5 rounded-full bg-white/[0.08] text-white/80 group-hover:bg-[#7C3AED] group-hover:text-white flex items-center justify-center text-[10px] font-mono transition-colors">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Technology Section */}
          {post.technologies.length > 0 && (
            <div className="flex flex-col space-y-5">
              <h3 className="text-2xl font-bold text-white tracking-wide" style={MONO}>Technology</h3>
              <div className="flex flex-wrap gap-3">
                {post.technologies.map((tech) => (
                  <div key={tech} className={PILL} style={MONO}>{tech}</div>
                ))}
              </div>
            </div>
          )}

          {/* Related Case Studies Section */}
          {related.length > 0 && (
            <div className="p-6 sm:p-7 rounded-[22px] bg-[rgba(10,10,12,0.45)] border border-white/[0.08] space-y-6 shadow-xl flex flex-col mt-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center tracking-wide" style={MONO}>
                Related Case Studies
              </h3>

              <div className="border-b border-white/10 pb-4 w-full" />

              <div className="space-y-6 pt-2">
                {related.map((item, idx) => (
                  <div key={item.id} className="flex flex-col">
                    {idx > 0 && <div className="border-t border-white/10 pt-6 mb-6" />}
                    <Link href={`/case-studies/${item.slug}`} className="group flex items-start space-x-5 cursor-pointer">
                      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-lg overflow-hidden shrink-0 relative border border-white/10 bg-[#08080E]">
                        <CaseStudyImage
                          src={item.image}
                          alt={item.title}
                          sizes="110px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-start">
                        <h4
                          className="text-sm sm:text-base font-normal text-white/90 group-hover:text-white leading-snug line-clamp-2 transition-colors"
                          style={DURU}
                        >
                          {item.title}
                        </h4>
                        {item.category && (
                          <span
                            className="text-[10px] sm:text-[11px] text-white/50 font-extrabold uppercase tracking-[0.15em] mt-2 block"
                            style={MONO}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEWSLETTER Card Widget */}
          <div className="rounded-[24px] bg-[#050711] border border-white/15 p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden mt-4">
            <div className="absolute top-1/3 -left-10 w-48 h-48 rounded-full bg-[#2563EB]/25 blur-[50px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#7C3AED]/45 via-[#3B82F6]/25 to-transparent pointer-events-none z-0" />

            <span className="text-xs font-intel uppercase tracking-[0.2em] text-white/50 font-bold block z-10 relative" style={MONO}>
              NEWSLETTER
            </span>

            <h3 className="text-2xl sm:text-[26px] font-normal font-duru text-white leading-[1.2] z-10 relative" style={DURU}>
              Subcribe to Our Newsletter
            </h3>

            <p className="text-xs sm:text-sm font-intel text-white/70 leading-relaxed font-light z-10 relative" style={MONO}>
              Join us and create bold, innovative agency that inspire change.
            </p>

            <NewsletterSignup sourceType="CASE_STUDY" sourceSlug={post.slug} mono />
          </div>
        </aside>
      </div>
    </article>
  );
}
