import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { canAccessRecord, checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { caseStudyAdminInclude, parseCaseStudyBody } from "@/lib/case-study-input";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const caseStudyId = typeof req.query.id === "string" ? req.query.id : "";
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

  if (req.method === "GET") {
    try {
      const user = await getAuthenticatedUser(req);
      const item = await prisma.caseStudy.findFirst({
        where: {
          OR: [{ id: caseStudyId }, { slug: caseStudyId }],
          // Staff are limited to their scope; everyone else to published case studies
          ...(user && checkPermission(user, "case_studies", "read")
            ? ownedRecordsFilter(user, "case_studies", "createdById")
            : { status: "PUBLISHED" as const }),
        },
        include: caseStudyAdminInclude,
      });
      if (!item) return res.status(404).json({ success: false, error: "Case study not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error("GET Case Study Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "case_studies", "update")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot edit case studies" });
      }

      const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId } });
      if (!existing) return res.status(404).json({ success: false, error: "Case study not found" });
      if (!canAccessRecord(user, "case_studies", existing.createdById)) {
        return res.status(403).json({ success: false, error: "Forbidden: You can only edit your own case studies" });
      }

      const parsed = await parseCaseStudyBody(req.body, false);
      if (parsed.errors.length) {
        return res.status(400).json({ success: false, error: parsed.errors.join(". ") });
      }

      if (typeof parsed.data.slug === "string" && parsed.data.slug !== existing.slug) {
        const clash = await prisma.caseStudy.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
        if (clash) return res.status(400).json({ success: false, error: "A case study with this slug already exists" });
      }

      const updateData: Prisma.CaseStudyUncheckedUpdateInput = {
        ...(parsed.data as Prisma.CaseStudyUncheckedUpdateInput),
      };

      if (parsed.status !== undefined && parsed.status !== existing.status) {
        if (parsed.status === "PUBLISHED" && !checkPermission(user, "case_studies", "publish")) {
          return res.status(403).json({ success: false, error: "Forbidden: You cannot publish case studies" });
        }
        updateData.status = parsed.status;
      }

      if (parsed.publishedAt !== undefined) {
        updateData.publishedAt = parsed.publishedAt;
      }
      // First publish without an explicit date: stamp it now
      const willBePublished = (parsed.status ?? existing.status) === "PUBLISHED";
      if (willBePublished && !existing.publishedAt && parsed.publishedAt == null) {
        updateData.publishedAt = new Date();
      }

      if (parsed.categoryId !== undefined) updateData.categoryId = parsed.categoryId;

      if (parsed.tagIds !== undefined) {
        updateData.tags = {
          deleteMany: {},
          create: parsed.tagIds.map((tagId) => ({ tagId })),
        };
      }

      const updated = await prisma.caseStudy.update({
        where: { id: caseStudyId },
        data: updateData,
        include: caseStudyAdminInclude,
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "update_case_study",
          module: "case_studies",
          details: { id: updated.id, title: updated.title, status: updated.status },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("PUT Case Study Error:", error);
      return res.status(500).json({ success: false, error: "Failed to update case study" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      if (!checkPermission(user, "case_studies", "delete")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot delete case studies" });
      }

      const existing = await prisma.caseStudy.findUnique({ where: { id: caseStudyId }, select: { id: true, title: true, createdById: true } });
      if (!existing) return res.status(404).json({ success: false, error: "Case study not found" });
      if (!canAccessRecord(user, "case_studies", existing.createdById)) {
        return res.status(403).json({ success: false, error: "Forbidden: You can only delete your own case studies" });
      }

      await prisma.caseStudy.delete({ where: { id: caseStudyId } });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "delete_case_study",
          module: "case_studies",
          details: { id: existing.id, title: existing.title },
          ipAddress: clientIp,
        },
      });

      return res.status(200).json({ success: true, message: "Case study deleted" });
    } catch (error) {
      console.error("DELETE Case Study Error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete case study" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
