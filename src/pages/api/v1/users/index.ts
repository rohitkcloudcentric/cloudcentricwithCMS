import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser, hashPassword } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { canAssignRole, clientIp, roleWithPermissions, serializeRole } from "@/lib/role-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** GET users + roles (users:view). POST create a user (users:add, role must be assignable). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      if (!checkPermission(user, "users", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot view users" });
      }

      const [users, roles] = await Promise.all([
        prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: "desc" } }),
        prisma.role.findMany({ include: roleWithPermissions, orderBy: [{ fullAccess: "desc" }, { createdAt: "asc" }] }),
      ]);

      const sanitizedUsers = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        phone: u.phone,
        isActive: u.isActive,
        role: u.role.name,
        roleId: u.roleId,
        fullAccess: u.role.fullAccess,
        createdAt: u.createdAt,
      }));

      return res.status(200).json({
        success: true,
        data: {
          users: sanitizedUsers,
          roles: roles.map((r) => ({ ...serializeRole(r), assignable: canAssignRole(user, r) })),
        },
      });
    } catch (error) {
      console.error("GET Users Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      if (!checkPermission(user, "users", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create users" });
      }

      const b = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
      const name = typeof b.name === "string" ? b.name.trim() : "";
      const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
      const password = typeof b.password === "string" ? b.password : "";
      const roleId = typeof b.roleId === "string" ? b.roleId : "";

      if (name.length < 2 || name.length > 100) return res.status(400).json({ success: false, error: "Full name must be 2-100 characters" });
      if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ success: false, error: "Enter a valid email address" });
      if (password.length < 8 || password.length > 100) return res.status(400).json({ success: false, error: "Password must be 8-100 characters" });

      const role = await prisma.role.findUnique({ where: { id: roleId }, include: roleWithPermissions });
      if (!role) return res.status(400).json({ success: false, error: "Selected role does not exist" });
      if (!canAssignRole(user, role)) {
        return res.status(403).json({ success: false, error: "Forbidden: You cannot assign a role with more access than your own" });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ success: false, error: "User with this email already exists" });
      }

      const newUser = await prisma.user.create({
        data: { name, email, passwordHash: await hashPassword(password), roleId: role.id, isActive: true },
        include: { role: true },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "create_user",
          module: "users",
          details: { targetUserId: newUser.id, email: newUser.email, role: newUser.role.name },
          ipAddress: clientIp(req),
        },
      });

      return res.status(201).json({
        success: true,
        data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role.name, isActive: newUser.isActive },
      });
    } catch (error) {
      console.error("POST User Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
