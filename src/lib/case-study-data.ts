/**
 * Server-only loaders that read published case studies from the CMS and map them
 * to the CaseStudyPost shape used by the public UI. Import only from getServerSideProps.
 */
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize-content";
import type { CaseStudyPost, TitleDescItem } from "@/components/case-studies/CaseStudyCard";

const FALLBACK_IMAGE = "/images/case-studies/case-studies-1.png";

const publicInclude = {
  category: { select: { name: true } },
  tags: { select: { tag: { select: { name: true } } } },
} as const;

type CaseStudyRow = Prisma.CaseStudyGetPayload<{ include: typeof publicInclude }>;

const asStrings = (v: Prisma.JsonValue | null): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

const asTitleDesc = (v: Prisma.JsonValue | null): TitleDescItem[] =>
  Array.isArray(v)
    ? v
        .filter((x): x is Prisma.JsonObject => !!x && typeof x === "object" && !Array.isArray(x))
        .map((x) => ({
          title: typeof x.title === "string" ? x.title : "",
          desc: typeof x.desc === "string" ? x.desc : "",
        }))
        .filter((x) => x.title || x.desc)
    : [];

const cleanHtml = (html: string | null) => (html && html.trim() ? sanitizeArticleHtml(html) : "");

/** Card-level fields (listing, related widgets). */
function toCard(r: CaseStudyRow): CaseStudyPost {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category?.name || "",
    excerpt: r.excerpt || "",
    challenge: r.challenge || "",
    solution: r.solution || "",
    impacts: asStrings(r.impacts),
    technologies: asStrings(r.technologies),
    tags: r.tags.map((t) => t.tag.name),
    image: r.thumbnailImage || r.featuredImage || FALLBACK_IMAGE,
    clientName: r.clientName,
    industry: r.industry,
    metaDescription: r.seoDescription || r.excerpt || r.challenge || "",
    date: (r.publishedAt ?? r.createdAt).toISOString(),
  };
}

/** Full detail fields (detail page). */
function toDetail(r: CaseStudyRow): CaseStudyPost {
  return {
    ...toCard(r),
    seoTitle: r.seoTitle || "",
    featuredImage: r.featuredImage || r.thumbnailImage || FALLBACK_IMAGE,
    featuredImageAlt: r.featuredImageAlt || r.title,
    overview: r.summary || "",
    challengeTitle: r.challengeTitle || "",
    challengeHtml: cleanHtml(r.challengeHtml),
    keyChallenges: asStrings(r.keyChallenges),
    approachTitle: r.approachTitle || "",
    approachHtml: cleanHtml(r.approachHtml),
    approachSteps: asTitleDesc(r.approachSteps),
    solutionTitle: r.solutionTitle || "",
    solutionHtml: cleanHtml(r.solutionHtml),
    solutionHighlights: asTitleDesc(r.solutionHighlights),
    impactTitle: r.impactTitle || "",
    impactHtml: cleanHtml(r.impactHtml),
    impactHighlights: asTitleDesc(r.impactHighlights),
    galleryImages: asStrings(r.galleryImages),
  };
}

const publishedOrder: Prisma.CaseStudyOrderByWithRelationInput[] = [
  { displayOrder: "asc" },
  { publishedAt: "desc" },
  { createdAt: "desc" },
];

/** Published case studies for the listing page, ordered by display order then date. */
export async function getPublishedCaseStudies(): Promise<CaseStudyPost[]> {
  try {
    const rows = await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      include: publicInclude,
      orderBy: publishedOrder,
    });
    return rows.map(toCard);
  } catch (error) {
    console.error("Failed to load case studies:", error);
    return [];
  }
}

export interface CaseStudyDetailData {
  post: CaseStudyPost;
  related: CaseStudyPost[];
}

/** One published case study plus its related studies. Returns null for 404. */
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyDetailData | null> {
  if (!slug) return null;

  const row = await prisma.caseStudy.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: publicInclude,
  });
  if (!row) return null;

  // Hand-picked related studies (in admin order); if none were picked, fall back to same category / latest
  const pickedIds = asStrings(row.relatedIds).filter((id) => id !== row.id);
  const picked = pickedIds.length
    ? await prisma.caseStudy.findMany({
        where: { id: { in: pickedIds }, status: "PUBLISHED" },
        include: publicInclude,
      })
    : [];
  const pickedSorted = pickedIds
    .map((id) => picked.find((p) => p.id === id))
    .filter((p): p is CaseStudyRow => Boolean(p));

  const RELATED_LIMIT = 3;
  let related = pickedSorted.slice(0, RELATED_LIMIT);
  // Only auto-fill when the admin hasn't picked any related case studies.
  // If they picked some, show exactly those (published ones only).
  if (pickedIds.length === 0) {
    const fill = await prisma.caseStudy.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: [row.id, ...related.map((r) => r.id)] },
      },
      include: publicInclude,
      orderBy: publishedOrder,
      take: 10,
    });
    // Prefer the same category
    fill.sort((a, b) => Number(b.categoryId === row.categoryId) - Number(a.categoryId === row.categoryId));
    related = [...related, ...fill].slice(0, RELATED_LIMIT);
  }

  return { post: toDetail(row), related: related.map(toCard) };
}

export interface CaseStudyCategoryCount {
  name: string;
  count: number;
}

/** Categories with at least one published case study, alphabetical. */
export async function getCaseStudyCategories(): Promise<CaseStudyCategoryCount[]> {
  try {
    const rows = await prisma.caseStudyCategory.findMany({
      orderBy: { name: "asc" },
      select: { name: true, _count: { select: { caseStudies: { where: { status: "PUBLISHED" } } } } },
    });
    return rows.map((c) => ({ name: c.name, count: c._count.caseStudies })).filter((c) => c.count > 0);
  } catch (error) {
    console.error("Failed to load case study categories:", error);
    return [];
  }
}

/** Lightweight list for the sitemap. */
export async function getPublishedCaseStudySlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  try {
    return await prisma.caseStudy.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: publishedOrder,
    });
  } catch (error) {
    console.error("Failed to load case study slugs:", error);
    return [];
  }
}
