import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ownedRecordsFilter } from "@/lib/rbac";

/** Audit trail: audit_logs:view required; without audit_logs:manage only the user's own actions. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!checkPermission(user, "audit_logs", "read")) {
      return res.status(403).json({ success: false, error: "Forbidden: You cannot view audit logs" });
    }

    const logs = await prisma.auditLog.findMany({
      where: ownedRecordsFilter(user, "audit_logs", "userId"),
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("GET Audit Logs Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
