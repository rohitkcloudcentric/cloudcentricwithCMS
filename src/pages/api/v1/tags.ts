import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { MAX_TAG_NAME_LENGTH, normalizeTagName } from "@/lib/article-tags";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { articles: true } } },
      });
      return res.status(200).json({ success: true, data: tags });
    } catch (error) {
      console.error("GET Tags Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "blogs", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create tags" });
      }

      const name = normalizeTagName(req.body?.name);
      if (!name) return res.status(400).json({ success: false, error: "Tag name is required" });
      if (name.length > MAX_TAG_NAME_LENGTH) {
        return res.status(400).json({ success: false, error: "Tag name is too long" });
      }

      const existing = await prisma.tag.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
      });
      if (existing) {
        return res.status(409).json({ success: false, error: "Tag already exists", data: existing });
      }

      const tag = await prisma.tag.create({ data: { name } });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: { userId: user.id, action: "create_tag", module: "blogs", details: { tagId: tag.id, name }, ipAddress: clientIp },
      });

      return res.status(201).json({ success: true, data: { ...tag, _count: { articles: 0 } } });
    } catch (error) {
      console.error("POST Tag Error:", error);
      return res.status(500).json({ success: false, error: "Failed to create tag" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
