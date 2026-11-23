import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/rbac";
import {
  verifyAdminApiIpAccess,
  logIpManagementActivity,
  invalidateAdminIpCache,
  LOCKOUT_ERROR_MESSAGE,
} from "@/lib/admin-ip-guard";
import { extractClientIp } from "@/lib/ip-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. IP Access Control check on backend
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  // 2. Authentication & Super Admin role check
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access" });
  }

  if (!hasFullAccess(user)) {
    return res.status(403).json({
      success: false,
      error: "Forbidden: Super Admin privileges are required to manage IP addresses.",
    });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Invalid record ID" });
  }

  // Never cache admin management responses
  res.setHeader("Cache-Control", "no-store");

  // Fetch target record
  const existing = await prisma.adminIpAddress.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({ success: false, error: "IP address record not found." });
  }

  // ── UPDATE IP (PUT / PATCH) ──
  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const body = req.body || {};
      const newStatus = typeof body.status === "string" ? body.status.toLowerCase().trim() : existing.status;
      const newDescription = typeof body.description === "string" ? body.description.trim() : existing.description;

      const normalizedStatus = newStatus === "blocked" ? "blocked" : "allowed";

      // ── LOCKOUT PREVENTION RULE ──
      // If currently allowed and changing to blocked, ensure at least one other allowed IP exists
      if (existing.status === "allowed" && normalizedStatus === "blocked") {
        // Enforce within a transaction to prevent concurrent race conditions
        const result = await prisma.$transaction(async (tx) => {
          const otherAllowedCount = await tx.adminIpAddress.count({
            where: {
              status: "allowed",
              id: { not: id },
            },
          });

          if (otherAllowedCount < 1) {
            throw new Error("LOCKOUT_PREVENTED");
          }

          return await tx.adminIpAddress.update({
            where: { id },
            data: {
              status: normalizedStatus,
              description: newDescription !== undefined ? newDescription : existing.description,
            },
            include: {
              createdBy: { select: { id: true, name: true, email: true } },
            },
          });
        });

        invalidateAdminIpCache();

        const currentClientIp = extractClientIp(req);
        await logIpManagementActivity({
          userId: user.id,
          action: "block",
          ipAddress: existing.ipAddress,
          previousStatus: existing.status,
          newStatus: normalizedStatus,
          description: newDescription,
          clientIp: currentClientIp,
        });

        return res.status(200).json({
          success: true,
          message: `IP address ${existing.ipAddress} status changed to blocked.`,
          data: result,
        });
      }

      // If status is not changing to blocked (e.g. updating description or allowing an already blocked IP)
      const updated = await prisma.adminIpAddress.update({
        where: { id },
        data: {
          status: normalizedStatus,
          description: newDescription !== undefined ? newDescription : existing.description,
        },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });

      invalidateAdminIpCache();

      const action =
        normalizedStatus === "allowed" && existing.status !== "allowed"
          ? "allow"
          : "update";

      const currentClientIp = extractClientIp(req);
      await logIpManagementActivity({
        userId: user.id,
        action,
        ipAddress: existing.ipAddress,
        previousStatus: existing.status,
        newStatus: normalizedStatus,
        description: newDescription,
        clientIp: currentClientIp,
      });

      return res.status(200).json({
        success: true,
        message: `IP address ${existing.ipAddress} updated successfully.`,
        data: updated,
      });
    } catch (error: any) {
      if (error?.message === "LOCKOUT_PREVENTED") {
        return res.status(400).json({
          success: false,
          error: LOCKOUT_ERROR_MESSAGE,
        });
      }
      console.error("PUT IP Address Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  // ── DELETE IP ──
  if (req.method === "DELETE") {
    try {
      // ── LOCKOUT PREVENTION RULE ──
      // If currently allowed, ensure at least one other active allowed IP address remains
      if (existing.status === "allowed") {
        await prisma.$transaction(async (tx) => {
          const otherAllowedCount = await tx.adminIpAddress.count({
            where: {
              status: "allowed",
              id: { not: id },
            },
          });

          if (otherAllowedCount < 1) {
            throw new Error("LOCKOUT_PREVENTED");
          }

          await tx.adminIpAddress.delete({
            where: { id },
          });
        });
      } else {
        await prisma.adminIpAddress.delete({
          where: { id },
        });
      }

      invalidateAdminIpCache();

      const currentClientIp = extractClientIp(req);
      await logIpManagementActivity({
        userId: user.id,
        action: "delete",
        ipAddress: existing.ipAddress,
        previousStatus: existing.status,
        newStatus: null,
        description: existing.description,
        clientIp: currentClientIp,
      });

      return res.status(200).json({
        success: true,
        message: `IP address ${existing.ipAddress} successfully deleted.`,
      });
    } catch (error: any) {
      if (error?.message === "LOCKOUT_PREVENTED") {
        return res.status(400).json({
          success: false,
          error: LOCKOUT_ERROR_MESSAGE,
        });
      }
      console.error("DELETE IP Address Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  res.setHeader("Allow", ["PUT", "PATCH", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
