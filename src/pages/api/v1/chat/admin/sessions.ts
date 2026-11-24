import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // IP access check
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  // Authentication check
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access." });
  }

  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const {
        search = "",
        mode = "all",
        status = "all",
        page = "1",
        limit = "10",
      } = req.query;

      const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 10));
      const skip = (pageNum - 1) * limitNum;

      const whereClause: Prisma.ChatSessionWhereInput = {};

      if (mode === "ai" || mode === "live_agent") {
        whereClause.mode = mode;
      }

      if (status === "active" || status === "transferred" || status === "closed") {
        whereClause.status = status;
      }

      const trimmedSearch = (search as string).trim();
      if (trimmedSearch) {
        whereClause.customer = {
          OR: [
            { fullName: { contains: trimmedSearch, mode: "insensitive" } },
            { email: { contains: trimmedSearch, mode: "insensitive" } },
            { contactNumber: { contains: trimmedSearch, mode: "insensitive" } },
            { purpose: { contains: trimmedSearch, mode: "insensitive" } },
            { companyName: { contains: trimmedSearch, mode: "insensitive" } },
          ],
        };
      }

      const [totalRecords, sessions, totalAi, totalLive, totalActive, totalClosed] =
        await Promise.all([
          prisma.chatSession.count({ where: whereClause }),
          prisma.chatSession.findMany({
            where: whereClause,
            include: {
              customer: true,
              messages: {
                orderBy: { createdAt: "asc" },
              },
            },
            orderBy: { updatedAt: "desc" },
            skip,
            take: limitNum,
          }),
          prisma.chatSession.count({ where: { mode: "ai" } }),
          prisma.chatSession.count({ where: { mode: "live_agent" } }),
          prisma.chatSession.count({ where: { status: "active" } }),
          prisma.chatSession.count({ where: { status: "closed" } }),
        ]);

      return res.status(200).json({
        success: true,
        data: sessions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalRecords,
          totalPages: Math.ceil(totalRecords / limitNum),
        },
        stats: {
          totalSessions: totalAi + totalLive,
          totalAi,
          totalLive,
          totalActive,
          totalClosed,
        },
      });
    } catch (error) {
      console.error("Error fetching admin chat sessions:", error);
      return res.status(500).json({ success: false, error: "Failed to load chat inquiries." });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
