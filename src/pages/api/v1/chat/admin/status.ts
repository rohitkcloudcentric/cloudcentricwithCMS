import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { sessionId, status } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    if (!status || !["active", "transferred", "closed"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value." });
    }

    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    if (status === "closed") {
      await prisma.chatMessage.create({
        data: {
          sessionId,
          sender: "system",
          text: `This chat session has been closed by administrator ${user.name}.`,
          isLiveAgent: updated.mode === "live_agent",
        },
      });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating session status:", error);
    return res.status(500).json({ success: false, error: "Failed to update session status." });
  }
}
