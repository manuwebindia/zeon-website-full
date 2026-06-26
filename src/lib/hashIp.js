import { createHash } from 'crypto';

/**
 * One-way SHA-256 hash of an IP address.
 * Never store raw IPs — always hash before persisting to DB.
 * @param {string} ip
 * @returns {string} 64-char hex digest
 */
export function hashIp(ip) {
  return createHash('sha256').update(String(ip)).digest('hex');
}
