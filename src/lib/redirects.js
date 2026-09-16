import fs from 'fs/promises';
import path from 'path';

const REDIRECTS_PATH = path.join(process.cwd(), 'src/data/redirects.json');

/**
 * Normalizes a URL path by ensuring a leading slash and stripping trailing slashes.
 */
export function normalizePath(p) {
  if (!p || typeof p !== 'string') return '/';
  let clean = p.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (!clean.startsWith('/')) {
    clean = '/' + clean;
  }
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

/**
 * Reads all redirects from src/data/redirects.json
 */
export async function readRedirects() {
  try {
    const raw = await fs.readFile(REDIRECTS_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.redirects) ? parsed.redirects : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeRedirects([]);
      return [];
    }
    console.error('Error reading redirects.json:', error);
    return [];
  }
}

/**
 * Writes the redirects array to src/data/redirects.json
 */
export async function writeRedirects(redirects) {
  const dir = path.dirname(REDIRECTS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(REDIRECTS_PATH, JSON.stringify({ redirects }, null, 2), 'utf-8');
}

/**
 * Validates a redirect object and checks for self-referential loops or duplicates.
 */
export function validateRedirect({ source, destination, id, existingRedirects = [] }) {
  const normSource = normalizePath(source);
  const normDest = normalizePath(destination);

  if (!normSource || normSource === '/') {
    return { valid: false, error: 'Source URL cannot be empty or root (/)' };
  }
  if (!normDest) {
    return { valid: false, error: 'Destination URL is required' };
  }
  if (normSource === normDest) {
    return { valid: false, error: 'Source and Destination cannot be the same (redirect loop)' };
  }

  // Check for existing source conflict
  const duplicate = existingRedirects.find(
    (r) => r.id !== id && normalizePath(r.source) === normSource
  );
  if (duplicate) {
    return { valid: false, error: `A redirect rule for "${normSource}" already exists` };
  }

  return { valid: true, source: normSource, destination: normDest };
}

/**
 * Finds a matching redirect rule for a requested pathname.
 * Checks active rules with exact matching first, then prefix/wildcard matching.
 */
export function findMatchingRedirect(pathname, redirects = []) {
  if (!pathname || !redirects || !redirects.length) return null;

  const cleanPath = normalizePath(pathname).toLowerCase();

  for (const rule of redirects) {
    if (!rule.isActive) continue;

    const ruleSource = normalizePath(rule.source).toLowerCase();

    // 1. Exact match
    if (rule.matchType === 'exact' || !rule.matchType) {
      if (cleanPath === ruleSource) {
        return {
          ...rule,
          matchedDestination: rule.destination,
        };
      }
    }

    // 2. Wildcard match (e.g. /old-folder/*)
    if (ruleSource.endsWith('/*')) {
      const prefix = ruleSource.slice(0, -2);
      if (cleanPath.startsWith(prefix)) {
        const remainder = cleanPath.slice(prefix.length);
        const destinationBase = rule.destination.endsWith('/')
          ? rule.destination.slice(0, -1)
          : rule.destination;
        return {
          ...rule,
          matchedDestination: `${destinationBase}${remainder}`,
        };
      }
    }

    // 3. Prefix match
    if (rule.matchType === 'prefix') {
      if (cleanPath.startsWith(ruleSource)) {
        return {
          ...rule,
          matchedDestination: rule.destination,
        };
      }
    }
  }

  return null;
}

/**
 * Increments the hit counter and updates lastHitAt for a redirect rule.
 */
export async function recordRedirectHit(id) {
  try {
    const list = await readRedirects();
    let updated = false;
    const newList = list.map((rule) => {
      if (rule.id === id) {
        updated = true;
        return {
          ...rule,
          hits: (rule.hits || 0) + 1,
          lastHitAt: new Date().toISOString(),
        };
      }
      return rule;
    });

    if (updated) {
      await writeRedirects(newList);
    }
  } catch (error) {
    console.error('Failed to record redirect hit:', error);
  }
}
