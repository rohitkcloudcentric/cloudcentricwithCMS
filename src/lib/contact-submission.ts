/**
 * Contact Us form submissions (server only for the guard; the validator is shared by the API).
 * Reading submissions is restricted to the Admin (full-access) role. It is deliberately not part
 * of the grantable permission catalog, so no other role can be given access from User Roles & RBAC.
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/rbac";

const clean = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Must be ${max} characters or fewer.`));

export const contactSubmissionSchema = z.object({
  name: clean(120).pipe(z.string().min(1, "Name is required.")),
  email: clean(254).pipe(z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address.")),
  phone: clean(30).refine((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }, "Please enter a valid phone number."),
  location: clean(200).optional().default(""),
  message: clean(5000).pipe(z.string().min(1, "Please describe your idea.")),
  referralSource: clean(100).optional().default(""),
  pageName: clean(200).optional().default(""),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

/** Resolves the signed-in Admin or sends 401/403 and returns null. */
export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return null;
  }
  if (!hasFullAccess(user)) {
    res.status(403).json({ success: false, error: "Forbidden: Admin access required" });
    return null;
  }
  return user;
}
