import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const createClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

/**
 * In development the client is cached on `global` so hot reloads don't open new connections.
 * After a schema change (`prisma generate`), that cached instance predates the new models
 * (e.g. `prisma.caseStudyCategory` is undefined) and every query on them fails with a 500.
 * Detect that and replace the stale instance.
 */
function isStale(client: PrismaClient): boolean {
  return Object.values(Prisma.ModelName).some((model) => {
    const delegate = model.charAt(0).toLowerCase() + model.slice(1);
    return !(delegate in client);
  });
}

function getClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && !isStale(cached)) return cached;
  if (cached) {
    console.warn("[prisma] Cached client is out of date with the schema; creating a new one.");
    cached.$disconnect().catch(() => {});
  }
  return createClient();
}

export const prisma = getClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
