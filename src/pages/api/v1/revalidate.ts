import type { NextApiRequest, NextApiResponse } from "next";
import { timingSafeEqual } from "crypto";
import { getAuthenticatedUser } from "@/lib/auth";

/** Constant-time comparison against REVALIDATION_SECRET (no built-in fallback). */
function validSecret(given: unknown): boolean {
  const expected = process.env.REVALIDATION_SECRET;
  if (!expected || typeof given !== "string" || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Rebuilds a cached public page.
 * Allowed for a signed-in CMS user (admin dashboard) or an external caller with REVALIDATION_SECRET.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = (req.body && typeof req.body === "object" ? req.body : {}) as Record<string, unknown>;
    const secret = body.secret ?? req.query.secret;
    const path = body.path ?? req.query.path;

    if (!validSecret(secret)) {
      const user = await getAuthenticatedUser(req);
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
    }

    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//") || path.length > 300) {
      return res.status(400).json({ success: false, error: "A site path starting with / is required" });
    }

    await res.revalidate(path);
    return res.status(200).json({ success: true, revalidated: true, path, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Revalidation Error:", error);
    return res.status(500).json({ success: false, error: "Error revalidating path" });
  }
}
