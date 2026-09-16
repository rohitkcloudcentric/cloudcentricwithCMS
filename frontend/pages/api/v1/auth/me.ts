import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const permissions = (user.role.permissions || []).map((rp: any) => ({
      module: rp.permission.module,
      action: rp.permission.action,
    }));

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        avatarUrl: user.avatarUrl,
        permissions,
      },
    });
  } catch (error: any) {
    console.error("Auth Me API Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
