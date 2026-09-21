/**
 * Dynamically resolves the active canonical site URL.
 * Automatically adapts when you add a custom domain in Vercel in the future:
 * 1. NEXT_PUBLIC_SITE_URL environment variable (custom domain override)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (automatically injected by Vercel for custom domains)
 * 3. VERCEL_URL (active preview deployment address)
 * 4. Fallback default
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    return trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://developerresources-qd-elta.vercel.app";
}
