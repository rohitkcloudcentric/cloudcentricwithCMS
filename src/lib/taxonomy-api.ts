/**
 * Shared REST handlers for simple name/slug taxonomies (case study categories & tags).
 * Responses use `_count.articles` so the admin TaxonomyManager component can render counts.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, type ModuleName } from "@/lib/rbac";
import { toSlug } from "@/lib/case-study-input";

interface TaxonomyRow {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface TaxonomyStore {
  label: string;
  module: ModuleName;
  maxLength: number;
  list(): Promise<TaxonomyRow[]>;
  get(id: string): Promise<TaxonomyRow | null>;
  findDuplicate(name: string, slug: string, excludeId?: string): Promise<boolean>;
  create(name: string, slug: string): Promise<TaxonomyRow>;
  rename(id: string, name: string, slug: string): Promise<TaxonomyRow>;
  remove(id: string): Promise<void>;
}

const ipOf = (req: NextApiRequest) =>
  (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

const toResponse = (row: TaxonomyRow) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  _count: { articles: row.count },
});

function readName(body: unknown, maxLength: number): { name?: string; slug?: string; error?: string } {
  const raw = (body as { name?: unknown } | undefined)?.name;
  const name = typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
  if (!name) return { error: "Name is required" };
  if (name.length > maxLength) return { error: "Name is too long" };
  const slug = toSlug(name);
  if (!slug) return { error: "Invalid name" };
  return { name, slug };
}

/** GET (list, public) + POST (create) */
export function taxonomyCollectionHandler(store: TaxonomyStore) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      try {
        const rows = await store.list();
        return res.status(200).json({ success: true, data: rows.map(toResponse) });
      } catch (error) {
        console.error(`GET ${store.label} list error:`, error);
        return res.status(500).json({ success: false, error: "Internal server error" });
      }
    }

    if (req.method === "POST") {
      try {
        const user = await getAuthenticatedUser(req);
        if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
        if (!checkPermission(user, store.module, "create")) {
          return res.status(403).json({ success: false, error: `Forbidden: Cannot create ${store.label.toLowerCase()}` });
        }

        const { name, slug, error } = readName(req.body, store.maxLength);
        if (error || !name || !slug) return res.status(400).json({ success: false, error });

        if (await store.findDuplicate(name, slug)) {
          return res.status(409).json({ success: false, error: `${store.label} already exists` });
        }

        const row = await store.create(name, slug);
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `create_${store.label.toLowerCase().replace(/\s+/g, "_")}`,
            module: store.module,
            details: { id: row.id, name },
            ipAddress: ipOf(req),
          },
        });
        return res.status(201).json({ success: true, data: toResponse(row) });
      } catch (error) {
        console.error(`POST ${store.label} error:`, error);
        return res.status(500).json({ success: false, error: `Failed to create ${store.label.toLowerCase()}` });
      }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  };
}

/** PUT (rename) + DELETE */
export function taxonomyItemHandler(store: TaxonomyStore) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PUT" && req.method !== "DELETE") {
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }

    const id = typeof req.query.id === "string" ? req.query.id : "";
    const actionKey = store.label.toLowerCase().replace(/\s+/g, "_");

    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const existing = await store.get(id);
      if (!existing) return res.status(404).json({ success: false, error: `${store.label} not found` });

      if (req.method === "PUT") {
        if (!checkPermission(user, store.module, "update")) {
          return res.status(403).json({ success: false, error: `Forbidden: Cannot edit ${store.label.toLowerCase()}` });
        }
        const { name, slug, error } = readName(req.body, store.maxLength);
        if (error || !name || !slug) return res.status(400).json({ success: false, error });

        if (await store.findDuplicate(name, slug, id)) {
          return res.status(409).json({ success: false, error: `Another ${store.label.toLowerCase()} already uses this name` });
        }

        const row = await store.rename(id, name, slug);
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: `update_${actionKey}`,
            module: store.module,
            details: { id, from: existing.name, to: row.name },
            ipAddress: ipOf(req),
          },
        });
        return res.status(200).json({ success: true, data: toResponse(row) });
      }

      if (!checkPermission(user, store.module, "delete")) {
        return res.status(403).json({ success: false, error: `Forbidden: Cannot delete ${store.label.toLowerCase()}` });
      }
      await store.remove(id);
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: `delete_${actionKey}`,
          module: store.module,
          details: { id, name: existing.name, itemsAffected: existing.count },
          ipAddress: ipOf(req),
        },
      });
      return res.status(200).json({ success: true, message: `${store.label} deleted` });
    } catch (error) {
      console.error(`${req.method} ${store.label} error:`, error);
      return res.status(500).json({ success: false, error: `Failed to update ${store.label.toLowerCase()}` });
    }
  };
}

// ── Stores ──

export const caseStudyCategoryStore: TaxonomyStore = {
  label: "Category",
  module: "case_studies",
  maxLength: 60,
  async list() {
    const rows = await prisma.caseStudyCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { caseStudies: true } } },
    });
    return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies }));
  },
  async get(id) {
    const r = await prisma.caseStudyCategory.findUnique({
      where: { id },
      include: { _count: { select: { caseStudies: true } } },
    });
    return r ? { id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies } : null;
  },
  async findDuplicate(name, slug, excludeId) {
    const r = await prisma.caseStudyCategory.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }],
      },
      select: { id: true },
    });
    return Boolean(r);
  },
  async create(name, slug) {
    const r = await prisma.caseStudyCategory.create({ data: { name, slug } });
    return { id: r.id, name: r.name, slug: r.slug, count: 0 };
  },
  async rename(id, name, slug) {
    const r = await prisma.caseStudyCategory.update({
      where: { id },
      data: { name, slug },
      include: { _count: { select: { caseStudies: true } } },
    });
    return { id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies };
  },
  async remove(id) {
    // Case studies are kept; relation is onDelete: SetNull
    await prisma.caseStudyCategory.delete({ where: { id } });
  },
};

export const caseStudyTagStore: TaxonomyStore = {
  label: "Tag",
  module: "case_studies",
  maxLength: 40,
  async list() {
    const rows = await prisma.caseStudyTag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { caseStudies: true } } },
    });
    return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies }));
  },
  async get(id) {
    const r = await prisma.caseStudyTag.findUnique({
      where: { id },
      include: { _count: { select: { caseStudies: true } } },
    });
    return r ? { id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies } : null;
  },
  async findDuplicate(name, slug, excludeId) {
    const r = await prisma.caseStudyTag.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }],
      },
      select: { id: true },
    });
    return Boolean(r);
  },
  async create(name, slug) {
    const r = await prisma.caseStudyTag.create({ data: { name, slug } });
    return { id: r.id, name: r.name, slug: r.slug, count: 0 };
  },
  async rename(id, name, slug) {
    const r = await prisma.caseStudyTag.update({
      where: { id },
      data: { name, slug },
      include: { _count: { select: { caseStudies: true } } },
    });
    return { id: r.id, name: r.name, slug: r.slug, count: r._count.caseStudies };
  },
  async remove(id) {
    // Tag links cascade; case studies are kept
    await prisma.caseStudyTag.delete({ where: { id } });
  },
};

/** Our Clients categories (industries). New ones are appended to the end of the filter bar. */
export const clientCategoryStore: TaxonomyStore = {
  label: "Category",
  module: "clients",
  maxLength: 60,
  async list() {
    const rows = await prisma.clientCategory.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { clients: true } } },
    });
    return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, count: r._count.clients }));
  },
  async get(id) {
    const r = await prisma.clientCategory.findUnique({
      where: { id },
      include: { _count: { select: { clients: true } } },
    });
    return r ? { id: r.id, name: r.name, slug: r.slug, count: r._count.clients } : null;
  },
  async findDuplicate(name, slug, excludeId) {
    const r = await prisma.clientCategory.findFirst({
      where: {
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }],
      },
      select: { id: true },
    });
    return Boolean(r);
  },
  async create(name, slug) {
    const last = await prisma.clientCategory.aggregate({ _max: { displayOrder: true } });
    const r = await prisma.clientCategory.create({
      data: { name, slug, displayOrder: (last._max.displayOrder ?? 0) + 1 },
    });
    return { id: r.id, name: r.name, slug: r.slug, count: 0 };
  },
  async rename(id, name, slug) {
    const r = await prisma.clientCategory.update({
      where: { id },
      data: { name, slug },
      include: { _count: { select: { clients: true } } },
    });
    return { id: r.id, name: r.name, slug: r.slug, count: r._count.clients };
  },
  async remove(id) {
    // Clients are kept; relation is onDelete: SetNull
    await prisma.clientCategory.delete({ where: { id } });
  },
};
