import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { parseProductBody, productAdminInclude, uniqueProductSlug } from "@/lib/product-input";

const MAX_PAGE_SIZE = 50;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { status, active, search, page, pageSize } = req.query;
      const user = await getAuthenticatedUser(req);
      const where: Prisma.ProductWhereInput = {};

      if (!user || !checkPermission(user, "products", "read")) {
        // Public callers (and users without products:view) only ever see published + active products
        where.status = "PUBLISHED";
        where.isActive = true;
      } else {
        // Without "manage" a user only sees the products they created
        Object.assign(where, ownedRecordsFilter(user, "products", "createdById"));
        if (typeof status === "string" && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
          where.status = status as Prisma.EnumContentStatusFilter["equals"];
        }
        if (active === "true") where.isActive = true;
        if (active === "false") where.isActive = false;
      }

      if (typeof search === "string" && search.trim()) {
        const q = search.trim().slice(0, 100);
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ];
      }

      const orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ displayOrder: "asc" }, { createdAt: "desc" }];
      // The detailed description can be large and is not needed for lists
      const listArgs = { where, orderBy, include: productAdminInclude, omit: { contentHtml: true } } as const;

      // Paginated (admin) vs. everything (backwards compatible)
      if (typeof page === "string") {
        const size = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(typeof pageSize === "string" ? pageSize : "", 10) || 6));
        const total = await prisma.product.count({ where });
        const totalPages = Math.max(1, Math.ceil(total / size));
        const current = Math.min(totalPages, Math.max(1, parseInt(page, 10) || 1));
        const products = await prisma.product.findMany({ ...listArgs, skip: (current - 1) * size, take: size });
        return res.status(200).json({
          success: true,
          data: products,
          meta: { total, page: current, pageSize: size, totalPages },
        });
      }

      const products = await prisma.product.findMany(listArgs);
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error("GET Products Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "products", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create products" });
      }

      const parsed = parseProductBody(req.body, true);
      if (parsed.errors.length) {
        return res.status(400).json({ success: false, error: parsed.errors.join(". ") });
      }

      const status = parsed.status ?? "DRAFT";
      if (status === "PUBLISHED" && !checkPermission(user, "products", "publish")) {
        return res.status(403).json({ success: false, error: "Forbidden: You cannot publish products" });
      }

      const slug = await uniqueProductSlug(parsed.data.slug as string);
      const fields = parsed.data as Partial<Prisma.ProductUncheckedCreateInput>;

      const product = await prisma.product.create({
        data: {
          ...fields,
          title: parsed.data.title as string,
          slug,
          description: fields.description ?? "",
          createdById: user.id,
          status,
          isActive: parsed.isActive ?? true,
          publishedAt: parsed.publishedAt ?? (status === "PUBLISHED" ? new Date() : null),
          ...(parsed.gallery?.length
            ? { images: { create: parsed.gallery.map((g, i) => ({ url: g.url, alt: g.alt, sortOrder: i })) } }
            : {}),
        },
        include: productAdminInclude,
      });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "create_product",
          module: "products",
          details: { id: product.id, title: product.title, status: product.status },
          ipAddress: clientIp,
        },
      });

      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error("POST Product Error:", error);
      return res.status(500).json({ success: false, error: "Failed to create product" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
