import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getClientIp, isRateLimited } from "@/lib/newsletter";
import { resolveVisitorIp } from "@/lib/client-ip";
import { contactSubmissionSchema, requireAdmin } from "@/lib/contact-submission";

export const config = { api: { bodyParser: { sizeLimit: "32kb" } } };

const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/**
 * POST: public Contact Us form (validated, honeypot + rate limited).
 * GET:  paginated list, Admin only.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") return create(req, res);
  if (req.method === "GET") return list(req, res);
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;

    // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
    if (typeof body.honeypot === "string" && body.honeypot.trim()) {
      return res.status(200).json({ success: true, message: "Thank you! We will get back to you shortly." });
    }

    const ip = getClientIp(req);
    if (isRateLimited(`contact:${ip}`, 10)) {
      return res.status(429).json({ success: false, error: "Too many attempts. Please try again in a few minutes." });
    }

    const parsed = contactSubmissionSchema.safeParse({
      name: typeof body.name === "string" ? body.name : "",
      email: typeof body.email === "string" ? body.email : "",
      phone: typeof body.phone === "string" ? body.phone : "",
      location: typeof body.location === "string" ? body.location : "",
      message: typeof body.message === "string" ? body.message : "",
      referralSource: typeof body.referralSource === "string" ? body.referralSource : "",
      pageName: typeof body.pageName === "string" ? body.pageName : "",
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return res.status(400).json({
        success: false,
        error: Object.values(fieldErrors)[0] || "Please check the form and try again.",
        fieldErrors,
      });
    }

    const d = parsed.data;
    const userAgent = (req.headers["user-agent"] || "").toString().slice(0, 500) || null;
    const record = await prisma.contactSubmission.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        phone: d.phone,
        location: d.location || null,
        message: d.message,
        referralSource: d.referralSource || null,
        pageName: d.pageName || "Unknown",
        ipAddress: resolveVisitorIp(req, body.clientIp),
        userAgent,
      },
      select: { id: true },
    });

    return res.status(201).json({
      success: true,
      id: record.id,
      message: "Thank you! Your request has been received. We will get back to you shortly.",
    });
  } catch (error) {
    console.error("[contact-submissions] Create error:", error);
    return res.status(500).json({ success: false, error: "We couldn't submit your request. Please try again." });
  }
}

async function list(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await requireAdmin(req, res);
    if (!user) return;
    res.setHeader("Cache-Control", "no-store");

    const search = pick(req.query.search).trim().slice(0, 100);
    const pageName = pick(req.query.pageName).trim().slice(0, 200);
    const sort = pick(req.query.sort) === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(pick(req.query.page), 10) || 1);
    const pageSize = Math.min(100, Math.max(5, parseInt(pick(req.query.pageSize), 10) || 25));

    const where = {
      ...(pageName ? { pageName } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search } },
              { location: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total, pages] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { submittedAt: sort },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          message: true,
          referralSource: true,
          pageName: true,
          submittedAt: true,
        },
      }),
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.groupBy({ by: ["pageName"], _count: { _all: true }, orderBy: { pageName: "asc" } }),
    ]);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: { total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      filters: { pages: pages.map((p) => ({ pageName: p.pageName, count: p._count._all })) },
    });
  } catch (error) {
    console.error("[contact-submissions] List error:", error);
    return res.status(500).json({ success: false, error: "Failed to load contact form submissions" });
  }
}
