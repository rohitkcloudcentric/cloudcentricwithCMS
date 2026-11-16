/**
 * Server-only SMTP mailer (Nodemailer). Credentials come exclusively from env vars:
 * MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_ENCRYPTION, MAIL_FROM_ADDRESS, MAIL_FROM_NAME.
 */
import { lookup } from "dns/promises";
import nodemailer, { type Transporter } from "nodemailer";

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export type MailResult = { ok: true; messageId: string } | { ok: false; error: string };


/** Turns low-level SMTP/network errors into an actionable message for the admin panel and logs. */
function describeSmtpError(err: unknown, host?: string, port?: number): string {
  const e = (err ?? {}) as { code?: string; responseCode?: number; message?: string; command?: string };
  const raw = e.message || String(err);
  const where = `${host}:${port}`;

  if (e.code === "ETIMEDOUT" || e.code === "ECONNRESET" || e.code === "ECONNREFUSED" || e.code === "ESOCKET" || e.code === "EDNS") {
    return `Cannot reach the SMTP server ${where} (${e.code}: ${raw}). Outgoing SMTP is likely blocked by this network or firewall; check that port ${port} is open from the server.`;
  }
  if (e.code === "EAUTH" || e.responseCode === 535) {
    return `SMTP login rejected for ${where} (${raw}). Check MAIL_USERNAME/MAIL_PASSWORD, and that SMTP AUTH is enabled for this mailbox in Microsoft 365.`;
  }
  if (e.responseCode === 550 || e.responseCode === 554) {
    return `SMTP server refused the message (${e.responseCode}: ${raw}). Check that MAIL_FROM_ADDRESS is allowed to send as this mailbox.`;
  }
  return `${e.code ? `${e.code}: ` : ""}${raw}`;
}

function getConfig() {
  const host = process.env.MAIL_HOST;
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;
  const port = Number(process.env.MAIL_PORT || 587);
  const encryption = (process.env.MAIL_ENCRYPTION || "tls").toLowerCase();
  const fromAddress = process.env.MAIL_FROM_ADDRESS || user;
  const expand = (v: string) => v.replace(/\$\{(\w+)\}/g, (_m, name: string) => process.env[name] || "");
  const fromName = expand(process.env.MAIL_FROM_NAME || "").trim() || process.env.APP_NAME || "CloudCentric";

  const missing = [
    !host && "MAIL_HOST",
    !user && "MAIL_USERNAME",
    !pass && "MAIL_PASSWORD",
    !fromAddress && "MAIL_FROM_ADDRESS",
  ].filter(Boolean) as string[];

  return { host, user, pass, port, encryption, fromAddress, fromName, missing };
}

/** True when every required SMTP setting is present (does not contact the server). */
export function isMailConfigured(): boolean {
  return getConfig().missing.length === 0;
}

/** Last address that worked; tried first next time. */
let preferredAddress: string | null = null;

/**
 * Resolves every address of the SMTP host for the configured IP family.
 * Defaults to IPv4: many networks have no IPv6 route, and Office 365 publishes AAAA records,
 * which otherwise fails with ENETUNREACH. Set MAIL_IP_FAMILY=6, or 0 to let the OS choose.
 * Large providers rotate many IPs and some may be unreachable from a given network, so
 * callers try each in turn.
 */
async function resolveAddresses(host: string): Promise<string[]> {
  const family = Number(process.env.MAIL_IP_FAMILY ?? 4);
  if (family !== 4 && family !== 6) return [host];
  try {
    const all = (await lookup(host, { family, all: true })).map((a) => a.address);
    const unique = Array.from(new Set(all));
    if (preferredAddress && unique.includes(preferredAddress)) {
      return [preferredAddress, ...unique.filter((a) => a !== preferredAddress)];
    }
    return unique.length ? unique : [host];
  } catch (err) {
    console.warn(`[mailer] IPv${family} lookup for ${host} failed; falling back to hostname`, err);
    return [host];
  }
}

/** Errors where trying another server address may help (vs. auth or message rejections). */
function isConnectionError(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  const code = e?.code;
  if (code && ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ECONNECTION", "ESOCKET", "ENETUNREACH", "EHOSTUNREACH", "EAI_AGAIN", "ECONNABORTED", "EPIPE"].includes(code)) return true;
  return /timeout|timed out|socket hang up/i.test(e?.message || "");
}

function createTransport(address: string): Transporter {
  const cfg = getConfig();
  return nodemailer.createTransport({
    host: address,
    port: cfg.port,
    // "ssl" = implicit TLS (port 465); "tls" = STARTTLS upgrade (port 587, Office 365)
    secure: cfg.encryption === "ssl",
    requireTLS: cfg.encryption === "tls",
    auth: { user: cfg.user, pass: cfg.pass },
    // Validate the certificate against the real hostname even though we connect by IP
    tls: { minVersion: "TLSv1.2", servername: cfg.host },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });
}

/** Sends an email. Never throws: failures are logged and returned as { ok: false }. */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const cfg = getConfig();
  if (cfg.missing.length) {
    const error = `SMTP not configured (missing ${cfg.missing.join(", ")})`;
    console.error("[mailer]", error);
    return { ok: false, error };
  }

  const addresses = await resolveAddresses(cfg.host!);
  let lastError: unknown = null;

  // Try each server address; move on only for network-level failures
  for (const address of addresses) {
    const transporter = createTransport(address);
    try {
      const info = await transporter.sendMail({
        from: { name: cfg.fromName, address: cfg.fromAddress! },
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        headers: message.headers,
      });
      preferredAddress = address;
      return { ok: true, messageId: info.messageId };
    } catch (err) {
      lastError = err;
      if (preferredAddress === address) preferredAddress = null;
      if (!isConnectionError(err)) break; // auth / rejection: another address won't help
      console.warn(`[mailer] ${cfg.host} via ${address} failed (${(err as { code?: string }).code}); trying next address`);
    } finally {
      transporter.close();
    }
  }

  // Log without credentials; nodemailer error messages don't include the password
  const error = describeSmtpError(lastError, cfg.host, cfg.port);
  console.error("[mailer] Delivery failed:", { to: message.to, subject: message.subject, triedAddresses: addresses, error });
  return { ok: false, error: error.slice(0, 1000) };
}
