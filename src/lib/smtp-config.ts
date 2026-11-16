import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  encryptPassword,
  decryptPassword,
  MASKED_PASSWORD,
  isMaskedPassword,
} from "./smtp-crypto";

export const ENCRYPTION_TYPES = ["TLS", "SSL", "NONE"] as const;
export type EncryptionType = (typeof ENCRYPTION_TYPES)[number];

const cleanStr = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Must be ${max} characters or fewer.`));

export const smtpSettingSchema = z.object({
  host: cleanStr(255)
    .pipe(z.string().min(1, "SMTP Host is required."))
    .refine(
      (v) => /^[a-zA-Z0-9.-]+$/.test(v),
      "Please enter a valid hostname or IP address without protocol or path."
    ),
  port: z.coerce
    .number()
    .int("Port must be an integer.")
    .min(1, "Port must be between 1 and 65535.")
    .max(65535, "Port must be between 1 and 65535."),
  username: cleanStr(255).pipe(z.string().min(1, "SMTP Username is required.")),
  password: z.string().optional().default(""),
  encryption: z
    .string()
    .transform((v) => v.toUpperCase().trim())
    .refine(
      (v): v is EncryptionType => ENCRYPTION_TYPES.includes(v as EncryptionType),
      "Encryption must be TLS (STARTTLS), SSL (Implicit TLS), or NONE."
    ),
  fromEmail: cleanStr(254)
    .pipe(z.string().min(1, "Sender Email Address is required."))
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid sender email address."),
  fromName: cleanStr(100).pipe(z.string().min(1, "Sender Name is required.")),
  isActive: z.boolean().optional().default(true),
});

export type SmtpSettingInput = z.infer<typeof smtpSettingSchema>;

export interface MaskedSmtpConfig {
  id?: string;
  host: string;
  port: number;
  username: string;
  passwordMasked: string;
  hasPassword: boolean;
  encryption: EncryptionType;
  fromEmail: string;
  fromName: string;
  isActive: boolean;
  updatedAt?: string | null;
  source: "database" | "env" | "none";
}

/**
 * Safely resolves the SmtpSetting delegate. If a long-running dev server has a cached
 * Prisma instance from before the model was compiled, this dynamically initializes a fresh client.
 */
function getSmtpDelegate() {
  const p = prisma as any;
  if (p && p.smtpSetting && typeof p.smtpSetting.updateMany === "function") {
    return p.smtpSetting;
  }
  try {
    const { PrismaClient } = require("@prisma/client");
    const freshClient = new PrismaClient();
    (global as any).prisma = freshClient;
    return freshClient.smtpSetting;
  } catch (err) {
    console.error("[smtp-config] Failed to resolve SmtpSetting delegate:", err);
    throw new Error("SMTP database service is initializing. Please try again.");
  }
}

/**
 * Retrieves the currently active SMTP setting from the database.
 */
export async function getActiveDbSmtpSetting() {
  try {
    const delegate = getSmtpDelegate();
    return await delegate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch (err) {
    console.error("[smtp-config] Failed to query SMTP settings from database:", err);
    return null;
  }
}

/**
 * Retrieves the latest SMTP setting (active or inactive) from the database.
 */
export async function getLatestDbSmtpSetting() {
  try {
    const delegate = getSmtpDelegate();
    return await delegate.findFirst({
      orderBy: { updatedAt: "desc" },
    });
  } catch (err) {
    console.error("[smtp-config] Failed to query latest SMTP settings:", err);
    return null;
  }
}

/**
 * Returns a masked configuration for safe client-side display in the Admin Dashboard.
 * Raw passwords are NEVER exposed to the client.
 */
export async function getMaskedSmtpConfig(): Promise<MaskedSmtpConfig> {
  const dbSetting = await getLatestDbSmtpSetting();

  if (dbSetting) {
    const hasPassword = Boolean(dbSetting.passwordEnc && dbSetting.passwordEnc.length > 0);
    return {
      id: dbSetting.id,
      host: dbSetting.host,
      port: dbSetting.port,
      username: dbSetting.username,
      passwordMasked: hasPassword ? MASKED_PASSWORD : "",
      hasPassword,
      encryption: (dbSetting.encryption as EncryptionType) || "TLS",
      fromEmail: dbSetting.fromEmail,
      fromName: dbSetting.fromName,
      isActive: dbSetting.isActive,
      updatedAt: dbSetting.updatedAt ? dbSetting.updatedAt.toISOString() : null,
      source: "database",
    };
  }

  // Fallback to environment variables if database has no record yet
  const envHost = process.env.MAIL_HOST || "";
  const envPort = Number(process.env.MAIL_PORT || 587);
  const envUser = process.env.MAIL_USERNAME || "";
  const envPass = process.env.MAIL_PASSWORD || "";
  const envEnc = (process.env.MAIL_ENCRYPTION || "TLS").toUpperCase() as EncryptionType;
  const envFromEmail = process.env.MAIL_FROM_ADDRESS || envUser;
  const envFromName = process.env.MAIL_FROM_NAME || process.env.APP_NAME || "CloudCentric";

  const hasEnv = Boolean(envHost || envUser);

  return {
    host: envHost,
    port: envPort || 587,
    username: envUser,
    passwordMasked: envPass ? MASKED_PASSWORD : "",
    hasPassword: Boolean(envPass),
    encryption: ENCRYPTION_TYPES.includes(envEnc) ? envEnc : "TLS",
    fromEmail: envFromEmail,
    fromName: envFromName,
    isActive: true,
    updatedAt: null,
    source: hasEnv ? "env" : "none",
  };
}

/**
 * Saves or updates SMTP configuration in the database.
 * If the provided password is empty or matches the mask and a previous password exists,
 * the previous encrypted password is retained.
 */
export async function saveSmtpConfig(input: SmtpSettingInput, existingId?: string) {
  const delegate = getSmtpDelegate();

  const existing = existingId
    ? await delegate.findUnique({ where: { id: existingId } })
    : await getLatestDbSmtpSetting();

  let finalPasswordEnc = existing?.passwordEnc || "";

  if (input.password && !isMaskedPassword(input.password)) {
    finalPasswordEnc = encryptPassword(input.password);
  } else if (!finalPasswordEnc) {
    throw new Error("SMTP Password is required.");
  }

  // Deactivate other records if saving this as active
  if (input.isActive) {
    await delegate.updateMany({
      where: existing?.id ? { id: { not: existing.id } } : {},
      data: { isActive: false },
    });
  }

  if (existing?.id) {
    return await delegate.update({
      where: { id: existing.id },
      data: {
        host: input.host,
        port: input.port,
        username: input.username,
        passwordEnc: finalPasswordEnc,
        encryption: input.encryption,
        fromEmail: input.fromEmail,
        fromName: input.fromName,
        isActive: input.isActive,
      },
    });
  }

  return await delegate.create({
    data: {
      host: input.host,
      port: input.port,
      username: input.username,
      passwordEnc: finalPasswordEnc,
      encryption: input.encryption,
      fromEmail: input.fromEmail,
      fromName: input.fromName,
      isActive: input.isActive,
    },
  });
}
