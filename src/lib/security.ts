/* eslint-disable no-control-regex */
/**
 * Security & Sanitization Utilities
 * Protects against XSS, input injection, URL schema exploits, and transmission spam.
 */

const COOLDOWN_KEY = 'nexus_contact_last_submission';
const COOLDOWN_SECONDS = 60;

/**
 * Strips HTML tags, script markers, null bytes, and trims string.
 * Enforces maximum character limits to prevent buffer/payload bloat.
 */
export function sanitizeText(input: unknown, maxLength = 5000): string {
  if (typeof input !== 'string') return '';
  
  // 1. Strip null bytes & control chars
  let clean = input.replace(/\0/g, '').replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  // 2. Strip HTML tags / script markers
  clean = clean.replace(/<[^>]*>?/gm, '');

  // 3. Trim whitespace
  clean = clean.trim();

  // 4. Enforce max length constraint
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  return clean;
}

/**
 * Validates and sanitizes email address according to RFC-standard syntax.
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed) || trimmed.length > 255) {
    return '';
  }
  return trimmed;
}

/**
 * Sanitizes URLs to prevent `javascript:`, `data:`, or `vbscript:` injection.
 * Only permits `http:`, `https:`, `mailto:`, or internal anchors `#`.
 */
export function sanitizeUrl(url: unknown, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow relative anchor links
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Allow mailto
  if (trimmed.startsWith('mailto:')) {
    const email = trimmed.replace('mailto:', '');
    return sanitizeEmail(email) ? `mailto:${sanitizeEmail(email)}` : fallback;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Malformed URL
  }

  return fallback;
}

/**
 * Checks client-side submission rate limiting.
 * Prevents automated flood attacks by enforcing a cooldown between transmissions.
 */
export function checkSubmissionRateLimit(): { allowed: boolean; remainingSeconds: number } {
  try {
    const lastTimestampStr = localStorage.getItem(COOLDOWN_KEY);
    if (!lastTimestampStr) {
      return { allowed: true, remainingSeconds: 0 };
    }
    const lastTimestamp = parseInt(lastTimestampStr, 10);
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTimestamp) / 1000);

    if (elapsedSeconds < COOLDOWN_SECONDS) {
      return {
        allowed: false,
        remainingSeconds: COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
  } catch {
    // If localStorage is unavailable, proceed safely
  }

  return { allowed: true, remainingSeconds: 0 };
}

/**
 * Records the timestamp of a successful contact transmission to activate the cooldown.
 */
export function recordSubmissionTimestamp(): void {
  try {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
  } catch {
    // ignore
  }
}
