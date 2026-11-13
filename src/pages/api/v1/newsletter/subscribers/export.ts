import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { buildSubscriberFilter, csvCell, getClientIp, SOURCE_LABELS, type SourceType } from "@/lib/newsletter";

/** Exports the (filtered) subscriber list as CSV — opens directly in Excel. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!checkPermission(user, "newsletter", "read")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot export newsletter subscribers" });
    }

    const { where, orderBy } = buildSubscriberFilter(req.query);
    const rows = await prisma.newsletterSubscriber.findMany({ where, orderBy, take: 50_000 });

    const header = ["Subscriber ID", "Email Address", "Subscribed Post / Case Study", "Blog Name (Section)", "Post Slug", "IP Address", "Subscription Date", "Status", "Unsubscribed At", "Confirmation Email"];
    const lines = rows.map((r) =>
      [
        r.id,
        r.email,
        r.sourceTitle || "",
        SOURCE_LABELS[r.sourceType as SourceType],
        r.sourceSlug || "",
        r.ipAddress || "",
        r.subscribedAt.toISOString(),
        r.status === "ACTIVE" ? "Active" : "Unsubscribed",
        r.unsubscribedAt ? r.unsubscribedAt.toISOString() : "",
        r.emailSentAt ? "Sent" : r.emailError ? "Failed" : "Pending",
      ]
        .map(csvCell)
        .join(",")
    );

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "export_newsletter_subscribers",
        module: "newsletter",
        details: { count: rows.length, filters: req.query as Record<string, string> },
        ipAddress: getClientIp(req),
      },
    });

    const stamp = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="newsletter-subscribers-${stamp}.csv"`);
    res.setHeader("Cache-Control", "no-store");
    // BOM so Excel detects UTF-8
    return res.status(200).send("\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n"));
  } catch (error) {
    console.error("[newsletter] Export error:", error);
    return res.status(500).json({ success: false, error: "Failed to export subscribers" });
  }
}
