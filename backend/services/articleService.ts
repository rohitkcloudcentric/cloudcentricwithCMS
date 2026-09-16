import prisma from "../lib/prisma";
import { ContentStatus } from "@prisma/client";

export class ArticleService {
  static async getArticles(params: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, category, search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status as ContentStatus;
    }

    if (category && category !== "All") {
      where.category = {
        name: {
          equals: category,
          mode: "insensitive",
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.blogArticle.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogArticle.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getArticleByIdOrSlug(identifier: string) {
    return await prisma.blogArticle.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });
  }

  static async createArticle(data: any, authorId: string) {
    const formattedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return await prisma.blogArticle.create({
      data: {
        title: data.title,
        slug: formattedSlug,
        excerpt: data.excerpt || null,
        contentHtml: data.contentHtml || "",
        featuredImage: data.featuredImage || null,
        readTime: data.readTime || "5 MIN READ",
        status: data.status || ContentStatus.DRAFT,
        publishedAt: data.status === ContentStatus.PUBLISHED ? new Date() : null,
        authorId,
        categoryId: data.categoryId || null,
        seoTitle: data.seoTitle || data.title,
        seoDescription: data.seoDescription || data.excerpt,
      },
      include: {
        category: true,
        author: { select: { id: true, name: true } },
      },
    });
  }

  static async updateArticle(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.slug) {
      updateData.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    return await prisma.blogArticle.update({
      where: { id },
      data: updateData,
      include: { category: true, author: { select: { id: true, name: true } } },
    });
  }

  static async deleteArticle(id: string) {
    return await prisma.blogArticle.delete({ where: { id } });
  }
}
