import type { GetServerSideProps } from "next";
import { getCaseStudyBySlug, getCaseStudyCategories } from "@/lib/case-study-data";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CaseStudyDetailsHero from "@/components/case-studies/CaseStudyDetailsHero";
import CaseStudyArticle, { type CaseStudySidebarCategory } from "@/components/case-studies/CaseStudyArticle";
import type { CaseStudyPost } from "@/components/case-studies/CaseStudyCard";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

interface CaseStudyDetailsPageProps {
  post: CaseStudyPost;
  related: CaseStudyPost[];
  categories: CaseStudySidebarCategory[];
}

export const getServerSideProps: GetServerSideProps<CaseStudyDetailsPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [detail, categories] = await Promise.all([getCaseStudyBySlug(slug), getCaseStudyCategories()]);
  if (!detail) return { notFound: true };

  return { props: { post: detail.post, related: detail.related, categories } };
};

export default function CaseStudyDetailsPage({ post, related = [], categories = [] }: CaseStudyDetailsPageProps) {
  const metaDescription = post.metaDescription || post.challenge;
  const ogImage = post.featuredImage || post.image;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": metaDescription,
      "image": ogImage?.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
      "datePublished": post.date,
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
        title={post.seoTitle || `${post.title} - Case Study | CloudCentric`}
        description={metaDescription}
        canonical={`${SITE_URL}/case-studies/${post.slug}`}
        ogType="article"
        ogImage={ogImage}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Case Study Details Hero */}
          <CaseStudyDetailsHero post={post} />

          {/* Main Case Study Article Content */}
          <CaseStudyArticle post={post} related={related} categories={categories} />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
