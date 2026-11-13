import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticatedUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

    const { fileName, fileData, optimize, maxWidth } = req.body || {};

    if (typeof fileName !== "string" || typeof fileData !== "string" || !fileName || !fileData) {
      return res.status(400).json({ success: false, error: "fileName and base64 fileData are required" });
    }

    // Only raster images are accepted (SVG/HTML could carry scripts served from our origin)
    const ALLOWED: Record<string, string> = {
      "image/png": ".png",
      "image/jpeg": ".jpg",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/avif": ".avif",
    };
    const match = /^data:([a-z0-9.+/-]*);base64,/i.exec(fileData);
    if (!match) {
      return res.status(400).json({ success: false, error: "Only PNG, JPG, WEBP, GIF, or AVIF images are allowed" });
    }

    const buffer = Buffer.from(fileData.slice(match[0].length), "base64");
    if (buffer.length === 0) {
      return res.status(400).json({ success: false, error: "Empty file" });
    }

    // The real type comes from the file's signature (magic bytes), not from the declared type,
    // which browsers derive from the file extension (e.g. a WebP saved as ".png").
    const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isGif = buffer.subarray(0, 4).toString("ascii") === "GIF8";
    const isWebp = buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    const isAvif = /^ftypavi[fs]$/.test(buffer.subarray(4, 12).toString("ascii"));
    const mime = isPng
      ? "image/png"
      : isJpg
        ? "image/jpeg"
        : isWebp
          ? "image/webp"
          : isGif
            ? "image/gif"
            : isAvif
              ? "image/avif"
              : null;
    if (!mime || !ALLOWED[mime]) {
      return res.status(400).json({
        success: false,
        error: "This file is not a valid PNG, JPG, WEBP, GIF or AVIF image (SVG and other formats are not supported).",
      });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Extension comes from the verified type, never from the client-supplied name
    let ext = ALLOWED[mime];
    let output = buffer;

    // Opt-in optimization (used by the Products module): downscale and re-encode as WebP.
    // Animated GIFs are left untouched. Re-encoding also proves the file is a decodable image.
    if (optimize === true && mime !== "image/gif") {
      const limit = Math.min(2560, Math.max(200, Number(maxWidth) || 1920));
      try {
        const sharp = (await import("sharp")).default;
        output = await sharp(buffer, { failOn: "error", limitInputPixels: 80_000_000 })
          .rotate() // honour EXIF orientation, then strip metadata
          .resize({ width: limit, height: limit, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        ext = ".webp";
      } catch (err) {
        console.error("Image optimization failed:", err);
        return res.status(400).json({ success: false, error: "Could not process this image. Try a different file." });
      }
    }

    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, output);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);
    return res.status(500).json({ success: false, error: "Failed to upload file" });
  }
}
