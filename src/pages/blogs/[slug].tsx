import type { GetServerSideProps } from "next";
import { getBlogPostBySlug, getPublishedBlogPosts, getBlogCategories } from "@/lib/blog-data";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import BlogDetailsHero from "@/components/blogs/BlogDetailsHero";
import BlogArticle, { type SidebarCategory } from "@/components/blogs/BlogArticle";
import type { BlogPost } from "@/components/blogs/BlogCard";
import YouMightLike from "@/components/blogs/YouMightLike";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

interface BlogDetailsPageProps {
  post: BlogPost;
  /** Sanitized CMS article HTML. */
  contentHtml: string;
  /** All published posts (for sidebar widgets and "You Might Like"). */
  allPosts: BlogPost[];
  /** All CMS categories with published-post counts (sidebar). */
  categories: SidebarCategory[];
}

export const getServerSideProps: GetServerSideProps<BlogDetailsPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [detail, allPosts, categories] = await Promise.all([
    getBlogPostBySlug(slug),
    getPublishedBlogPosts(),
    getBlogCategories(),
  ]);

  if (!detail) return { notFound: true };

  return {
    props: {
      post: detail.post,
      contentHtml: detail.contentHtml,
      allPosts,
      categories: categories.map((c) => ({ name: c.name, count: c.count })),
    },
  };
};

export default function BlogDetailsPage({ post, contentHtml, allPosts = [], categories = [] }: BlogDetailsPageProps) {
  const metaDescription = post.metaDescription || post.description;

  // Recommendations exclude the current article (matched by slug)
  const recommended = allPosts.filter((p) => p.slug !== post.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": metaDescription,
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
        description={metaDescription}
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
          <BlogArticle post={post} contentHtml={contentHtml} allPosts={allPosts} categories={categories} />

          {/* You Might Like Recommended Articles Section */}
          <YouMightLike
            currentPostId={post.id}
            posts={recommended}
          />

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
