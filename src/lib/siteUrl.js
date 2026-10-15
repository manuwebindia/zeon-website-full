// Centralized site URL helper
// Prioritizes environment variables, with fallback to the official site domain.

export const DEFAULT_SITE_URL = 'https://www.zeonacademy.com';

/**
 * Returns the normalized base site URL without trailing slash.
 * Works safely on both client and server.
 */
export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_SITE_URL;

  return url.replace(/\/$/, '');
}
