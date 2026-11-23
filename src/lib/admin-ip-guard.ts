import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { extractClientIp, normalizeIp } from "@/lib/ip-utils";
import { ACCESS_DENIED_MESSAGE, LOCKOUT_ERROR_MESSAGE } from "@/lib/ip-constants";

export { ACCESS_DENIED_MESSAGE, LOCKOUT_ERROR_MESSAGE };

export interface IpCheckResult {
  allowed: boolean;
  status: "allowed" | "blocked" | "unregistered";
  clientIp: string;
  reason?: string;
}

export function invalidateAdminIpCache() {
  // Direct DB query ensures immediate real-time effect across all workers
}

/**
 * Checks whether an IP address is authorized to access the Admin Panel.
 * Only IP addresses explicitly present in `admin_ip_addresses` with status='allowed' are permitted.
 * Blocked and unregistered IP addresses are denied.
 */
export async function checkAdminIpAccess(rawIp: string): Promise<IpCheckResult> {
  const normalized = normalizeIp(rawIp) || rawIp.trim();

  try {
    const record = await prisma.adminIpAddress.findUnique({
      where: { ipAddress: normalized },
    });

    let status: "allowed" | "blocked" | "unregistered" = "unregistered";
    let reason = "Your IP address is not registered in the Admin Panel access list.";

    if (record) {
      if (record.status.toLowerCase() === "allowed") {
        status = "allowed";
        reason = "";
      } else {
        status = "blocked";
        reason = "Your IP address is explicitly blocked from accessing the Admin Panel.";
      }
    }

    return {
      allowed: status === "allowed",
      status,
      clientIp: normalized,
      reason: status === "allowed" ? undefined : reason,
    };
  } catch (err) {
    console.error("Database error while checking admin IP access:", err);
    // On DB error, fall back to denying access for security
    return {
      allowed: false,
      status: "unregistered",
      clientIp: normalized,
      reason: "Security check failed. Please verify database connectivity.",
    };
  }
}

/**
 * Lockout prevention rule:
 * Always maintain at least one active and authorized IP address in the Allowed IP Address list.
 * Throws an error with the exact required message if an operation would leave 0 allowed IPs.
 */
export async function assertCannotLockout(targetRecordId: string): Promise<void> {
  const otherAllowedCount = await prisma.adminIpAddress.count({
    where: {
      status: "allowed",
      id: { not: targetRecordId },
    },
  });

  if (otherAllowedCount < 1) {
    throw new Error(LOCKOUT_ERROR_MESSAGE);
  }
}

/**
 * Log IP management activities to the standard AuditLog table.
 */
export async function logIpManagementActivity({
  userId,
  action,
  ipAddress,
  previousStatus,
  newStatus,
  description,
  clientIp,
}: {
  userId?: string | null;
  action: "create" | "update" | "allow" | "block" | "delete";
  ipAddress: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  description?: string | null;
  clientIp?: string | null;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        module: "ip_management",
        action,
        details: {
          ipAddress,
          previousStatus: previousStatus || null,
          newStatus: newStatus || null,
          description: description || null,
        },
        ipAddress: clientIp || null,
      },
    });
  } catch (error) {
    console.error("Failed to write IP management audit log:", error);
  }
}

/**
 * Renders a full HTML 403 page for browser requests to admin pages.
 */
export function renderAccessDeniedHtml(clientIp: string, reason?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>403 Access Denied | CloudCentric CMS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #050505;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .orb {
      position: absolute;
      border-radius: 9999px;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
    }
    .orb-1 {
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%);
    }
    .card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 520px;
      background: #0e0e12;
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 0 50px rgba(239, 68, 68, 0.1);
      text-align: center;
    }
    .icon-container {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem;
      border-radius: 20px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #f87171;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    p.message {
      font-size: 0.95rem;
      color: #a1a1aa;
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }
    .ip-box {
      background: #14141a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    .ip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      padding: 0.25rem 0;
    }
    .ip-label {
      color: #71717a;
    }
    .ip-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #e4e4e7;
      font-weight: 600;
    }
    .status-blocked {
      color: #ef4444;
      font-weight: 600;
    }
    .note {
      font-size: 0.8rem;
      color: #71717a;
      line-height: 1.4;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="orb orb-1"></div>
  <div class="card">
    <div class="icon-container">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <div class="badge">403 Forbidden</div>
    <h1>${ACCESS_DENIED_MESSAGE}</h1>
    <p class="message">
      This administrative console is restricted to authorized IP addresses only.
      Your connection attempt has been logged for security auditing.
    </p>
    <div class="ip-box">
      <div class="ip-row">
        <span class="ip-label">Detected Client IP:</span>
        <span class="ip-value">${clientIp}</span>
      </div>
      <div class="ip-row">
        <span class="ip-label">Access Status:</span>
        <span class="status-blocked">Unauthorized / Blocked</span>
      </div>
      ${reason ? `<div class="ip-row"><span class="ip-label">Detail:</span><span class="ip-value" style="font-size: 0.75rem;">${reason}</span></div>` : ""}
    </div>
    <p class="note">
      If you believe this is in error, please contact your Super Administrator to have your IP address added to the authorized access list.
    </p>
  </div>
</body>
</html>`;
}

/**
 * Middleware helper for NextApiRequest:
 * Verifies admin IP access. Returns true if allowed.
 * If denied, writes HTTP 403 response and returns false.
 */
export async function verifyAdminApiIpAccess(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  const clientIp = extractClientIp(req);
  const result = await checkAdminIpAccess(clientIp);

  if (!result.allowed) {
    res.status(403).json({
      success: false,
      error: ACCESS_DENIED_MESSAGE,
      clientIp,
      reason: result.reason,
    });
    return false;
  }

  return true;
}
