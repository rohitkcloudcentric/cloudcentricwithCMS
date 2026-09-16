import prisma from "../lib/prisma";
import { ContentStatus } from "@prisma/client";

export class CaseStudyService {
  static async getCaseStudies(params: { status?: string; search?: string }) {
    const { status, search } = params;
    const where: any = {};

    if (status) {
      where.status = status as ContentStatus;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    return await prisma.caseStudy.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async getByIdOrSlug(identifier: string) {
    return await prisma.caseStudy.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
    });
  }

  static async createCaseStudy(data: any) {
    const formattedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return await prisma.caseStudy.create({
      data: {
        title: data.title,
        slug: formattedSlug,
        clientName: data.clientName,
        industry: data.industry || "GENERAL",
        summary: data.summary || "",
        challenge: data.challenge || "",
        solution: data.solution || "",
        results: data.results || "",
        featuredImage: data.featuredImage || null,
        status: data.status || ContentStatus.DRAFT,
        publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  static async updateCaseStudy(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.slug) {
      updateData.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    return await prisma.caseStudy.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteCaseStudy(id: string) {
    return await prisma.caseStudy.delete({ where: { id } });
  }
}
