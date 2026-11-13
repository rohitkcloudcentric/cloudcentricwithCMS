/**
 * Server-only helpers that load published blog articles from the CMS database
 * and map them to the BlogPost shape used by the public blog UI.
 * Import only from getServerSideProps / API routes.
 */
import prisma from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize-content";
import type { BlogPost } from "@/components/blogs/BlogCard";

const FALLBACK_IMAGE = "/images/blogs/how-ai-agents-are-changing-business-automation.png";
const DEFAULT_READ_TIME = "5 MIN READ";

const articleInclude = {
  category: { select: { name: true } },
  author: { select: { name: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  seoDescription: string | null;
  readTime: string | null;
  featuredImage: string | null;
  thumbnailImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string } | null;
  author: { name: string } | null;
  tags: { tag: { name: string } }[];
};

/**
 * Maps a DB row to a BlogPost.
 * `imageType: "card"` prefers the thumbnail (listing cards), `"cover"` prefers the cover image.
 */
function toBlogPost(a: ArticleRow, imageType: "card" | "cover"): BlogPost {
  const image =
    imageType === "card"
      ? a.thumbnailImage || a.featuredImage
      : a.featuredImage || a.thumbnailImage;

  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category?.name || "Insights",
    description: a.excerpt || "",
    metaDescription: a.seoDescription || a.excerpt || "",
    readTime: a.readTime?.trim() || DEFAULT_READ_TIME,
    image: image || FALLBACK_IMAGE,
    date: (a.publishedAt ?? a.createdAt).toISOString().split("T")[0],
    author: a.author?.name || "CloudCentric",
    tags: a.tags.map((t) => t.tag.name).sort((x, y) => x.localeCompare(y)),
  };
}

/** All published articles (newest first), shaped for listing cards. */
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogArticle.findMany({
      where: { status: "PUBLISHED" },
      include: articleInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map((r) => toBlogPost(r, "card"));
  } catch (error) {
    console.error("Failed to load blog posts:", error);
    return [];
  }
}

export interface BlogDetailData {
  post: BlogPost;
  /** Sanitized CMS article HTML. */
  contentHtml: string;
}

/** Loads a single published article by slug. Returns null when it should 404. */
export async function getBlogPostBySlug(slug: string): Promise<BlogDetailData | null> {
  if (!slug) return null;

  const row = await prisma.blogArticle.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: articleInclude,
  });
  if (!row) return null;

  return {
    post: toBlogPost(row, "cover"),
    contentHtml: sanitizeArticleHtml(row.contentHtml),
  };
}

/** Lightweight list used by the blog sitemap. */
export async function getPublishedBlogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  try {
    return await prisma.blogArticle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load blog slugs for sitemap:", error);
    return [];
  }
}

export interface BlogCategoryCount {
  name: string;
  slug: string;
  /** Number of PUBLISHED articles in this category */
  count: number;
}

/** CMS categories (alphabetical) that have at least one published article, with their counts. */
export async function getBlogCategories(): Promise<BlogCategoryCount[]> {
  try {
    const rows = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        name: true,
        slug: true,
        _count: { select: { articles: { where: { status: "PUBLISHED" } } } },
      },
    });
    return rows
      .map((c) => ({ name: c.name, slug: c.slug, count: c._count.articles }))
      .filter((c) => c.count > 0);
  } catch (error) {
    console.error("Failed to load blog categories:", error);
    return [];
  }
}

/** Tag names (alphabetical) used by at least one published article. */
export async function getBlogTags(): Promise<string[]> {
  try {
    const rows = await prisma.tag.findMany({
      where: { articles: { some: { article: { status: "PUBLISHED" } } } },
      orderBy: { name: "asc" },
      select: { name: true },
    });
    return rows.map((t) => t.name);
  } catch (error) {
    console.error("Failed to load blog tags:", error);
    return [];
  }
}
