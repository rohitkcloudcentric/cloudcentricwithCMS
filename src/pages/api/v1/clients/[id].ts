import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { canAccessRecord, checkPermission } from "@/lib/rbac";
import { clientInclude, parseClientBody } from "@/lib/client-input";

/** GET one client (admin), PUT update (partial allowed), DELETE. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!["GET", "PUT", "DELETE"].includes(req.method || "")) {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const existing = await prisma.client.findUnique({ where: { id }, include: clientInclude });
    if (!existing) return res.status(404).json({ success: false, error: "Client not found" });

    // Record scope: own clients only unless the role has clients:manage
    if (!canAccessRecord(user, "clients", existing.createdById)) {
      return res.status(403).json({ success: false, error: "Forbidden: This client is outside your access" });
    }

    if (req.method === "GET") {
      if (!checkPermission(user, "clients", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }
      return res.status(200).json({ success: true, data: existing });
    }

    if (req.method === "PUT") {
      if (!checkPermission(user, "clients", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit clients" });
      }
      const parsed = await parseClientBody(req.body, false);
      if (parsed.errors.length) return res.status(400).json({ success: false, error: parsed.errors.join(". ") });

      const updated = await prisma.client.update({ where: { id }, data: parsed.data, include: clientInclude });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_client",
          module: "clients",
          details: { id, name: updated.name, changed: Object.keys(parsed.data) },
          ipAddress: clientIp,
        },
      });
      return res.status(200).json({ success: true, data: updated });
    }

    // DELETE
    if (!checkPermission(user, "clients", "delete")) {
      return res.status(403).json({ success: false, error: "Forbidden: Cannot delete clients" });
    }
    await prisma.client.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "delete_client",
        module: "clients",
        details: { id, name: existing.name },
        ipAddress: clientIp,
      },
    });
    return res.status(200).json({ success: true, message: "Client deleted" });
  } catch (error) {
    console.error(`${req.method} Client Error:`, error);
    return res.status(500).json({ success: false, error: "Failed to update client" });
  }
}
