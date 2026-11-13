import { useEffect, useState } from "react";
import type { PublicContactSettings } from "@/lib/contact-settings";

/**
 * Website contact details (active records from Contact Settings).
 * One request per page load, shared by every component that needs it.
 * Returns null until loaded; components render nothing for missing data.
 */
let cache: PublicContactSettings | null = null;
let inflight: Promise<PublicContactSettings | null> | null = null;

function load(): Promise<PublicContactSettings | null> {
  if (!inflight) {
    inflight = fetch("/api/v1/contact-settings")
      .then((r) => r.json())
      .then((j) => {
        cache = j?.success ? (j.data as PublicContactSettings) : null;
        return cache;
      })
      .catch(() => null)
      .finally(() => {
        // Allow a fresh fetch on the next client-side navigation
        setTimeout(() => (inflight = null), 30_000);
      });
  }
  return inflight;
}

export function useContactSettings(): PublicContactSettings | null {
  const [data, setData] = useState<PublicContactSettings | null>(cache);
  useEffect(() => {
    let alive = true;
    load().then((d) => alive && d && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}
