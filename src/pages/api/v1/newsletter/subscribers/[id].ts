import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { getClientIp } from "@/lib/newsletter";
import { sendWelcomeEmail } from "@/lib/newsletter-email";

/** GET one subscriber; PATCH { status }; POST { action: "resend" } re-sends the confirmation email. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "PATCH" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "PATCH", "POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: "Subscriber not found" });

    if (req.method === "GET") {
      if (!checkPermission(user, "newsletter", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      // Never expose the unsubscribe token to the admin UI
      const { unsubscribeToken: _omit, ...data } = existing;
      void _omit;
      return res.status(200).json({ success: true, data });
    }

    if (!checkPermission(user, "newsletter", "update")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot update subscribers" });
    }

    if (req.method === "POST") {
      if ((req.body as { action?: unknown } | undefined)?.action !== "resend") {
        return res.status(400).json({ success: false, error: "Unknown action" });
      }
      if (existing.status !== "ACTIVE") {
        return res.status(400).json({ success: false, error: "Only active subscribers can be emailed" });
      }
      const result = await sendWelcomeEmail(existing);
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "resend_newsletter_confirmation",
          module: "newsletter",
          details: { id, email: existing.email, ok: result.ok },
          ipAddress: getClientIp(req),
        },
      });
      const fresh = await prisma.newsletterSubscriber.findUnique({ where: { id } });
      const { unsubscribeToken: _t, ...freshData } = fresh!;
      void _t;
      return result.ok
        ? res.status(200).json({ success: true, data: freshData, message: "Confirmation email sent" })
        : res.status(502).json({ success: false, data: freshData, error: result.error });
    }

    const status = (req.body as { status?: unknown } | undefined)?.status;
    if (status !== "ACTIVE" && status !== "UNSUBSCRIBED") {
      return res.status(400).json({ success: false, error: "Status must be ACTIVE or UNSUBSCRIBED" });
    }

    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data:
        status === "ACTIVE"
          ? { status, unsubscribedAt: null }
          : { status, unsubscribedAt: existing.unsubscribedAt ?? new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "update_newsletter_subscriber",
        module: "newsletter",
        details: { id, email: existing.email, from: existing.status, to: status },
        ipAddress: getClientIp(req),
      },
    });

    const { unsubscribeToken: _omit, ...data } = updated;
    void _omit;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[newsletter] Subscriber update error:", error);
    return res.status(500).json({ success: false, error: "Failed to update subscriber" });
  }
}
