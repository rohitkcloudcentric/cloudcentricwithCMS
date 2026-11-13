import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

/** One-click unsubscribe via the token in the confirmation email (POST from the unsubscribe page or mail client). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const raw = (req.query.token ?? (req.body as { token?: unknown } | undefined)?.token) as unknown;
  const token = typeof raw === "string" && /^[a-f0-9]{48}$/.test(raw) ? raw : null;
  if (!token) return res.status(400).json({ success: false, error: "Invalid unsubscribe link." });

  try {
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken: token } });
    if (!sub) return res.status(404).json({ success: false, error: "This unsubscribe link is invalid or has expired." });

    if (sub.status !== "UNSUBSCRIBED") {
      await prisma.newsletterSubscriber.update({
        where: { id: sub.id },
        data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
      });
    }
    return res.status(200).json({ success: true, message: "You have been unsubscribed." });
  } catch (error) {
    console.error("[newsletter] Unsubscribe error:", error);
    return res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
}
