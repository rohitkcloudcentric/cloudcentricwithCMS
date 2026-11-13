/**
 * Validates and normalizes product request bodies (create / update) into Prisma-ready data.
 * Unknown fields are ignored (no mass assignment). Same approach as case-study-input.ts.
 */
import prisma from "@/lib/prisma";

const LIMITS = {
  title: 150,
  shortText: 200,
  description: 600,
  seoDescription: 500,
  html: 100_000,
  features: 30,
  featureLen: 200,
  technologies: 30,
  techLen: 60,
  gallery: 20,
  url: 1000,
};

export const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 150);

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

function strList(value: unknown, maxItems: number, maxLen: number): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of value) {
    if (typeof v !== "string") continue;
    const s = v.trim().slice(0, maxLen);
    if (!s || seen.has(s.toLowerCase())) continue;
    seen.add(s.toLowerCase());
    out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

/** Local upload / site path (not protocol-relative) or an http(s) URL. */
export function isSafeImageUrl(s: string): boolean {
  if (s.startsWith("/")) return !s.startsWith("//") && !s.includes("..") && !/[\s"'<>\\]/.test(s);
  return /^https?:\/\/[^\s"'<>]+$/i.test(s);
}

function imageUrl(value: unknown, label: string, errors: string[]): string | null | undefined {
  const s = str(value, LIMITS.url);
  if (s === undefined) return undefined;
  if (!s) return null;
  if (!isSafeImageUrl(s)) {
    errors.push(`${label} must be an uploaded image or a valid http(s) URL`);
    return undefined;
  }
  return s;
}

/** Validates the official website link (http/https only). */
function websiteUrl(value: unknown, errors: string[]): string | null | undefined {
  const s = str(value, LIMITS.url);
  if (s === undefined) return undefined;
  if (!s) return null;
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(s) ? s : `https://${s}`);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("protocol");
    if (!u.hostname.includes(".")) throw new Error("host");
    return u.toString();
  } catch {
    errors.push("Website URL must be a valid http(s) link");
    return undefined;
  }
}

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ProductStatus = (typeof STATUSES)[number];

export interface ParsedProduct {
  data: Record<string, unknown>;
  status?: ProductStatus;
  isActive?: boolean;
  publishedAt?: Date | null;
  /** undefined = leave gallery untouched */
  gallery?: { url: string; alt: string | null }[];
  errors: string[];
}

/**
 * @param body      raw request body
 * @param isCreate  when true, title is required
 */
export function parseProductBody(body: unknown, isCreate: boolean): ParsedProduct {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: string[] = [];
  const data: Record<string, unknown> = {};

  const title = str(b.title, LIMITS.title);
  if (isCreate || title !== undefined) {
    if (!title) errors.push("Product name is required");
    else data.title = title;
  }

  // Slug: optional on create (derived from the title); never empty on update
  const slugInput = str(b.slug, LIMITS.title);
  if (slugInput !== undefined) {
    const slug = toSlug(slugInput);
    if (slug) data.slug = slug;
    else if (!isCreate || slugInput) errors.push("URL slug is required");
  }
  if (isCreate && !data.slug && title) data.slug = toSlug(title);
  if (isCreate && !data.slug && title) errors.push("Could not build a URL slug from the product name");

  const set = (key: string, value: unknown) => {
    if (value !== undefined) data[key] = value;
  };

  set("badge", optStr(b.badge, LIMITS.shortText));
  set("description", str(b.description, LIMITS.description));
  set("contentHtml", optStr(b.contentHtml, LIMITS.html));
  set("logoUrl", imageUrl(b.logoUrl, "Logo / thumbnail", errors));
  set("featuredImage", imageUrl(b.featuredImage, "Featured image", errors));
  set("featuredImageAlt", optStr(b.featuredImageAlt, LIMITS.shortText));
  set("features", strList(b.features, LIMITS.features, LIMITS.featureLen));
  set("technologies", strList(b.technologies, LIMITS.technologies, LIMITS.techLen));
  set("websiteUrl", websiteUrl(b.websiteUrl, errors));
  set("appExchange", optStr(b.appExchange, LIMITS.url));
  set("seoTitle", optStr(b.seoTitle, LIMITS.shortText));
  set("seoDescription", optStr(b.seoDescription, LIMITS.seoDescription));

  if (b.displayOrder !== undefined) {
    const n = Number(b.displayOrder);
    data.displayOrder = Number.isFinite(n) ? Math.max(-9999, Math.min(9999, Math.trunc(n))) : 0;
  }

  let isActive: boolean | undefined;
  if (b.isActive !== undefined) {
    if (typeof b.isActive === "boolean") isActive = b.isActive;
    else errors.push("Invalid active flag");
  }

  let status: ProductStatus | undefined;
  if (b.status !== undefined) {
    if (typeof b.status === "string" && (STATUSES as readonly string[]).includes(b.status)) {
      status = b.status as ProductStatus;
    } else {
      errors.push("Invalid status");
    }
  }

  let publishedAt: Date | null | undefined;
  if (b.publishedAt !== undefined) {
    if (b.publishedAt === null || b.publishedAt === "") publishedAt = null;
    else if (typeof b.publishedAt === "string" && !Number.isNaN(Date.parse(b.publishedAt))) {
      publishedAt = new Date(b.publishedAt);
    } else errors.push("Invalid publication date");
  }

  // Gallery: [{url, alt}] or plain URL strings
  let gallery: ParsedProduct["gallery"];
  if (b.galleryImages !== undefined) {
    gallery = [];
    const list = Array.isArray(b.galleryImages) ? b.galleryImages : [];
    const seen = new Set<string>();
    for (const item of list) {
      const raw = typeof item === "string" ? item : item && typeof item === "object" ? (item as { url?: unknown }).url : "";
      const alt = item && typeof item === "object" ? optStr((item as { alt?: unknown }).alt, LIMITS.shortText) ?? null : null;
      const url = typeof raw === "string" ? raw.trim().slice(0, LIMITS.url) : "";
      if (!url || seen.has(url)) continue;
      if (!isSafeImageUrl(url)) {
        errors.push("Gallery images must be uploaded images or valid http(s) URLs");
        break;
      }
      seen.add(url);
      gallery.push({ url, alt });
      if (gallery.length >= LIMITS.gallery) break;
    }
  }

  return { data, status, isActive, publishedAt, gallery, errors };
}

/** Returns `base`, or `base-2`, `base-3`... until it is not used by another product. */
export async function uniqueProductSlug(base: string, excludeId?: string): Promise<string> {
  const root = base || "product";
  for (let i = 1; i < 500; i++) {
    const candidate = i === 1 ? root : `${root}-${i}`;
    const clash = await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!clash || clash.id === excludeId) return candidate;
  }
  return `${root}-${Date.now()}`;
}

export const productAdminInclude = {
  images: { orderBy: { sortOrder: "asc" as const }, select: { id: true, url: true, alt: true, sortOrder: true } },
} as const;
