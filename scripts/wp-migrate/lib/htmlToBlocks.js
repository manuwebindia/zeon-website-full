const { randomBytes } = require('crypto');

function blockId() {
  return randomBytes(8).toString('hex');
}

function normalizeHtml(text) {
  return String(text || '')
    .replace(/\\\\\//g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"');
}

function extractImageTags(html) {
  const images = [];
  const re = /<img[^>]+>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (!src || !/\/wp-content\/uploads\//i.test(src)) continue;
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || '';
    images.push({ src, alt, index: m.index, length: tag.length });
  }
  return images;
}

function htmlToBlocks(html) {
  const normalized = normalizeHtml(html);
  if (!normalized.trim()) return [];

  const blocks = [];
  const images = extractImageTags(normalized);
  if (images.length === 0) {
    blocks.push({ id: blockId(), type: 'text', html: normalized.trim() });
    return blocks;
  }

  let cursor = 0;
  for (const img of images) {
    const before = normalized.slice(cursor, img.index).trim();
    if (before) {
      blocks.push({ id: blockId(), type: 'text', html: before });
    }
    blocks.push({
      id: blockId(),
      type: 'image',
      src: img.src.replace(/-\d+x\d+(\.[a-z]+)$/i, '$1'),
      alt: img.alt,
      caption: null,
    });
    cursor = img.index + img.length;
  }

  const after = normalized.slice(cursor).trim();
  if (after) {
    blocks.push({ id: blockId(), type: 'text', html: after });
  }

  return blocks.length ? blocks : [{ id: blockId(), type: 'text', html: normalized.trim() }];
}

function mergeHtmlSources(...parts) {
  return parts.filter(Boolean).join('\n');
}

module.exports = { htmlToBlocks, mergeHtmlSources, normalizeHtml };
