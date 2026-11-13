import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { canAccessRecord, checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { parseProductBody, productAdminInclude } from "@/lib/product-input";
import { deleteUnusedUploads, uploadUrlsInHtml } from "@/lib/upload-cleanup";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const productId = typeof req.query.id === "string" ? req.query.id : "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  if (req.method === "GET") {
    try {
      const user = await getAuthenticatedUser(req);
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: productId }, { slug: productId }],
          // Staff are limited to their scope; everyone else to published + active products
          ...(user && checkPermission(user, "products", "read")
            ? ownedRecordsFilter(user, "products", "createdById")
            : { status: "PUBLISHED" as const, isActive: true }),
        },
        include: productAdminInclude,
      });
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error("GET Product Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "products", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit products" });
      }

      const existing = await prisma.product.findUnique({ where: { id: productId }, include: productAdminInclude });
      if (!existing) return res.status(404).json({ success: false, error: "Product not found" });
      if (!canAccessRecord(user, "products", existing.createdById)) {
        return res.status(403).json({ success: false, error: "Forbidden: You can only change your own products" });
      }

      const parsed = parseProductBody(req.body, false);
      if (parsed.errors.length) {
        return res.status(400).json({ success: false, error: parsed.errors.join(". ") });
      }

      if (typeof parsed.data.slug === "string" && parsed.data.slug !== existing.slug) {
        const clash = await prisma.product.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
        if (clash) return res.status(400).json({ success: false, error: "A product with this slug already exists" });
      }

      const updateData: Prisma.ProductUncheckedUpdateInput = {
        ...(parsed.data as Prisma.ProductUncheckedUpdateInput),
      };

      if (parsed.isActive !== undefined) updateData.isActive = parsed.isActive;

      if (parsed.status !== undefined && parsed.status !== existing.status) {
        if (parsed.status === "PUBLISHED" && !checkPermission(user, "products", "publish")) {
          return res.status(403).json({ success: false, error: "Forbidden: You cannot publish products" });
        }
        updateData.status = parsed.status;
      }

      if (parsed.publishedAt !== undefined) updateData.publishedAt = parsed.publishedAt;
      // First publish without an explicit date: stamp it now
      const willBePublished = (parsed.status ?? existing.status) === "PUBLISHED";
      if (willBePublished && !existing.publishedAt && parsed.publishedAt == null) {
        updateData.publishedAt = new Date();
      }

      // Replace the gallery as a whole (keeps order); rows are re-created in one transaction
      if (parsed.gallery !== undefined) {
        updateData.images = {
          deleteMany: {},
          create: parsed.gallery.map((g, i) => ({ url: g.url, alt: g.alt, sortOrder: i })),
        };
      }

      const updated = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: productAdminInclude,
      });

      // Remove files that were replaced or removed (after the DB change succeeded)
      const before = [
        existing.logoUrl,
        existing.featuredImage,
        ...existing.images.map((i) => i.url),
        ...uploadUrlsInHtml(existing.contentHtml),
      ];
      if (parsed.data.contentHtml !== undefined || parsed.gallery !== undefined || parsed.data.logoUrl !== undefined || parsed.data.featuredImage !== undefined) {
        const stillUsed = new Set([updated.logoUrl, updated.featuredImage, ...updated.images.map((i) => i.url)]);
        const html = (parsed.data.contentHtml as string | null | undefined) ?? updated.contentHtml;
        uploadUrlsInHtml(html).forEach((u) => stillUsed.add(u));
        await deleteUnusedUploads(before.filter((u) => u && !stillUsed.has(u)));
      }

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_product",
          module: "products",
          details: { id: updated.id, title: updated.title, status: updated.status, isActive: updated.isActive },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("PUT Product Error:", error);
      return res.status(500).json({ success: false, error: "Failed to update product" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "products", "delete")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot delete products" });
      }

      const existing = await prisma.product.findUnique({ where: { id: productId }, include: productAdminInclude });
      if (!existing) return res.status(404).json({ success: false, error: "Product not found" });
      if (!canAccessRecord(user, "products", existing.createdById)) {
        return res.status(403).json({ success: false, error: "Forbidden: You can only change your own products" });
      }

      await prisma.product.delete({ where: { id: productId } }); // gallery rows cascade

      await deleteUnusedUploads([
        existing.logoUrl,
        existing.featuredImage,
        ...existing.images.map((i) => i.url),
        ...uploadUrlsInHtml(existing.contentHtml),
      ]);

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "delete_product",
          module: "products",
          details: { id: existing.id, title: existing.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("DELETE Product Error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete product" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
