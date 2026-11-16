import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { getClientIp, isRateLimited, resolveSource, validateEmail } from "@/lib/newsletter";
import { sendWelcomeEmail } from "@/lib/newsletter-email";
import { resolveVisitorIp } from "@/lib/client-ip";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

const newToken = () => randomBytes(24).toString("hex");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const ip = getClientIp(req);

    // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
    if (typeof body.website === "string" && body.website.trim()) {
      return res.status(200).json({ success: true, message: "Thank you for subscribing!" });
    }

    if (isRateLimited(`newsletter:${ip}`)) {
      return res.status(429).json({ success: false, error: "Too many attempts. Please try again in a few minutes." });
    }

    const { email, error } = validateEmail(body.email);
    if (!email) return res.status(400).json({ success: false, error });

    const source = await resolveSource(body.sourceType, body.sourceSlug);
    // Stored IP: public network address, or the browser-reported public IP when the server only sees a local one
    const visitorIp = resolveVisitorIp(req, body.clientIp);
    const userAgent = (req.headers["user-agent"] || "").toString().slice(0, 500) || null;

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing?.status === "ACTIVE") {
      return res.status(409).json({ success: false, error: "This email is already subscribed to our newsletter." });
    }

    let subscriber;
    try {
      subscriber = existing
        ? // Previously unsubscribed: re-activate with the new source
          await prisma.newsletterSubscriber.update({
            where: { id: existing.id },
            data: {
              status: "ACTIVE",
              ...source,
              ipAddress: visitorIp,
              userAgent,
              subscribedAt: new Date(),
              unsubscribedAt: null,
              unsubscribeToken: newToken(),
              emailSentAt: null,
              emailError: null,
            },
          })
        : await prisma.newsletterSubscriber.create({
            data: { email, ...source, ipAddress: visitorIp, userAgent, unsubscribeToken: newToken() },
          });
    } catch (e) {
      // Unique constraint race (two submits at once)
      if (typeof e === "object" && e && "code" in e && (e as { code?: string }).code === "P2002") {
        return res.status(409).json({ success: false, error: "This email is already subscribed to our newsletter." });
      }
      throw e;
    }

    const emailSent = (await sendWelcomeEmail(subscriber)).ok;

    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? "Thank you for subscribing! Please check your inbox for a confirmation email."
        : "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("[newsletter] Subscribe error:", error);
    return res.status(500).json({ success: false, error: "We couldn't complete your subscription. Please try again." });
  }
}
