/**
 * Admin password reset email. Same table-based, inline-styled layout as the newsletter email
 * so it renders in Outlook, Gmail, and mobile clients.
 */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export interface PasswordResetEmailInput {
  siteName: string;
  siteUrl: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
  /** Optional absolute PNG/JPG logo URL (SVG is blocked by many clients) */
  logoUrl?: string;
}

export function renderPasswordResetEmail(input: PasswordResetEmailInput): { subject: string; html: string; text: string } {
  const siteName = escapeHtml(input.siteName);
  const siteUrl = escapeHtml(input.siteUrl);
  const name = escapeHtml(input.name || "there");
  const resetUrl = escapeHtml(input.resetUrl);
  const minutes = input.expiresInMinutes;
  const year = new Date().getFullYear();
  const subject = `Reset your ${input.siteName} admin password`;
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
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Use this link within ${minutes} minutes to choose a new password.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#0B0B12;border:1px solid #23232f;border-radius:20px;overflow:hidden;">
          <tr>
            <td align="left" class="px" style="padding:28px 40px;background-color:#0E0B1F;background-image:linear-gradient(135deg,#1b1240 0%,#0E0B1F 55%,#0a1633 100%);border-bottom:1px solid #23232f;">
              <a href="${siteUrl}" style="text-decoration:none;">${logo}</a>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:40px 40px 8px 40px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#A78BFA;font-weight:700;">Admin Portal</p>
              <h1 class="h1" style="margin:0 0 16px 0;font-size:28px;line-height:36px;color:#ffffff;font-weight:700;">Reset your password</h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:24px;color:#C9C6D6;">Hi ${name},</p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:24px;color:#C9C6D6;">
                We received a request to reset the password for your <strong style="color:#ffffff;">${siteName}</strong> admin account.
                Click the button below to choose a new password. This link expires in <strong style="color:#ffffff;">${minutes} minutes</strong> and can be used once.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
                <tr>
                  <td align="center" style="border-radius:12px;background-color:#7C3AED;background-image:linear-gradient(90deg,#7C3AED,#4F8BFF);">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:12px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#8E8A9F;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0 0 28px 0;font-size:12px;line-height:18px;word-break:break-all;"><a href="${resetUrl}" style="color:#A78BFA;text-decoration:underline;">${resetUrl}</a></p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;width:100%;"><tr><td style="padding:14px 18px;background-color:#12121c;border:1px solid #2a2a3a;border-left:3px solid #7C3AED;border-radius:10px;font-size:13px;line-height:20px;color:#A8A4B8;">
                Didn't request this? You can safely ignore this email; your password won't change.
              </td></tr></table>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding:24px 40px 32px 40px;border-top:1px solid #23232f;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#ffffff;font-weight:700;">${siteName}</p>
              <p style="margin:0;font-size:12px;line-height:18px;color:#8E8A9F;">&copy; ${year} ${siteName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Hi ${input.name || "there"},`,
    "",
    `We received a request to reset the password for your ${input.siteName} admin account.`,
    `Open this link within ${minutes} minutes to choose a new password (it can be used once):`,
    "",
    input.resetUrl,
    "",
    "Didn't request this? You can safely ignore this email; your password won't change.",
    "",
    `${input.siteName} - ${input.siteUrl}`,
  ].join("\n");

  return { subject, html, text };
}
