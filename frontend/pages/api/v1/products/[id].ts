import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const itemIdentifier = id as string;

  if (req.method === "GET") {
    try {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: itemIdentifier }, { slug: itemIdentifier }],
        },
      });

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      console.error("GET Product Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "products", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit products" });
      }

      const existing = await prisma.product.findUnique({ where: { id: itemIdentifier } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const {
        title,
        slug,
        description,
        badge,
        logoUrl,
        features,
        appExchange,
        websiteUrl,
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      if (description !== undefined) updateData.description = description;
      if (badge !== undefined) updateData.badge = badge;
      if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
      if (features !== undefined) updateData.features = features;
      if (appExchange !== undefined) updateData.appExchange = appExchange;
      if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;

      const updated = await prisma.product.update({
        where: { id: itemIdentifier },
        data: updateData,
      });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_product",
          module: "products",
          details: { id: updated.id, title: updated.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("PUT Product Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "products", "delete")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot delete products" });
      }

      const existing = await prisma.product.findUnique({ where: { id: itemIdentifier } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      await prisma.product.delete({ where: { id: itemIdentifier } });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "delete_product",
          module: "products",
          details: { id: itemIdentifier, title: existing.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("DELETE Product Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
