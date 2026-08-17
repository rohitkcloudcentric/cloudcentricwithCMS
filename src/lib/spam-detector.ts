const DISPOSABLE_DOMAINS = [
  "yopmail.com",
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "trashmail.com",
  "guerrillamail.com",
  "sharklasers.com",
];

const JUNK_EMAILS = [
  "test@test.com",
  "test@gmail.com",
  "asdf@asdf.com",
  "asdf@gmail.com",
  "admin@gmail.com",
  "123@gmail.com",
  "abc@gmail.com",
  "qwer@qwer.com",
];

export function isSpamSubmission(formData: {
  name: string;
  email: string;
  phone: string;
  description: string;
  honeypot?: string;
}): { isSpam: boolean; reason?: string } {
  // 1. Honeypot check: if honeypot has any value, it's a bot
  if (formData.honeypot && formData.honeypot.trim().length > 0) {
    return { isSpam: true, reason: "Honeypot filled" };
  }

  const cleanName = formData.name.trim().toLowerCase();
  const cleanEmail = formData.email.trim().toLowerCase();
  const cleanPhone = formData.phone.trim().replace(/\D/g, "");
  const cleanDesc = formData.description.trim().toLowerCase();

  // 2. Name validation: too short, only numbers, or repeating characters
  if (cleanName.length < 2) {
    return { isSpam: true, reason: "Name too short" };
  }
  if (/^[0-9]+$/.test(cleanName)) {
    return { isSpam: true, reason: "Name is numeric" };
  }
  if (/(.)\1{4,}/.test(cleanName)) { // e.g. "aaaaa"
    return { isSpam: true, reason: "Repeating characters in name" };
  }

  // 3. Email validation: test/junk lists and disposable domains
  if (JUNK_EMAILS.includes(cleanEmail)) {
    return { isSpam: true, reason: "Junk email address" };
  }
  const emailDomain = cleanEmail.split("@")[1];
  if (emailDomain && DISPOSABLE_DOMAINS.includes(emailDomain)) {
    return { isSpam: true, reason: "Disposable email domain" };
  }

  // 4. Phone validation: repeating digits (e.g. 1111111111) or too short
  if (cleanPhone.length > 0) {
    if (cleanPhone.length < 7) {
      return { isSpam: true, reason: "Phone number too short" };
    }
    if (/(.)\1{6,}/.test(cleanPhone)) { // e.g. "1111111"
      return { isSpam: true, reason: "Repeating digits in phone" };
    }
  }

  // 5. Description validation: empty or purely spam keywords (cryptocurrency ads, free money, link spam)
  const spamKeywords = ["crypto profit", "make money online", "passive income", "seo optimization services", "free traffic", "buy traffic"];
  if (spamKeywords.some((keyword) => cleanDesc.includes(keyword))) {
    return { isSpam: true, reason: "Spam keywords in description" };
  }

  return { isSpam: false };
}
