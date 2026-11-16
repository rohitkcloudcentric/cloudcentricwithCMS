import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/contact-submission";

/** GET one submission with full details (Admin only). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  try {
    const user = await requireAdmin(req, res);
    if (!user) return;
    res.setHeader("Cache-Control", "no-store");

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return res.status(400).json({ success: false, error: "Missing id" });

    const row = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ success: false, error: "Submission not found" });
    return res.status(200).json({ success: true, data: row });
  } catch (error) {
    console.error("[contact-submissions] Detail error:", error);
    return res.status(500).json({ success: false, error: "Failed to load submission" });
  }
}
