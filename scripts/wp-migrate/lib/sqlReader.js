const fs = require('fs');
const readline = require('readline');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const DEFAULT_SQL = path.join(ROOT, 'migration-data/u496631329_cooombh.sql');

function extractSqlStringValue(line, startIdx) {
  let end = startIdx;
  while (end < line.length) {
    if (line[end] === "'" && line[end - 1] !== '\\') break;
    end++;
  }
  return line.slice(startIdx, end);
}

function parsePostLine(line) {
  if (!line.startsWith('(')) return null;

  const tail = line.match(/,\s*(\d+),\s*'https?:[^']*',\s*(\d+),\s*'(post|page|attachment|[^']+)',\s*'[^']*',\s*(\d+)\s*\)[,;]?\s*$/);
  if (!tail) return null;

  const idMatch = line.match(/^\((\d+),/);
  if (!idMatch) return null;

  const statusMatch = line.match(/,\s*'(publish|draft|private|pending|future)',\s*'/);
  const slugMatch = line.match(/,\s*'(publish|draft|private|pending|future)',\s*'[^']*',\s*'[^']*',\s*'',\s*'([^']*)',/);

  return {
    id: parseInt(idMatch[1], 10),
    slug: slugMatch ? slugMatch[2] : '',
    status: statusMatch ? statusMatch[1] : 'draft',
    postType: tail[3],
    rawLine: line,
  };
}

function extractTitleFromLine(line) {
  const slugMatch = line.match(/,\s*'(publish|draft|private)',\s*'[^']*',\s*'[^']*',\s*'',\s*'([^']*)',/);
  if (!slugMatch) return null;
  const slug = slugMatch[2];
  const slugIdx = line.indexOf(`'', '${slug}',`);
  if (slugIdx === -1) return null;
  const before = line.slice(0, slugIdx);
  const titleMatches = [...before.matchAll(/,\s*'((?:[^'\\]|\\.)*)'\s*,\s*'(?:[^'\\]|\\.)*'\s*,\s*'(publish|draft|private)',\s*'[^']*',\s*'[^']*',\s*''\s*$/g)];
  if (titleMatches.length) {
    return titleMatches[titleMatches.length - 1][1].replace(/\\'/g, "'").replace(/\\"/g, '"');
  }
  return null;
}

async function streamWpPosts(sqlPath = DEFAULT_SQL, { postType, status = 'publish' } = {}) {
  if (!fs.existsSync(sqlPath)) return [];

  const posts = [];
  const rs = fs.createReadStream(sqlPath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: rs, crlfDelay: Infinity });

  for await (const line of lines) {
    const parsed = parsePostLine(line);
    if (!parsed) continue;
    if (postType && parsed.postType !== postType) continue;
    if (status && parsed.status !== status) continue;
    if (!parsed.slug) continue;
    posts.push(parsed);
  }

  return posts;
}

async function findPostMeta(postId, metaKey, sqlPath = DEFAULT_SQL) {
  if (!fs.existsSync(sqlPath)) return null;
  const needle = `, ${postId}, '${metaKey}', '`;
  const rs = fs.createReadStream(sqlPath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: rs, crlfDelay: Infinity });

  for await (const line of lines) {
    const idx = line.indexOf(needle);
    if (idx === -1) continue;
    return extractSqlStringValue(line, idx + needle.length);
  }
  return null;
}

async function getPostMetaMap(postId, keys, sqlPath = DEFAULT_SQL) {
  const out = Object.fromEntries(keys.map((k) => [k, null]));
  if (!fs.existsSync(sqlPath)) return out;

  const needles = keys.map((k) => ({ key: k, needle: `, ${postId}, '${k}', '` }));
  const rs = fs.createReadStream(sqlPath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: rs, crlfDelay: Infinity });
  let remaining = keys.length;

  for await (const line of lines) {
    if (remaining === 0) break;
    for (const { key, needle } of needles) {
      if (out[key] !== null) continue;
      const idx = line.indexOf(needle);
      if (idx === -1) continue;
      out[key] = extractSqlStringValue(line, idx + needle.length);
      remaining--;
    }
  }
  return out;
}

function extractUrlsFromText(text) {
  if (!text) return [];
  const normalized = text.replace(/\\\\\//g, '/').replace(/\\\//g, '/');
  const urls = [];
  const re = /https?:\/\/(?:www\.)?zeonacademy\.com\/wp-content\/uploads\/[^\s"'\\)]+/gi;
  let m;
  while ((m = re.exec(normalized))) {
    urls.push(m[0].replace(/-\d+x\d+(\.[a-z]+)$/i, '$1').replace(/\?.*$/, ''));
  }
  return [...new Set(urls)];
}

async function getAttachmentUrl(attachmentId, sqlPath = DEFAULT_SQL) {
  if (!attachmentId) return null;
  const rs = fs.createReadStream(sqlPath, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: rs, crlfDelay: Infinity });
  const needle = `\n(${attachmentId}, `;

  for await (const line of lines) {
    if (!line.startsWith(`(${attachmentId},`)) continue;
    const guidMatch = line.match(/,\s*'https?:\/\/[^']*\/wp-content\/uploads\/[^']*',\s*\d+,\s*'attachment'/);
    if (guidMatch) {
      const urlMatch = line.match(/'(https?:\/\/[^']*\/wp-content\/uploads\/[^']*)'/);
      return urlMatch ? urlMatch[1].replace(/\\'/g, "'") : null;
    }
  }
  return null;
}

function extractPostDateFromLine(line) {
  const m = line.match(/^\(\d+,\s*\d+,\s*'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})',/);
  if (!m) return null;
  const parsed = new Date(m[1].replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractPostContentFromLine(line) {
  const m = line.match(/^\(\d+,\s*\d+,\s*'[^']*',\s*'[^']*',\s*'((?:[^'\\]|\\.)*)',\s*'/);
  if (!m) return '';
  return m[1]
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n');
}

module.exports = {
  DEFAULT_SQL,
  streamWpPosts,
  findPostMeta,
  getPostMetaMap,
  extractTitleFromLine,
  extractPostDateFromLine,
  extractPostContentFromLine,
  extractUrlsFromText,
  getAttachmentUrl,
  parsePostLine,
};
