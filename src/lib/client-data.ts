/** Server-only loader for the public Our Clients section. Import only from getServerSideProps. */
import prisma from "@/lib/prisma";

export interface PublicClient {
  id: string;
  name: string;
  /** Logo image path/URL */
  src: string;
  alt: string;
  /** Category name ("" when uncategorized) */
  category: string;
  websiteUrl: string | null;
  description: string | null;
}

export interface OurClientsData {
  clients: PublicClient[];
  /** All client categories, in admin-defined order */
  categories: string[];
}

export async function getOurClientsData(): Promise<OurClientsData> {
  try {
    const [rows, cats] = await Promise.all([
      prisma.client.findMany({
        where: { isActive: true },
        include: { category: { select: { name: true } } },
        // Featured first, then admin display order
        orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { name: "asc" }],
      }),
      prisma.clientCategory.findMany({ orderBy: [{ displayOrder: "asc" }, { name: "asc" }], select: { name: true } }),
    ]);

    return {
      clients: rows.map((c) => ({
        id: c.id,
        name: c.name,
        src: c.logoUrl,
        alt: c.logoAlt || `${c.name} logo`,
        category: c.category?.name || "",
        websiteUrl: c.websiteUrl,
        description: c.description,
      })),
      categories: cats.map((c) => c.name),
    };
  } catch (error) {
    console.error("Failed to load Our Clients data:", error);
    return { clients: [], categories: [] };
  }
}
