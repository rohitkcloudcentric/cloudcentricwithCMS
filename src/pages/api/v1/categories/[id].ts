import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categoryId = typeof req.query.id === "string" ? req.query.id : "";

  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { articles: true } } },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Category not found" });

    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    // ── Rename category ──
    if (req.method === "PUT") {
      if (!checkPermission(user, "blogs", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit categories" });
      }

      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      if (!name) return res.status(400).json({ success: false, error: "Category name is required" });
      if (name.length > 60) return res.status(400).json({ success: false, error: "Category name is too long" });

      const slug = toSlug(name);
      if (!slug) return res.status(400).json({ success: false, error: "Invalid category name" });

      const duplicate = await prisma.category.findFirst({
        where: {
          NOT: { id: categoryId },
          OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }],
        },
      });
      if (duplicate) {
        return res.status(409).json({ success: false, error: "Another category already uses this name" });
      }

      const updated = await prisma.category.update({
        where: { id: categoryId },
        data: { name, slug },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_category",
          module: "blogs",
          details: { categoryId, from: existing.name, to: updated.name },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    }

    // ── Delete category ──
    if (!checkPermission(user, "blogs", "delete")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot delete categories" });
    }

    // Articles in this category are kept and become uncategorized
    await prisma.$transaction([
      prisma.blogArticle.updateMany({ where: { categoryId }, data: { categoryId: null } }),
      prisma.category.delete({ where: { id: categoryId } }),
    ]);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "delete_category",
        module: "blogs",
        details: { categoryId, name: existing.name, articlesUncategorized: existing._count.articles },
        ipAddress: clientIp,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Category deleted",
      articlesUncategorized: existing._count.articles,
    });
  } catch (error) {
    console.error(`${req.method} Category Error:`, error);
    return res.status(500).json({ success: false, error: "Failed to update category" });
  }
}
