/**
 * Routes that must never be overwritten by WordPress migration or bulk imports.
 * Homepage is excluded from all migration work entirely.
 */
export const FROZEN_PATHS = [
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

export const FROZEN_SLUGS = new Set(
  FROZEN_PATHS.filter((p) => p !== '/').map((p) => p.replace(/^\//, '').split('/')[0])
);

export function isFrozenPath(pathname = '') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/') return true;
  return FROZEN_PATHS.some(
    (frozen) => normalized === frozen || normalized.startsWith(`${frozen}/`)
  );
}

export function isFrozenSlug(slug = '') {
  const s = String(slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!s) return false;
  const first = s.split('/')[0];
  return FROZEN_SLUGS.has(first) || FROZEN_SLUGS.has(s);
}

/** WP page slugs that map to built Next.js routes or other CMS sections */
export const RESERVED_WP_PAGE_SLUGS = new Set([
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
  // gallery albums (live under /gallery/[slug])
  'onam-celebration-2025', 'graduation-day-2025', 'holi-celebration-2024',
  'xmas-celebration-2024', 'xmas-celebration-2023', 'onam-celebration-2024',
  'q-and-a-with-zeon-students', 'graduation-day-2024', 'kerala-piravi-celebration-2023',
  'onam-celebration-2023', 'birthday-celebration', 'holi-celebration',
  'graduation-ceremony-2023', 'graduation-day-2024-2nd-batch',
  'keralapiravi-celebration', 'keralapiravi-celebrations-2023', 'xmas-celebration',
]);

export function shouldSkipPageImport(slug = '') {
  const s = String(slug).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!s || RESERVED_WP_PAGE_SLUGS.has(s)) return true;
  if (s.startsWith('gallery/') || s.startsWith('gallery-')) return true;
  if (isFrozenSlug(s) || isFrozenPath(`/${s}`)) return true;
  // First path segment matches any built static route
  const first = s.split('/')[0];
  if (FROZEN_SLUGS.has(first)) return true;
  return false;
}
