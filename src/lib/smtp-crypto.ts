import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const TAG_LENGTH = 16; // 128 bits

export const MASKED_PASSWORD = "••••••••••••";

/**
 * Derives a consistent 256-bit (32-byte) key for encrypting SMTP credentials.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.SMTP_SECRET_KEY ||
    process.env.JWT_SECRET ||
    "cloudcentric-cms-smtp-secret-encryption-salt-2026";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts an SMTP password using AES-256-GCM.
 * Output format: <ivHex>:<tagHex>:<ciphertextHex>
 */
export function encryptPassword(plainText: string): string {
  if (!plainText) return "";
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an encrypted SMTP password. Returns empty string if decryption fails or payload is invalid.
 */
export function decryptPassword(cipherPayload: string): string {
  if (!cipherPayload) return "";
  try {
    const parts = cipherPayload.split(":");
    if (parts.length !== 3) {
      return "";
    }
    const [ivHex, tagHex, encryptedHex] = parts;
    if (!ivHex || !tagHex || !encryptedHex) return "";

    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("[smtp-crypto] Password decryption error:", err);
    return "";
  }
}

/**
 * Checks whether a given string is the placeholder masked password.
 */
export function isMaskedPassword(val: string | null | undefined): boolean {
  if (!val) return false;
  return val.trim() === MASKED_PASSWORD || /^[\u2022*•\s]+$/.test(val.trim());
}
