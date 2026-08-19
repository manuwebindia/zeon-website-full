const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../../..');
const APP_DIR = path.join(ROOT, 'src/app');

const FROZEN_PATHS = [
  '/',
  '/about',
  '/courses',
  '/courses/seo-specialist',
  '/courses/ads-specialist',
  '/courses/advanced-digital-marketing',
  '/contact',
  '/testimonials',
  '/post-your-job',
  '/offers',
  '/placements',
  '/thank-you',
  '/gallery',
  '/blog',
  '/admin',
  '/api',
];

const FROZEN_SLUGS = new Set(
  FROZEN_PATHS.filter((p) => p !== '/').map((p) => p.replace(/^\//, '').split('/')[0]),
);

const RESERVED_WP_PAGE_SLUGS = new Set([
  'home', 'homepage', 'homesample', 'about', 'about-us',
  'courses', 'course', 'contact', 'contact-us',
  'testimonials', 'testimonial', 'placements', 'placement-cell',
  'gallery', 'offers', 'offer', 'post-your-job', 'blog', 'blogold', 'blog-new',
  'advanced-digital-marketing-course', 'search-engine-optimization',
  'ad-specialist', 'google-ads-social-media-ads', 'seo-junior-specialist',
  'social-media-ads', 'google-ads',
  'refer-friend', 'refer-a-friend', 'gift-a-course', 'free-demo-class', 'free-handbook',
  'my-account', 'payment', 'refund_returns', 'test', 'form-test-page',
  'workshop-thank-you', 'workshop-landing-page-dev', 'digital-marketing-workshop',
  'new-section-demo-page', 'new-design', 'upcoming-batches',
  'onam-celebration-2025', 'graduation-day-2025', 'holi-celebration-2024',
  'xmas-celebration-2024', 'xmas-celebration-2023', 'onam-celebration-2024',
  'q-and-a-with-zeon-students', 'graduation-day-2024', 'kerala-piravi-celebration-2023',
  'onam-celebration-2023', 'birthday-celebration', 'holi-celebration',
  'graduation-ceremony-2023', 'graduation-day-2024-2nd-batch',
  'keralapiravi-celebration', 'keralapiravi-celebrations-2023', 'xmas-celebration',
]);

/** Slugs backed by static Next.js app routes (never import as CMS pages). */
function collectBuiltStaticSlugs(dir = APP_DIR, prefix = '') {
  const slugs = new Set();
  if (!fs.existsSync(dir)) return slugs;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith('[') || name === 'admin' || name === 'api') continue;

    const segment = prefix ? `${prefix}/${name}` : name;
    const segmentDir = path.join(dir, name);
    const hasPage = ['page.js', 'page.jsx', 'page.ts', 'page.tsx'].some((file) =>
      fs.existsSync(path.join(segmentDir, file)),
    );

    if (hasPage) {
      slugs.add(segment.toLowerCase());
      slugs.add(segment.split('/')[0].toLowerCase());
    }

    for (const nested of collectBuiltStaticSlugs(segmentDir, segment)) {
      slugs.add(nested);
    }
  }

  return slugs;
}

let builtStaticSlugsCache = null;

function getBuiltStaticSlugs() {
  if (!builtStaticSlugsCache) {
    builtStaticSlugsCache = new Set([
      ...FROZEN_SLUGS,
      ...RESERVED_WP_PAGE_SLUGS,
      ...collectBuiltStaticSlugs(),
    ]);
  }
  return builtStaticSlugsCache;
}

function isBuiltStaticSlug(slug = '') {
  const s = String(slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!s) return false;
  const built = getBuiltStaticSlugs();
  return built.has(s) || built.has(s.split('/')[0]);
}

function isFrozenPath(pathname = '') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/') return true;
  return FROZEN_PATHS.some(
    (frozen) => normalized === frozen || normalized.startsWith(`${frozen}/`),
  );
}

function isFrozenSlug(slug = '') {
  const s = String(slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!s) return false;
  const first = s.split('/')[0];
  return FROZEN_SLUGS.has(first) || FROZEN_SLUGS.has(s);
}

function shouldSkipPageImport(slug = '') {
  const s = String(slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!s || RESERVED_WP_PAGE_SLUGS.has(s)) return true;
  if (s.startsWith('gallery/') || s.startsWith('gallery-')) return true;
  if (isBuiltStaticSlug(s)) return true;
  return isFrozenSlug(s) || isFrozenPath(`/${s}`);
}

module.exports = {
  FROZEN_PATHS,
  FROZEN_SLUGS,
  RESERVED_WP_PAGE_SLUGS,
  getBuiltStaticSlugs,
  isBuiltStaticSlug,
  isFrozenPath,
  isFrozenSlug,
  shouldSkipPageImport,
};
