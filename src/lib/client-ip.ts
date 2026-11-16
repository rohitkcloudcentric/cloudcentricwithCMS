/**
 * Visitor IP resolution for public forms (server only).
 *
 * In production the proxy sends the real public IP in x-forwarded-for, so that is used.
 * When the server only sees a loopback/private address (local development, or a proxy that
 * doesn't forward the header) it falls back to the public IP the browser reported, so
 * records always hold an address like "14.97.135.226" instead of "::1".
 */
import { isIP } from "net";
import type { NextApiRequest } from "next";
import { getClientIp } from "@/lib/newsletter";

/** Strips IPv4-mapped IPv6 prefixes ("::ffff:1.2.3.4" -> "1.2.3.4"). */
const normalize = (ip: string) => ip.trim().replace(/^::ffff:/i, "");

/** Loopback, private, link-local, CGNAT and unspecified ranges. */
export function isPrivateIp(raw: string): boolean {
  const ip = normalize(raw);
  const v = isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    return lower === "::" || lower === "::1" || /^f[cd]/.test(lower) || /^fe[89ab]/.test(lower);
  }
  return true; // not an IP at all ("unknown")
}

/** A syntactically valid, public IPv4/IPv6 address, normalized; otherwise null. */
export function publicIpOrNull(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 64) return null;
  const ip = normalize(value);
  return isIP(ip) && !isPrivateIp(ip) ? ip : null;
}

/** Best public IP for this request: the network address if public, else the browser-reported one. */
export function resolveVisitorIp(req: NextApiRequest, reportedIp?: unknown): string {
  const networkIp = normalize(getClientIp(req));
  if (!isPrivateIp(networkIp)) return networkIp;
  return publicIpOrNull(reportedIp) ?? networkIp;
}
