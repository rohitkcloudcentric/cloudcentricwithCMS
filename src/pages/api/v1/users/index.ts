import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser, hashPassword } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      if (!checkPermission(user, "users", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot view users" });
      }

      const users = await prisma.user.findMany({
        include: {
          role: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const roles = await prisma.role.findMany();

      const sanitizedUsers = users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isActive: u.isActive,
        role: u.role.name,
        roleId: u.roleId,
        createdAt: u.createdAt,
      }));

      return res.status(200).json({ success: true, data: { users: sanitizedUsers, roles } });
    } catch (error: any) {
      console.error("GET Users Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      if (!checkPermission(user, "users", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create users" });
      }

      const { name, email, password, roleId } = req.body;

      if (!name || !email || !password || !roleId) {
        return res.status(400).json({ success: false, error: "Name, email, password, and roleId are required" });
      }

      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (existing) {
        return res.status(400).json({ success: false, error: "User with this email already exists" });
      }

      const passwordHash = await hashPassword(password);
      const newUser = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          passwordHash,
          roleId,
          isActive: true,
        },
        include: { role: true },
      });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "create_user",
          module: "users",
          details: { targetUserId: newUser.id, email: newUser.email, role: newUser.role.name },
          ipAddress: clientIp,
        },
      });

      return res.status(201).json({
        success: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role.name,
          isActive: newUser.isActive,
        },
      });
    } catch (error: any) {
      console.error("POST User Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
