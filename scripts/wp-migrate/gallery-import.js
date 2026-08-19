/**
 * Import WordPress gallery albums from migration-data.
 *
 * Usage:
 *   npm run wp:import-gallery:dry
 *   npm run wp:import-gallery:dry -- --scan-sql
 *   npm run wp:import-gallery              # manifest only (titles/slugs, no SQL read)
 *   npm run wp:import-gallery:scan           # scan SQL dump for per-album image URLs
 *   npm run wp:import-gallery:scan -- --reset  # wipe DB + public/uploads/gallery first
 *
 * Uploads folder: migration-data/uploads (or migration-data/public/wp-content/uploads)
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '../..');
const SQL_PATH = path.join(ROOT, 'migration-data/u496631329_cooombh.sql');
const GALLERY_OUT = path.join(ROOT, 'public/uploads/gallery');
const UPLOAD_CANDIDATES = [
  path.join(ROOT, 'migration-data/public/wp-content/uploads'),
  path.join(ROOT, 'migration-data/wp-content/uploads'),
  path.join(ROOT, 'migration-data/uploads'),
];

const KNOWN_ALBUMS = [
  { slug: 'onam-celebration-2025', title: 'Onam Celebration 2025', sortOrder: 0 },
  { slug: 'graduation-day-2025', title: 'Graduation Day 2025', sortOrder: 1 },
  { slug: 'holi-celebration-2024', title: 'Holi Celebration 2024', sortOrder: 2 },
  { slug: 'xmas-celebration-2024', title: "X'mas Celebration 2024", sortOrder: 3 },
  { slug: 'xmas-celebration-2023', title: "X'mas Celebration 2023", sortOrder: 4 },
  { slug: 'onam-celebration-2024', title: 'Onam Celebration 2024', sortOrder: 5 },
  { slug: 'q-and-a-with-zeon-students', title: 'Q&A with Zeon Students', sortOrder: 6 },
  { slug: 'graduation-day-2024', title: 'Graduation Day 2024', sortOrder: 7 },
  { slug: 'kerala-piravi-celebration-2023', title: 'Kerala Piravi Celebration 2023', sortOrder: 8 },
  { slug: 'onam-celebration-2023', title: 'Onam Celebration 2023', sortOrder: 9 },
  { slug: 'birthday-celebration', title: 'Birthday Celebration', sortOrder: 10 },
  { slug: 'holi-celebration', title: 'Holi Celebration 2023', sortOrder: 11 },
  { slug: 'graduation-ceremony-2023', title: 'Graduation Day 2023', sortOrder: 12 },
  { slug: 'graduation-day-2024-2nd-batch', title: 'Graduation Day 2024 (2nd Batch)', sortOrder: 13 },
  { slug: 'keralapiravi-celebration', title: 'Kerala Piravi Celebration', sortOrder: 14 },
  { slug: 'keralapiravi-celebrations-2023', title: 'Kerala Piravi Celebrations 2023', sortOrder: 15 },
  { slug: 'xmas-celebration', title: 'Christmas Celebration 2022', sortOrder: 16 },
];

const commit = process.argv.includes('--commit');
const dryRun = !commit;
const scanSql = process.argv.includes('--scan-sql');
const reset = process.argv.includes('--reset');

const SKIP_URL_RE =
  /(?:banner|Zeon-Logo|preema\.jpg|Gallery-banner|favicon|icon-|logo\.(?:png|webp|jpg)|gallery_tile|tile0[0-9])/i;

function findUploadsRoot() {
  for (const p of UPLOAD_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function cleanUrl(raw) {
  return String(raw)
    .replace(/\\u002F/g, '/')
    .replace(/\\\//g, '/')
    .replace(/\\\\\//g, '/')
    .split(/[\s"'<>]/)[0]
    .replace(/\?.*$/, '');
}

function normalizeSqlText(text) {
  return text.replace(/\\\\\//g, '/').replace(/\\\//g, '/');
}

function extractUrls(text) {
  const normalized = normalizeSqlText(text);
  const urls = [];
  const seen = new Set();
  const re = /https?:\/\/(?:www\.)?zeonacademy\.com\/wp-content\/uploads\/[^\s"'\\)]+/gi;
  let m;
  while ((m = re.exec(normalized))) {
    const url = cleanUrl(m[0]);
    if (!/\.(jpe?g|png|webp|gif)$/i.test(url)) continue;
    if (SKIP_URL_RE.test(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

async function findPostId(slug) {
  if (!fs.existsSync(SQL_PATH)) return null;

  const wpPostsNeedle = `'publish', 'closed', 'closed', '', '${slug}',`;
  let postId = null;
  const rs = fs.createReadStream(SQL_PATH, { encoding: 'utf8', highWaterMark: 16 * 1024 * 1024 });
  let carry = '';

  await new Promise((resolve, reject) => {
    rs.on('data', (chunk) => {
      if (postId) return;
      const data = carry + chunk;
      const idx = data.indexOf(wpPostsNeedle);
      if (idx === -1) {
        carry = data.slice(-300);
        return;
      }
      const rowStart = data.lastIndexOf('\n(', idx);
      const parenStart = rowStart === -1 ? data.lastIndexOf('(', idx) : rowStart + 1;
      const m = data.slice(parenStart).match(/^\((\d+),/);
      if (m) postId = m[1];
      carry = data.slice(-300);
    });
    rs.on('end', resolve);
    rs.on('error', reject);
  });

  return postId;
}

function extractSqlStringValue(line, startIdx) {
  let end = startIdx;
  while (end < line.length) {
    if (line[end] === "'" && line[end - 1] !== '\\') break;
    end++;
  }
  return line.slice(startIdx, end);
}

async function findPostMetaBlob(postId, metaKey) {
  if (!fs.existsSync(SQL_PATH)) return null;

  const needle = `, ${postId}, '${metaKey}', '`;
  const rs = fs.createReadStream(SQL_PATH, { encoding: 'utf8' });
  const lines = readline.createInterface({ input: rs, crlfDelay: Infinity });

  for await (const line of lines) {
    const idx = line.indexOf(needle);
    if (idx === -1) continue;
    return extractSqlStringValue(line, idx + needle.length);
  }
  return null;
}

async function urlsForAlbumSlug(slug) {
  const postId = await findPostId(slug);
  if (!postId) {
    console.warn(`  no wp_posts row for ${slug}`);
    return [];
  }

  const elementor = await findPostMetaBlob(postId, '_elementor_data');
  const urls = extractUrls(elementor || '');

  if (urls.length === 0 && elementor) {
    console.warn(`  post ${postId}: elementor data found but no gallery URLs`);
  } else if (!elementor) {
    console.warn(`  post ${postId}: no _elementor_data`);
  }

  return urls;
}

function uploadsPathFromUrl(url, uploadsRoot) {
  const match = url.match(/\/wp-content\/uploads\/(.+)$/i);
  if (!match) return null;
  return path.join(uploadsRoot, match[1]);
}

async function copyImageToGallery(localPath, slug, index) {
  await fsp.mkdir(GALLERY_OUT, { recursive: true });
  const base = `${slug}-${index}`;
  const outPath = path.join(GALLERY_OUT, `${base}.webp`);
  const buf = await fsp.readFile(localPath);
  await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  return `/uploads/gallery/${base}.webp`;
}

async function resetGallery(prisma) {
  console.log('Resetting gallery albums, images, and public/uploads/gallery...');
  await prisma.galleryImage.deleteMany({});
  await prisma.galleryAlbum.deleteMany({});
  await fsp.rm(GALLERY_OUT, { recursive: true, force: true });
  console.log('Reset complete.\n');
}

async function main() {
  const uploadsRoot = findUploadsRoot();
  if (!uploadsRoot) {
    console.warn('⚠ No local wp-content/uploads under migration-data/. Image copy skipped.');
  } else {
    console.log('Uploads root:', uploadsRoot);
  }

  const prisma = new PrismaClient();

  if (reset && !dryRun) {
    await resetGallery(prisma);
  } else if (reset && dryRun) {
    console.log('[dry-run] Would reset gallery DB rows and public/uploads/gallery\n');
  }

  for (const album of KNOWN_ALBUMS) {
    let urls = [];
    if (scanSql) {
      console.log(`Scanning SQL for ${album.slug}...`);
      urls = await urlsForAlbumSlug(album.slug);
    }

    const images = [];
    let coverImage = null;
    let copied = 0;
    let missing = 0;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (!uploadsRoot) continue;
      const local = uploadsPathFromUrl(url, uploadsRoot);
      if (!local || !fs.existsSync(local)) {
        missing++;
        continue;
      }
      try {
        const src = dryRun ? url : await copyImageToGallery(local, album.slug, copied);
        images.push({ src, alt: album.title, caption: null, sortOrder: copied });
        if (!coverImage) coverImage = src;
        copied++;
      } catch (err) {
        console.warn(`  skip ${url}:`, err.message);
      }
    }

    const hasPhotos = images.length > 0;
    const status = hasPhotos ? 'published' : 'draft';

    if (dryRun) {
      console.log(
        `[dry-run] ${album.slug}: ${images.length} local images (${urls.length} urls, ${missing} missing on disk)`,
      );
      continue;
    }

    const existing = await prisma.galleryAlbum.findUnique({ where: { slug: album.slug } });
    const data = {
      title: album.title,
      slug: album.slug,
      coverImage: coverImage || existing?.coverImage || null,
      status,
      sortOrder: album.sortOrder,
      allowIndexing: true,
      publishedAt: hasPhotos ? new Date() : existing?.publishedAt || null,
    };

    let record;
    if (existing) {
      record = await prisma.galleryAlbum.update({ where: { id: existing.id }, data });
      if (images.length) {
        await prisma.galleryImage.deleteMany({ where: { albumId: record.id } });
      }
    } else {
      record = await prisma.galleryAlbum.create({ data });
    }

    if (images.length) {
      await prisma.galleryImage.createMany({
        data: images.map((img) => ({ ...img, albumId: record.id })),
      });
    }

    const missingNote = missing ? `, ${missing} missing locally` : '';
    console.log(`✔ ${album.slug} (${status}, ${images.length} images${missingNote})`);
  }

  if (dryRun) {
    console.log('\nDry run complete. Use --commit to write albums.');
  } else {
    console.log('\nImport complete.');
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
