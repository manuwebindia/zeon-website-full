const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '../../..');
const UPLOAD_CANDIDATES = [
  path.join(ROOT, 'migration-data/public/wp-content/uploads'),
  path.join(ROOT, 'migration-data/wp-content/uploads'),
  path.join(ROOT, 'migration-data/uploads'),
];

function findUploadsRoot() {
  for (const p of UPLOAD_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function uploadsPathFromUrl(url, uploadsRoot) {
  const match = String(url).match(/\/wp-content\/uploads\/(.+)$/i);
  if (!match) return null;
  return path.join(uploadsRoot, match[1].replace(/\?.*$/, ''));
}

function resolveLocalPath(url, uploadsRoot) {
  const clean = String(url).replace(/-\d+x\d+(\.[a-z]+)$/i, '$1');
  const direct = uploadsPathFromUrl(clean, uploadsRoot);
  const candidates = new Set();
  if (direct) candidates.add(direct);

  const rel = clean.match(/\/wp-content\/uploads\/(.+)$/i)?.[1];
  if (rel) {
    const dir = path.dirname(rel);
    const base = path.basename(rel, path.extname(rel)).replace(/-scaled$/, '');
    for (const ext of ['.webp', '.jpg', '.jpeg', '.png', '.gif']) {
      candidates.add(path.join(uploadsRoot, dir, base + ext));
      candidates.add(path.join(uploadsRoot, dir, base + '-scaled' + ext));
    }
  }

  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

async function copyToPublic(localPath, outDir, filename) {
  await fsp.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  const ext = path.extname(localPath).toLowerCase();
  if (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    await sharp(await fsp.readFile(localPath))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath.replace(/\.[^.]+$/, '.webp'));
    return outPath.replace(/\.[^.]+$/, '.webp');
  }
  await fsp.copyFile(localPath, outPath);
  return outPath;
}

function publicUrlFromPath(absPath, publicSegment) {
  const rel = path.relative(path.join(ROOT, 'public'), absPath).replace(/\\/g, '/');
  return `/${rel}`;
}

async function importMediaUrl(url, uploadsRoot, publicSegment, cache) {
  if (!url || !uploadsRoot) return url;
  if (cache.has(url)) return cache.get(url);

  const local = resolveLocalPath(url, uploadsRoot);
  if (!local) {
    cache.set(url, url);
    return url;
  }

  const outDir = path.join(ROOT, 'public/uploads', publicSegment);
  const base = path.basename(local, path.extname(local)).replace(/-scaled$/, '');
  const hash = Buffer.from(local).toString('base64url').slice(0, 10);
  const filename = `${base}-${hash}.webp`;
  const outAbs = await copyToPublic(local, outDir, filename);
  const publicUrl = publicUrlFromPath(outAbs, publicSegment);
  cache.set(url, publicUrl);
  return publicUrl;
}

async function rewriteBlocksMedia(blocks, uploadsRoot, publicSegment) {
  const cache = new Map();
  const out = [];
  for (const block of blocks) {
    if (block.type === 'image' && block.src) {
      out.push({
        ...block,
        src: await importMediaUrl(block.src, uploadsRoot, publicSegment, cache),
      });
    } else if (block.type === 'text' && block.html) {
      let html = block.html;
      const re = /https?:\/\/(?:www\.)?zeonacademy\.com\/wp-content\/uploads\/[^\s"'<>]+/gi;
      const matches = [...html.matchAll(re)];
      for (const m of matches) {
        const local = await importMediaUrl(m[0], uploadsRoot, publicSegment, cache);
        html = html.split(m[0]).join(local);
      }
      out.push({ ...block, html });
    } else {
      out.push(block);
    }
  }
  return out;
}

module.exports = {
  findUploadsRoot,
  resolveLocalPath,
  importMediaUrl,
  rewriteBlocksMedia,
  publicUrlFromPath,
};
