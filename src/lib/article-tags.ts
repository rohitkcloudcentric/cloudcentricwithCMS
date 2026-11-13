import prisma from "@/lib/prisma";

export const MAX_TAG_NAME_LENGTH = 40;
export const MAX_TAGS_PER_ARTICLE = 20;

/** Trims and collapses whitespace. Returns "" for non-strings. */
export function normalizeTagName(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

/**
 * Validates a `tagIds` request value and returns only IDs of tags that exist.
 * Returns `undefined` when the field was not sent (leave tags unchanged on update).
 */
export async function resolveTagIds(input: unknown): Promise<string[] | undefined> {
  if (input === undefined) return undefined;
  if (!Array.isArray(input)) return [];

  const ids = Array.from(
    new Set(input.filter((v): v is string => typeof v === "string" && v.trim() !== ""))
  ).slice(0, MAX_TAGS_PER_ARTICLE);
  if (ids.length === 0) return [];

  const found = await prisma.tag.findMany({ where: { id: { in: ids } }, select: { id: true } });
  return found.map((t) => t.id);
}
