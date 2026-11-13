/**
 * Privilege-escalation guards for user & role management (server only).
 * A user can never hand out more access than they hold themselves.
 */
import prisma from "@/lib/prisma";
import { hasFullAccess, permissionKeys } from "@/lib/rbac";
import { isCatalogPermission, permissionKey } from "@/lib/permission-catalog";

export const roleWithPermissions = {
  permissions: { include: { permission: true } },
  _count: { select: { users: true } },
} as const;

type RoleWithPerms = {
  id: string;
  name: string;
  description: string | null;
  fullAccess: boolean;
  createdAt?: Date;
  permissions: { permission: { module: string; action: string } }[];
  _count?: { users: number };
};

export function rolePermissionKeys(role: RoleWithPerms): string[] {
  return role.permissions
    .filter((rp) => isCatalogPermission(rp.permission.module, rp.permission.action))
    .map((rp) => permissionKey(rp.permission.module, rp.permission.action));
}

export function serializeRole(role: RoleWithPerms) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    fullAccess: role.fullAccess,
    permissionKeys: rolePermissionKeys(role),
    userCount: role._count?.users ?? 0,
  };
}

/** Actor may assign `role` to a user only if every permission in it is one they hold. */
export function canAssignRole(actor: unknown, role: RoleWithPerms): boolean {
  if (hasFullAccess(actor)) return true;
  if (role.fullAccess) return false;
  const mine = new Set(permissionKeys(actor));
  return rolePermissionKeys(role).every((k) => mine.has(k));
}

/** True when someone other than `excludeUserId` still holds an active full-access account. */
export async function otherActiveFullAccessUserExists(excludeUserId: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { id: { not: excludeUserId }, isActive: true, role: { fullAccess: true } },
  });
  return count > 0;
}

export function clientIp(req: { headers: Record<string, unknown>; socket: { remoteAddress?: string } }) {
  return (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
}
