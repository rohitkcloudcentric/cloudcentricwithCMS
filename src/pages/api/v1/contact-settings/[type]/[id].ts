import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { CONTACT_TYPES, parseContactBody, type ContactType } from "@/lib/contact-settings";
import { delegateFor, prepareWrite, typeLabel } from "@/lib/contact-settings-server";
import { deleteUnusedUploads } from "@/lib/upload-cleanup";

/** PUT update (contact_settings:edit, partial allowed) / DELETE (contact_settings:delete) one record. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = req.query.type as ContactType;
  if (!CONTACT_TYPES.includes(type)) return res.status(404).json({ success: false, error: "Unknown contact setting type" });
  if (req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const user = await getAuthenticatedUser(req).catch(() => null);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
  const action = req.method === "PUT" ? "update" : "delete";
  if (!checkPermission(user, "contact_settings", action)) {
    return res.status(403).json({ success: false, error: `Forbidden: Cannot ${action === "update" ? "edit" : "delete"} contact settings` });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  try {
    const d = delegateFor(type);
    const existing = await d.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: `This ${typeLabel(type)} no longer exists` });

    if (req.method === "PUT") {
      const parsed = parseContactBody(type, req.body, true);
      if (Object.keys(parsed.errors).length) {
        return res.status(400).json({ success: false, error: Object.values(parsed.errors).join(" "), fields: parsed.errors });
      }
      const prepared = await prepareWrite(type, parsed.data, existing);
      if (prepared.duplicate) {
        return res.status(409).json({ success: false, error: prepared.duplicate.message, fields: { [prepared.duplicate.field]: prepared.duplicate.message } });
      }
      const row = await d.update({ where: { id }, data: prepared.data });
      // A replaced/removed custom social icon is deleted from disk (only if nothing else uses it)
      if (type === "social" && "iconUrl" in prepared.data && existing.iconUrl !== prepared.data.iconUrl) {
        await deleteUnusedUploads([existing.iconUrl as string | null]);
      }
      await prisma.auditLog.create({
        data: { userId: user.id, action: `update_${type}`, module: "contact_settings", details: { id, changed: Object.keys(parsed.data) }, ipAddress: clientIp },
      });
      return res.status(200).json({
        success: true,
        data: row,
        // message: prepared.iconSkipped
        //   ? `The ${typeLabel(type)} was updated, but the custom icon was not saved: run "npx prisma db push" to enable custom icons.`
        //   : `The ${typeLabel(type)} was updated.`,
        message: `The ${typeLabel(type)} was updated.`,
      });
    }

    await d.delete({ where: { id } });
    if (type === "social") await deleteUnusedUploads([existing.iconUrl as string | null]);
    await prisma.auditLog.create({
      data: { userId: user.id, action: `delete_${type}`, module: "contact_settings", details: { id }, ipAddress: clientIp },
    });
    return res.status(200).json({ success: true, message: `The ${typeLabel(type)} was deleted.` });
  } catch (error) {
    console.error(`${req.method} contact-settings/${type}/${id} error:`, error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
