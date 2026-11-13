/**
 * Contact Settings: shared types, platforms and validation (pure; safe on client and server).
 * Records live in the OfficeAddress / ContactPhone / ContactEmail / SocialLink tables.
 */

export type ContactType = "offices" | "phones" | "emails" | "social";
export const CONTACT_TYPES: ContactType[] = ["offices", "phones", "emails", "social"];

export interface OfficeItem { id: string; location: string; address: string; displayOrder: number; isActive: boolean }
export interface PhoneItem { id: string; countryCode: string; number: string; displayOrder: number; isActive: boolean }
export interface EmailItem { id: string; email: string; type: string; displayOrder: number; isActive: boolean }
export interface SocialItem { id: string; platform: string; name: string; url: string; iconUrl: string | null; displayOrder: number; isActive: boolean }

/** What the website receives: active records only, in display order. */
export interface PublicContactSettings {
  offices: Omit<OfficeItem, "isActive" | "displayOrder">[];
  phones: Omit<PhoneItem, "isActive" | "displayOrder">[];
  emails: Omit<EmailItem, "isActive" | "displayOrder">[];
  social: Omit<SocialItem, "isActive" | "displayOrder">[];
}

/** Platforms with a dedicated icon. Anything else is allowed and gets a generic icon. */
export const KNOWN_PLATFORMS: { key: string; name: string; hosts: string[] }[] = [
  { key: "facebook", name: "Facebook", hosts: ["facebook.com", "fb.com"] },
  { key: "linkedin", name: "LinkedIn", hosts: ["linkedin.com"] },
  { key: "x", name: "X (Twitter)", hosts: ["x.com", "twitter.com"] },
  { key: "instagram", name: "Instagram", hosts: ["instagram.com"] },
  { key: "youtube", name: "YouTube", hosts: ["youtube.com", "youtu.be"] },
];

export const EMAIL_TYPE_SUGGESTIONS = ["Sales", "Support", "General Enquiry", "Careers", "Partnerships"];

/** "+91 99711 26721" -> "tel:+919971126721" */
export const phoneHref = (p: { countryCode: string; number: string }) =>
  `tel:${`${p.countryCode}${p.number}`.replace(/[^\d+]/g, "")}`;
export const phoneLabel = (p: { countryCode: string; number: string }) => `${p.countryCode} ${p.number}`.trim();
/** Digits only (country code included), used for WhatsApp links and duplicate checks. */
export const phoneDigits = (p: { countryCode: string; number: string }) => `${p.countryCode}${p.number}`.replace(/\D/g, "");

export const slugifyPlatform = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 40);

// ─────────────────────────── Validation ───────────────────────────

export type FieldErrors = Record<string, string>;
export interface Parsed<T> { data: Partial<T>; errors: FieldErrors }

const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function common(b: Record<string, unknown>, data: Record<string, unknown>, errors: FieldErrors) {
  if (b.displayOrder !== undefined && b.displayOrder !== "") {
    const n = Number(b.displayOrder);
    if (!Number.isInteger(n) || n < 0 || n > 9999) errors.displayOrder = "Display order must be a whole number between 0 and 9999.";
    else data.displayOrder = n;
  }
  if (b.isActive !== undefined) {
    if (typeof b.isActive !== "boolean") errors.isActive = "Invalid status.";
    else data.isActive = b.isActive;
  }
}

/**
 * Validates a create (partial = false) or update (partial = true) body for a type.
 * Unknown fields are ignored.
 */
export function parseContactBody(type: ContactType, body: unknown, partial: boolean): Parsed<Record<string, unknown>> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  const errors: FieldErrors = {};
  const need = (key: string) => !partial || b[key] !== undefined;

  if (type === "offices") {
    if (need("location")) {
      const v = s(b.location);
      if (v.length < 2 || v.length > 60) errors.location = "Location must be 2-60 characters.";
      else data.location = v;
    }
    if (need("address")) {
      const v = s(b.address).replace(/\s+\n/g, "\n");
      if (v.length < 5 || v.length > 400) errors.address = "Address must be 5-400 characters.";
      else data.address = v;
    }
  }

  if (type === "phones") {
    if (need("countryCode")) {
      const v = s(b.countryCode).replace(/\s+/g, "");
      const cc = v.startsWith("+") ? v : `+${v}`;
      if (!/^\+\d{1,4}$/.test(cc)) errors.countryCode = "Country code must look like +91 (1-4 digits).";
      else data.countryCode = cc;
    }
    if (need("number")) {
      const v = s(b.number).replace(/\s{2,}/g, " ");
      const digits = v.replace(/\D/g, "");
      if (!/^[0-9][0-9 ()-]*$/.test(v) || digits.length < 5 || digits.length > 14) {
        errors.number = "Enter a valid number (5-14 digits; spaces, dashes and brackets allowed).";
      } else data.number = v;
    }
  }

  if (type === "emails") {
    if (need("email")) {
      const v = s(b.email).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || v.length > 200) errors.email = "Enter a valid email address.";
      else data.email = v;
    }
    if (need("type")) {
      const v = s(b.type);
      if (v.length < 2 || v.length > 40) errors.type = "Email type must be 2-40 characters.";
      else data.type = v;
    }
  }

  if (type === "social") {
    if (need("name")) {
      const v = s(b.name);
      if (v.length < 2 || v.length > 40) errors.name = "Platform name must be 2-40 characters.";
      else data.name = v;
    }
    if (need("platform")) {
      const v = slugifyPlatform(s(b.platform) || s(b.name));
      if (!v) errors.platform = "Choose a platform.";
      else data.platform = v;
    }
    if (need("url")) {
      const v = s(b.url);
      try {
        const u = new URL(v);
        if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".") || v.length > 500) throw new Error();
        data.url = u.toString();
      } catch {
        errors.url = "Enter a full http(s):// link to the profile.";
      }
    }
    // Optional custom icon: an uploaded image (/uploads/...) or an https image URL; "" clears it
    if (b.iconUrl !== undefined) {
      const v = s(b.iconUrl);
      if (!v) data.iconUrl = null;
      else if (
        v.length <= 1000 &&
        ((v.startsWith("/") && !v.startsWith("//") && !v.includes("..") && !/[\s"'<>\\]/.test(v)) || /^https:\/\/[^\s"'<>]+$/i.test(v))
      ) data.iconUrl = v;
      else errors.iconUrl = "Icon must be an uploaded image or an https:// image URL.";
    }
  }

  common(b, data, errors);
  return { data, errors };
}
