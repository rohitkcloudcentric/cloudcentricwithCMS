import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess, permissionKeys } from "@/lib/rbac";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";

/** The signed-in user with their role and effective permissions (loaded fresh from the DB). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    // Never cache: permissions can change at any time from User Roles & RBAC
    res.setHeader("Cache-Control", "no-store");

    const keys = permissionKeys(user);
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        roleId: user.roleId,
        fullAccess: hasFullAccess(user),
        username: user.username,
        phone: user.phone,
        createdAt: user.createdAt,
        avatarUrl: user.avatarUrl,
        permissionKeys: keys,
        // Backwards-compatible shape
        permissions: keys.map((k) => {
          const [module, action] = k.split(":");
          return { module, action };
        }),
      },
    });
  } catch (error) {
    console.error("Auth Me API Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
