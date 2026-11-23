import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/contact-submission";
import { getActiveDbSmtpSetting, getLatestDbSmtpSetting } from "@/lib/smtp-config";
import { decryptPassword } from "@/lib/smtp-crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const setting = (await getActiveDbSmtpSetting()) || (await getLatestDbSmtpSetting());
    const password = setting?.passwordEnc ? decryptPassword(setting.passwordEnc) : "";
    return res.status(200).json({
      success: true,
      password,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to reveal password." });
  }
}
