import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { SITE_NAME } from "@/config/seo.config";
import { getClientIp, isRateLimited } from "@/lib/newsletter";
import { isMailConfigured, sendMail, type MailResult } from "@/lib/mailer";
import { appBaseUrl, createResetToken, RESET_TOKEN_TTL_MINUTES } from "@/lib/password-reset";
import { renderPasswordResetEmail } from "@/lib/email-templates/password-reset";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW = 15 * 60 * 1000;

/** Never wait longer than this for SMTP before telling the user it failed. */
const SEND_TIMEOUT_MS = 40_000;
/**
 * Every successful response takes at least this long, so an unknown email (nothing to send)
 * can't be told apart from a real one by how fast the reply comes back.
 */
const MIN_RESPONSE_MS = 2_000;

/** Same wording for registered and unregistered emails, so the response never reveals which exist. */
const GENERIC_OK =
  "If an active account exists for that email, we've sent a password reset link. Please check your inbox (and spam folder).";
const SEND_FAILED =
  "We couldn't send the reset email right now. Please try again in a few minutes, or contact your administrator if the problem continues.";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * POST { email } → emails a time-limited reset link to an active CMS account (Admin or any other role).
 * The email is actually sent before responding; a delivery failure is reported to the user
 * (never a false "sent"), logged on the server, and recorded in the audit log.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  res.setHeader("Cache-Control", "no-store");

  try {
    const started = Date.now();
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    const ip = getClientIp(req);
    if (isRateLimited(`pwreset-ip:${ip}`, 5, WINDOW) || isRateLimited(`pwreset-email:${email}`, 3, WINDOW)) {
      return res.status(429).json({ success: false, error: "Too many reset requests. Please try again in 15 minutes." });
    }

    // Configuration problem (same for every email, so it reveals nothing about accounts)
    if (!(await isMailConfigured())) {
      console.error("[password-reset] SMTP is not configured (active DB setting or MAIL_* env vars required); cannot send reset emails");
      return res.status(503).json({
        success: false,
        error: "Password reset emails are temporarily unavailable. Please contact your administrator.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, passwordHash: true, isActive: true },
    });

    let delivery: MailResult | null = null;
    if (user && user.isActive) {
      // Token goes in the URL fragment: browsers never send it to servers, analytics or Referer headers
      const resetUrl = `${appBaseUrl(req)}/admin/reset-password#token=${encodeURIComponent(createResetToken(user))}`;
      delivery = await Promise.race([
        deliver(user, resetUrl, ip),
        sleep(SEND_TIMEOUT_MS).then((): MailResult => ({ ok: false, error: "Timed out waiting for the SMTP server" })),
      ]);
    }

    if (delivery && !delivery.ok) {
      return res.status(502).json({ success: false, error: SEND_FAILED });
    }

    const elapsed = Date.now() - started;
    if (elapsed < MIN_RESPONSE_MS) await sleep(MIN_RESPONSE_MS - elapsed);
    return res.status(200).json({ success: true, message: GENERIC_OK });
  } catch (error) {
    console.error("[password-reset] Request error:", error);
    return res.status(500).json({ success: false, error: "We couldn't process your request. Please try again." });
  }
}

async function deliver(user: { id: string; name: string; email: string }, resetUrl: string, ip: string): Promise<MailResult> {
  const siteName = process.env.APP_NAME || SITE_NAME;
  const { subject, html, text } = renderPasswordResetEmail({
    siteName,
    siteUrl: new URL(resetUrl).origin,
    name: user.name,
    resetUrl,
    expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
    logoUrl: process.env.MAIL_LOGO_URL || undefined,
  });
  const result = await sendMail({
    to: user.email,
    subject,
    html,
    text,
    headers: { "X-Auto-Response-Suppress": "All", "Auto-Submitted": "auto-generated" },
    source: "forgot-password",
  }).catch((e): MailResult => ({ ok: false, error: String(e) }));

  if (result.ok) console.info("[password-reset] Reset email accepted by SMTP for user", user.id, result.messageId);
  else console.error("[password-reset] Email delivery failed for user", user.id, result.error);

  await prisma.auditLog
    .create({
      data: {
        userId: user.id,
        action: result.ok ? "password_reset_requested" : "password_reset_email_failed",
        module: "auth",
        details: result.ok ? { email: user.email, messageId: result.messageId } : { email: user.email, error: result.error.slice(0, 500) },
        ipAddress: ip,
      },
    })
    .catch((e) => console.error("[password-reset] Audit log failed:", e));
  return result;
}
