import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { generateRagResponse } from "@/lib/chatbot/rag-engine";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { sessionId, message } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    const trimmedMsg = (message || "").trim();
    if (!trimmedMsg) {
      return res.status(400).json({ success: false, error: "Message cannot be empty." });
    }

    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        customer: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 12,
        },
      },
    });

    if (!session) {
      return res.status(404).json({ success: false, error: "Chat session not found." });
    }

    const isLiveAgent = session.mode === "live_agent";

    // 1. Record user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: "user",
        text: trimmedMsg,
        isLiveAgent,
      },
    });

    // 2. If in AI mode, run RAG engine
    if (!isLiveAgent) {
      const history = session.messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const ragResponse = await generateRagResponse(trimmedMsg, history);

      const botMessage = await prisma.chatMessage.create({
        data: {
          sessionId,
          sender: "bot",
          text: ragResponse.answer,
          sources: ragResponse.sources as any,
          isLiveAgent: false,
        },
      });

      return res.status(200).json({
        success: true,
        userMessage,
        botMessage,
        sources: ragResponse.sources,
        canEscalate: ragResponse.canEscalate,
      });
    } else {
      // In Live Agent mode, message is queued for the human agent.
      return res.status(200).json({
        success: true,
        userMessage,
        mode: "live_agent",
        agentName: session.agentName,
      });
    }
  } catch (error) {
    console.error("Error processing chat message:", error);
    return res.status(500).json({ success: false, error: "Failed to process chat message." });
  }
}
