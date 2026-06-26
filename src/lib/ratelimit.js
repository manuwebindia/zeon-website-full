import prisma from '@/lib/db';
import { hashIp } from '@/lib/hashIp';

/**
 * DB-backed rate limiting using the RateLimit table (MySQL).
 * No Redis required — works on any VPS with the existing Prisma setup.
 *
 * Algorithm:
 *  1. Probabilistic cleanup — 5% chance, deletes rows older than 1 hour.
 *  2. Count rows matching (ipHash, endpoint) within the window.
 *  3. If count >= limit: return { allowed: false, retryAfter }.
 *  4. Otherwise: insert a new row and return { allowed: true }.
 *
 * @param {string} ipRaw       - Raw IP string (will be hashed)
 * @param {string} endpoint    - Logical endpoint key (e.g. 'chat', 'lead-submit')
 * @param {number} limit       - Max requests allowed within the window
 * @param {number} windowMs    - Window size in milliseconds
 * @returns {Promise<{ allowed: boolean, retryAfter: number }>}
 */
export async function checkRateLimit(ipRaw, endpoint, limit, windowMs) {
  const ipHash = hashIp(ipRaw);
  const windowStart = new Date(Date.now() - windowMs);

  // ── Probabilistic cleanup (5% chance) ────────────────────────────────────
  if (Math.random() < 0.05) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await prisma.rateLimit.deleteMany({
      where: { createdAt: { lt: oneHourAgo } },
    }).catch((err) => {
      // Cleanup failure must never block the request
      console.warn('[ratelimit] cleanup failed:', err.message);
    });
  }

  // ── Count recent requests from this IP on this endpoint ──────────────────
  const count = await prisma.rateLimit.count({
    where: {
      ipHash,
      endpoint,
      createdAt: { gte: windowStart },
    },
  });

  if (count >= limit) {
    // Calculate how many seconds until the oldest entry in the window expires
    const oldest = await prisma.rateLimit.findFirst({
      where: { ipHash, endpoint, createdAt: { gte: windowStart } },
      orderBy: { createdAt: 'asc' },
    });
    const retryAfter = oldest
      ? Math.ceil((oldest.createdAt.getTime() + windowMs - Date.now()) / 1000)
      : Math.ceil(windowMs / 1000);
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
  }

  // ── Record this request ───────────────────────────────────────────────────
  await prisma.rateLimit.create({
    data: { ipHash, endpoint },
  });

  return { allowed: true, retryAfter: 0 };
}
