import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { normalizeUsername, validateProfile } from "@/lib/profile-input";
import { deleteUnusedUploads } from "@/lib/upload-cleanup";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
  phone: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { name: true, description: true } },
} as const;

/**
 * The signed-in user's own profile.
 * The target user always comes from the session, never from the request, and only
 * name / username / phone / avatar are writable (role, permissions, email, status are not).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getAuthenticatedUser(req).catch(() => null);
  if (!session) return res.status(401).json({ success: false, error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({ where: { id: session.id }, select: profileSelect });
      if (!user) return res.status(404).json({ success: false, error: "User not found" });
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error("GET Profile Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const b = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
      const text = (v: unknown) => (typeof v === "string" ? v : "");

      const input = {
        name: text(b.name),
        username: text(b.username),
        phone: text(b.phone),
        avatarUrl: text(b.avatarUrl),
      };

      const errors = validateProfile(input);
      if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, error: Object.values(errors).join(" "), fields: errors });
      }

      const username = normalizeUsername(input.username) || null;
      if (username) {
        const clash = await prisma.user.findFirst({ where: { username, id: { not: session.id } }, select: { id: true } });
        if (clash) {
          return res.status(409).json({
            success: false,
            error: "This username is already taken.",
            fields: { username: "This username is already taken." },
          });
        }
      }

      const avatarUrl = input.avatarUrl.trim() || null;
      const before = await prisma.user.findUnique({ where: { id: session.id }, select: { avatarUrl: true } });

      const updated = await prisma.user.update({
        where: { id: session.id },
        data: { name: input.name.trim(), username, phone: input.phone.trim() || null, avatarUrl },
        select: profileSelect,
      });

      // Remove the replaced picture from disk (only if nothing else uses it)
      if (before?.avatarUrl && before.avatarUrl !== avatarUrl) await deleteUnusedUploads([before.avatarUrl]);

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "update_profile",
          module: "users",
          details: { id: session.id, fields: ["name", "username", "phone", "avatarUrl"] },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "This username is already taken.",
          fields: { username: "This username is already taken." },
        });
      }
      console.error("PUT Profile Error:", error);
      return res.status(500).json({ success: false, error: "Failed to update profile" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
