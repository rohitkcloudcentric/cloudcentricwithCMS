import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Prevent any caching of live messages
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        customer: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ success: false, error: "Chat session not found." });
    }

    return res.status(200).json({
      success: true,
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
        agentName: session.agentName,
      },
      customer: {
        fullName: session.customer.fullName,
        email: session.customer.email,
        purpose: session.customer.purpose,
      },
      messages: session.messages,
    });
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return res.status(500).json({ success: false, error: "Failed to retrieve chat messages." });
  }
}
