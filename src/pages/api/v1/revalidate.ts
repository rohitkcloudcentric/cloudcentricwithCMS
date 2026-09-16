import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { secret, path } = req.body || req.query;

    if (secret !== (process.env.REVALIDATION_SECRET || "cloudcentric_revalidate_secret_key")) {
      return res.status(401).json({ success: false, error: "Invalid revalidation secret" });
    }

    if (!path) {
      return res.status(400).json({ success: false, error: "Path parameter is required" });
    }

    await res.revalidate(path as string);
    return res.status(200).json({ success: true, revalidated: true, path, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("Revalidation Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Error revalidating path" });
  }
}
