/**
 * Quick verification for WP blog/pages import guardrails.
 * Usage: node --env-file=.env.local scripts/wp-migrate/verify-import.js
 */

const { PrismaClient } = require('@prisma/client');
const { FROZEN_PATHS, shouldSkipPageImport } = require('./lib/frozenRoutes');

async function main() {
  const prisma = new PrismaClient();

  const importedBlogs = await prisma.blog.count({ where: { wpPostId: { not: null } } });
  const importedPages = await prisma.page.count({ where: { wpPostId: { not: null } } });
  const publishedImportedPages = await prisma.page.count({
    where: { status: 'published', wpPostId: { not: null } },
  });
  const manualBlogs = await prisma.blog.count({ where: { wpPostId: null } });
  const manualPages = await prisma.page.count({ where: { wpPostId: null } });

  const importedPageSlugs = await prisma.page.findMany({
    where: { wpPostId: { not: null } },
    select: { slug: true },
  });

  const conflictingPages = importedPageSlugs.filter((p) => shouldSkipPageImport(p.slug));
  const frozenStaticRoutes = FROZEN_PATHS.filter((p) => p !== '/');

  console.log('=== Import counts ===');
  console.log(`Imported blogs: ${importedBlogs}`);
  console.log(`Imported pages: ${importedPages} (${publishedImportedPages} published)`);
  console.log(`Manual blogs (no wpPostId): ${manualBlogs}`);
  console.log(`Manual pages (no wpPostId): ${manualPages}`);

  console.log('\n=== Frozen/reserved page slug conflicts ===');
  if (conflictingPages.length) {
    console.log(`FAIL: ${conflictingPages.length} imported page(s) conflict with frozen/reserved slugs:`);
    conflictingPages.slice(0, 20).forEach((p) => console.log(`  - ${p.slug}`));
    process.exitCode = 1;
  } else {
    console.log('OK: no imported pages use frozen or reserved slugs');
  }

  console.log('\n=== Static routes (unchanged — file-based) ===');
  frozenStaticRoutes.slice(0, 8).forEach((p) => console.log(`  ${p}`));
  console.log(`  ... (${frozenStaticRoutes.length} total frozen paths)`);

  console.log('\n=== Sitemap-eligible imported pages ===');
  const sitemapPages = await prisma.page.findMany({
    where: { status: 'published', allowIndexing: true, wpPostId: { not: null } },
    select: { slug: true },
    take: 5,
  });
  const sitemapPageTotal = await prisma.page.count({
    where: { status: 'published', allowIndexing: true, wpPostId: { not: null } },
  });
  console.log(`Published indexable imported pages: ${sitemapPageTotal}`);
  sitemapPages.forEach((p) => console.log(`  /${p.slug}`));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
