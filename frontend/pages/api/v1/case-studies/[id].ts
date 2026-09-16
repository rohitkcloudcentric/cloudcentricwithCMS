import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const itemIdentifier = id as string;

  if (req.method === "GET") {
    try {
      const caseStudy = await prisma.caseStudy.findFirst({
        where: {
          OR: [{ id: itemIdentifier }, { slug: itemIdentifier }],
        },
      });

      if (!caseStudy) {
        return res.status(404).json({ success: false, error: "Case Study not found" });
      }

      return res.status(200).json({ success: true, data: caseStudy });
    } catch (error: any) {
      console.error("GET Case Study Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "case_studies", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit case studies" });
      }

      const existing = await prisma.caseStudy.findUnique({ where: { id: itemIdentifier } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Case Study not found" });
      }

      const {
        title,
        slug,
        clientName,
        industry,
        summary,
        challenge,
        solution,
        results,
        featuredImage,
        status,
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      if (clientName !== undefined) updateData.clientName = clientName;
      if (industry !== undefined) updateData.industry = industry;
      if (summary !== undefined) updateData.summary = summary;
      if (challenge !== undefined) updateData.challenge = challenge;
      if (solution !== undefined) updateData.solution = solution;
      if (results !== undefined) updateData.results = results;
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (status !== undefined) {
        updateData.status = status;
        if (status === "PUBLISHED" && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      const updated = await prisma.caseStudy.update({
        where: { id: itemIdentifier },
        data: updateData,
      });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_case_study",
          module: "case_studies",
          details: { id: updated.id, title: updated.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("PUT Case Study Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "case_studies", "delete")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot delete case studies" });
      }

      const existing = await prisma.caseStudy.findUnique({ where: { id: itemIdentifier } });
      if (!existing) {
        return res.status(404).json({ success: false, error: "Case Study not found" });
      }

      await prisma.caseStudy.delete({ where: { id: itemIdentifier } });

      // Audit Log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "delete_case_study",
          module: "case_studies",
          details: { id: itemIdentifier, title: existing.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, message: "Case Study deleted successfully" });
    } catch (error: any) {
      console.error("DELETE Case Study Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
