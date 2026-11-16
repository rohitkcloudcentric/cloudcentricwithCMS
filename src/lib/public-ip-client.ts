/**
 * Browser helper: the visitor's public IP from ipify (the same service the contact forms use).
 * Cached for the page session; resolves "" if the lookup is blocked or takes longer than `timeoutMs`,
 * so a form submit is never held up. The server validates whatever is sent.
 */
let cached: Promise<string> | null = null;

export function getPublicIp(timeoutMs = 3000): Promise<string> {
  if (typeof window === "undefined") return Promise.resolve("");
  if (!cached) {
    cached = fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => (d && typeof d.ip === "string" ? d.ip : ""))
      .catch(() => "");
    // Allow a retry later if this attempt failed
    cached.then((ip) => {
      if (!ip) cached = null;
    });
  }
  return Promise.race([cached, new Promise<string>((resolve) => setTimeout(() => resolve(""), timeoutMs))]);
}
