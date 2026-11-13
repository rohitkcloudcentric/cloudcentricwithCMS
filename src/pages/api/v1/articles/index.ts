import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { resolveTagIds } from "@/lib/article-tags";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { status, category, search, page = "1", limit = "10" } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};

      const user = await getAuthenticatedUser(req);
      const staff = Boolean(user) && checkPermission(user, "blogs", "read");
      if (!staff) {
        // Public callers (and users without blogs:view) only ever see published articles
        where.status = "PUBLISHED";
      } else {
        if (typeof status === "string" && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) where.status = status;
        // Without "manage" a user only sees the articles they wrote
        Object.assign(where, ownedRecordsFilter(user, "blogs", "authorId"));
      }

      if (category && category !== "All") {
        where.category = {
          name: {
            equals: category as string,
            mode: "insensitive",
          },
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { excerpt: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const [articles, total] = await Promise.all([
        prisma.blogArticle.findMany({
          where,
          include: {
            category: true,
            author: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        prisma.blogArticle.count({ where }),
      ]);

      return res.status(200).json({
        success: true,
        data: articles,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    } catch (error: any) {
      console.error("GET Articles Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "blogs", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create articles" });
      }

      const {
        title,
        slug,
        excerpt,
        contentHtml,
        featuredImage,
        thumbnailImage,
        readTime,
        status = "DRAFT",
        categoryId,
        seoTitle,
        seoDescription,
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ success: false, error: "Title and slug are required" });
      }

      // Format slug
      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      const existing = await prisma.blogArticle.findUnique({ where: { slug: formattedSlug } });
      if (existing) {
        return res.status(400).json({ success: false, error: "Article with this slug already exists" });
      }

      const tagIds = await resolveTagIds(req.body?.tagIds);

      const isPublishing = status === "PUBLISHED";
      if (isPublishing && !checkPermission(user, "blogs", "publish")) {
        return res.status(403).json({ success: false, error: "Forbidden: You do not have permission to publish" });
      }

      let resolvedCategoryId: string | null = null;
      if (categoryId && typeof categoryId === "string" && categoryId.trim() !== "" && categoryId !== "null" && categoryId !== "undefined") {
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
          resolvedCategoryId = cat.id;
        } else {
          const catSlug = categoryId.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          if (catSlug) {
            const newCat = await prisma.category.upsert({
              where: { slug: catSlug },
              update: {},
              create: { name: categoryId, slug: catSlug },
            });
            resolvedCategoryId = newCat.id;
          }
        }
      }

      const article = await prisma.blogArticle.create({
        data: {
          title,
          slug: formattedSlug,
          excerpt: excerpt || null,
          contentHtml: contentHtml || "",
          featuredImage: featuredImage || null,
          thumbnailImage: thumbnailImage || null,
          readTime: readTime || "5 MIN READ",
          status,
          publishedAt: isPublishing ? new Date() : null,
          authorId: user.id,
          categoryId: resolvedCategoryId,
          seoTitle: seoTitle || title,
          seoDescription: seoDescription || excerpt,
          ...(tagIds && tagIds.length > 0
            ? { tags: { create: tagIds.map((tagId) => ({ tagId })) } }
            : {}),
        },
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
          action: "create_article",
          module: "blogs",
          details: { articleId: article.id, title: article.title, status: article.status },
          ipAddress: clientIp,
        },
      });

      return res.status(201).json({ success: true, data: article });
    } catch (error: any) {
      console.error("POST Article Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
