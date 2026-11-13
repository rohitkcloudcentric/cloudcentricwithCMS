import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { buildSubscriberFilter } from "@/lib/newsletter";

const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** GET paginated subscriber list + filter options (admin only). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!checkPermission(user, "newsletter", "read")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot view newsletter subscribers" });
    }

    const { where, orderBy } = buildSubscriberFilter(req.query);
    const page = Math.max(1, parseInt(pick(req.query.page), 10) || 1);
    const pageSize = Math.min(100, Math.max(5, parseInt(pick(req.query.pageSize), 10) || 25));

    const [rows, total, sources, counts] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          status: true,
          sourceType: true,
          sourceTitle: true,
          sourceSlug: true,
          ipAddress: true,
          subscribedAt: true,
          unsubscribedAt: true,
          emailSentAt: true,
          emailError: true,
        },
      }),
      prisma.newsletterSubscriber.count({ where }),
      // Distinct posts/case studies people subscribed from (for the filter dropdown)
      prisma.newsletterSubscriber.groupBy({
        by: ["sourceType", "sourceSlug", "sourceTitle"],
        where: { sourceSlug: { not: null } },
        _count: { _all: true },
        orderBy: { sourceTitle: "asc" },
      }),
      prisma.newsletterSubscriber.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      filters: {
        sources: sources.map((s) => ({
          sourceType: s.sourceType,
          sourceSlug: s.sourceSlug,
          sourceTitle: s.sourceTitle,
          count: s._count._all,
        })),
      },
      stats: {
        active: counts.find((c) => c.status === "ACTIVE")?._count._all ?? 0,
        unsubscribed: counts.find((c) => c.status === "UNSUBSCRIBED")?._count._all ?? 0,
      },
    });
  } catch (error) {
    console.error("[newsletter] List error:", error);
    return res.status(500).json({ success: false, error: "Failed to load subscribers" });
  }
}
