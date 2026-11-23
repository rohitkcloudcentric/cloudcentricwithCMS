import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/rbac";
import {
  verifyAdminApiIpAccess,
  logIpManagementActivity,
  invalidateAdminIpCache,
} from "@/lib/admin-ip-guard";
import { checkIpVersion, normalizeIp, extractClientIp } from "@/lib/ip-utils";
import type { Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. IP Access Control check on backend
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  // 2. Authentication & Super Admin role check
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access" });
  }

  // Only Super Admin can access or manage IP Address records
  if (!hasFullAccess(user)) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Super Admin privileges are required to access IP Address Management.",
    });
  }

  // Never cache admin management results
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const {
        search = "",
        status = "all",
        sortBy = "createdAt",
        sortOrder = "desc",
        page = "1",
        limit = "10",
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const whereClause: Prisma.AdminIpAddressWhereInput = {};

      // Filter by status (allowed / blocked)
      if (status === "allowed" || status === "blocked") {
        whereClause.status = status;
      }

      // Search by IP address or description
      const trimmedSearch = (search as string).trim();
      if (trimmedSearch) {
        whereClause.OR = [
          { ipAddress: { contains: trimmedSearch, mode: "insensitive" } },
          { description: { contains: trimmedSearch, mode: "insensitive" } },
        ];
      }

      // Sorting
      const validSortFields = ["ipAddress", "createdAt", "updatedAt", "status"];
      const actualSortBy = validSortFields.includes(sortBy as string) ? (sortBy as string) : "createdAt";
      const actualSortOrder: Prisma.SortOrder = (sortOrder as string).toLowerCase() === "asc" ? "asc" : "desc";

      const [totalRecords, items, totalIps, totalAllowed, totalBlocked] = await Promise.all([
        prisma.adminIpAddress.count({ where: whereClause }),
        prisma.adminIpAddress.findMany({
          where: whereClause,
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { [actualSortBy]: actualSortOrder },
          skip,
          take: limitNum,
        }),
        prisma.adminIpAddress.count(),
        prisma.adminIpAddress.count({ where: { status: "allowed" } }),
        prisma.adminIpAddress.count({ where: { status: "blocked" } }),
      ]);

      const currentClientIp = extractClientIp(req);

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limitNum),
        },
        stats: {
          totalIps,
          totalAllowed,
          totalBlocked,
          currentClientIp,
        },
      });
    } catch (error) {
      console.error("GET IP Addresses Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const rawIp = typeof body.ipAddress === "string" ? body.ipAddress.trim() : "";
      const rawStatus = typeof body.status === "string" ? body.status.toLowerCase().trim() : "allowed";
      const description = typeof body.description === "string" ? body.description.trim() : "";

      if (!rawIp) {
        return res.status(400).json({ success: false, error: "IP address is required." });
      }

      const version = checkIpVersion(rawIp);
      if (version === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid IP address format. Please enter a valid IPv4 or IPv6 address.",
        });
      }

      const normalizedIp = normalizeIp(rawIp);
      if (!normalizedIp) {
        return res.status(400).json({
          success: false,
          error: "Invalid IP address format.",
        });
      }

      const status = rawStatus === "blocked" ? "blocked" : "allowed";

      // Prevent duplicate entries
      const existing = await prisma.adminIpAddress.findUnique({
        where: { ipAddress: normalizedIp },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: `IP address "${normalizedIp}" is already registered with status "${existing.status}". You can edit the existing record.`,
        });
      }

      const created = await prisma.adminIpAddress.create({
        data: {
          ipAddress: normalizedIp,
          status,
          description: description || null,
          createdById: user.id,
        },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });

      // Invalidate cache immediately so new entry takes effect right away
      invalidateAdminIpCache();

      // Write audit log
      const currentClientIp = extractClientIp(req);
      await logIpManagementActivity({
        userId: user.id,
        action: status === "allowed" ? "allow" : "block",
        ipAddress: normalizedIp,
        previousStatus: null,
        newStatus: status,
        description: description || null,
        clientIp: currentClientIp,
      });

      return res.status(201).json({
        success: true,
        message: `IP address ${normalizedIp} successfully added as ${status}.`,
        data: created,
      });
    } catch (error) {
      console.error("POST IP Address Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
