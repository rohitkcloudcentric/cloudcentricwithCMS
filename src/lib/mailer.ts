/**
 * Server-only SMTP mailer (Nodemailer).
 * Configuration priority:
 * 1. Active database SMTP settings (SmtpSetting table)
 * 2. Environment variables fallback (MAIL_HOST, MAIL_PORT, MAIL_USERNAME, etc.)
 */
import { lookup } from "dns/promises";
import nodemailer, { type Transporter } from "nodemailer";
import prisma from "@/lib/prisma";
import { decryptPassword } from "@/lib/smtp-crypto";

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  source?: string;
}

export type MailResult = { ok: true; messageId: string } | { ok: false; error: string };

function getPrismaModel(modelName: string) {
  const p = prisma as any;
  if (p && p[modelName]) return p[modelName];
  try {
    const { PrismaClient } = require("@prisma/client");
    const freshClient = new PrismaClient();
    (global as any).prisma = freshClient;
    return freshClient[modelName];
  } catch {
    return null;
  }
}

/** Records a delivery failure in the database for admin troubleshooting. */
export async function logSmtpFailure(data: {
  recipient: string;
  subject: string;
  error: string;
  host?: string;
  port?: number;
  fromEmail?: string;
  source?: string;
}): Promise<void> {
  try {
    const model = getPrismaModel("smtpFailureLog");
    if (model) {
      await model.create({
        data: {
          recipient: data.recipient.slice(0, 255),
          subject: data.subject.slice(0, 500),
          error: data.error,
          host: data.host ? data.host.slice(0, 255) : null,
          port: data.port ?? null,
          fromEmail: data.fromEmail ? data.fromEmail.slice(0, 255) : null,
          source: data.source ? data.source.slice(0, 100) : "application",
        },
      });
    }
  } catch (err) {
    console.warn("[mailer] Could not persist SMTP failure log:", err);
  }
}

export interface SmtpEffectiveConfig {
  host: string;
  user: string;
  pass: string;
  port: number;
  encryption: string; // 'tls' | 'ssl' | 'none'
  fromAddress: string;
  fromName: string;
  missing: string[];
  source: "database" | "env" | "none";
}

/** Turns low-level SMTP/network errors into an actionable message for the admin panel and logs. */
export function describeSmtpError(err: unknown, host?: string, port?: number): string {
  const e = (err ?? {}) as { code?: string; responseCode?: number; message?: string; command?: string };
  const raw = e.message || String(err);
  const where = `${host || "host"}:${port || "port"}`;

  if (
    e.code === "ETIMEDOUT" ||
    e.code === "ECONNRESET" ||
    e.code === "ECONNREFUSED" ||
    e.code === "ESOCKET" ||
    e.code === "EDNS" ||
    e.code === "ENOTFOUND"
  ) {
    return `Cannot reach the SMTP server ${where} (${e.code}: ${raw}). Please verify host and port, and ensure outgoing traffic is permitted by your firewall.`;
  }
  if (e.code === "EAUTH" || e.responseCode === 535) {
    return `SMTP authentication rejected for ${where} (${raw}). Please check your SMTP Username and Password. If using Office 365 or Gmail, ensure an App Password or SMTP AUTH is enabled.`;
  }
  if (e.responseCode === 550 || e.responseCode === 554) {
    return `SMTP server refused the message (${e.responseCode}: ${raw}). Verify that the Sender Email Address is authorized to send emails through this mailbox.`;
  }
  return `${e.code ? `${e.code}: ` : ""}${raw}`;
}

/**
 * Resolves active SMTP configuration from the database first, then environment variables.
 */
export async function getEffectiveSmtpConfig(): Promise<SmtpEffectiveConfig> {
  // 1. Try active database setting
  try {
    const model = getPrismaModel("smtpSetting");
    const dbSetting = model
      ? await model.findFirst({
          where: { isActive: true },
          orderBy: { updatedAt: "desc" },
        })
      : null;

    if (dbSetting) {
      const pass = decryptPassword(dbSetting.passwordEnc);
      const host = dbSetting.host.trim();
      const user = dbSetting.username.trim();
      const port = Number(dbSetting.port || 587);
      const encryption = (dbSetting.encryption || "tls").toLowerCase();
      const fromAddress = dbSetting.fromEmail.trim() || user;
      const fromName = dbSetting.fromName.trim() || process.env.APP_NAME || "CloudCentric";

      const missing = [
        !host && "host",
        !user && "username",
        !pass && "password",
        !fromAddress && "fromAddress",
      ].filter(Boolean) as string[];

      if (missing.length === 0) {
        return {
          host,
          user,
          pass,
          port,
          encryption,
          fromAddress,
          fromName,
          missing: [],
          source: "database",
        };
      }
    }
  } catch (err) {
    console.warn("[mailer] Could not read SMTP configuration from database, falling back to env:", err);
  }

  // 2. Fall back to environment variables
  const host = process.env.MAIL_HOST || "";
  const user = process.env.MAIL_USERNAME || "";
  const pass = process.env.MAIL_PASSWORD || "";
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

  return {
    host,
    user,
    pass,
    port,
    encryption,
    fromAddress,
    fromName,
    missing,
    source: missing.length === 0 ? "env" : "none",
  };
}

/** True when every required SMTP setting is present (database or environment). */
export async function isMailConfigured(): Promise<boolean> {
  const cfg = await getEffectiveSmtpConfig();
  return cfg.missing.length === 0;
}

/** Last address that worked; tried first next time. */
let preferredAddress: string | null = null;

/**
 * Resolves every address of the SMTP host for the configured IP family.
 */
export async function resolveAddresses(host: string): Promise<string[]> {
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
  if (
    code &&
    [
      "ETIMEDOUT",
      "ECONNRESET",
      "ECONNREFUSED",
      "ECONNECTION",
      "ESOCKET",
      "ENETUNREACH",
      "EHOSTUNREACH",
      "EAI_AGAIN",
      "ECONNABORTED",
      "EPIPE",
    ].includes(code)
  )
    return true;
  return /timeout|timed out|socket hang up/i.test(e?.message || "");
}

export function createTransport(
  address: string,
  cfg: { host: string; port: number; encryption: string; user: string; pass: string }
): Transporter {
  const enc = (cfg.encryption || "tls").toLowerCase();
  return nodemailer.createTransport({
    host: address,
    port: cfg.port,
    secure: enc === "ssl",
    requireTLS: enc === "tls",
    ignoreTLS: enc === "none",
    auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
    tls: { minVersion: "TLSv1.2", servername: cfg.host },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });
}

/** Sends an email. Never throws: failures are logged and returned as { ok: false }. */
export async function sendMail(
  message: MailMessage,
  customConfig?: SmtpEffectiveConfig
): Promise<MailResult> {
  const cfg = customConfig || (await getEffectiveSmtpConfig());
  if (cfg.missing.length) {
    const error = `SMTP not configured (missing ${cfg.missing.join(", ")})`;
    console.error("[mailer]", error);
    await logSmtpFailure({
      recipient: message.to,
      subject: message.subject,
      error,
      host: cfg.host,
      port: cfg.port,
      fromEmail: cfg.fromAddress,
      source: message.source || "application",
    });
    return { ok: false, error };
  }

  const addresses = await resolveAddresses(cfg.host);
  let lastError: unknown = null;

  // Try each server address; move on only for network-level failures
  for (const address of addresses) {
    const transporter = createTransport(address, cfg);
    try {
      const info = await transporter.sendMail({
        from: { name: cfg.fromName, address: cfg.fromAddress },
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

  const error = describeSmtpError(lastError, cfg.host, cfg.port);
  console.error("[mailer] Delivery failed:", {
    to: message.to,
    subject: message.subject,
    triedAddresses: addresses,
    error,
  });

  await logSmtpFailure({
    recipient: message.to,
    subject: message.subject,
    error,
    host: cfg.host,
    port: cfg.port,
    fromEmail: cfg.fromAddress,
    source: message.source || "application",
  });

  return { ok: false, error: error.slice(0, 1000) };
}
