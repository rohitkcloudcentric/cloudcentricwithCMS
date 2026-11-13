/** Server-only newsletter helpers: validation, source resolution, IP, rate limiting, CSV. */
import type { NextApiRequest } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export type SourceType = "BLOG" | "CASE_STUDY" | "OTHER";

export const SOURCE_LABELS: Record<SourceType, string> = {
  BLOG: "Blog",
  CASE_STUDY: "Case Studies",
  OTHER: "Website",
};

// Pragmatic RFC 5322 subset: local@domain.tld, no spaces, sane lengths
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const DISPOSABLE_DOMAINS = new Set([
  "yopmail.com", "mailinator.com", "tempmail.com", "temp-mail.org", "10minutemail.com",
  "trashmail.com", "guerrillamail.com", "sharklasers.com",
]);

/** Returns the normalized email, or an error message. */
export function validateEmail(raw: unknown): { email?: string; error?: string } {
  if (typeof raw !== "string") return { error: "Please enter your email address." };
  const email = raw.trim().toLowerCase();
  if (!email) return { error: "Please enter your email address." };
  if (email.length > 254) return { error: "That email address is too long." };
  const [local, domain] = email.split("@");
  if (!EMAIL_RE.test(email) || !local || local.length > 64 || !domain) {
    return { error: "Please enter a valid email address." };
  }
  if (DISPOSABLE_DOMAINS.has(domain)) return { error: "Please use a permanent email address." };
  return { email };
}

/**
 * Resolves the page the user subscribed from. The title is looked up server-side
 * from the slug so the stored name is always the real, published post name.
 */
export async function resolveSource(
  rawType: unknown,
  rawSlug: unknown
): Promise<{ sourceType: SourceType; sourceSlug: string | null; sourceTitle: string | null }> {
  const slug = typeof rawSlug === "string" ? rawSlug.trim().slice(0, 200) : "";
  if (slug && rawType === "BLOG") {
    const post = await prisma.blogArticle.findFirst({ where: { slug, status: "PUBLISHED" }, select: { title: true } });
    if (post) return { sourceType: "BLOG", sourceSlug: slug, sourceTitle: post.title };
  }
  if (slug && rawType === "CASE_STUDY") {
    const cs = await prisma.caseStudy.findFirst({ where: { slug, status: "PUBLISHED" }, select: { title: true } });
    if (cs) return { sourceType: "CASE_STUDY", sourceSlug: slug, sourceTitle: cs.title };
  }
  return { sourceType: "OTHER", sourceSlug: null, sourceTitle: null };
}

/**
 * Best-effort client IP. Uses the first X-Forwarded-For hop when behind a proxy.
 * Note: that header is client-controllable unless your proxy overwrites it.
 */
export function getClientIp(req: NextApiRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  const ip = first || req.headers["x-real-ip"]?.toString() || req.socket.remoteAddress || "unknown";
  return ip.replace(/^::ffff:/, "").slice(0, 64);
}

// ── Simple in-memory rate limiter (per process) ──
const hits = new Map<string, number[]>();

/** Returns true when `key` exceeded `limit` requests within `windowMs`. */
export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    // Prevent unbounded growth
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return recent.length > limit;
}

/** CSV cell: quotes, escapes, and neutralizes spreadsheet formulas (=, +, -, @). */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

// ── Admin list / export filtering ──

const STATUSES = ["ACTIVE", "UNSUBSCRIBED"] as const;
const SOURCES = ["BLOG", "CASE_STUDY", "OTHER"] as const;

const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Builds the Prisma filter/sort from admin query params (search, status, sourceType, sourceSlug, sort). */
export function buildSubscriberFilter(query: NextApiRequest["query"]) {
  const where: Prisma.NewsletterSubscriberWhereInput = {};

  const search = pick(query.search).trim().slice(0, 254);
  if (search) where.email = { contains: search, mode: "insensitive" };

  const status = pick(query.status);
  if ((STATUSES as readonly string[]).includes(status)) where.status = status as (typeof STATUSES)[number];

  const sourceType = pick(query.sourceType);
  if ((SOURCES as readonly string[]).includes(sourceType)) where.sourceType = sourceType as (typeof SOURCES)[number];

  const sourceSlug = pick(query.sourceSlug).trim().slice(0, 200);
  if (sourceSlug) where.sourceSlug = sourceSlug;

  const orderBy: Prisma.NewsletterSubscriberOrderByWithRelationInput = {
    subscribedAt: pick(query.sort) === "asc" ? "asc" : "desc",
  };

  return { where, orderBy };
}
