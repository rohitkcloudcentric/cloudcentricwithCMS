/** Contact Settings data access (server only). */
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

/**
 * True once the SocialLink.iconUrl column exists in the generated Prisma client
 * (after `npx prisma db push`). Until then custom icons are ignored instead of
 * crashing every social-link save and the public contact details.
 */
export const SOCIAL_ICON_SUPPORTED = "iconUrl" in (Prisma.SocialLinkScalarFieldEnum as Record<string, string>);
import { phoneDigits, type ContactType, type PublicContactSettings } from "@/lib/contact-settings";

type Row = Record<string, unknown> & { id: string };
interface Delegate {
  findMany(args: object): Promise<Row[]>;
  findUnique(args: object): Promise<Row | null>;
  findFirst(args: object): Promise<Row | null>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
  delete(args: object): Promise<Row>;
  aggregate(args: object): Promise<{ _max: { displayOrder: number | null } }>;
}

export function delegateFor(type: ContactType): Delegate {
  const map = {
    offices: prisma.officeAddress,
    phones: prisma.contactPhone,
    emails: prisma.contactEmail,
    social: prisma.socialLink,
  };
  return map[type] as unknown as Delegate;
}

export const contactOrder = [{ displayOrder: "asc" as const }, { createdAt: "asc" as const }];

const LABELS: Record<ContactType, string> = {
  offices: "office address",
  phones: "contact number",
  emails: "email address",
  social: "social media link",
};
export const typeLabel = (t: ContactType) => LABELS[t];

/**
 * Builds the final data for a create/update and checks for duplicates.
 * `existing` is the current row on update. Returns a field error when a duplicate exists.
 */
export async function prepareWrite(
  type: ContactType,
  data: Record<string, unknown>,
  existing: Row | null
): Promise<{ data: Record<string, unknown>; duplicate?: { field: string; message: string }; iconSkipped?: boolean }> {
  const d = delegateFor(type);

  // Database not migrated yet: drop the custom icon so the rest of the record still saves
  let iconSkipped = false;
  if (type === "social" && !SOCIAL_ICON_SUPPORTED && "iconUrl" in data) {
    const { iconUrl, ...rest } = data;
    iconSkipped = Boolean(iconUrl);
    data = rest;
  }
  const merged = { ...(existing ?? {}), ...data } as Record<string, string>;
  const notSelf = existing ? { id: { not: existing.id } } : {};

  if (type === "offices") {
    const clash = await d.findFirst({
      where: {
        ...notSelf,
        location: { equals: merged.location, mode: "insensitive" },
        address: { equals: merged.address, mode: "insensitive" },
      },
    });
    if (clash) return { data, duplicate: { field: "address", message: "This office address already exists." } };
  }

  if (type === "phones") {
    const digits = phoneDigits({ countryCode: merged.countryCode, number: merged.number });
    data = { ...data, digits };
    if (await d.findFirst({ where: { ...notSelf, digits } })) {
      return { data, duplicate: { field: "number", message: "This contact number already exists." } };
    }
  }

  if (type === "emails") {
    if (await d.findFirst({ where: { ...notSelf, email: merged.email } })) {
      return { data, duplicate: { field: "email", message: "This email address already exists." } };
    }
  }

  if (type === "social") {
    if (await d.findFirst({ where: { ...notSelf, platform: merged.platform } })) {
      return { data, duplicate: { field: "platform", message: "This platform already has a link. Edit the existing one instead." } };
    }
    if (await d.findFirst({ where: { ...notSelf, url: { equals: merged.url, mode: "insensitive" } } })) {
      return { data, duplicate: { field: "url", message: "This link is already used by another platform." } };
    }
  }

  // New records go to the end unless an order was given
  if (!existing && data.displayOrder === undefined) {
    const last = await d.aggregate({ _max: { displayOrder: true } });
    data = { ...data, displayOrder: (last._max.displayOrder ?? 0) + 1 };
  }

  return { data, iconSkipped };
}

/** Active records for the website, in display order. Never throws (empty lists on error). */
export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  const where = { isActive: true };
  try {
    const [offices, phones, emails, social] = await Promise.all([
      prisma.officeAddress.findMany({ where, orderBy: contactOrder, select: { id: true, location: true, address: true } }),
      prisma.contactPhone.findMany({ where, orderBy: contactOrder, select: { id: true, countryCode: true, number: true } }),
      prisma.contactEmail.findMany({ where, orderBy: contactOrder, select: { id: true, email: true, type: true } }),
      prisma.socialLink.findMany({
        where,
        orderBy: contactOrder,
        select: { id: true, platform: true, name: true, url: true, ...(SOCIAL_ICON_SUPPORTED ? { iconUrl: true } : {}) },
      }),
    ]);
    return {
      offices,
      phones,
      emails,
      social: social.map((s) => ({ ...s, iconUrl: (s as { iconUrl?: string | null }).iconUrl ?? null })),
    };
  } catch (error) {
    console.error("Failed to load contact settings:", error);
    return { offices: [], phones: [], emails: [], social: [] };
  }
}
