import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access." });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, error: "Document ID is required." });
  }

  if (req.method === "DELETE") {
    try {
      const doc = await prisma.chatKnowledgeDoc.findUnique({
        where: { id },
      });

      if (!doc) {
        return res.status(404).json({ success: false, error: "Document not found." });
      }

      // Delete file from disk if present
      const filePath = path.join(process.cwd(), "public", "documents", "company", doc.fileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // File deletion non-fatal
        }
      }

      // Delete from Prisma (cascades to chunks)
      await prisma.chatKnowledgeDoc.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: `Document "${doc.title}" removed from knowledge base.`,
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ success: false, error: "Failed to delete knowledge document." });
    }
  }

  if (req.method === "PUT") {
    try {
      const { isActive, title } = req.body || {};

      const dataToUpdate: any = {};
      if (typeof isActive === "boolean") dataToUpdate.isActive = isActive;
      if (typeof title === "string" && title.trim()) dataToUpdate.title = title.trim();

      const updated = await prisma.chatKnowledgeDoc.update({
        where: { id },
        data: dataToUpdate,
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating document:", error);
      return res.status(500).json({ success: false, error: "Failed to update knowledge document." });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
