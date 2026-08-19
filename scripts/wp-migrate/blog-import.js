/**
 * Import WordPress posts → Blog CMS
 *
 * Usage:
 *   npm run wp:import-blog:dry
 *   npm run wp:import-blog
 *   npm run wp:import-blog:reset
 */

const { PrismaClient } = require('@prisma/client');
const {
  streamWpPosts,
  getPostMetaMap,
  extractTitleFromLine,
  extractPostDateFromLine,
  extractPostContentFromLine,
  getAttachmentUrl,
  DEFAULT_SQL,
} = require('./lib/sqlReader');
const { htmlToBlocks, normalizeHtml } = require('./lib/htmlToBlocks');
const { findUploadsRoot, importMediaUrl, rewriteBlocksMedia } = require('./lib/mediaCopy');
const { assertCanImport } = require('./lib/upsertGuard');
const { isFrozenSlug } = require('./lib/frozenRoutes');

const commit = process.argv.includes('--commit');
const dryRun = !commit;
const reset = process.argv.includes('--reset');

function humanizeSlug(slug) {
  return String(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 190);
}

function trunc(str, max = 190) {
  if (!str) return null;
  const s = String(str).trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

async function importAttachmentById(attachmentId, uploadsRoot, cache) {
  if (!attachmentId) return null;
  const id = parseInt(String(attachmentId), 10);
  if (!Number.isFinite(id)) return null;
  const attachUrl = await getAttachmentUrl(id);
  if (!attachUrl) return null;
  if (dryRun) return attachUrl;
  if (!uploadsRoot) return attachUrl;
  return importMediaUrl(attachUrl, uploadsRoot, 'blog', cache);
}

async function buildBlogPayload(post, uploadsRoot) {
  const meta = await getPostMetaMap(post.id, [
    '_elementor_data',
    '_thumbnail_id',
    'banner_image',
    'rank_math_title',
    'rank_math_description',
    'rank_math_focus_keyword',
  ]);

  const elementor = normalizeHtml(meta._elementor_data || '');
  const postContent = normalizeHtml(extractPostContentFromLine(post.rawLine));
  const html = elementor || postContent;
  let blocks = htmlToBlocks(html);

  if (!dryRun && uploadsRoot) {
    blocks = await rewriteBlocksMedia(blocks, uploadsRoot, 'blog');
  }

  const mediaCache = new Map();
  const featuredImage = await importAttachmentById(meta._thumbnail_id, uploadsRoot, mediaCache);
  const bannerImage = await importAttachmentById(meta.banner_image, uploadsRoot, mediaCache);

  const title = trunc(
    extractTitleFromLine(post.rawLine) ||
      meta.rank_math_title?.replace(/\\'/g, "'") ||
      humanizeSlug(post.slug),
    190
  );

  const excerpt = stripHtml(blocks.find((b) => b.type === 'text')?.html || '') || null;

  return {
    wpPostId: post.id,
    title,
    slug: post.slug,
    content: blocks.length ? blocks : [{ id: 'empty', type: 'text', html: '<p></p>' }],
    excerpt,
    seoTitle: trunc(meta.rank_math_title?.replace(/\\'/g, "'"), 190),
    seoDescription: trunc(meta.rank_math_description?.replace(/\\'/g, "'"), 190),
    focusKeyword: trunc(meta.rank_math_focus_keyword?.replace(/\\'/g, "'"), 100),
    featuredImage,
    bannerImage,
    status: 'published',
    allowIndexing: true,
    publishedAt: extractPostDateFromLine(post.rawLine) || new Date(),
  };
}

async function main() {
  if (!require('fs').existsSync(DEFAULT_SQL)) {
    console.error('SQL dump not found:', DEFAULT_SQL);
    process.exit(1);
  }

  const uploadsRoot = findUploadsRoot();
  console.log('Uploads root:', uploadsRoot || '(none — URLs kept remote)');

  const posts = await streamWpPosts(DEFAULT_SQL, { postType: 'post', status: 'publish' });
  console.log(`Found ${posts.length} published WP posts`);

  const prisma = new PrismaClient();

  if (reset && !dryRun) {
    const { count } = await prisma.blog.deleteMany({});
    if (count) console.log(`Deleted ${count} blog(s)`);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    if (isFrozenSlug(post.slug)) {
      console.log(`  skip frozen slug: ${post.slug}`);
      skipped++;
      continue;
    }

    const guard = dryRun
      ? { action: 'create', existing: null }
      : await assertCanImport(prisma, 'blog', { wpPostId: post.id, slug: post.slug });

    if (guard.action === 'skip') {
      console.log(`  skip ${post.slug}: ${guard.reason}`);
      skipped++;
      continue;
    }

    const payload = await buildBlogPayload(post, uploadsRoot);

    if (dryRun) {
      console.log(`[dry-run] ${post.slug} — ${payload.title.slice(0, 60)} (${payload.content.length} blocks)`);
      continue;
    }

    if (guard.action === 'update') {
      await prisma.blog.update({
        where: { id: guard.existing.id },
        data: payload,
      });
      updated++;
      console.log(`✔ updated ${post.slug}`);
    } else {
      await prisma.blog.create({ data: payload });
      created++;
      console.log(`✔ created ${post.slug}`);
    }
  }

  if (dryRun) {
    console.log('\nDry run complete.');
  } else {
    console.log(`\nImport complete: ${created} created, ${updated} updated, ${skipped} skipped`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
