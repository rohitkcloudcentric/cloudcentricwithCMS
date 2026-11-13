import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";
import { CONTACT_TYPES, parseContactBody, type ContactType } from "@/lib/contact-settings";
import { contactOrder, delegateFor, prepareWrite, typeLabel } from "@/lib/contact-settings-server";

/** GET all records of a type (contact_settings:view). POST create (contact_settings:add). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const type = req.query.type as ContactType;
  if (!CONTACT_TYPES.includes(type)) return res.status(404).json({ success: false, error: "Unknown contact setting type" });

  const user = await getAuthenticatedUser(req).catch(() => null);
  if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      if (!checkPermission(user, "contact_settings", "read")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot view contact settings" });
      }
      const rows = await delegateFor(type).findMany({ orderBy: contactOrder });
      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === "POST") {
      if (!checkPermission(user, "contact_settings", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot add contact settings" });
      }
      const parsed = parseContactBody(type, req.body, false);
      if (Object.keys(parsed.errors).length) {
        return res.status(400).json({ success: false, error: Object.values(parsed.errors).join(" "), fields: parsed.errors });
      }
      const prepared = await prepareWrite(type, parsed.data, null);
      if (prepared.duplicate) {
        return res.status(409).json({ success: false, error: prepared.duplicate.message, fields: { [prepared.duplicate.field]: prepared.duplicate.message } });
      }
      const row = await delegateFor(type).create({ data: prepared.data });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: { userId: user.id, action: `create_${type}`, module: "contact_settings", details: { id: row.id, ...parsed.data }, ipAddress: clientIp },
      });
      return res.status(201).json({
        success: true,
        data: row,
        // message: prepared.iconSkipped
        //   ? `The ${typeLabel(type)} was added, but the custom icon was not saved: run "npx prisma db push" to enable custom icons.`
        //   : `The ${typeLabel(type)} was added.`,
        message: `The ${typeLabel(type)} was added.`,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error(`${req.method} contact-settings/${type} error:`, error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
