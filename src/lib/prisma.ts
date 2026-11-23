import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const createClient = (): PrismaClient => {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({ log: ["error"] });
  }

  try {
    const prismaClientPath = require.resolve("@prisma/client");
    delete require.cache[prismaClientPath];
  } catch {}

  const { PrismaClient: FreshClient } = require("@prisma/client");
  return new FreshClient({
    log: ["query", "error", "warn"],
  });
};

/**
 * In development the client is cached on `global` so hot reloads don't open new connections.
 * After a schema change (`prisma generate`), that cached instance predates the new models
 * (e.g. `prisma.smtpSetting` is undefined) and every query on them fails with a 500.
 * Detect that and replace the stale instance.
 */
function isStale(client: PrismaClient): boolean {
  if (!client) return true;
  return Object.values(Prisma.ModelName).some((model) => {
    const delegate = model.charAt(0).toLowerCase() + model.slice(1);
    return !(delegate in client) || (client as any)[delegate] === undefined;
  });
}

function getClient(requiredProp?: string | symbol): PrismaClient {
  let cached = globalForPrisma.prisma;
  const isMissingProp =
    typeof requiredProp === "string" &&
    !requiredProp.startsWith("$") &&
    !requiredProp.startsWith("_") &&
    (!cached || (cached as any)[requiredProp] === undefined);

  if (!cached || isStale(cached) || isMissingProp) {
    if (cached) {
      console.warn("[prisma] Cached client is out of date with the schema; refreshing PrismaClient instance.");
      cached.$disconnect().catch(() => {});
    }
    cached = createClient();
    globalForPrisma.prisma = cached;
  }
  return cached;
}

/**
 * Dynamic Proxy export: ensures that all property accesses (e.g. prisma.smtpSetting, prisma.user)
 * resolve through getClient(), dynamically detecting and regenerating any stale client instances
 * during development hot reloads.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient(prop);
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
