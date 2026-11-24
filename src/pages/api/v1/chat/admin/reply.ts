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

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { sessionId, message } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    const trimmed = (message || "").trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, error: "Reply message cannot be empty." });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ success: false, error: "Chat session not found." });
    }

    // Ensure session is in live agent mode and updated with the admin's name
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        mode: "live_agent",
        agentName: user.name || "Live Specialist",
        updatedAt: new Date(),
      },
    });

    const agentMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: "agent",
        text: trimmed,
        isLiveAgent: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: agentMessage,
    });
  } catch (error) {
    console.error("Error sending admin chat reply:", error);
    return res.status(500).json({ success: false, error: "Failed to send live agent reply." });
  }
}
