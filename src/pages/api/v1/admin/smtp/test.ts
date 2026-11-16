import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/contact-submission";
import {
  sendMail,
  getEffectiveSmtpConfig,
  type SmtpEffectiveConfig,
} from "@/lib/mailer";
import { decryptPassword, isMaskedPassword } from "@/lib/smtp-crypto";
import { getLatestDbSmtpSetting } from "@/lib/smtp-config";
import { clientIp } from "@/lib/role-guard";

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };

const testEmailSchema = z.object({
  toEmail: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid recipient email address."),
  host: z.string().trim().optional(),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  username: z.string().trim().optional(),
  password: z.string().optional(),
  encryption: z.string().trim().optional(),
  fromEmail: z.string().trim().optional(),
  fromName: z.string().trim().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;

    // Default to admin's current email if toEmail is empty
    if (!body.toEmail && admin.email) {
      body.toEmail = admin.email;
    }

    const parsed = testEmailSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid test email parameters.";
      return res.status(400).json({ success: false, error: msg });
    }

    const { toEmail, host, port, username, password, encryption, fromEmail, fromName } = parsed.data;

    let targetConfig: SmtpEffectiveConfig;

    // If specific parameters were provided from the test form, build config with them
    if (host && username) {
      let finalPass = password || "";
      if (isMaskedPassword(finalPass) || !finalPass) {
        const latestDb = await getLatestDbSmtpSetting();
        if (latestDb?.passwordEnc) {
          finalPass = decryptPassword(latestDb.passwordEnc);
        } else if (process.env.MAIL_PASSWORD) {
          finalPass = process.env.MAIL_PASSWORD;
        }
      }

      if (!finalPass) {
        return res.status(400).json({
          success: false,
          error: "No SMTP password available to test. Please provide a password.",
        });
      }

      const enc = (encryption || "TLS").toLowerCase();
      const fromAddr = fromEmail || username;
      const fromNm = fromName || "CloudCentric Portal";

      targetConfig = {
        host,
        user: username,
        pass: finalPass,
        port: port || 587,
        encryption: enc,
        fromAddress: fromAddr,
        fromName: fromNm,
        missing: [],
        source: "database",
      };
    } else {
      // Use existing active effective config
      targetConfig = await getEffectiveSmtpConfig();
      if (targetConfig.missing.length > 0) {
        return res.status(400).json({
          success: false,
          error: `SMTP is not configured yet (missing: ${targetConfig.missing.join(", ")}). Please fill in the details and save or provide them above.`,
        });
      }
    }

    const testTime = new Date().toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background-color: #ffffff; color: #18181b; border: 1px solid #e4e4e7; border-radius: 12px;">
        <div style="border-bottom: 2px solid #7c3aed; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #7c3aed; margin: 0 0 4px 0; font-size: 20px;">SMTP Configuration Test Successful</h2>
          <p style="color: #71717a; margin: 0; font-size: 13px;">CloudCentric Headless CMS Admin Notification</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
          Hello <strong>${admin.email}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #27272a; margin-bottom: 20px;">
          This test email confirms that your outgoing SMTP server credentials and connectivity are correctly configured and functional.
        </p>
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #52525b; letter-spacing: 0.5px;">Active Connection Details</h4>
          <table style="width: 100%; font-size: 13px; color: #3f3f46; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: 600; width: 140px;">SMTP Host:</td>
              <td style="padding: 4px 0; font-family: monospace;">${targetConfig.host}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Port & Encryption:</td>
              <td style="padding: 4px 0; font-family: monospace;">${targetConfig.port} (${targetConfig.encryption.toUpperCase()})</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">SMTP Username:</td>
              <td style="padding: 4px 0; font-family: monospace;">${targetConfig.user}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Sender Address:</td>
              <td style="padding: 4px 0; font-family: monospace;">${targetConfig.fromName} &lt;${targetConfig.fromAddress}&gt;</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 600;">Tested At:</td>
              <td style="padding: 4px 0;">${testTime}</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 12px; color: #71717a; border-top: 1px solid #f4f4f5; padding-top: 14px; margin-top: 24px;">
          This message was sent from the CloudCentric CMS Admin Dashboard by an authorized administrator.
        </p>
      </div>
    `;

    const text = `SMTP Configuration Test Successful\n\n` +
      `Hello ${admin.email},\n\n` +
      `This test email confirms that your outgoing SMTP server credentials and connectivity are correctly configured and functional.\n\n` +
      `Connection Details:\n` +
      `- Host: ${targetConfig.host}\n` +
      `- Port: ${targetConfig.port} (${targetConfig.encryption.toUpperCase()})\n` +
      `- Username: ${targetConfig.user}\n` +
      `- Sender: ${targetConfig.fromName} <${targetConfig.fromAddress}>\n` +
      `- Timestamp: ${testTime}\n`;

    const result = await sendMail(
      {
        to: toEmail,
        subject: `[${targetConfig.fromName}] SMTP Connection Test`,
        html,
        text,
        source: "test-email",
      },
      targetConfig
    );

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "TEST_SMTP_EMAIL",
          module: "settings",
          ipAddress: clientIp(req),
          details: {
            to: toEmail,
            host: targetConfig.host,
            port: targetConfig.port,
            encryption: targetConfig.encryption,
            success: result.ok,
            error: result.ok ? undefined : result.error,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[smtp-test] Failed to write audit log:", auditErr);
    }

    if (!result.ok) {
      return res.status(400).json({
        success: false,
        error: result.error || "Failed to deliver test email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${toEmail}. Please check your inbox.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unexpected error while testing SMTP connection.";
    console.error("[smtp-test] Exception:", err);
    return res.status(500).json({ success: false, error: errorMsg });
  }
}
