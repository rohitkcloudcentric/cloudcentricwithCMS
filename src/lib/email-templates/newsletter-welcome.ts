/**
 * Newsletter subscription confirmation email.
 * Table-based, inline-styled HTML so it renders in Outlook, Gmail, and mobile clients.
 */

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export interface NewsletterWelcomeInput {
  siteName: string;
  siteUrl: string;
  email: string;
  unsubscribeUrl: string;
  /** Optional absolute PNG/JPG logo URL (SVG is blocked by many clients) */
  logoUrl?: string;
  /** Where they subscribed from, e.g. a post title */
  sourceTitle?: string | null;
}

export function renderNewsletterWelcome(input: NewsletterWelcomeInput): { subject: string; html: string; text: string } {
  const siteName = escapeHtml(input.siteName);
  const siteUrl = escapeHtml(input.siteUrl);
  const email = escapeHtml(input.email);
  const unsubscribeUrl = escapeHtml(input.unsubscribeUrl);
  const source = input.sourceTitle ? escapeHtml(input.sourceTitle) : "";
  const year = new Date().getFullYear();

  const subject = `You're subscribed to the ${input.siteName} newsletter`;

  const logo = input.logoUrl
    ? `<img src="${escapeHtml(input.logoUrl)}" alt="${siteName}" width="160" style="display:block;border:0;outline:none;max-width:160px;height:auto;" />`
    : `<span style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">${siteName}</span>`;

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(subject)}</title>
<style>
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .h1 { font-size: 24px !important; line-height: 32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#050505;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks for subscribing to ${siteName}. You'll get our latest insights straight to your inbox.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#0B0B12;border:1px solid #23232f;border-radius:20px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td align="left" class="px" style="padding:28px 40px;background-color:#0E0B1F;background-image:linear-gradient(135deg,#1b1240 0%,#0E0B1F 55%,#0a1633 100%);border-bottom:1px solid #23232f;">
              <a href="${siteUrl}" style="text-decoration:none;">${logo}</a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="px" style="padding:40px 40px 8px 40px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#A78BFA;font-weight:700;">Newsletter</p>
              <h1 class="h1" style="margin:0 0 16px 0;font-size:28px;line-height:36px;color:#ffffff;font-weight:700;">Welcome aboard! You're subscribed.</h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:#C9C6D6;">
                Thanks for subscribing to the <strong style="color:#ffffff;">${siteName}</strong> newsletter.
                We've confirmed your subscription for <strong style="color:#ffffff;">${email}</strong>.
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:24px;color:#C9C6D6;">
                You'll be the first to receive our latest insights on AI, Salesforce, automation, and digital transformation.
              </p>
              ${
                source
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;width:100%;"><tr><td style="padding:14px 18px;background-color:#12121c;border:1px solid #2a2a3a;border-left:3px solid #7C3AED;border-radius:10px;font-size:13px;line-height:20px;color:#A8A4B8;">You subscribed while reading: <strong style="color:#ffffff;">${source}</strong></td></tr></table>`
                  : ""
              }
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
                <tr>
                  <td align="center" style="border-radius:12px;background-color:#7C3AED;background-image:linear-gradient(90deg,#7C3AED,#4F8BFF);">
                    <a href="${siteUrl}/blogs" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:12px;">Explore Latest Insights</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="px" style="padding:24px 40px 32px 40px;border-top:1px solid #23232f;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#ffffff;font-weight:700;">${siteName}</p>
              <p style="margin:0 0 12px 0;font-size:12px;line-height:18px;color:#8E8A9F;">
                You're receiving this email because ${email} subscribed to the ${siteName} newsletter at
                <a href="${siteUrl}" style="color:#A78BFA;text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a>.
              </p>
              <p style="margin:0;font-size:12px;line-height:18px;color:#8E8A9F;">
                Don't want these emails? <a href="${unsubscribeUrl}" style="color:#A78BFA;text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp; &copy; ${year} ${siteName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Welcome aboard! You're subscribed to the ${input.siteName} newsletter.`,
    "",
    `We've confirmed your subscription for ${input.email}.`,
    "You'll be the first to receive our latest insights on AI, Salesforce, automation, and digital transformation.",
    input.sourceTitle ? `\nYou subscribed while reading: ${input.sourceTitle}` : "",
    "",
    `Explore latest insights: ${input.siteUrl}/blogs`,
    "",
    "—",
    `${input.siteName} · ${input.siteUrl}`,
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return { subject, html, text };
}
