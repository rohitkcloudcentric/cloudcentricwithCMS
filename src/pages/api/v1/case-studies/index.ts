import type { NextApiRequest, NextApiResponse } from "next";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission, ownedRecordsFilter } from "@/lib/rbac";
import { caseStudyAdminInclude, parseCaseStudyBody } from "@/lib/case-study-input";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { status, search } = req.query;
      const user = await getAuthenticatedUser(req);
      const where: Prisma.CaseStudyWhereInput = {};

      // Public callers (and users without case_studies:view) only ever see published case studies
      if (!user || !checkPermission(user, "case_studies", "read")) {
        where.status = "PUBLISHED";
      } else {
        if (typeof status === "string" && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
          where.status = status as Prisma.EnumContentStatusFilter["equals"];
        }
        // Without "manage" a user only sees the case studies they created
        Object.assign(where, ownedRecordsFilter(user, "case_studies", "createdById"));
      }

      if (typeof search === "string" && search.trim()) {
        const q = search.trim();
        where.OR = [
          { title: { contains: q, mode: "insensitive" } },
          { clientName: { contains: q, mode: "insensitive" } },
          { industry: { contains: q, mode: "insensitive" } },
        ];
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        include: caseStudyAdminInclude,
        orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      });

      return res.status(200).json({ success: true, data: caseStudies });
    } catch (error) {
      console.error("GET Case Studies Error:", error);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "case_studies", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create case studies" });
      }

      const parsed = await parseCaseStudyBody(req.body, true);
      if (parsed.errors.length) {
        return res.status(400).json({ success: false, error: parsed.errors.join(". ") });
      }

      const status = parsed.status ?? "DRAFT";
      if (status === "PUBLISHED" && !checkPermission(user, "case_studies", "publish")) {
        return res.status(403).json({ success: false, error: "Forbidden: You cannot publish case studies" });
      }

      const slug = parsed.data.slug as string;
      const existing = await prisma.caseStudy.findUnique({ where: { slug }, select: { id: true } });
      if (existing) {
        return res.status(400).json({ success: false, error: "A case study with this slug already exists" });
      }

      const fields = parsed.data as Partial<Prisma.CaseStudyUncheckedCreateInput>;
      const caseStudy = await prisma.caseStudy.create({
        data: {
          ...fields,
          // Required text columns default to empty
          industry: fields.industry || "GENERAL",
          summary: fields.summary ?? "",
          challenge: fields.challenge ?? "",
          solution: fields.solution ?? "",
          results: fields.results ?? "",
          title: parsed.data.title as string,
          slug,
          clientName: parsed.data.clientName as string,
          createdById: user.id,
          status,
          publishedAt: parsed.publishedAt ?? (status === "PUBLISHED" ? new Date() : null),
          categoryId: parsed.categoryId ?? null,
          ...(parsed.tagIds?.length
            ? { tags: { create: parsed.tagIds.map((tagId) => ({ tagId })) } }
            : {}),
        },
        include: caseStudyAdminInclude,
      });

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "create_case_study",
          module: "case_studies",
          details: { id: caseStudy.id, title: caseStudy.title, status: caseStudy.status },
          ipAddress: clientIp,
        },
      });

      return res.status(201).json({ success: true, data: caseStudy });
    } catch (error) {
      console.error("POST Case Study Error:", error);
      return res.status(500).json({ success: false, error: "Failed to create case study" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
