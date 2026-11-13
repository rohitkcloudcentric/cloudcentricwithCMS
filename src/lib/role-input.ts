/** Shared role-body parsing for /api/v1/roles (server only). */
import prisma from "@/lib/prisma";
import { hasFullAccess, permissionKeys } from "@/lib/rbac";
import { isCatalogPermission, permissionKey } from "@/lib/permission-catalog";

export function parseRoleText(b: Record<string, unknown>) {
  const errors: string[] = [];
  const name = typeof b.name === "string" ? b.name.trim().replace(/\s+/g, " ") : undefined;
  const description = typeof b.description === "string" ? b.description.trim().slice(0, 300) : undefined;
  if (name !== undefined && (name.length < 2 || name.length > 50)) errors.push("Role name must be 2-50 characters");
  return { name, description, errors };
}

/** Requested "module:action" keys, keeping only ones the catalog knows. */
export function parseKeys(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter((k): k is string => typeof k === "string").filter((k) => {
        const [m, a] = k.split(":");
        return isCatalogPermission(m, a);
      })
    )
  );
}

/**
 * The final permission set after an edit. A non-full-access actor can only add or
 * remove permissions they hold; everything else stays as it was (no escalation).
 */
export function mergeKeys(actor: unknown, requested: string[], current: string[]): string[] {
  if (hasFullAccess(actor)) return requested;
  const mine = new Set(permissionKeys(actor));
  return Array.from(new Set([...requested.filter((k) => mine.has(k)), ...current.filter((k) => !mine.has(k))]));
}

/** Replaces a role's permissions with `keys` (permission rows must exist). */
export async function setRolePermissions(roleId: string, keys: string[]) {
  const perms = await prisma.permission.findMany({ select: { id: true, module: true, action: true } });
  const ids = perms.filter((p) => keys.includes(permissionKey(p.module, p.action))).map((p) => p.id);
  // Only catalog permissions are managed here; unknown legacy rows are left untouched
  const catalogIds = perms.filter((p) => isCatalogPermission(p.module, p.action)).map((p) => p.id);
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId, permissionId: { in: catalogIds } } }),
    prisma.rolePermission.createMany({ data: ids.map((permissionId) => ({ roleId, permissionId })), skipDuplicates: true }),
  ]);
}
