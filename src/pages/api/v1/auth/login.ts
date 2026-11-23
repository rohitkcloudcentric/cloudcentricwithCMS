import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { hashPassword, verifyPassword, signToken, setTokenCookie } from "@/lib/auth";
import { getClientIp, isRateLimited } from "@/lib/newsletter";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

/** Same message for unknown email, wrong password and disabled account (no account enumeration). */
const INVALID = "Invalid email or password, or the account is disabled.";

/** Compared against when the email doesn't exist, so response time doesn't reveal valid emails. */
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword(randomBytes(24).toString("hex")));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enforce IP Access Control before processing any login request
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }
    if (email.length > 254 || password.length > 200) {
      return res.status(400).json({ success: false, error: INVALID });
    }

    // Brute-force protection: per IP and per account
    const ip = getClientIp(req);
    if (isRateLimited(`login-ip:${ip}`, 20, 15 * 60 * 1000) || isRateLimited(`login-email:${email}`, 10, 15 * 60 * 1000)) {
      return res.status(429).json({ success: false, error: "Too many login attempts. Please try again in 15 minutes." });
    }

    // Credentials are validated only against the database (bcrypt hash in User.passwordHash)
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    const isMatch = await verifyPassword(password, user?.passwordHash || (await getDummyHash()));
    if (!user || !user.isActive || !isMatch) {
      return res.status(401).json({ success: false, error: INVALID });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    setTokenCookie(res, token);

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "login",
        module: "auth",
        details: { email: user.email, role: user.role.name },
        ipAddress: ip,
      },
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
