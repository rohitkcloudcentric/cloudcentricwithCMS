import { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "./auth";

export type ModuleName = "blogs" | "case_studies" | "products" | "users" | "settings" | "audit_logs";
export type ActionName = "create" | "read" | "update" | "delete" | "publish";

export function checkPermission(
  user: any,
  moduleName: ModuleName,
  actionName: ActionName
): boolean {
  if (!user || !user.role) return false;

  // Super Admin override
  if (user.role.name === "Super Admin") return true;

  const permissions = user.role.permissions || [];
  return permissions.some(
    (rp: any) =>
      rp.permission &&
      rp.permission.module === moduleName &&
      rp.permission.action === actionName
  );
}

export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void>,
  requiredPermission?: { module: ModuleName; action: ActionName }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized access" });
      }

      if (requiredPermission) {
        const hasPerm = checkPermission(
          user,
          requiredPermission.module,
          requiredPermission.action
        );
        if (!hasPerm) {
          return res.status(403).json({
            success: false,
            error: `Forbidden: Missing required permission [${requiredPermission.module}:${requiredPermission.action}]`,
          });
        }
      }

      return await handler(req, res, user);
    } catch (error: any) {
      console.error("API Auth Middleware Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  };
}
