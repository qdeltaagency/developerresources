import crypto from "crypto";
import { cookies } from "next/headers";

// Strictly read from environment variable — zero hardcoded secrets allowed in source code
export const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "";
export const COOKIE_NAME = "admin_session";

// Secret internal salt for HMAC token derivation
const SESSION_SALT = "wtf-admin-session-v2-salt";

/**
 * Computes a cryptographically secure HMAC session token.
 * This is irreversible — even if the cookie is seen, the underlying admin password cannot be recovered.
 */
export function computeSessionToken(key: string = ADMIN_KEY): string {
  if (!key) return "";
  return crypto.createHmac("sha256", SESSION_SALT).update(key.trim()).digest("hex");
}

/**
 * Validates the admin secret key using timing-safe comparison.
 * Protects against timing attacks that attempt to deduce key length or characters.
 * Accepts both exact key and key without trailing exclamation mark for user convenience.
 */
export function isValidAdminKey(providedKey: string | null | undefined): boolean {
  if (!providedKey || typeof providedKey !== "string" || !ADMIN_KEY) return false;

  const trimmed = providedKey.trim();
  const keyWithExclamation = ADMIN_KEY.endsWith("!") ? ADMIN_KEY : ADMIN_KEY + "!";
  const keyWithoutExclamation = ADMIN_KEY.replace(/!$/, "");

  // Hash values to fixed 32-byte buffers to guarantee constant-length comparison for timingSafeEqual
  const hashProvided = crypto.createHash("sha256").update(trimmed).digest();
  const hashWith = crypto.createHash("sha256").update(keyWithExclamation).digest();
  const hashWithout = crypto.createHash("sha256").update(keyWithoutExclamation).digest();

  return (
    crypto.timingSafeEqual(hashProvided, hashWith) ||
    crypto.timingSafeEqual(hashProvided, hashWithout)
  );
}

/**
 * Validates the session token using timing-safe comparison.
 */
export function isValidSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string" || !ADMIN_KEY) return false;

  const validHmac = computeSessionToken(ADMIN_KEY);
  const validHmacAlt = computeSessionToken(ADMIN_KEY.replace(/!$/, ""));

  const hashToken = crypto.createHash("sha256").update(token).digest();
  const hashValid = crypto.createHash("sha256").update(validHmac).digest();
  const hashValidAlt = crypto.createHash("sha256").update(validHmacAlt).digest();

  return (
    crypto.timingSafeEqual(hashToken, hashValid) ||
    crypto.timingSafeEqual(hashToken, hashValidAlt)
  );
}

/**
 * In-memory sliding-window rate limiter for brute-force defense.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Unified authorization helper for all admin API route handlers.
 * Checks session cookie first, then x-admin-key header.
 */
export async function isAuthorized(req: Request): Promise<boolean> {
  if (!ADMIN_KEY) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (session && isValidSessionToken(session.value)) {
    return true;
  }

  const headerKey = req.headers.get("x-admin-key");
  if (headerKey && isValidAdminKey(headerKey)) {
    return true;
  }

  return false;
}
