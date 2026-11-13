import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { MAX_TAG_NAME_LENGTH, normalizeTagName } from "@/lib/article-tags";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tagId = typeof req.query.id === "string" ? req.query.id : "";

  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await prisma.tag.findUnique({
      where: { id: tagId },
      include: { _count: { select: { articles: true } } },
    });
    if (!existing) return res.status(404).json({ success: false, error: "Tag not found" });

    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    // ── Rename tag ──
    if (req.method === "PUT") {
      if (!checkPermission(user, "blogs", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit tags" });
      }

      const name = normalizeTagName(req.body?.name);
      if (!name) return res.status(400).json({ success: false, error: "Tag name is required" });
      if (name.length > MAX_TAG_NAME_LENGTH) {
        return res.status(400).json({ success: false, error: "Tag name is too long" });
      }

      const duplicate = await prisma.tag.findFirst({
        where: { NOT: { id: tagId }, name: { equals: name, mode: "insensitive" } },
      });
      if (duplicate) {
        return res.status(409).json({ success: false, error: "Another tag already uses this name" });
      }

      const updated = await prisma.tag.update({ where: { id: tagId }, data: { name } });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_tag",
          module: "blogs",
          details: { tagId, from: existing.name, to: updated.name },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: { ...updated, _count: existing._count } });
    }

    // ── Delete tag (removes it from articles; the articles themselves are kept) ──
    if (!checkPermission(user, "blogs", "delete")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot delete tags" });
    }

    // ArticleTag rows cascade on delete
    await prisma.tag.delete({ where: { id: tagId } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "delete_tag",
        module: "blogs",
        details: { tagId, name: existing.name, articlesAffected: existing._count.articles },
        ipAddress: clientIp,
      },
    });

    return res.status(200).json({ success: true, message: "Tag deleted", articlesAffected: existing._count.articles });
  } catch (error) {
    console.error(`${req.method} Tag Error:`, error);
    return res.status(500).json({ success: false, error: "Failed to update tag" });
  }
}
