import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-zeon-blog-dev-only-change-this';

/**
 * Signs a JWT token.
 * @param {Object} payload
 *   Env super admin:  { userId: 'env-super-admin', username, permissions: ['*'] }
 *   DB users:         { userId: cuid, username, permissions: ['blogs.view',...] }
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verifies and decodes a JWT. Returns payload or null.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the Bearer token from the Authorization header.
 * Returns decoded user payload or null.
 * @deprecated Use requirePermission() for new route handlers.
 */
export function authenticateRequest(request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7);
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Authenticates the request AND checks for a specific permission.
 * The '*' wildcard (env super admin) bypasses all permission checks.
 *
 * @param {Request} request
 * @param {string} permission - e.g. 'blogs.create'
 * @returns {Object|null} Decoded user payload if authorized, null otherwise
 */
export function requirePermission(request, permission) {
  const user = authenticateRequest(request);
  if (!user) return null;

  const perms = user.permissions;

  // Env super admin wildcard — bypasses every check
  if (Array.isArray(perms) && perms.includes('*')) return user;

  // Check specific permission key
  if (!Array.isArray(perms) || !perms.includes(permission)) return null;

  return user;
}
