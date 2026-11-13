/** Client-side helper for the admin: uploads one image via /api/v1/upload and returns its public URL. */

const MAX_BYTES = 7 * 1024 * 1024; // the API body limit is 10 MB of base64 (~7.5 MB raw)
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

export const ACCEPTED_IMAGE_TYPES = ACCEPTED.join(",");

export interface UploadOptions {
  /** Ask the server to downscale + re-encode as WebP. */
  optimize?: boolean;
  /** Longest side in px when optimizing (server clamps 200-2560). */
  maxWidth?: number;
}

export async function uploadImageFile(file: File, options: UploadOptions = {}): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error(`${file.name}: only PNG, JPG, WEBP, GIF, or AVIF images are allowed`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`${file.name}: image must be under 7 MB`);
  }

  const fileData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`${file.name}: could not read file`));
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/v1/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileData, optimize: options.optimize, maxWidth: options.maxWidth }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.error || `${file.name}: upload failed`);
  }
  return data.url as string;
}
