/**
 * One-time, idempotent RBAC data migration. Run with: npx tsx prisma/rbac-migrate.ts
 *  1. Marks the existing "Super Admin" role as fullAccess (only if no role has it yet).
 *  2. Creates any missing catalog permissions (clients, newsletter, manage, ...).
 *  3. Assigns owner-less case studies / products / clients to the first full-access user.
 */
import { PrismaClient } from "@prisma/client";
import { PERMISSION_CATALOG, ACTION_LABELS } from "../src/lib/permission-catalog";

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.role.count({ where: { fullAccess: true } })) === 0) {
    const r = await prisma.role.updateMany({ where: { name: "Super Admin" }, data: { fullAccess: true } });
    console.log(`fullAccess set on ${r.count} role(s)`);
  }

  const data = PERMISSION_CATALOG.flatMap((m) =>
    m.actions.map((a) => ({ module: m.module, action: a, description: `${ACTION_LABELS[a]} ${m.label}` }))
  );
  const created = await prisma.permission.createMany({ data, skipDuplicates: true });
  console.log(`permissions created: ${created.count}`);

  const owner = await prisma.user.findFirst({ where: { role: { fullAccess: true } }, orderBy: { createdAt: "asc" } });
  if (owner) {
    const [cs, p, c] = await Promise.all([
      prisma.caseStudy.updateMany({ where: { createdById: null }, data: { createdById: owner.id } }),
      prisma.product.updateMany({ where: { createdById: null }, data: { createdById: owner.id } }),
      prisma.client.updateMany({ where: { createdById: null }, data: { createdById: owner.id } }),
    ]);
    console.log(`owners backfilled: caseStudies=${cs.count} products=${p.count} clients=${c.count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
