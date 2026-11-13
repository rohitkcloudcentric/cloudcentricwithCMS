/**
 * One-off migration: moves the clients and categories that used to be hardcoded in
 * src/components/our-clients/OurClientsHero.tsx into the CMS database.
 * Safe to re-run: existing categories/clients (matched by name) are left untouched.
 *
 * Run: npx tsx prisma/seed-clients.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (v: string) => v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const CATEGORIES = [
  "Real Estate",
  "IT & Services",
  "Agriculture",
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Education",
  "Travel & Hospitality",
  "Utilities",
  "Professional Services",
  "Retail & Consumer Goods",
  "Automotives",
  "Media & Entertainment",
  "High Tech",
  "Food & Beverage",
  "Non Profit",
];

const CLIENTS: { name: string; logoUrl: string; category: string }[] = [
  { name: "GTC Marketing", logoUrl: "/images/our-clients-1/gtcsvg.svg", category: "Professional Services" },
  { name: "SparkTG", logoUrl: "/images/our-clients-1/sparktg.svg", category: "IT & Services" },
  { name: "Fellowship Travel & Tours", logoUrl: "/images/our-clients-1/fellowship.svg", category: "Travel & Hospitality" },
  { name: "Abhushan", logoUrl: "/images/our-clients-1/abhushan.svg", category: "Retail & Consumer Goods" },
  { name: "Magic Billion", logoUrl: "/images/our-clients-1/magic-billion.svg", category: "Professional Services" },
  { name: "Preferred Square", logoUrl: "/images/our-clients-1/prefrred.svg", category: "Real Estate" },
  { name: "BIMTECH", logoUrl: "/images/our-clients-1/bimtech.svg", category: "Education" },
  { name: "Intuit Lab", logoUrl: "/images/our-clients-1/intuit-lab.svg", category: "High Tech" },
  { name: "CU Online", logoUrl: "/images/our-clients-1/cu-online.svg", category: "Education" },
  { name: "ALLEN", logoUrl: "/images/our-clients-1/allen.svg", category: "Education" },
  { name: "Footprints", logoUrl: "/images/our-clients-1/footprints.svg", category: "Education" },
  { name: "Maplebear", logoUrl: "/images/our-clients-1/maplebear.svg", category: "Food & Beverage" },
  { name: "Adventus.io", logoUrl: "/images/our-clients-1/adventus.svg", category: "IT & Services" },
  { name: "New Light Institute", logoUrl: "/images/our-clients-1/new-light-institute.svg", category: "Education" },
  { name: "Bhagwati", logoUrl: "/images/our-clients-1/bhagwati.svg", category: "Manufacturing" },
  { name: "Adle Broswon Group", logoUrl: "/images/our-clients-1/adle-broswon.svg", category: "Professional Services" },
  { name: "Asees", logoUrl: "/images/our-clients-1/asees.svg", category: "Non Profit" },
  { name: "Genus", logoUrl: "/images/our-clients-1/genus.svg", category: "Utilities" },
  { name: "ED Camp", logoUrl: "/images/our-clients-1/ed-camp.svg", category: "Education" },
  { name: "TechnoStruct", logoUrl: "/images/our-clients-1/technostruct.svg", category: "IT & Services" },
];

async function main() {
  const categoryIds = new Map<string, string>();
  let createdCats = 0;
  for (const [i, name] of CATEGORIES.entries()) {
    const existing = await prisma.clientCategory.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
    if (existing) {
      categoryIds.set(name, existing.id);
      continue;
    }
    const cat = await prisma.clientCategory.create({ data: { name, slug: slugify(name), displayOrder: i + 1 } });
    categoryIds.set(name, cat.id);
    createdCats++;
  }

  let createdClients = 0;
  for (const [i, c] of CLIENTS.entries()) {
    const existing = await prisma.client.findFirst({ where: { name: { equals: c.name, mode: "insensitive" } } });
    if (existing) continue;
    await prisma.client.create({
      data: {
        name: c.name,
        logoUrl: c.logoUrl,
        logoAlt: `${c.name} logo`,
        categoryId: categoryIds.get(c.category) ?? null,
        displayOrder: i + 1,
        isActive: true,
      },
    });
    createdClients++;
  }

  console.log(`categories created: ${createdCats} (total ${await prisma.clientCategory.count()})`);
  console.log(`clients created: ${createdClients} (total ${await prisma.client.count()})`);
}

main()
  .catch((e) => {
    console.error("SEED FAILED:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
