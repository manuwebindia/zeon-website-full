/**
 * Import WordPress pages → Page CMS (non-frozen slugs only)
 *
 * Usage:
 *   npm run wp:import-pages:dry
 *   npm run wp:import-pages
 *   npm run wp:import-pages:reset
 *   npm run wp:import-pages -- --update   # refresh existing imported rows
 */

const { PrismaClient } = require('@prisma/client');
const {
  streamWpPosts,
  getPostMetaMap,
  extractTitleFromLine,
  extractPostContentFromLine,
  DEFAULT_SQL,
} = require('./lib/sqlReader');
const { htmlToBlocks, normalizeHtml } = require('./lib/htmlToBlocks');
const { findUploadsRoot, importMediaUrl, rewriteBlocksMedia } = require('./lib/mediaCopy');
const { assertCanImport } = require('./lib/upsertGuard');
const { shouldSkipPageImport } = require('./lib/frozenRoutes');

const commit = process.argv.includes('--commit');
const dryRun = !commit;
const reset = process.argv.includes('--reset');
const allowUpdate = process.argv.includes('--update');

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

async function buildPagePayload(post, uploadsRoot) {
  const meta = await getPostMetaMap(post.id, [
    '_elementor_data',
    '_thumbnail_id',
    'rank_math_title',
    'rank_math_description',
  ]);

  const elementor = normalizeHtml(meta._elementor_data || '');
  const postContent = normalizeHtml(extractPostContentFromLine(post.rawLine));
  const html = elementor || postContent;
  let blocks = htmlToBlocks(html);

  if (!dryRun && uploadsRoot) {
    blocks = await rewriteBlocksMedia(blocks, uploadsRoot, 'pages');
  }

  let featuredImage = null;
  if (meta._thumbnail_id) {
    const { getAttachmentUrl } = require('./lib/sqlReader');
    const attachUrl = await getAttachmentUrl(parseInt(meta._thumbnail_id, 10));
    if (attachUrl && uploadsRoot && !dryRun) {
      featuredImage = await importMediaUrl(attachUrl, uploadsRoot, 'pages', new Map());
    }
  }

  const title = trunc(
    extractTitleFromLine(post.rawLine) ||
      meta.rank_math_title?.replace(/\\'/g, "'") ||
      humanizeSlug(post.slug),
    190
  );

  return {
    wpPostId: post.id,
    title,
    slug: post.slug,
    content: blocks.length ? blocks : [{ id: 'empty', type: 'text', html: '<p></p>' }],
    excerpt: stripHtml(blocks.find((b) => b.type === 'text')?.html || '') || null,
    seoTitle: trunc(meta.rank_math_title?.replace(/\\'/g, "'"), 190),
    seoDescription: trunc(meta.rank_math_description?.replace(/\\'/g, "'"), 190),
    featuredImage,
    status: 'published',
    allowIndexing: true,
    publishedAt: new Date(),
  };
}

async function main() {
  if (!require('fs').existsSync(DEFAULT_SQL)) {
    console.error('SQL dump not found:', DEFAULT_SQL);
    process.exit(1);
  }

  const uploadsRoot = findUploadsRoot();
  console.log('Uploads root:', uploadsRoot || '(none)');

  const posts = await streamWpPosts(DEFAULT_SQL, { postType: 'page', status: 'publish' });
  console.log(`Found ${posts.length} published WP pages`);

  const prisma = new PrismaClient();

  if (reset && !dryRun) {
    const count = await prisma.page.count({ where: { wpPostId: { not: null } } });
    if (count) {
      await prisma.page.deleteMany({ where: { wpPostId: { not: null } } });
      console.log(`Deleted ${count} imported page(s)`);
    }
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    if (shouldSkipPageImport(post.slug)) {
      console.log(`  skip frozen/reserved: ${post.slug}`);
      skipped++;
      continue;
    }

    const guard = dryRun
      ? { action: 'create', existing: null }
      : await assertCanImport(prisma, 'page', { wpPostId: post.id, slug: post.slug }, { allowUpdate });

    if (guard.action === 'skip') {
      console.log(`  skip ${post.slug}: ${guard.reason}`);
      skipped++;
      continue;
    }

    const payload = await buildPagePayload(post, uploadsRoot);

    if (dryRun) {
      console.log(`[dry-run] /${post.slug} — ${payload.title.slice(0, 50)}`);
      continue;
    }

    if (guard.action === 'update') {
      await prisma.page.update({ where: { id: guard.existing.id }, data: payload });
      updated++;
      console.log(`✔ updated ${post.slug}`);
    } else {
      await prisma.page.create({ data: payload });
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
