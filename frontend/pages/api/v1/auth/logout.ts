import type { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie, getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (user) {
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "logout",
          module: "auth",
          details: { email: user.email },
          ipAddress: clientIp,
        },
      });
    }

    removeTokenCookie(res);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout API Error:", error);
    removeTokenCookie(res);
    return res.status(200).json({ success: true, message: "Logged out" });
  }
}
