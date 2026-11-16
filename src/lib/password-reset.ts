/**
 * Admin password reset tokens (server only).
 *
 * A token is a short-lived JWT signed with a key derived from JWT_SECRET (so it can never be
 * used as a session token, and a session token can never be used here). It carries a fingerprint
 * of the account's current password hash: as soon as the password changes, every previously
 * issued link (including the one just used) stops verifying. That makes links single-use and
 * revokes older links without storing tokens in the database.
 */
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";
import { jwtSecret } from "@/lib/auth";
import { SITE_URL } from "@/config/seo.config";

export const RESET_TOKEN_TTL_MINUTES = 10;
const PURPOSE = "admin-password-reset";

const resetKey = () => createHmac("sha256", jwtSecret()).update(`${PURPOSE}:v1`).digest();
const fingerprint = (passwordHash: string) =>
  createHmac("sha256", resetKey()).update(passwordHash).digest("base64url").slice(0, 32);

export function createResetToken(user: { id: string; passwordHash: string }): string {
  return jwt.sign({ sub: user.id, pf: fingerprint(user.passwordHash), purpose: PURPOSE }, resetKey(), {
    algorithm: "HS256",
    expiresIn: `${RESET_TOKEN_TTL_MINUTES}m`,
    jwtid: randomBytes(16).toString("hex"),
  });
}

export type ResetTokenCheck =
  | { status: "ok"; userId: string; pf: string }
  | { status: "expired" }
  | { status: "invalid" };

/**
 * Signature, purpose and expiry check. "expired" is only returned for a token whose signature is valid
 * (i.e. one we really issued), so it can't be used to probe anything.
 */
export function inspectResetToken(token: unknown): ResetTokenCheck {
  if (typeof token !== "string" || token.length > 2000) return { status: "invalid" };
  try {
    const p = jwt.verify(token, resetKey(), { algorithms: ["HS256"], ignoreExpiration: true }) as {
      sub?: string;
      pf?: string;
      purpose?: string;
      exp?: number;
    };
    if (p.purpose !== PURPOSE || typeof p.sub !== "string" || typeof p.pf !== "string" || typeof p.exp !== "number") {
      return { status: "invalid" };
    }
    if (p.exp * 1000 <= Date.now()) return { status: "expired" };
    return { status: "ok", userId: p.sub, pf: p.pf };
  } catch {
    return { status: "invalid" };
  }
}

/** Signature, expiry and purpose check only. Returns the user id, or null. */
export function readResetToken(token: unknown): { userId: string; pf: string } | null {
  const r = inspectResetToken(token);
  return r.status === "ok" ? { userId: r.userId, pf: r.pf } : null;
}

/** True while the account's password is still the one the link was issued for. */
export function tokenMatchesPassword(pf: string, passwordHash: string): boolean {
  const a = Buffer.from(pf);
  const b = Buffer.from(fingerprint(passwordHash));
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Absolute base URL for links in emails. Taken from configuration (APP_URL, then NEXT_PUBLIC_SITE_URL)
 * so a forged Host header can't redirect reset links to another domain. Local development falls back
 * to the request host.
 */
export function appBaseUrl(req: NextApiRequest): string {
  const configured = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.NODE_ENV !== "production" && req.headers.host) return `http://${req.headers.host}`;
  return SITE_URL.replace(/\/+$/, "");
}
