/**
 * Password rules for password resets. Pure: shared by the reset page (live checklist) and the API.
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 100;

export const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
  { label: `At least ${PASSWORD_MIN} characters`, test: (pw) => pw.length >= PASSWORD_MIN },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /\d/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/** First problem with the password, or null when it meets every rule. */
export function passwordProblem(pw: string): string | null {
  if (pw.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters.`;
  const failed = PASSWORD_RULES.find((r) => !r.test(pw));
  return failed ? `Password needs: ${failed.label.toLowerCase()}.` : null;
}
