import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { getClientIp, isRateLimited } from "@/lib/newsletter";
import { passwordProblem } from "@/lib/password-policy";
import { inspectResetToken, tokenMatchesPassword } from "@/lib/password-reset";

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };

const EXPIRED_LINK = "Your password reset link has expired. Please request a new one.";
const INVALID_LINK = "This password reset link is invalid or has already been used. Please request a new one.";

type LinkCheck =
  | { ok: true; user: { id: string; email: string; passwordHash: string } }
  | { ok: false; reason: "expired" | "invalid"; error: string };

const fail = (reason: "expired" | "invalid"): LinkCheck => ({
  ok: false,
  reason,
  error: reason === "expired" ? EXPIRED_LINK : INVALID_LINK,
});

/** Active account the token was issued for, while the link is unexpired and unused. */
async function checkLink(token: unknown): Promise<LinkCheck> {
  const claims = inspectResetToken(token);
  if (claims.status === "expired") return fail("expired");
  if (claims.status !== "ok") return fail("invalid");
  const user = await prisma.user.findUnique({
    where: { id: claims.userId },
    select: { id: true, email: true, passwordHash: true, isActive: true },
  });
  // A changed password (link already used, or a newer reset) makes the fingerprint mismatch
  if (!user || !user.isActive || !tokenMatchesPassword(claims.pf, user.passwordHash)) return fail("invalid");
  return { ok: true, user };
}

/**
 * POST { token, checkOnly: true }               → { valid } (lets the page show "link expired" up front)
 * POST { token, password, confirmPassword }     → sets the new password and invalidates the link
 * The token is only ever sent in the body, never in a URL, so it doesn't end up in logs.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  res.setHeader("Cache-Control", "no-store");

  try {
    const ip = getClientIp(req);
    if (isRateLimited(`pwreset-verify:${ip}`, 20, 15 * 60 * 1000)) {
      return res.status(429).json({ success: false, error: "Too many attempts. Please try again in 15 minutes." });
    }

    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;

    if (body.checkOnly === true) {
      const check = await checkLink(body.token);
      return res.status(200).json({
        success: true,
        valid: check.ok,
        ...(check.ok ? {} : { reason: check.reason, error: check.error }),
      });
    }
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    const problem = passwordProblem(password);
    if (problem) return res.status(400).json({ success: false, error: problem, field: "password" });
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match.", field: "confirmPassword" });
    }

    const check = await checkLink(body.token);
    if (!check.ok) return res.status(400).json({ success: false, error: check.error, reason: check.reason, expired: true });
    const user = check.user;

    if (password.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({ success: false, error: "Password must not be your email address.", field: "password" });
    }

    // Conditional update: if the password changed meanwhile (e.g. the link was used in another tab), nothing is written
    const updated = await prisma.user.updateMany({
      where: { id: user.id, passwordHash: user.passwordHash, isActive: true },
      data: { passwordHash: await hashPassword(password) },
    });
    if (updated.count === 0) return res.status(400).json({ success: false, error: INVALID_LINK, reason: "invalid", expired: true });

    await prisma.auditLog
      .create({ data: { userId: user.id, action: "password_reset", module: "auth", details: { email: user.email }, ipAddress: ip } })
      .catch((e) => console.error("[password-reset] Audit log failed:", e));

    return res.status(200).json({ success: true, message: "Your password has been reset. You can now sign in with your new password." });
  } catch (error) {
    console.error("[password-reset] Reset error:", error);
    return res.status(500).json({ success: false, error: "We couldn't reset your password. Please try again." });
  }
}
