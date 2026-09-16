import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { status, search } = req.query;
      const where: any = {};

      if (status) {
        where.status = status;
      } else {
        const user = await getAuthenticatedUser(req);
        if (!user) where.status = "PUBLISHED";
      }

      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: "insensitive" } },
          { clientName: { contains: search as string, mode: "insensitive" } },
          { industry: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ success: true, data: caseStudies });
    } catch (error: any) {
      console.error("GET Case Studies Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const user = await getAuthenticatedUser(req);
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      if (!checkPermission(user, "case_studies", "create")) {
        return res.status(403).json({ success: false, error: "Forbidden: Cannot create case studies" });
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
        status = "DRAFT",
      } = req.body;

      if (!title || !slug || !clientName) {
        return res.status(400).json({ success: false, error: "Title, slug, and client name are required" });
      }

      const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      const caseStudy = await prisma.caseStudy.create({
        data: {
          title,
          slug: formattedSlug,
          clientName,
          industry: industry || "GENERAL",
          summary: summary || "",
          challenge: challenge || "",
          solution: solution || "",
          results: results || "",
          featuredImage: featuredImage || null,
          status,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
      });

      // Audit log
      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "create_case_study",
          module: "case_studies",
          details: { id: caseStudy.id, title: caseStudy.title },
          ipAddress: clientIp,
        },
      });

      return res.status(201).json({ success: true, data: caseStudy });
    } catch (error: any) {
      console.error("POST Case Study Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
