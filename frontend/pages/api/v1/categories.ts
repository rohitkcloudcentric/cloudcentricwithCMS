import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      let categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      // Seed default categories if none exist in DB
      if (categories.length === 0) {
        const defaults = [
          { name: "AI & Automation", slug: "ai-automation" },
          { name: "Digital Transformation", slug: "digital-transformation" },
          { name: "Technology", slug: "technology" },
          { name: "Salesforce", slug: "salesforce" },
          { name: "Cloud Services", slug: "cloud-services" },
        ];

        for (const cat of defaults) {
          await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
          });
        }

        categories = await prisma.category.findMany({
          orderBy: { name: "asc" },
        });
      }

      return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      console.error("GET Categories Error:", error);
      return res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
