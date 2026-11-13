import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser, hashPassword } from "@/lib/auth";
import { checkPermission, hasFullAccess } from "@/lib/rbac";
import { canAssignRole, clientIp, otherActiveFullAccessUserExists, roleWithPermissions } from "@/lib/role-guard";
import { normalizeUsername, validateProfile } from "@/lib/profile-input";
import { deleteUnusedUploads } from "@/lib/upload-cleanup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Manage another user's account, driven by the users:* permissions:
 *  - users:edit    -> details, status, password
 *  - users:manage  -> change the role (only to roles within the actor's own access)
 *  - users:delete  -> delete
 * Full-access accounts can only be changed by full-access users.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const actor = await getAuthenticatedUser(req).catch(() => null);
  if (!actor) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const required = req.method === "PUT" ? "update" : "delete";
  if (!checkPermission(actor, "users", required)) {
    return res.status(403).json({ success: false, error: `Forbidden: You cannot ${required === "update" ? "edit" : "delete"} users` });
  }

  const targetId = typeof req.query.id === "string" ? req.query.id : "";
  const target = await prisma.user.findUnique({ where: { id: targetId }, include: { role: true } });
  if (!target) return res.status(404).json({ success: false, error: "User not found" });

  if (target.role.fullAccess && !hasFullAccess(actor)) {
    return res.status(403).json({ success: false, error: "Forbidden: Only a full-access administrator can change this account" });
  }

  if (req.method === "PUT") {
    try {
      const b = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
      const data: Prisma.UserUncheckedUpdateInput = {};
      const fields: Record<string, string> = {};

      // Profile details (same rules as the profile page)
      const name = typeof b.name === "string" ? b.name : target.name;
      const username = typeof b.username === "string" ? b.username : target.username || "";
      const phone = typeof b.phone === "string" ? b.phone : target.phone || "";
      Object.assign(fields, validateProfile({ name, username, phone, avatarUrl: "" }));

      let email = target.email;
      if (typeof b.email === "string") {
        email = b.email.trim().toLowerCase();
        if (!EMAIL_RE.test(email) || email.length > 200) fields.email = "Enter a valid email address.";
      }

      let password: string | undefined;
      if (typeof b.password === "string" && b.password) {
        if (b.password.length < 8 || b.password.length > 100) fields.password = "Password must be 8-100 characters.";
        else password = b.password;
      }

      let roleChanged = false;
      if (typeof b.roleId === "string" && b.roleId && b.roleId !== target.roleId) {
        if (!checkPermission(actor, "users", "manage")) {
          return res.status(403).json({ success: false, error: "Forbidden: You cannot change user roles" });
        }
        const role = await prisma.role.findUnique({ where: { id: b.roleId }, include: roleWithPermissions });
        if (!role) fields.roleId = "Selected role does not exist.";
        else if (!canAssignRole(actor, role)) {
          return res.status(403).json({ success: false, error: "Forbidden: You cannot assign a role with more access than your own" });
        } else {
          if (target.role.fullAccess && !role.fullAccess && !(await otherActiveFullAccessUserExists(target.id))) {
            fields.roleId = "You cannot remove the last active full-access administrator.";
          }
          data.roleId = role.id;
          roleChanged = true;
        }
      }

      let statusChanged = false;
      if (b.isActive !== undefined) {
        if (typeof b.isActive !== "boolean") fields.isActive = "Invalid status.";
        else if (b.isActive !== target.isActive) {
          if (!b.isActive && target.id === actor.id) fields.isActive = "You cannot deactivate your own account.";
          else if (!b.isActive && target.role.fullAccess && !(await otherActiveFullAccessUserExists(target.id))) {
            fields.isActive = "You cannot deactivate the last active full-access administrator.";
          } else {
            data.isActive = b.isActive;
            statusChanged = true;
          }
        }
      }

      // Uniqueness
      if (!fields.email && email !== target.email) {
        const clash = await prisma.user.findFirst({ where: { email, id: { not: target.id } }, select: { id: true } });
        if (clash) fields.email = "This email address is already in use.";
      }
      const normUsername = normalizeUsername(username) || null;
      if (!fields.username && normUsername && normUsername !== target.username) {
        const clash = await prisma.user.findFirst({ where: { username: normUsername, id: { not: target.id } }, select: { id: true } });
        if (clash) fields.username = "This username is already taken.";
      }

      if (Object.keys(fields).length) {
        return res.status(400).json({ success: false, error: Object.values(fields).join(" "), fields });
      }

      data.name = name.trim();
      data.email = email;
      data.username = normUsername;
      data.phone = phone.trim() || null;
      if (password) data.passwordHash = await hashPassword(password);

      const updated = await prisma.user.update({ where: { id: target.id }, data, include: { role: true } });

      await prisma.auditLog.create({
        data: {
          userId: actor.id,
          action: "update_user",
          module: "users",
          details: {
            targetUserId: target.id,
            email: updated.email,
            ...(roleChanged ? { role: updated.role.name } : {}),
            ...(statusChanged ? { isActive: updated.isActive } : {}),
            passwordChanged: Boolean(password),
          },
          ipAddress: clientIp(req),
        },
      });

      return res.status(200).json({
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          username: updated.username,
          phone: updated.phone,
          isActive: updated.isActive,
          role: updated.role.name,
          roleId: updated.roleId,
          fullAccess: updated.role.fullAccess,
          createdAt: updated.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return res.status(409).json({ success: false, error: "Email or username is already in use." });
      }
      console.error("PUT User Error:", error);
      return res.status(500).json({ success: false, error: "Failed to update user" });
    }
  }

  // DELETE
  try {
    if (target.id === actor.id) {
      return res.status(400).json({ success: false, error: "You cannot delete your own account." });
    }
    if (target.role.fullAccess && !(await otherActiveFullAccessUserExists(target.id))) {
      return res.status(400).json({ success: false, error: "You cannot delete the last active full-access administrator." });
    }

    try {
      await prisma.user.delete({ where: { id: target.id } });
    } catch (error) {
      // Users who authored articles are referenced by them and cannot be removed
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return res.status(409).json({
          success: false,
          error: "This user still owns content (e.g. blog articles). Deactivate the account instead.",
        });
      }
      throw error;
    }

    await deleteUnusedUploads([target.avatarUrl]);

    await prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "delete_user",
        module: "users",
        details: { targetUserId: target.id, email: target.email, role: target.role.name },
        ipAddress: clientIp(req),
      },
    });

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete user" });
  }
}
