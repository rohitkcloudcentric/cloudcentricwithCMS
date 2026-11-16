import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/contact-submission";
import { clientIp } from "@/lib/role-guard";

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

function getLogDelegate() {
  const p = prisma as any;
  if (p && p.smtpFailureLog && typeof p.smtpFailureLog.findMany === "function") {
    return p.smtpFailureLog;
  }
  try {
    const { PrismaClient } = require("@prisma/client");
    const freshClient = new PrismaClient();
    (global as any).prisma = freshClient;
    return freshClient.smtpFailureLog;
  } catch (err) {
    console.error("[smtp-logs] Failed to resolve SmtpFailureLog delegate:", err);
    throw new Error("SMTP logs service is initializing. Please try again.");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === "GET") return listLogs(req, res);
  if (req.method === "DELETE") return deleteLogs(req, res, admin);

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}

async function listLogs(req: NextApiRequest, res: NextApiResponse) {
  try {
    const delegate = getLogDelegate();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(5, Number(req.query.limit || 20)));
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const source = typeof req.query.source === "string" ? req.query.source.trim() : "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { recipient: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { error: { contains: search, mode: "insensitive" } },
        { host: { contains: search, mode: "insensitive" } },
      ];
    }

    if (source && source !== "all") {
      where.source = source;
    }

    const [total, logs, distinctSources] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      delegate.findMany({
        select: { source: true },
        distinct: ["source"],
      }),
    ]);

    const latest = logs[0]?.createdAt ?? null;

    return res.status(200).json({
      success: true,
      data: logs,
      sources: distinctSources.map((s: { source: string | null }) => s.source).filter(Boolean),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        totalFailures: total,
        latestFailureAt: latest,
      },
    });
  } catch (err) {
    console.error("[smtp-logs-api] Failed to fetch failed logs:", err);
    return res.status(500).json({ success: false, error: "Failed to load SMTP failed logs." });
  }
}

async function deleteLogs(
  req: NextApiRequest,
  res: NextApiResponse,
  admin: { id: string; email: string }
) {
  try {
    const delegate = getLogDelegate();
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : typeof req.query.id === "string" ? req.query.id : "";
    const clearAll = body.all === true || req.query.all === "true";

    if (clearAll) {
      const result = await delegate.deleteMany({});
      try {
        await prisma.auditLog.create({
          data: {
            userId: admin.id,
            action: "CLEAR_SMTP_FAILURE_LOGS",
            module: "settings",
            ipAddress: clientIp(req),
            details: { countDeleted: result.count },
          },
        });
      } catch (auditErr) {
        console.warn("[smtp-logs-api] Audit log failed:", auditErr);
      }

      return res.status(200).json({
        success: true,
        message: `Cleared ${result.count} SMTP failed log entries.`,
      });
    }

    if (!id) {
      return res.status(400).json({ success: false, error: "Log ID is required." });
    }

    await delegate.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Log entry deleted successfully.",
    });
  } catch (err) {
    console.error("[smtp-logs-api] Delete failed:", err);
    return res.status(500).json({ success: false, error: "Failed to delete log entry." });
  }
}
