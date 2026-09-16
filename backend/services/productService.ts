import prisma from "../lib/prisma";

export class ProductService {
  static async getProducts(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    return await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async getByIdOrSlug(identifier: string) {
    return await prisma.product.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
    });
  }

  static async createProduct(data: any) {
    const formattedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    return await prisma.product.create({
      data: {
        title: data.title,
        slug: formattedSlug,
        description: data.description || "",
        badge: data.badge || null,
        logoUrl: data.logoUrl || null,
        features: data.features || [],
        appExchange: data.appExchange || null,
        websiteUrl: data.websiteUrl || null,
      },
    });
  }

  static async updateProduct(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.slug) {
      updateData.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }
    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteProduct(id: string) {
    return await prisma.product.delete({ where: { id } });
  }
}
