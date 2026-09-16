import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const articleId = id as string;

  if (req.method === "GET") {
    try {
      // Find by ID or by Slug
      const article = await prisma.blogArticle.findFirst({
        where: {
          OR: [{ id: articleId }, { slug: articleId }],
        },
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true, avatarUrl: true } },
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

      // Author can edit own draft, Editor/Super Admin can edit any
      const isOwner = existing.authorId === user.id;
      if (!isOwner && !checkPermission(user, "blogs", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit this article" });
      }

      const {
        title,
        slug,
        excerpt,
        contentHtml,
        featuredImage,
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
      if (readTime !== undefined) updateData.readTime = readTime;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
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

      const updated = await prisma.blogArticle.update({
        where: { id: articleId },
        data: updateData,
        include: { category: true, author: { select: { id: true, name: true } } },
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
