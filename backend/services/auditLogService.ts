import prisma from "../lib/prisma";

export class AuditLogService {
  static async logAction(params: {
    userId?: string;
    action: string;
    module: string;
    details?: any;
    ipAddress?: string;
  }) {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        module: params.module,
        details: params.details || null,
        ipAddress: params.ipAddress || "127.0.0.1",
      },
    });
  }

  static async getLogs(limit = 100) {
    return await prisma.auditLog.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
