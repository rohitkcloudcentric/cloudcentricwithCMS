import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ensurePermissionCatalog, hasFullAccess } from "@/lib/rbac";
import { canAssignRole, clientIp, rolePermissionKeys, roleWithPermissions, serializeRole } from "@/lib/role-guard";
import { mergeKeys, parseKeys, parseRoleText, setRolePermissions } from "@/lib/role-input";

/**
 * PUT update a role's name / description / permissions, DELETE a role. Requires users:manage.
 * Full-access roles always have every permission and can only be renamed by full-access users.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
  if (!checkPermission(user, "users", "manage")) {
    return res.status(403).json({ success: false, error: "Forbidden: Cannot manage roles" });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";

  try {
    const role = await prisma.role.findUnique({ where: { id }, include: roleWithPermissions });
    if (!role) return res.status(404).json({ success: false, error: "Role not found" });

    if (role.fullAccess && !hasFullAccess(user)) {
      return res.status(403).json({ success: false, error: "Forbidden: This role can only be changed by a full-access administrator" });
    }

    if (req.method === "PUT") {
      const b = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
      const { name, description, errors } = parseRoleText(b);
      if (errors.length) return res.status(400).json({ success: false, error: errors.join(". ") });

      if (name && name.toLowerCase() !== role.name.toLowerCase()) {
        const clash = await prisma.role.findFirst({
          where: { name: { equals: name, mode: "insensitive" }, id: { not: role.id } },
          select: { id: true },
        });
        if (clash) return res.status(409).json({ success: false, error: "A role with this name already exists" });
      }

      await prisma.role.update({
        where: { id: role.id },
        data: { ...(name ? { name } : {}), ...(description !== undefined ? { description: description || null } : {}) },
      });

      const requested = parseKeys(b.permissionKeys);
      let finalKeys = rolePermissionKeys(role);
      if (requested !== undefined && !role.fullAccess) {
        await ensurePermissionCatalog();
        finalKeys = mergeKeys(user, requested, finalKeys);
        await setRolePermissions(role.id, finalKeys);
      }

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_role",
          module: "users",
          details: { roleId: role.id, name: name || role.name, permissions: finalKeys },
          ipAddress: clientIp(req),
        },
      });

      const fresh = await prisma.role.findUniqueOrThrow({ where: { id: role.id }, include: roleWithPermissions });
      return res.status(200).json({ success: true, data: { ...serializeRole(fresh), assignable: canAssignRole(user, fresh) } });
    }

    // DELETE
    if (role.fullAccess) return res.status(400).json({ success: false, error: "The full-access role cannot be deleted" });
    if (role._count.users > 0) {
      return res.status(409).json({ success: false, error: `Move the ${role._count.users} user(s) with this role to another role first` });
    }
    if (role.id === user.roleId) return res.status(400).json({ success: false, error: "You cannot delete your own role" });

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
      prisma.role.delete({ where: { id: role.id } }),
    ]);
    await prisma.auditLog.create({
      data: { userId: user.id, action: "delete_role", module: "users", details: { roleId: role.id, name: role.name }, ipAddress: clientIp(req) },
    });
    return res.status(200).json({ success: true, message: "Role deleted" });
  } catch (error) {
    console.error(`${req.method} Role Error:`, error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
