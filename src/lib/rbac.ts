import { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "./auth";
import prisma from "./prisma";
import {
  PERMISSION_CATALOG,
  ACTION_LABELS,
  permissionKey,
  type ActionName,
  type ModuleName,
} from "./permission-catalog";

export type { ActionName, ModuleName } from "./permission-catalog";

/** Shape returned by getAuthenticatedUser (role with its permission rows). */
interface RbacUser {
  id: string;
  role?: {
    fullAccess?: boolean;
    permissions?: { permission?: { module: string; action: string } | null }[];
  } | null;
}

/** Role flagged in the database as full access (the Super Admin role). */
export function hasFullAccess(user: unknown): boolean {
  return Boolean((user as RbacUser | null)?.role?.fullAccess);
}

/** @deprecated use hasFullAccess; kept for existing callers */
export const isSuperAdmin = hasFullAccess;

export function checkPermission(user: unknown, moduleName: ModuleName, actionName: ActionName): boolean {
  const u = user as RbacUser | null;
  if (!u || !u.role) return false;
  if (u.role.fullAccess) return true;
  return (u.role.permissions || []).some(
    (rp) => rp.permission && rp.permission.module === moduleName && rp.permission.action === actionName
  );
}

/** "module:action" keys held by the user (all catalog keys for full-access roles). */
export function permissionKeys(user: unknown): string[] {
  const u = user as RbacUser | null;
  if (!u?.role) return [];
  if (u.role.fullAccess) {
    return PERMISSION_CATALOG.flatMap((m) => m.actions.map((a) => permissionKey(m.module, a)));
  }
  return (u.role.permissions || [])
    .filter((rp) => rp.permission)
    .map((rp) => permissionKey(rp.permission!.module, rp.permission!.action));
}

/** True when the user may see every record of the module, not just their own. */
export function canAccessAllRecords(user: unknown, moduleName: ModuleName): boolean {
  return checkPermission(user, moduleName, "manage");
}

/**
 * Prisma `where` fragment restricting a query to records the user may access:
 * {} with "manage" (or full access), otherwise { [ownerField]: user.id }.
 */
export function ownedRecordsFilter<F extends string>(user: unknown, moduleName: ModuleName, ownerField: F): Record<F, string> | Record<string, never> {
  if (canAccessAllRecords(user, moduleName)) return {};
  return { [ownerField]: (user as RbacUser).id } as Record<F, string>;
}

/** Whether a single record (with owner id) is within the user's scope. */
export function canAccessRecord(user: unknown, moduleName: ModuleName, ownerId: string | null | undefined): boolean {
  if (canAccessAllRecords(user, moduleName)) return true;
  return Boolean(ownerId) && ownerId === (user as RbacUser | null)?.id;
}

/** Makes sure every catalog permission exists as a row (idempotent). */
export async function ensurePermissionCatalog(): Promise<void> {
  const existing = await prisma.permission.findMany({ select: { module: true, action: true } });
  const have = new Set(existing.map((p) => permissionKey(p.module, p.action)));
  const missing = PERMISSION_CATALOG.flatMap((m) =>
    m.actions
      .filter((a) => !have.has(permissionKey(m.module, a)))
      .map((a) => ({ module: m.module, action: a, description: `${ACTION_LABELS[a]} ${m.label}` }))
  );
  if (missing.length) await prisma.permission.createMany({ data: missing, skipDuplicates: true });
}

export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, user: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>) => Promise<void>,
  requiredPermission?: { module: ModuleName; action: ActionName }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized access" });
      }

      if (requiredPermission && !checkPermission(user, requiredPermission.module, requiredPermission.action)) {
        return res.status(403).json({
          success: false,
          error: `Forbidden: Missing required permission [${requiredPermission.module}:${requiredPermission.action}]`,
        });
      }

      return await handler(req, res, user);
    } catch (error) {
      console.error("API Auth Middleware Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  };
}
