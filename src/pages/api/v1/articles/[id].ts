import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { canAccessRecord, checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { resolveTagIds } from "@/lib/article-tags";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const articleId = id as string;

  if (req.method === "GET") {
    try {
      const user = await getAuthenticatedUser(req);
      const staff = Boolean(user) && checkPermission(user, "blogs", "read");
      // Find by ID or by Slug; staff are limited to their scope, everyone else to published articles
      const article = await prisma.blogArticle.findFirst({
        where: {
          OR: [{ id: articleId }, { slug: articleId }],
          ...(staff ? ownedRecordsFilter(user, "blogs", "authorId") : { status: "PUBLISHED" as const }),
        },
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true, avatarUrl: true } },
          tags: { include: { tag: true } },
        },
      });

      if (!article) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }

      return res.status(200).json({ success: true, data: article });
    } catch (error: any) {
      console.error("GET Single Article Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const existing = await prisma.blogArticle.findUnique({ where: { id: articleId } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }

      // Needs blogs:edit, and the article must be within the user's scope (own, or all with "manage")
      if (!checkPermission(user, "blogs", "update") || !canAccessRecord(user, "blogs", existing.authorId)) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit this article" });
      }

      const {
        title,
        slug,
        excerpt,
        contentHtml,
        featuredImage,
        thumbnailImage,
        readTime,
        status,
        categoryId,
        seoTitle,
        seoDescription,
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) {
        updateData.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      }
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (contentHtml !== undefined) updateData.contentHtml = contentHtml;
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (thumbnailImage !== undefined) updateData.thumbnailImage = thumbnailImage || null;
      if (readTime !== undefined) {
        updateData.readTime = typeof readTime === "string" && readTime.trim() ? readTime.trim() : "5 MIN READ";
      }
      if (categoryId !== undefined) {
        if (!categoryId || categoryId === "" || categoryId === "null" || categoryId === "undefined" || categoryId === "none") {
          updateData.categoryId = null;
        } else {
          const cat = await prisma.category.findFirst({
            where: {
              OR: [
                { id: categoryId },
                { slug: categoryId },
                { name: categoryId },
              ],
            },
          });
          if (cat) {
            updateData.categoryId = cat.id;
          } else {
            const catSlug = categoryId.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            if (catSlug) {
              const newCat = await prisma.category.upsert({
                where: { slug: catSlug },
                update: {},
                create: { name: categoryId, slug: catSlug },
              });
              updateData.categoryId = newCat.id;
            } else {
              updateData.categoryId = null;
            }
          }
        }
      }
      if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
      if (seoDescription !== undefined) updateData.seoDescription = seoDescription;

      if (status !== undefined && status !== existing.status) {
        if (status === "PUBLISHED" && !checkPermission(user, "blogs", "publish")) {
          return res.status(403).json({ success: false, error: "Forbidden: You cannot publish articles" });
        }
        updateData.status = status;
        if (status === "PUBLISHED" && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      // Replace the article's tags only when `tagIds` was sent
      const tagIds = await resolveTagIds(req.body?.tagIds);
      if (tagIds !== undefined) {
        updateData.tags = {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        };
      }

      const updated = await prisma.blogArticle.update({
        where: { id: articleId },
        data: updateData,
        include: {
          category: true,
          author: { select: { id: true, name: true } },
          tags: { include: { tag: true } },
        },
      });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_article",
          module: "blogs",
          details: { articleId: updated.id, title: updated.title, status: updated.status },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("PUT Article Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "blogs", "delete")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot delete articles" });
      }

      const existing = await prisma.blogArticle.findUnique({ where: { id: articleId } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Article not found" });
      }
      if (!canAccessRecord(user, "blogs", existing.authorId)) {
        return res.status(403).json({ success: false, error: "Forbidden: You can only delete your own articles" });
      }

      await prisma.blogArticle.delete({ where: { id: articleId } });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "delete_article",
          module: "blogs",
          details: { articleId, title: existing.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, message: "Article deleted successfully" });
    } catch (error: any) {
      console.error("DELETE Article Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
