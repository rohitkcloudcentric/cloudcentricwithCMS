/**
 * Seeds Contact Settings with the details that used to be hardcoded in the website.
 * Idempotent: a table is only filled when it is empty. Run: npx tsx prisma/seed-contact-settings.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const digits = (cc: string, n: string) => `${cc}${n}`.replace(/\D/g, "");

async function main() {
  if ((await prisma.officeAddress.count()) === 0) {
    await prisma.officeAddress.createMany({
      data: [
        { location: "India", address: "H-146 & 147, H Block, Sector 63, Noida, Uttar Pradesh 201301.", displayOrder: 1 },
        { location: "USA", address: "8357 Emerald Winds Cir, Boynton Beach, FL 33473 United States.", displayOrder: 2 },
      ],
    });
    console.log("✅ Office addresses seeded");
  }

  if ((await prisma.contactPhone.count()) === 0) {
    const phones = [
      // Footer / Contact Us page numbers (active)
      { countryCode: "+91", number: "9971126721", displayOrder: 1, isActive: true },
      { countryCode: "+1", number: "5615047778", displayOrder: 2, isActive: true },
      // Numbers previously shown only in the "Ready to build" contact strip (kept, inactive)
      { countryCode: "+91", number: "7042912244", displayOrder: 3, isActive: false },
      { countryCode: "+1", number: "3024060272", displayOrder: 4, isActive: false },
      { countryCode: "+44", number: "7842243933", displayOrder: 5, isActive: false },
    ];
    await prisma.contactPhone.createMany({ data: phones.map((p) => ({ ...p, digits: digits(p.countryCode, p.number) })) });
    console.log("✅ Contact numbers seeded");
  }

  if ((await prisma.contactEmail.count()) === 0) {
    await prisma.contactEmail.createMany({
      data: [
        { email: "sales@cccinfotech.com", type: "Sales", displayOrder: 1 },
        { email: "support@cccinfotech.com", type: "Support", displayOrder: 2 },
      ],
    });
    console.log("✅ Email addresses seeded");
  }

  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: "facebook", name: "Facebook", url: "https://www.facebook.com/cloudcentricinfotech/", displayOrder: 1 },
        { platform: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/company/cccinfotech/", displayOrder: 2 },
        { platform: "x", name: "X (Twitter)", url: "https://x.com/CCCInfotech", displayOrder: 3 },
        { platform: "instagram", name: "Instagram", url: "https://www.instagram.com/cccinfotech/", displayOrder: 4 },
        { platform: "youtube", name: "YouTube", url: "https://www.youtube.com/channel/UC21Gs_6xh8PF1nc8-XIyHJg", displayOrder: 5 },
      ],
    });
    console.log("✅ Social media links seeded");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
