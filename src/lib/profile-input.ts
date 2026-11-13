/**
 * Profile field validation, shared by the profile page (client) and the API (server).
 * Pure functions only: no database or Node imports.
 */
export const PROFILE_LIMITS = { name: 100, username: 30, phone: 20 };

export interface ProfileInput {
  name: string;
  username: string;
  phone: string;
  avatarUrl: string;
}

export type ProfileErrors = Partial<Record<keyof ProfileInput, string>>;

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]*$/;
const PHONE_RE = /^\+?[0-9][0-9 ()-]*$/;

export function normalizeUsername(v: string) {
  return v.trim().toLowerCase();
}

/** Local upload path or http(s) URL; no protocol-relative or script URLs. */
export function isValidAvatarUrl(s: string): boolean {
  if (s.startsWith("/")) return !s.startsWith("//") && !s.includes("..") && !/[\s"'<>\\]/.test(s);
  return /^https?:\/\/[^\s"'<>]+$/i.test(s);
}

export function validateProfile(input: ProfileInput): ProfileErrors {
  const errors: ProfileErrors = {};
  const name = input.name.trim();
  const username = normalizeUsername(input.username);
  const phone = input.phone.trim();

  if (!name) errors.name = "Full name is required.";
  else if (name.length < 2) errors.name = "Full name must be at least 2 characters.";
  else if (name.length > PROFILE_LIMITS.name) errors.name = `Full name must be at most ${PROFILE_LIMITS.name} characters.`;

  if (username) {
    if (username.length < 3 || username.length > PROFILE_LIMITS.username) {
      errors.username = `Username must be 3-${PROFILE_LIMITS.username} characters.`;
    } else if (!USERNAME_RE.test(username)) {
      errors.username = "Use only letters, numbers, dots, dashes and underscores.";
    }
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > PROFILE_LIMITS.phone) {
      errors.phone = "Enter a valid mobile number (7-15 digits, optional leading +).";
    }
  }

  if (input.avatarUrl.trim() && !isValidAvatarUrl(input.avatarUrl.trim())) {
    errors.avatarUrl = "Profile picture must be an uploaded image or a valid http(s) URL.";
  }

  return errors;
}
