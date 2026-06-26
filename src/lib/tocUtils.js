// src/lib/tocUtils.js
// Shared Table of Contents utilities — works server-side and client-side

/**
 * Generates a URL-safe anchor ID from heading text.
 * e.g. "Why SEO Matters?" → "why-seo-matters"
 */
export function headingToId(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extracts H2/H3/H4 headings from an array of content blocks.
 * Returns: [{ id, text, level }]
 * Works from raw HTML strings in text blocks.
 */
export function extractHeadings(content = []) {
  const headings = [];

  for (const block of content) {
    if (block.type !== 'text' || !block.html) continue;

    // `s` flag: dot matches newlines — handles multi-line or nested-tag headings
    const matches = [...block.html.matchAll(/<(h[234])[^>]*>([\s\S]*?)<\/h[234]>/gi)];

    for (const match of matches) {
      const tag = match[1].toLowerCase();          // "h2" | "h3" | "h4"
      const innerHtml = match[2] || '';
      const text = innerHtml.replace(/<[^>]*>/g, '').trim();

      if (!text) continue;

      const level = parseInt(tag[1], 10);           // 2 | 3 | 4
      const id = headingToId(text);

      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Injects anchor `id` attributes into H2/H3/H4 tags in an HTML string.
 * Used in BlogContent before dangerouslySetInnerHTML so scroll links work.
 * Skips headings that already have an id attribute.
 */
export function addIdsToHtml(html = '') {
  return html.replace(
    /<(h[234])([^>]*)>([\s\S]*?)<\/h[234]>/gi,
    (match, tag, attrs, inner) => {
      // Skip if already has id
      if (/\bid=/i.test(attrs)) return match;

      const text = inner.replace(/<[^>]*>/g, '').trim();
      if (!text) return match;

      const id = headingToId(text);
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );
}
