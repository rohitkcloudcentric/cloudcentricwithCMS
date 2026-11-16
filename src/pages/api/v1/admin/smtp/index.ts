import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/contact-submission";
import {
  getMaskedSmtpConfig,
  saveSmtpConfig,
  smtpSettingSchema,
} from "@/lib/smtp-config";
import { clientIp } from "@/lib/role-guard";

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return; // 401 or 403 already handled

  if (req.method === "GET") return getSettings(req, res);
  if (req.method === "POST" || req.method === "PUT") return saveSettings(req, res, admin);

  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}

async function getSettings(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getMaskedSmtpConfig();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("[smtp-api] Failed to get SMTP settings:", err);
    return res.status(500).json({ success: false, error: "Failed to load SMTP configuration." });
  }
}

async function saveSettings(
  req: NextApiRequest,
  res: NextApiResponse,
  admin: { id: string; email: string }
) {
  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;

    const parsed = smtpSettingSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "general");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return res.status(400).json({
        success: false,
        error: Object.values(fieldErrors)[0] || "Please check the form inputs.",
        fieldErrors,
      });
    }

    const saved = await saveSmtpConfig(parsed.data, typeof body.id === "string" ? body.id : undefined);

    // Record in Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE_SMTP_SETTINGS",
          module: "settings",
          ipAddress: clientIp(req),
          details: {
            host: saved.host,
            port: saved.port,
            username: saved.username,
            encryption: saved.encryption,
            fromEmail: saved.fromEmail,
            fromName: saved.fromName,
            isActive: saved.isActive,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[smtp-api] Failed to create audit log entry:", auditErr);
    }

    const masked = await getMaskedSmtpConfig();
    return res.status(200).json({
      success: true,
      message: "SMTP configuration saved and activated successfully.",
      data: masked,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to save SMTP configuration.";
    console.error("[smtp-api] Save error:", err);
    return res.status(400).json({ success: false, error: errorMsg });
  }
}
