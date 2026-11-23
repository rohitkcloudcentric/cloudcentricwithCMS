import type { NextApiRequest, NextApiResponse } from "next";
import { extractClientIp, normalizeIp, checkIpVersion } from "@/lib/ip-utils";
import { checkAdminIpAccess } from "@/lib/admin-ip-guard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Prevent any browser caching for IP check
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    let clientIp = extractClientIp(req);

    // If query provides a candidate IP (e.g. from client-side public lookup), validate and check it
    const queryIp = req.query.ip;
    if (typeof queryIp === "string" && queryIp.trim()) {
      const normalizedCandidate = normalizeIp(queryIp);
      if (normalizedCandidate && checkIpVersion(normalizedCandidate) !== 0) {
        // Allow client to query its self-detected public IP
        clientIp = normalizedCandidate;
      }
    }

    const check = await checkAdminIpAccess(clientIp);

    return res.status(200).json({
      success: true,
      allowed: check.allowed,
      status: check.status,
      clientIp: check.clientIp || clientIp,
      reason: check.reason || null,
    });
  } catch (error) {
    console.error("Error checking IP access:", error);
    return res.status(500).json({
      success: false,
      allowed: false,
      status: "unregistered",
      error: "Internal security check error",
    });
  }
}
