/**
 * Server-only loaders that read published + active products from the CMS and map them
 * to the ProductPost shape used by the public UI. Import only from getServerSideProps.
 */
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/sanitize-content";
import type { ProductPost } from "@/components/products/product-types";

const publicWhere: Prisma.ProductWhereInput = { status: "PUBLISHED", isActive: true };
const publicOrder: Prisma.ProductOrderByWithRelationInput[] = [{ displayOrder: "asc" }, { createdAt: "desc" }];
const withImages = { images: { orderBy: { sortOrder: "asc" as const } } } as const;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof withImages }>;
type ProductListRow = Omit<ProductRow, "contentHtml" | "images"> & Partial<Pick<ProductRow, "contentHtml" | "images">>;

const asStrings = (v: Prisma.JsonValue | null): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

function toCard(r: ProductListRow): ProductPost {
  return {
    id: r.id,
    name: r.title,
    slug: r.slug,
    subtitle: r.badge || "",
    shortDescription: r.description || "",
    logo: r.logoUrl || "",
    image: r.featuredImage || r.logoUrl || "",
    features: asStrings(r.features),
    technologies: asStrings(r.technologies),
    websiteUrl: r.websiteUrl || "",
  };
}

function toDetail(r: ProductRow): ProductPost {
  return {
    ...toCard(r),
    featuredImage: r.featuredImage || r.logoUrl || "",
    featuredImageAlt: r.featuredImageAlt || r.title,
    contentHtml: r.contentHtml && r.contentHtml.trim() ? sanitizeArticleHtml(r.contentHtml) : "",
    gallery: r.images.map((i) => ({ url: i.url, alt: i.alt || `${r.title} screenshot` })),
    seoTitle: r.seoTitle || "",
    seoDescription: r.seoDescription || r.description || "",
    updatedAt: r.updatedAt.toISOString(),
  };
}

/** Published + active products for the listing page, in display order. */
export async function getPublishedProducts(): Promise<ProductPost[]> {
  try {
    const rows = await prisma.product.findMany({
      where: publicWhere,
      orderBy: publicOrder,
      omit: { contentHtml: true },
    });
    return rows.map(toCard);
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
}

export interface ProductDetailData {
  product: ProductPost;
  others: ProductPost[];
}

/** One published product plus a few other products. Returns null for 404. */
export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  if (!slug) return null;

  const row = await prisma.product.findFirst({ where: { slug, ...publicWhere }, include: withImages });
  if (!row) return null;

  const others = await prisma.product.findMany({
    where: { ...publicWhere, id: { not: row.id } },
    orderBy: publicOrder,
    take: 3,
    omit: { contentHtml: true },
  });

  return { product: toDetail(row), others: others.map(toCard) };
}

/** Lightweight list for the sitemap. */
export async function getPublishedProductSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  try {
    return await prisma.product.findMany({
      where: publicWhere,
      select: { slug: true, updatedAt: true },
      orderBy: publicOrder,
    });
  } catch (error) {
    console.error("Failed to load product slugs:", error);
    return [];
  }
}
