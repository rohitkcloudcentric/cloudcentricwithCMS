import prisma from "../src/lib/prisma";

export const INITIAL_AUTHORIZED_IP = "122.176.158.93";

export async function seedInitialAdminIp() {
  const superAdmin = await prisma.user.findFirst({
    where: { role: { fullAccess: true } },
    orderBy: { createdAt: "asc" },
  });

  const existing = await prisma.adminIpAddress.findUnique({
    where: { ipAddress: INITIAL_AUTHORIZED_IP },
  });

  if (!existing) {
    const created = await prisma.adminIpAddress.create({
      data: {
        ipAddress: INITIAL_AUTHORIZED_IP,
        status: "allowed",
        description: "Initial Authorized Administrator IP",
        createdById: superAdmin?.id || null,
      },
    });
    console.log(`✅ Seeded initial authorized IP address: ${created.ipAddress} (${created.status})`);
  } else {
    // Ensure initial IP is active and allowed
    if (existing.status !== "allowed") {
      await prisma.adminIpAddress.update({
        where: { id: existing.id },
        data: { status: "allowed" },
      });
      console.log(`✅ Restored initial IP address status to allowed: ${existing.ipAddress}`);
    } else {
      console.log(`ℹ️ Initial authorized IP address already present: ${existing.ipAddress}`);
    }
  }
}

async function main() {
  await seedInitialAdminIp();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("Error seeding initial IP:", e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
