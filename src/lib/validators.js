// ── Indian Mobile Phone Validator & Formatter ─────────────────────────────────
// Shared between client (ChatWidget) and server (API routes).
// Rules (Decision 8):
//   - Strip spaces, dashes, parentheses, dots.
//   - Accept +91 / 91 / 0 prefix — strip it.
//   - After stripping: exactly 10 digits.
//   - First digit must be 6, 7, 8, or 9.
//   - Reject all-same-digit numbers (e.g. 9999999999).

/**
 * Strips a raw phone string to a normalised 10-digit Indian mobile number.
 * Returns the cleaned string for further validation.
 * @param {string} raw
 * @returns {string}
 */
function cleanPhone(raw) {
  let s = String(raw).replace(/[\s\-().]/g, '');
  // Remove country code prefix
  if (s.startsWith('+91')) s = s.slice(3);
  else if (s.startsWith('91') && s.length === 12) s = s.slice(2);
  else if (s.startsWith('0') && s.length === 11) s = s.slice(1);
  return s;
}

/**
 * Validates an Indian mobile phone number.
 * @param {string} raw
 * @returns {boolean}
 */
export function validateIndianPhone(raw) {
  if (!raw) return false;
  const s = cleanPhone(raw);
  if (!/^\d{10}$/.test(s)) return false;
  if (!/^[6789]/.test(s)) return false;
  // Reject all-same-digit (e.g. 0000000000, 9999999999)
  if (/^(.)\1{9}$/.test(s)) return false;
  return true;
}

/**
 * Returns the normalised 10-digit form. Call after validateIndianPhone passes.
 * @param {string} raw
 * @returns {string}
 */
export function formatIndianPhone(raw) {
  return cleanPhone(raw);
}

// ── Message Sanitiser ─────────────────────────────────────────────────────────
// Decision 20: filter roles, strip control chars, cap content length, cap array.

const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
const MAX_CONTENT_LEN = 1000;
const ALLOWED_ROLES = new Set(['user', 'assistant']);

/**
 * Sanitises a messages array before sending to OpenRouter.
 *  - Filters out any messages with roles other than 'user' or 'assistant'.
 *  - Strips control characters from content.
 *  - Caps each content string at MAX_CONTENT_LEN chars.
 *  - Caps the array at the last 10 items.
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Array<{role: string, content: string}>}
 */
export function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && ALLOWED_ROLES.has(m.role) && typeof m.content === 'string')
    .map((m) => ({
      role: m.role,
      content: m.content.replace(CONTROL_CHAR_RE, '').slice(0, MAX_CONTENT_LEN),
    }))
    .slice(-10);
}
