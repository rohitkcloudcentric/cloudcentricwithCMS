import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { clientInclude, parseClientBody } from "@/lib/client-input";

const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * GET: public callers get active clients only; signed-in admins can filter by
 *      search, categoryId, status (active|inactive), featured.
 * POST: create a client (clients:create).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const user = await getAuthenticatedUser(req);
      const where: Prisma.ClientWhereInput = {};

      if (!user || !checkPermission(user, "clients", "read")) {
        where.isActive = true;
      } else {
        // Without "manage" a user only sees the clients they added
        Object.assign(where, ownedRecordsFilter(user, "clients", "createdById"));
        const status = pick(req.query.status);
        if (status === "active") where.isActive = true;
        if (status === "inactive") where.isActive = false;
        if (pick(req.query.featured) === "true") where.isFeatured = true;
        const search = pick(req.query.search).trim().slice(0, 120);
        if (search) where.name = { contains: search, mode: "insensitive" };
      }

      const categoryId = pick(req.query.categoryId);
      if (categoryId === "none") where.categoryId = null;
      else if (categoryId) where.categoryId = categoryId;

      const clients = await prisma.client.findMany({
        where,
        include: clientInclude,
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      });
      return res.status(200).json({ success: true, data: clients });
    } catch (error) {
      console.error("GET Clients Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "clients", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create clients" });
      }

      const parsed = await parseClientBody(req.body, true);
      if (parsed.errors.length) return res.status(400).json({ success: false, error: parsed.errors.join(". ") });

      const duplicate = await prisma.client.findFirst({
        where: { name: { equals: parsed.data.name!, mode: "insensitive" } },
        select: { id: true },
      });
      if (duplicate) return res.status(409).json({ success: false, error: "A client with this name already exists" });

      // Default: append to the end of the grid
      let displayOrder = parsed.data.displayOrder;
      if (displayOrder === undefined) {
        const last = await prisma.client.aggregate({ _max: { displayOrder: true } });
        displayOrder = (last._max.displayOrder ?? 0) + 1;
      }

      const client = await prisma.client.create({
        data: {
          ...parsed.data,
          name: parsed.data.name!,
          logoUrl: parsed.data.logoUrl!,
          displayOrder,
          createdById: user.id,
        },
        include: clientInclude,
      });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: { userId: user.id, action: "create_client", module: "clients", details: { id: client.id, name: client.name }, ipAddress: clientIp },
      });

      return res.status(201).json({ success: true, data: client });
    } catch (error) {
      console.error("POST Client Error:", error);
      return res.status(500).json({ success: false, error: "Failed to create client" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
