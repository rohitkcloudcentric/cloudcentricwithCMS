/**
 * Removes uploaded image files that are no longer used by anything.
 * Only touches files directly inside public/uploads and only deletes a file
 * when no other record in the CMS still references its URL.
 */
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { SOCIAL_ICON_SUPPORTED } from "@/lib/contact-settings-server";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const SAFE_NAME = /^[A-Za-z0-9._-]+$/;

/** "/uploads/123-abc.webp" -> "123-abc.webp"; anything else (external URLs, /images/...) -> null. */
function uploadFileName(url: string | null | undefined): string | null {
  if (!url || !url.startsWith("/uploads/")) return null;
  const name = url.slice("/uploads/".length);
  return SAFE_NAME.test(name) && name !== "." && name !== ".." ? name : null;
}

async function isReferenced(url: string): Promise<boolean> {
  const avatarUser = await prisma.user.findFirst({ where: { avatarUrl: url }, select: { id: true } });
  if (avatarUser) return true;
  if (SOCIAL_ICON_SUPPORTED) {
    const socialIcon = await prisma.socialLink.findFirst({ where: { iconUrl: url } as object, select: { id: true } });
    if (socialIcon) return true;
  }
  const [product, productImage, article, caseStudy, caseStudyGallery] = await Promise.all([
    prisma.product.findFirst({
      where: { OR: [{ logoUrl: url }, { featuredImage: url }, { contentHtml: { contains: url } }] },
      select: { id: true },
    }),
    prisma.productImage.findFirst({ where: { url }, select: { id: true } }),
    prisma.blogArticle.findFirst({
      where: { OR: [{ featuredImage: url }, { thumbnailImage: url }, { contentHtml: { contains: url } }] },
      select: { id: true },
    }),
    prisma.caseStudy.findFirst({
      where: { OR: [{ thumbnailImage: url }, { featuredImage: url }] },
      select: { id: true },
    }),
    prisma.$queryRaw<{ x: number }[]>`SELECT 1 AS x FROM "CaseStudy" WHERE "galleryImages"::text LIKE ${"%" + url + "%"} LIMIT 1`,
  ]);
  return Boolean(product || productImage || article || caseStudy || caseStudyGallery.length);
}

/**
 * Call AFTER the database change has been committed, with the URLs that may have been orphaned.
 * Failures are logged and never thrown (a leftover file is harmless; a failed request is not).
 */
export async function deleteUnusedUploads(urls: (string | null | undefined)[]): Promise<void> {
  const unique = Array.from(new Set(urls.filter((u): u is string => Boolean(u))));
  for (const url of unique) {
    const name = uploadFileName(url);
    if (!name) continue;
    try {
      if (await isReferenced(url)) continue;
      await fs.unlink(path.join(UPLOADS_DIR, name));
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") console.error("Upload cleanup failed:", url, err);
    }
  }
}

/** Extracts /uploads/... URLs embedded in rich-text HTML (<img src="...">). */
export function uploadUrlsInHtml(html: string | null | undefined): string[] {
  if (!html) return [];
  return Array.from(html.matchAll(/\/uploads\/[A-Za-z0-9._-]+/g), (m) => m[0]);
}
