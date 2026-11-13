/**
 * Validates and normalizes case study request bodies (create / update)
 * into Prisma-ready data. Unknown fields are ignored (no mass assignment).
 */
import prisma from "@/lib/prisma";

export interface TitleDesc {
  title: string;
  desc: string;
}

const LIMITS = {
  shortText: 200,
  mediumText: 2000,
  html: 100_000,
  listItems: 30,
  galleryItems: 40,
  tags: 20,
};

export const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

function str(value: unknown, max: number): string | undefined {
  if (value === undefined) return undefined;
  if (value === null) return "";
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Optional string: "" becomes null so the column is cleared. */
function optStr(value: unknown, max: number): string | null | undefined {
  const s = str(value, max);
  return s === undefined ? undefined : s || null;
}

function strList(value: unknown, maxItems = LIMITS.listItems, maxLen = LIMITS.shortText): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function titleDescList(value: unknown): TitleDesc[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => !!v && typeof v === "object")
    .map((v) => ({
      title: typeof v.title === "string" ? v.title.trim().slice(0, LIMITS.shortText) : "",
      desc: typeof v.desc === "string" ? v.desc.trim().slice(0, LIMITS.mediumText) : "",
    }))
    .filter((v) => v.title || v.desc)
    .slice(0, LIMITS.listItems);
}

/** Accepts local upload paths or http(s) URLs only. */
function imageUrl(value: unknown): string | null | undefined {
  const s = str(value, 1000);
  if (s === undefined) return undefined;
  if (!s) return null;
  return s.startsWith("/") || /^https?:\/\//i.test(s) ? s : null;
}

function imageList(value: unknown): string[] | undefined {
  const list = strList(value, LIMITS.galleryItems, 1000);
  return list?.filter((s) => s.startsWith("/") || /^https?:\/\//i.test(s));
}

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type CaseStudyStatus = (typeof STATUSES)[number];

export interface ParsedCaseStudy {
  data: Record<string, unknown>;
  status?: CaseStudyStatus;
  publishedAt?: Date | null;
  categoryId?: string | null;
  tagIds?: string[];
  errors: string[];
}

/**
 * @param body   raw request body
 * @param isCreate  when true, title/slug/clientName are required
 */
export async function parseCaseStudyBody(body: unknown, isCreate: boolean): Promise<ParsedCaseStudy> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: string[] = [];
  const data: Record<string, unknown> = {};

  const title = str(b.title, LIMITS.shortText);
  const slugInput = str(b.slug, LIMITS.shortText);
  const clientName = str(b.clientName, LIMITS.shortText);

  if (isCreate || title !== undefined) {
    if (!title) errors.push("Title is required");
    else data.title = title;
  }
  if (isCreate || slugInput !== undefined) {
    const slug = toSlug(slugInput || "");
    if (!slug) errors.push("URL slug is required");
    else data.slug = slug;
  }
  if (isCreate || clientName !== undefined) {
    if (!clientName) errors.push("Client name is required");
    else data.clientName = clientName;
  }

  const set = (key: string, value: unknown) => {
    if (value !== undefined) data[key] = value;
  };

  set("industry", str(b.industry, LIMITS.shortText));
  set("summary", str(b.overview, LIMITS.mediumText));
  set("excerpt", optStr(b.excerpt, LIMITS.mediumText));
  set("challenge", str(b.challengeSummary, LIMITS.mediumText));
  set("solution", str(b.solutionSummary, LIMITS.mediumText));

  set("thumbnailImage", imageUrl(b.thumbnailImage));
  set("featuredImage", imageUrl(b.featuredImage));
  set("featuredImageAlt", optStr(b.featuredImageAlt, LIMITS.shortText));
  set("galleryImages", imageList(b.galleryImages));

  set("challengeTitle", optStr(b.challengeTitle, LIMITS.shortText));
  set("challengeHtml", optStr(b.challengeHtml, LIMITS.html));
  set("keyChallenges", strList(b.keyChallenges));
  set("approachTitle", optStr(b.approachTitle, LIMITS.shortText));
  set("approachHtml", optStr(b.approachHtml, LIMITS.html));
  set("approachSteps", titleDescList(b.approachSteps));
  set("solutionTitle", optStr(b.solutionTitle, LIMITS.shortText));
  set("solutionHtml", optStr(b.solutionHtml, LIMITS.html));
  set("solutionHighlights", titleDescList(b.solutionHighlights));
  set("impactTitle", optStr(b.impactTitle, LIMITS.shortText));
  set("impactHtml", optStr(b.impactHtml, LIMITS.html));
  set("impactHighlights", titleDescList(b.impactHighlights));
  set("impacts", strList(b.impacts, 8, 60));
  set("technologies", strList(b.technologies, 20, 60));
  set("relatedIds", strList(b.relatedIds, 6, 64));

  set("seoTitle", optStr(b.seoTitle, LIMITS.shortText));
  set("seoDescription", optStr(b.seoDescription, LIMITS.mediumText));

  if (b.displayOrder !== undefined) {
    const n = Number(b.displayOrder);
    data.displayOrder = Number.isFinite(n) ? Math.max(-9999, Math.min(9999, Math.trunc(n))) : 0;
  }

  // Status
  let status: CaseStudyStatus | undefined;
  if (b.status !== undefined) {
    if (typeof b.status === "string" && (STATUSES as readonly string[]).includes(b.status)) {
      status = b.status as CaseStudyStatus;
    } else {
      errors.push("Invalid status");
    }
  }

  // Publication date ("" clears it)
  let publishedAt: Date | null | undefined;
  if (b.publishedAt !== undefined) {
    if (b.publishedAt === null || b.publishedAt === "") {
      publishedAt = null;
    } else if (typeof b.publishedAt === "string" && !Number.isNaN(Date.parse(b.publishedAt))) {
      publishedAt = new Date(b.publishedAt);
    } else {
      errors.push("Invalid publication date");
    }
  }

  // Category (must exist)
  let categoryId: string | null | undefined;
  if (b.categoryId !== undefined) {
    if (!b.categoryId) {
      categoryId = null;
    } else if (typeof b.categoryId === "string") {
      const cat = await prisma.caseStudyCategory.findUnique({ where: { id: b.categoryId }, select: { id: true } });
      categoryId = cat ? cat.id : null;
    }
  }

  // Tags (only existing IDs)
  let tagIds: string[] | undefined;
  if (b.tagIds !== undefined) {
    const ids = strList(b.tagIds, LIMITS.tags, 64) || [];
    const found = ids.length
      ? await prisma.caseStudyTag.findMany({ where: { id: { in: ids } }, select: { id: true } })
      : [];
    tagIds = found.map((t) => t.id);
  }

  return { data, status, publishedAt, categoryId, tagIds, errors };
}

export const caseStudyAdminInclude = {
  category: { select: { id: true, name: true } },
  tags: { select: { tagId: true, tag: { select: { id: true, name: true } } } },
} as const;
