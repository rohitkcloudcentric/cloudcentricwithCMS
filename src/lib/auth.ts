import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";

export const TOKEN_NAME = "cc_cms_token";

/**
 * Session signing key. Must come from the environment (JWT_SECRET); there is deliberately no
 * built-in fallback, because a key that ships in the source code lets anyone forge admin sessions.
 */
export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or too short (min 32 characters). Set it in .env.");
  }
  return secret;
}

/** bcrypt work factor for new hashes (existing hashes with a lower factor still verify). */
const BCRYPT_ROUNDS = 12;

export interface TokenPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d", algorithm: "HS256" });
}

export function verifyToken(token: string): TokenPayload | null {
  const secret = jwtSecret();
  try {
    return jwt.verify(token, secret, { algorithms: ["HS256"] }) as TokenPayload;
  } catch {
    return null;
  }
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookieOptions = [
    `${TOKEN_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}

export function removeTokenCookie(res: NextApiResponse) {
  const cookieOptions = [
    `${TOKEN_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  // Check Cookie header first
  if (req.cookies && req.cookies[TOKEN_NAME]) {
    return req.cookies[TOKEN_NAME];
  }

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

export async function getAuthenticatedUser(req: NextApiRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) return null;

  return user;
}
