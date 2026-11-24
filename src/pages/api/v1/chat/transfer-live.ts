import type { NextApiRequest, NextApiResponse } from "next";
import { transferToLiveAgent } from "@/lib/chatbot/live-agent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body || {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ success: false, error: "Session ID is required." });
    }

    const result = await transferToLiveAgent(sessionId);

    return res.status(200).json({
      success: true,
      mode: "live_agent",
      agent: result.agent,
      session: result.session,
    });
  } catch (error: any) {
    console.error("Error transferring to live agent:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to initiate live agent transfer.",
    });
  }
}
