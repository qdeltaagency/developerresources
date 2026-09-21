/**
 * Comprehensive input sanitization and URL safety utilities
 */

/**
 * Safe URL Sanitizer to prevent XSS via javascript:, data:, vbscript: pseudo-protocols in links.
 */
export function safeUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();

  // Explicitly block script execution protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    console.warn("Blocked unsafe URL execution attempt:", trimmed);
    return "#";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 * Also blocks localhost, private network addresses, and invalid protocols to prevent SSRF.
 */
export function isValidHttpUrl(testUrl: string): boolean {
  if (!testUrl || typeof testUrl !== "string") return false;
  try {
    const formatted =
      testUrl.startsWith("http://") || testUrl.startsWith("https://")
        ? testUrl
        : `https://${testUrl}`;
    const parsed = new URL(formatted);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    // Block local loopback & private subnets to prevent SSRF
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Strips HTML tags and excessive whitespace to neutralize stored XSS attempts.
 */
export function sanitizeText(input?: string | null, maxLength: number = 500): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip control characters
    .trim()
    .slice(0, maxLength);
}
