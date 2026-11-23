import type { IncomingMessage } from "http";
import type { NextApiRequest } from "next";
import { INITIAL_AUTHORIZED_IP } from "@/lib/ip-constants";

/**
 * Validates IPv4 or IPv6 without requiring Node.js 'net' module,
 * making it safe for both server and browser/edge contexts.
 * Returns 4 for IPv4, 6 for IPv6, 0 for invalid.
 */
export function isIP(str: string): 0 | 4 | 6 {
  if (!str || typeof str !== "string") return 0;
  const trimmed = str.trim();

  // IPv4 check
  const v4Parts = trimmed.split(".");
  if (v4Parts.length === 4) {
    for (const part of v4Parts) {
      if (!/^\d{1,3}$/.test(part)) return 0;
      const num = parseInt(part, 10);
      if (num < 0 || num > 255) return 0;
    }
    return 4;
  }

  // IPv6 check
  if (trimmed.includes(":")) {
    const unbracketed = trimmed.replace(/^\[|\]$/g, "");
    const doubleColonCount = (unbracketed.match(/::/g) || []).length;
    if (doubleColonCount > 1) return 0;

    const parts = unbracketed.split(":");
    if (doubleColonCount === 0 && parts.length !== 8) return 0;
    if (doubleColonCount === 1 && parts.length > 8) return 0;

    for (const part of parts) {
      if (part === "") continue; // allowed with ::
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return 0;
    }
    return 6;
  }

  return 0;
}

/**
 * Validates whether the given string is a valid IPv4 or IPv6 address.
 * Returns 4 for IPv4, 6 for IPv6, 0 for invalid.
 */
export function checkIpVersion(ip: string): 0 | 4 | 6 {
  if (!ip || typeof ip !== "string") return 0;
  const normalized = normalizeIp(ip);
  if (!normalized) return 0;
  return isIP(normalized);
}

/**
 * Normalizes an IPv4 address by removing leading zeros from octets.
 * e.g. "122.176.158.093" -> "122.176.158.93"
 */
function normalizeIPv4(ip: string): string {
  const parts = ip.split(".");
  if (parts.length !== 4) return ip;
  return parts.map((part) => parseInt(part, 10).toString()).join(".");
}

/**
 * Canonicalizes an IPv6 address:
 * - Expands into 8 groups of 16-bit integers
 * - Finds the longest consecutive run of zeros (minimum length 2) and compresses with "::"
 * - Returns lowercase string
 */
function normalizeIPv6(ip: string): string {
  const lower = ip.toLowerCase().trim();
  if (lower === "::") return "::";
  if (lower === "::1") return "::1";

  const doubleColonIndex = lower.indexOf("::");
  let segments: string[] = [];

  if (doubleColonIndex !== -1) {
    const leftStr = lower.slice(0, doubleColonIndex);
    const rightStr = lower.slice(doubleColonIndex + 2);
    const left = leftStr ? leftStr.split(":") : [];
    const right = rightStr ? rightStr.split(":") : [];
    const missing = 8 - (left.length + right.length);
    const zeros = new Array(Math.max(0, missing)).fill("0");
    segments = [...left, ...zeros, ...right];
  } else {
    segments = lower.split(":");
  }

  if (segments.length !== 8) return lower;

  const numbers = segments.map((s) => parseInt(s || "0", 16));

  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;

  for (let i = 0; i < 8; i++) {
    if (numbers[i] === 0) {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) {
        bestStart = curStart;
        bestLen = curLen;
      }
    } else {
      curStart = -1;
      curLen = 0;
    }
  }

  if (bestLen >= 2) {
    const left = numbers.slice(0, bestStart).map((n) => n.toString(16)).join(":");
    const right = numbers.slice(bestStart + bestLen).map((n) => n.toString(16)).join(":");
    return `${left}::${right}`;
  }

  return numbers.map((n) => n.toString(16)).join(":");
}

/**
 * Normalizes an IP address (IPv4 or IPv6) into a canonical format.
 * Returns null if the IP is invalid.
 */
export function normalizeIp(raw: string): string | null {
  if (!raw || typeof raw !== "string") return null;
  let ip = raw.trim();

  // Strip port if present for IPv4 (e.g. "122.176.158.93:8080")
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/.test(ip)) {
    ip = ip.split(":")[0];
  }

  // Strip brackets from bracketed IPv6 (e.g. "[2001:db8::1]:8080" or "[2001:db8::1]")
  if (ip.startsWith("[") && ip.includes("]")) {
    const match = ip.match(/^\[([a-fA-F0-9:]+)\](?::\d+)?$/);
    if (match) {
      ip = match[1];
    }
  }

  // Strip IPv4-mapped IPv6 prefix (e.g. "::ffff:122.176.158.93" -> "122.176.158.93")
  if (/^::ffff:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i.test(ip)) {
    ip = ip.replace(/^::ffff:/i, "");
  }

  // Handle leading zeros in IPv4 octets (e.g. "122.176.158.093")
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
    const candidate = normalizeIPv4(ip);
    if (isIP(candidate) === 4) {
      return candidate;
    }
  }

  const version = isIP(ip);
  if (version === 4) {
    return normalizeIPv4(ip);
  }
  if (version === 6) {
    return normalizeIPv6(ip);
  }
  return null;
}

/**
 * Determines whether an IP is loopback, private, link-local, CGNAT, or unspecified.
 */
export function isPrivateOrLoopbackIp(raw: string): boolean {
  if (!raw || typeof raw !== "string") return true;
  const ip = normalizeIp(raw);
  if (!ip) return true;

  if (ip === "::1" || ip === "::" || ip === "127.0.0.1" || ip.startsWith("127.")) {
    return true;
  }

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
  return true;
}

// In-memory cache for host machine public IP
let cachedHostPublicIp: string | null = null;
let lastHostIpFetchTime = 0;
const HOST_IP_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function getCachedHostPublicIp(): string | null {
  return cachedHostPublicIp;
}

export function setCachedHostPublicIp(ip: string): void {
  const normalized = normalizeIp(ip);
  if (normalized && !isPrivateOrLoopbackIp(normalized)) {
    cachedHostPublicIp = normalized;
    lastHostIpFetchTime = Date.now();
  }
}

/**
 * Fetches the host machine's public IP from external lookup services (ipify).
 * Safe against timeouts and network unavailability.
 */
export async function fetchHostPublicIp(timeoutMs = 2500): Promise<string | null> {
  if (cachedHostPublicIp && Date.now() - lastHostIpFetchTime < HOST_IP_CACHE_TTL) {
    return cachedHostPublicIp;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.ip === "string") {
        const normalized = normalizeIp(data.ip);
        if (normalized && !isPrivateOrLoopbackIp(normalized)) {
          setCachedHostPublicIp(normalized);
          return normalized;
        }
      }
    }
  } catch {
    // Network or timeout
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch("https://api64.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.ip === "string") {
        const normalized = normalizeIp(data.ip);
        if (normalized && !isPrivateOrLoopbackIp(normalized)) {
          setCachedHostPublicIp(normalized);
          return normalized;
        }
      }
    }
  } catch {
    // Network or timeout
  }

  return cachedHostPublicIp;
}

// Background warm-up when loaded on Node.js server
if (typeof window === "undefined") {
  fetchHostPublicIp(3000).catch(() => {});
}

/**
 * Parses client IP from cookie header.
 */
function getClientIpFromCookie(cookieHeader?: string | string[]): string | null {
  if (!cookieHeader) return null;
  const str = Array.isArray(cookieHeader) ? cookieHeader.join("; ") : cookieHeader;
  const match = str.match(/(?:^|;\s*)(?:admin_client_ip|client_ip|user_public_ip)=([^;]+)/i);
  if (match) {
    const raw = decodeURIComponent(match[1].trim());
    const normalized = normalizeIp(raw);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) {
      return normalized;
    }
  }
  return null;
}

/**
 * Extracts and normalizes the client IP from a NextApiRequest or standard IncomingMessage.
 * Accurately detects public IP from reverse proxy headers, client-reported headers/cookies,
 * and resolves host machine public IP during local/loopback access.
 */
export function extractClientIp(req: IncomingMessage | NextApiRequest): string {
  const headers = req.headers;

  // 1. Cloudflare / Enterprise headers
  const cfIp = headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim()) {
    const normalized = normalizeIp(cfIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const trueClientIp = headers["true-client-ip"];
  if (typeof trueClientIp === "string" && trueClientIp.trim()) {
    const normalized = normalizeIp(trueClientIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  // 2. Nginx / Standard reverse proxy headers
  const realIp = headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    const normalized = normalizeIp(realIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const xForwardedFor = headers["x-forwarded-for"];
  let firstForwardedIp: string | null = null;
  if (xForwardedFor) {
    const rawList = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    if (typeof rawList === "string") {
      const candidates = rawList.split(",").map((c) => c.trim()).filter(Boolean);
      for (const candidate of candidates) {
        const normalized = normalizeIp(candidate);
        if (normalized) {
          if (!firstForwardedIp) firstForwardedIp = normalized;
          // If this is a genuine public IP from a proxy/client, return it immediately
          if (!isPrivateOrLoopbackIp(normalized)) {
            return normalized;
          }
        }
      }
    }
  }

  // 3. Client-reported public IP headers (e.g. from browser frontend lookup)
  const clientPublicIp = headers["x-client-public-ip"] || headers["x-client-ip"] || headers["x-public-ip"];
  if (typeof clientPublicIp === "string" && clientPublicIp.trim()) {
    const normalized = normalizeIp(clientPublicIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) {
      return normalized;
    }
  }

  // 4. Client-reported cookie
  const cookieIp = getClientIpFromCookie(headers.cookie);
  if (cookieIp) {
    return cookieIp;
  }

  // 5. Socket remote address
  const socketIp = req.socket?.remoteAddress;
  let normalizedSocket: string | null = null;
  if (socketIp) {
    normalizedSocket = normalizeIp(socketIp);
    if (normalizedSocket && !isPrivateOrLoopbackIp(normalizedSocket)) {
      return normalizedSocket;
    }
  }

  // 6. Loopback / private address resolution:
  // When accessed via localhost / private connection, resolve to the host machine's public IP
  if (cachedHostPublicIp) {
    return cachedHostPublicIp;
  }

  const envIp = process.env.ADMIN_CLIENT_IP || process.env.NEXT_PUBLIC_ADMIN_IP;
  if (envIp && typeof envIp === "string") {
    const normalizedEnv = normalizeIp(envIp);
    if (normalizedEnv && !isPrivateOrLoopbackIp(normalizedEnv)) {
      setCachedHostPublicIp(normalizedEnv);
      return normalizedEnv;
    }
  }

  // In local development mode on loopback, default to INITIAL_AUTHORIZED_IP (122.176.158.93)
  if (process.env.NODE_ENV !== "production" || !process.env.NODE_ENV) {
    return INITIAL_AUTHORIZED_IP;
  }

  return firstForwardedIp || normalizedSocket || "127.0.0.1";
}

/**
 * Extracts client IP from a Web Request / NextRequest.
 */
export function extractClientIpFromWebRequest(request: Request & { ip?: string }): string {
  if (request.ip) {
    const normalized = normalizeIp(request.ip);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const headers = request.headers;

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) {
    const normalized = normalizeIp(cfIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp) {
    const normalized = normalizeIp(trueClientIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    const normalized = normalizeIp(realIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) return normalized;
  }

  const xForwardedFor = headers.get("x-forwarded-for");
  let firstForwardedIp: string | null = null;
  if (xForwardedFor) {
    const candidates = xForwardedFor.split(",").map((c) => c.trim()).filter(Boolean);
    for (const candidate of candidates) {
      const normalized = normalizeIp(candidate);
      if (normalized) {
        if (!firstForwardedIp) firstForwardedIp = normalized;
        if (!isPrivateOrLoopbackIp(normalized)) {
          return normalized;
        }
      }
    }
  }

  const clientPublicIp = headers.get("x-client-public-ip") || headers.get("x-client-ip") || headers.get("x-public-ip");
  if (clientPublicIp) {
    const normalized = normalizeIp(clientPublicIp);
    if (normalized && !isPrivateOrLoopbackIp(normalized)) {
      return normalized;
    }
  }

  const cookieHeader = headers.get("cookie");
  const cookieIp = getClientIpFromCookie(cookieHeader || undefined);
  if (cookieIp) {
    return cookieIp;
  }

  if (cachedHostPublicIp) {
    return cachedHostPublicIp;
  }

  const envIp = process.env.ADMIN_CLIENT_IP || process.env.NEXT_PUBLIC_ADMIN_IP;
  if (envIp && typeof envIp === "string") {
    const normalizedEnv = normalizeIp(envIp);
    if (normalizedEnv && !isPrivateOrLoopbackIp(normalizedEnv)) {
      setCachedHostPublicIp(normalizedEnv);
      return normalizedEnv;
    }
  }

  if (process.env.NODE_ENV !== "production" || !process.env.NODE_ENV) {
    return INITIAL_AUTHORIZED_IP;
  }

  return firstForwardedIp || "127.0.0.1";
}
