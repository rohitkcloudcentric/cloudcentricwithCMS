import type { NextApiRequest, NextApiResponse } from "next";
import { getPublicContactSettings } from "@/lib/contact-settings-server";

/** Public: active office addresses, numbers, emails and social links (used by the website). */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  // Short shared cache; admin changes show up within a minute at most
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json({ success: true, data: await getPublicContactSettings() });
}
