/** Server-only: sends the subscription confirmation email and records the outcome on the subscriber. */
import prisma from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/config/seo.config";
import { sendMail, type MailResult } from "@/lib/mailer";
import { renderNewsletterWelcome } from "@/lib/email-templates/newsletter-welcome";

export async function sendWelcomeEmail(subscriber: {
  id: string;
  email: string;
  unsubscribeToken: string;
  sourceTitle: string | null;
}): Promise<MailResult> {
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
  const { subject, html, text } = renderNewsletterWelcome({
    siteName: process.env.APP_NAME || SITE_NAME,
    siteUrl: SITE_URL,
    email: subscriber.email,
    sourceTitle: subscriber.sourceTitle,
    logoUrl: process.env.MAIL_LOGO_URL || undefined,
    unsubscribeUrl,
  });

  const result = await sendMail({
    to: subscriber.email,
    subject,
    html,
    text,
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
  });

  await prisma.newsletterSubscriber
    .update({
      where: { id: subscriber.id },
      data: result.ok ? { emailSentAt: new Date(), emailError: null } : { emailError: result.error },
    })
    .catch((e) => console.error("[newsletter] Failed to record email status:", e));

  return result;
}
