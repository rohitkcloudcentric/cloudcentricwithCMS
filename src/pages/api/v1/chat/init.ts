import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { generateRagResponse } from "@/lib/chatbot/rag-engine";
import { extractClientIp } from "@/lib/ip-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const {
      fullName,
      email,
      contactNumber,
      purpose,
      companyName,
      additionalInfo,
      initialMessage,
    } = req.body || {};

    // 1. Validate required fields
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, error: "Please enter your full name." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: "Please provide a valid email address." });
    }

    // Contact number validation: must contain digits, min 7
    const cleanPhone = (contactNumber || "").replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 7) {
      return res.status(400).json({ success: false, error: "Please enter a valid contact phone number." });
    }

    if (!purpose || typeof purpose !== "string" || purpose.trim().length < 2) {
      return res.status(400).json({ success: false, error: "Please specify the purpose of your chat or inquiry." });
    }

    const clientIp = extractClientIp(req);
    const userAgent = req.headers["user-agent"] || "";

    // 2. Create customer record in database
    const customer = await prisma.chatCustomer.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        contactNumber: cleanPhone,
        purpose: purpose.trim(),
        companyName: companyName ? String(companyName).trim() : null,
        additionalInfo: additionalInfo ? String(additionalInfo).trim() : null,
        ipAddress: clientIp,
        userAgent: String(userAgent).slice(0, 500),
      },
    });

    // 3. Create chat session
    const session = await prisma.chatSession.create({
      data: {
        customerId: customer.id,
        mode: "ai",
        status: "active",
        initialMessage: initialMessage ? String(initialMessage).trim() : null,
      },
    });

    const messages = [];

    // 4. If an initial message was entered in the AIChatBar, process it immediately!
    const trimmedInitial = initialMessage ? String(initialMessage).trim() : "";
    if (trimmedInitial) {
      // User message
      const userMsg = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "user",
          text: trimmedInitial,
          isLiveAgent: false,
        },
      });
      messages.push(userMsg);

      // Generate AI response grounded in company documentation
      const ragRes = await generateRagResponse(trimmedInitial, [{ sender: "user", text: trimmedInitial }]);
      const botMsg = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "bot",
          text: ragRes.answer,
          sources: ragRes.sources as any,
          isLiveAgent: false,
        },
      });
      messages.push(botMsg);
    } else {
      // Default welcoming AI message
      const defaultGreeting = `Hello ${customer.fullName}! I am CloudCentric's AI Assistant. How can I assist you with your inquiry regarding "${customer.purpose}" today?`;
      const botMsg = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: "bot",
          text: defaultGreeting,
          isLiveAgent: false,
        },
      });
      messages.push(botMsg);
    }

    return res.status(201).json({
      success: true,
      customerId: customer.id,
      sessionId: session.id,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        purpose: customer.purpose,
      },
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
      },
      messages,
    });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    return res.status(500).json({ success: false, error: "Internal server error initializing chat session." });
  }
}
