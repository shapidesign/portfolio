/**
 * Hardcoded admin credentials for the content editor.
 *
 * Values default to the requested login but can be overridden with env vars so
 * the secret can be kept out of a public repo. Set ADMIN_USER, ADMIN_PASS and a
 * random ADMIN_SESSION_SECRET in the Vercel project settings to override.
 *
 * ponytail: single static session token, no expiry/rotation. Ceiling: fine for
 * a one-person portfolio admin; upgrade path is a signed/expiring JWT if needed.
 *
 * This module must stay edge-safe (no Node-only APIs) so `middleware.ts` can
 * import it.
 */
export const ADMIN_USER = process.env.ADMIN_USER ?? "shapi";
export const ADMIN_PASS = process.env.ADMIN_PASS ?? "Syxhxnt12!";

export const SESSION_COOKIE = "admin_session";
export const SESSION_TOKEN =
  process.env.ADMIN_SESSION_SECRET ?? "sp_admin_2f9c1a7b4e6d8f0a3c5e7b9d1f2a4c6e";

export function verifyCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function isValidSession(token: string | undefined | null): boolean {
  return typeof token === "string" && token === SESSION_TOKEN;
}
