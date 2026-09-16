import prisma from "../lib/prisma";
import { hashPassword } from "../lib/auth";

export class UserService {
  static async getUsers() {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
    const roles = await prisma.role.findMany();

    const sanitized = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isActive: u.isActive,
      role: u.role.name,
      roleId: u.roleId,
      createdAt: u.createdAt,
    }));

    return { users: sanitized, roles };
  }

  static async createUser(data: { name: string; email: string; password: string; roleId: string }) {
    const passwordHash = await hashPassword(data.password);
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        roleId: data.roleId,
        isActive: true,
      },
      include: { role: true },
    });
  }
}
