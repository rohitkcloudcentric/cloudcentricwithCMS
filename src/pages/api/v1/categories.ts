import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // No auto-seeding here: admins manage the full list and may delete every category.
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { articles: true } } },
      });

      return res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error("GET Categories Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "blogs", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create categories" });
      }

      const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
      if (!name) return res.status(400).json({ success: false, error: "Category name is required" });
      if (name.length > 60) return res.status(400).json({ success: false, error: "Category name is too long" });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      if (!slug) return res.status(400).json({ success: false, error: "Invalid category name" });

      const existing = await prisma.category.findFirst({
        where: { OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }] },
      });
      if (existing) {
        return res.status(409).json({ success: false, error: "Category already exists", data: existing });
      }

      const category = await prisma.category.create({ data: { name, slug } });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: { userId: user.id, action: "create_category", module: "blogs", details: { categoryId: category.id, name }, ipAddress: clientIp },
      });

      return res.status(201).json({ success: true, data: { ...category, _count: { articles: 0 } } });
    } catch (error) {
      console.error("POST Category Error:", error);
      return res.status(500).json({ success: false, error: "Failed to create category" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
