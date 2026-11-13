import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ensurePermissionCatalog } from "@/lib/rbac";
import { canAssignRole, clientIp, roleWithPermissions, serializeRole } from "@/lib/role-guard";
import { mergeKeys, parseKeys, parseRoleText, setRolePermissions } from "@/lib/role-input";

/** GET roles with their permissions (users:view). POST create a role (users:manage). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      if (!checkPermission(user, "users", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot view roles" });
      }
      await ensurePermissionCatalog();
      const roles = await prisma.role.findMany({ include: roleWithPermissions, orderBy: [{ fullAccess: "desc" }, { createdAt: "asc" }] });
      return res.status(200).json({
        success: true,
        data: roles.map((r) => ({ ...serializeRole(r), assignable: canAssignRole(user, r) })),
      });
    }

    if (req.method === "POST") {
      if (!checkPermission(user, "users", "manage")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot manage roles" });
      }
      const b = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
      const { name, description, errors } = parseRoleText(b);
      if (!name) errors.push("Role name is required");
      if (errors.length) return res.status(400).json({ success: false, error: errors.join(". ") });

      const clash = await prisma.role.findFirst({ where: { name: { equals: name!, mode: "insensitive" } }, select: { id: true } });
      if (clash) return res.status(409).json({ success: false, error: "A role with this name already exists" });

      await ensurePermissionCatalog();
      const keys = mergeKeys(user, parseKeys(b.permissionKeys) ?? [], []);
      const role = await prisma.role.create({ data: { name: name!, description: description || null } });
      await setRolePermissions(role.id, keys);

      await prisma.auditLog.create({
        data: { userId: user.id, action: "create_role", module: "users", details: { roleId: role.id, name: role.name, permissions: keys }, ipAddress: clientIp(req) },
      });

      const full = await prisma.role.findUniqueOrThrow({ where: { id: role.id }, include: roleWithPermissions });
      return res.status(201).json({ success: true, data: { ...serializeRole(full), assignable: canAssignRole(user, full) } });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error(`${req.method} Roles Error:`, error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
