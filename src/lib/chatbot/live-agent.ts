import prisma from "@/lib/prisma";

export interface LiveAgentProfile {
  name: string;
  role: string;
  avatar: string;
  status: "online" | "busy" | "away";
}

export const LIVE_AGENTS_ROSTER: LiveAgentProfile[] = [
  {
    name: "Sarah Jenkins",
    role: "Principal AI Solutions Architect",
    avatar: "/images/avatars/agent-sarah.png",
    status: "online",
  },
  {
    name: "David Chen",
    role: "Enterprise Salesforce Lead",
    avatar: "/images/avatars/agent-david.png",
    status: "online",
  },
  {
    name: "Elena Rostova",
    role: "Cloud Systems Consultant",
    avatar: "/images/avatars/agent-elena.png",
    status: "online",
  },
  {
    name: "Marcus Vance",
    role: "Technical Client Director",
    avatar: "/images/avatars/agent-marcus.png",
    status: "online",
  },
];

/**
 * Assigns an appropriate live agent based on the inquiry purpose.
 */
export function assignAgentForInquiry(purpose = ""): LiveAgentProfile {
  const p = purpose.toLowerCase();
  if (p.includes("salesforce") || p.includes("crm")) {
    return LIVE_AGENTS_ROSTER[1]; // David Chen
  }
  if (p.includes("cloud") || p.includes("infra") || p.includes("devops")) {
    return LIVE_AGENTS_ROSTER[2]; // Elena Rostova
  }
  if (p.includes("consult") || p.includes("hire") || p.includes("price") || p.includes("demo")) {
    return LIVE_AGENTS_ROSTER[3]; // Marcus Vance
  }
  // Default to Sarah Jenkins for AI & general inquiries
  return LIVE_AGENTS_ROSTER[0];
}

/**
 * Transfers an existing AI chat session to a live human agent.
 * Preserves the customer's submitted information and previous conversation history.
 */
export async function transferToLiveAgent(sessionId: string): Promise<{
  success: boolean;
  agent: LiveAgentProfile;
  session: any;
}> {
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
    throw new Error("Chat session not found.");
  }

  const assignedAgent = assignAgentForInquiry(session.customer.purpose);

  // Update session mode and status
  const updatedSession = await prisma.chatSession.update({
    where: { id: sessionId },
    data: {
      mode: "live_agent",
      status: "transferred",
      agentName: assignedAgent.name,
    },
  });

  // 1. System notification message
  await prisma.chatMessage.create({
    data: {
      sessionId,
      sender: "system",
      text: `Connecting you to a live specialist... All previous conversation history has been securely transferred to ${assignedAgent.name}.`,
      isLiveAgent: true,
    },
  });

  // 2. Initial welcoming agent message
  await prisma.chatMessage.create({
    data: {
      sessionId,
      sender: "agent",
      text: `Hello ${session.customer.fullName}! My name is ${assignedAgent.name} (${assignedAgent.role}). I have your inquiry regarding "${session.customer.purpose}" and your previous chat notes. How can I assist you today?`,
      isLiveAgent: true,
    },
  });

  return {
    success: true,
    agent: assignedAgent,
    session: updatedSession,
  };
}

/**
 * Adds a message from customer or live agent to the session.
 */
export async function addSessionMessage({
  sessionId,
  sender,
  text,
  sources,
  isLiveAgent = false,
}: {
  sessionId: string;
  sender: "user" | "bot" | "agent" | "system";
  text: string;
  sources?: any;
  isLiveAgent?: boolean;
}) {
  return prisma.chatMessage.create({
    data: {
      sessionId,
      sender,
      text: text.trim(),
      sources: sources || null,
      isLiveAgent,
    },
  });
}
