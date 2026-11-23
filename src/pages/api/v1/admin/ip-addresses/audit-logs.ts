import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/rbac";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Check IP access
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  // 2. Authentication & Super Admin check
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access" });
  }

  if (!hasFullAccess(user)) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Super Admin access required.",
    });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { page = "1", limit = "20", search = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const trimmedSearch = (search as string).trim();

    // Query audit logs where module = "ip_management"
    const whereClause: any = {
      module: "ip_management",
    };

    if (trimmedSearch) {
      whereClause.OR = [
        { action: { contains: trimmedSearch, mode: "insensitive" } },
        { ipAddress: { contains: trimmedSearch, mode: "insensitive" } },
      ];
    }

    const [totalRecords, logs] = await Promise.all([
      prisma.auditLog.count({ where: whereClause }),
      prisma.auditLog.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limitNum),
      },
    });
  } catch (error) {
    console.error("GET IP Audit Logs Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
