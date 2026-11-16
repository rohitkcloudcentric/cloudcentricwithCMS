/**
 * Browser helper shared by every Contact Us form: saves the enquiry via /api/v1/contact-submissions.
 * Safe to import on the client (no server-only imports).
 */
import { getPublicIp } from "@/lib/public-ip-client";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  referralSource: string;
  pageName: string;
  honeypot: string;
  /** Public IP captured by the form (ipify); looked up again here if still empty */
  ipAddress?: string;
}

export type SaveResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Page label stored with the submission ("Home Page" for "/", otherwise the path). */
export function currentPageName(pathname?: string): string {
  const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "") || "unknown";
  return path === "/" ? "Home Page" : path;
}

export async function saveContactSubmission(values: ContactFormValues): Promise<SaveResult> {
  try {
    const clientIp = values.ipAddress && hasClientIp(values.ipAddress) ? values.ipAddress : await getPublicIp();
    const res = await fetch("/api/v1/contact-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        message: values.description,
        referralSource: values.referralSource,
        pageName: values.pageName || currentPageName(),
        honeypot: values.honeypot,
        clientIp,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) return { ok: true };
    // The API names the idea field "message"; the forms call it "description"
    const fieldErrors = data?.fieldErrors
      ? Object.fromEntries(
          Object.entries(data.fieldErrors as Record<string, string>).map(([k, v]) => [k === "message" ? "description" : k, v])
        )
      : undefined;
    return { ok: false, error: data?.error || "We couldn't submit your request. Please try again.", fieldErrors };
  } catch {
    return { ok: false, error: "Network error. Please check your connection and try again." };
  }
}

/** True when the visitor's IP was captured (Pardot requires it; our database records it server-side). */
export const hasClientIp = (ip: string) => Boolean(ip && ip.trim() && ip !== "Blocked or Unavailable");
