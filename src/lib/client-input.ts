/** Validates and normalizes Our Clients request bodies into Prisma-ready data. */
import prisma from "@/lib/prisma";

export interface ParsedClient {
  data: {
    name?: string;
    logoUrl?: string;
    logoAlt?: string | null;
    websiteUrl?: string | null;
    description?: string | null;
    displayOrder?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    categoryId?: string | null;
  };
  errors: string[];
}

const LIMITS = { name: 120, alt: 200, description: 500, url: 500 };

/** Local upload path or http(s) URL; nothing else (no javascript:, data:, etc.). */
const isSafeImageUrl = (v: string) => /^\/[A-Za-z0-9._~\-/%]+$/.test(v) || /^https?:\/\/[^\s"'<>]+$/i.test(v);

/** Absolute http(s) website URL; adds https:// when the scheme is missing. */
function normalizeWebsite(raw: string): string | null {
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * @param isCreate when true, name and logo are required
 */
export async function parseClientBody(body: unknown, isCreate: boolean): Promise<ParsedClient> {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: string[] = [];
  const data: ParsedClient["data"] = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : null);

  // Name
  if (isCreate || b.name !== undefined) {
    const name = str(b.name);
    if (!name) errors.push("Client name is required");
    else if (name.length > LIMITS.name) errors.push(`Client name must be ${LIMITS.name} characters or less`);
    else data.name = name;
  }

  // Logo
  if (isCreate || b.logoUrl !== undefined) {
    const logo = str(b.logoUrl);
    if (!logo) errors.push("Client logo is required");
    else if (logo.length > LIMITS.url || !isSafeImageUrl(logo)) errors.push("Client logo must be an uploaded image or a valid http(s) URL");
    else data.logoUrl = logo;
  }

  if (b.logoAlt !== undefined) {
    const alt = str(b.logoAlt);
    if (alt === null) errors.push("Alt text must be text");
    else if (alt.length > LIMITS.alt) errors.push(`Alt text must be ${LIMITS.alt} characters or less`);
    else data.logoAlt = alt || null;
  }

  if (b.websiteUrl !== undefined) {
    const site = str(b.websiteUrl);
    if (site === null) errors.push("Website URL must be text");
    else if (!site) data.websiteUrl = null;
    else if (site.length > LIMITS.url) errors.push("Website URL is too long");
    else {
      const normalized = normalizeWebsite(site);
      if (!normalized) errors.push("Website URL must be a valid http(s) address, e.g. https://example.com");
      else data.websiteUrl = normalized;
    }
  }

  if (b.description !== undefined) {
    const desc = str(b.description);
    if (desc === null) errors.push("Description must be text");
    else if (desc.length > LIMITS.description) errors.push(`Description must be ${LIMITS.description} characters or less`);
    else data.description = desc || null;
  }

  if (b.displayOrder !== undefined) {
    const n = Number(b.displayOrder);
    if (!Number.isInteger(n) || n < 0 || n > 9999) errors.push("Display order must be a whole number between 0 and 9999");
    else data.displayOrder = n;
  }

  if (b.isActive !== undefined) {
    if (typeof b.isActive !== "boolean") errors.push("Status must be Active or Inactive");
    else data.isActive = b.isActive;
  }
  if (b.isFeatured !== undefined) {
    if (typeof b.isFeatured !== "boolean") errors.push("Featured must be true or false");
    else data.isFeatured = b.isFeatured;
  }

  if (b.categoryId !== undefined) {
    if (!b.categoryId) {
      data.categoryId = null;
    } else if (typeof b.categoryId !== "string") {
      errors.push("Invalid category");
    } else {
      const cat = await prisma.clientCategory.findUnique({ where: { id: b.categoryId }, select: { id: true } });
      if (!cat) errors.push("Selected category no longer exists");
      else data.categoryId = cat.id;
    }
  }

  return { data, errors };
}

export const clientInclude = { category: { select: { id: true, name: true } } } as const;
