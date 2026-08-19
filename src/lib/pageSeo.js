import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { readSettings } from '@/lib/settings';
import { readSitemapConfig, getSitemapBaseUrl } from '@/lib/sitemapBuilder';
import { readOffersConfig, isOfferActive } from '@/lib/offers';

const PAGE_SEO_PATH = path.join(process.cwd(), 'src/data/page-seo.json');

export const SITE_PAGES = [
  {
    path: '/',
    label: 'Home',
    group: 'Main',
    defaults: {
      title: 'Best Digital Marketing Course in Kochi | #1 Kerala | Zeon',
      description:
        'Become a certified digital marketer at Zeon Academy. Practical training, guaranteed internship, and 100% placement support. Start your digital marketing career today!',
      canonical: '/',
      allowIndexing: true,
      ogImage: '/zeon-banner-bg.webp',
    },
  },
  {
    path: '/about',
    label: 'About Us',
    group: 'Main',
    defaults: {
      title: 'About Us | Zeon Academy Kochi',
      description:
        'Learn about Zeon Academy, the leading digital marketing training institute in Kochi, Kerala. An offshoot of Web India Solutions (WIS) with 17+ years of experience.',
      canonical: '/about',
      allowIndexing: true,
    },
  },
  {
    path: '/courses',
    label: 'Courses',
    group: 'Main',
    defaults: {
      title: 'Professional Digital Marketing Courses in Kochi | Zeon Academy',
      description:
        'Save hundreds of hours by learning from working professionals with the best digital marketing course in Kochi, Kerala. Browse our courses.',
      canonical: '/courses',
      allowIndexing: true,
    },
  },
  {
    path: '/blog',
    label: 'Blog',
    group: 'Main',
    defaults: {
      title: 'Digital Marketing Blog | Tips, Guides & Insights | Zeon Academy',
      description:
        "Explore expert insights on digital marketing, SEO, Google Ads, Meta Ads, and career growth strategies from Kerala's #1 digital marketing academy — Zeon.",
      canonical: '/blog',
      allowIndexing: true,
    },
  },
  {
    path: '/contact',
    label: 'Contact',
    group: 'Main',
    defaults: {
      title: 'Contact Us | Zeon Academy Kochi',
      description:
        "Get in touch with Zeon Academy, Kerala's leading digital marketing training institute in Kochi. Call us at +91 7558888252, or visit our Vennala campus today.",
      canonical: '/contact',
      allowIndexing: true,
    },
  },
  {
    path: '/courses/seo-specialist',
    label: 'SEO Specialist Course',
    group: 'Courses',
    defaults: {
      title: 'SEO Specialist Course in Kochi | Zeon Academy',
      description:
        'Master keyword research, technical SEO, on-page optimization, and organic traffic growth with the SEO Specialist Course at Zeon Academy, Kochi.',
      canonical: '/courses/seo-specialist',
      allowIndexing: true,
    },
  },
  {
    path: '/courses/ads-specialist',
    label: 'Ads Specialist Course',
    group: 'Courses',
    defaults: {
      title: 'Ads Specialist Course in Kochi | Zeon Academy',
      description:
        'Learn Facebook, Instagram, and social media ad management with the Ads Specialist Course at Zeon Academy. Practical training with placement support.',
      canonical: '/courses/ads-specialist',
      allowIndexing: true,
    },
  },
  {
    path: '/courses/advanced-digital-marketing',
    label: 'Advanced Digital Marketing',
    group: 'Courses',
    defaults: {
      title: 'Advanced Digital Marketing Course in Kochi | Zeon Academy',
      description:
        'Join our Advanced Digital Marketing Course to learn SEO, Social Media Marketing, Google Ads, and WordPress. Complete with an internship and placement assistance.',
      canonical: '/courses/advanced-digital-marketing',
      allowIndexing: true,
    },
  },
  {
    path: '/placements',
    label: 'Placements',
    group: 'Other',
    defaults: {
      title: 'Job Vacancies | Digital Marketing Jobs in Kerala | Zeon Academy Placement Cell',
      description:
        "Explore live digital marketing job vacancies in Kerala through Zeon Academy's Placement Cell. Find openings in Kochi, Ernakulam, and across Kerala for freshers and experienced professionals.",
      canonical: '/placements',
      allowIndexing: true,
    },
  },
  {
    path: '/testimonials',
    label: 'Testimonials',
    group: 'Other',
    defaults: {
      title: 'Student Testimonials | Zeon Academy',
      description:
        "Hear from our students about their journey at Zeon Academy — Kerala's #1 digital marketing institute. Real stories, real career transformations.",
      canonical: '/testimonials',
      allowIndexing: true,
    },
  },
  {
    path: '/post-your-job',
    label: 'Post Your Job',
    group: 'Other',
    defaults: {
      title: 'Post Your Job | Zeon Academy Placement Cell',
      description:
        'List your digital marketing job openings with Zeon Academy. Connect with top-trained marketing talent in Kerala.',
      canonical: '/post-your-job',
      allowIndexing: true,
    },
  },
  {
    path: '/offers',
    label: 'Offers',
    group: 'Other',
    defaults: {
      title: 'Offers & Free Resources | Zeon Academy',
      description:
        'Download free handbooks, guides, and exclusive digital marketing resources from Zeon Academy, Kochi.',
      canonical: '/offers',
      allowIndexing: true,
    },
  },
  {
    path: '/gallery',
    label: 'Gallery',
    group: 'Other',
    defaults: {
      title: 'Gallery | Zeon Academy Kochi',
      description:
        'Photos from celebrations, graduations, and campus life at Zeon Academy — Kerala\'s leading digital marketing institute.',
      canonical: '/gallery',
      allowIndexing: true,
    },
  },
  {
    path: '/thank-you',
    label: 'Thank You',
    group: 'Other',
    defaults: {
      title: 'Thank You | Zeon Academy',
      description: 'Thank you for reaching out to Zeon Academy. Our team will get back to you shortly.',
      canonical: '/thank-you',
      allowIndexing: false,
    },
  },
];

export function getSitePage(pathname) {
  return SITE_PAGES.find((page) => page.path === pathname) || null;
}

export const ADMIN_PAGE_GROUP_ORDER = ['Main', 'Courses', 'Other', 'Site Pages', 'Gallery', 'Offers'];

function buildAdminPageEntry({
  path,
  label,
  group,
  source,
  defaults,
  override,
  editUrl = null,
  readOnly = false,
}) {
  const effective = mergePageSeo(path, defaults, override);
  const hasOverride =
    source === 'static'
      ? Boolean(override && !isEmptyOverride(override))
      : Boolean(
          override?.seoTitle ||
            override?.seoDescription ||
            override?.allowIndexing === false
        );

  return {
    path,
    label,
    group,
    source,
    defaults,
    override: override && !isEmptyOverride(override) ? override : override || null,
    effective,
    hasOverride,
    editUrl,
    readOnly,
  };
}

async function getCmsSitePageEntries() {
  try {
    const pages = await prisma.page.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        seoTitle: true,
        seoDescription: true,
        allowIndexing: true,
      },
      orderBy: { title: 'asc' },
    });

    return pages.map((page) => {
      const defaults = {
        title: page.title,
        description: page.excerpt || '',
        canonical: `/${page.slug}`,
        allowIndexing: page.allowIndexing !== false,
      };
      const override = {
        seoTitle: page.seoTitle || '',
        seoDescription: page.seoDescription || '',
        allowIndexing: page.allowIndexing !== false,
      };

      return buildAdminPageEntry({
        path: `/${page.slug}`,
        label: page.title,
        group: 'Site Pages',
        source: 'site-page',
        defaults,
        override,
        editUrl: `/admin/dashboard/site-pages/${page.id}/edit`,
      });
    });
  } catch (error) {
    console.error('Failed to load CMS site pages for admin:', error.message);
    return [];
  }
}

async function getGalleryPageEntries() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        seoTitle: true,
        seoDescription: true,
        allowIndexing: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    });

    return albums.map((album) => {
      const defaults = {
        title: `${album.title} | Gallery | Zeon Academy`,
        description: album.description || `Photos from ${album.title} at Zeon Academy.`,
        canonical: `/gallery/${album.slug}`,
        allowIndexing: album.allowIndexing !== false,
      };
      const override = {
        seoTitle: album.seoTitle || '',
        seoDescription: album.seoDescription || '',
        allowIndexing: album.allowIndexing !== false,
      };

      return buildAdminPageEntry({
        path: `/gallery/${album.slug}`,
        label: album.title,
        group: 'Gallery',
        source: 'gallery',
        defaults,
        override,
        editUrl: `/admin/dashboard/gallery/${album.id}/edit`,
      });
    });
  } catch (error) {
    console.error('Failed to load gallery pages for admin:', error.message);
    return [];
  }
}

async function getOfferPageEntries() {
  try {
    const config = await readOffersConfig();
    return config.offers
      .filter((offer) => isOfferActive(offer))
      .map((offer) => {
        const heading = offer.heading?.replace(/\n/g, ' ').trim() || offer.slug;
        const defaults = {
          title: `${heading} | Offers | Zeon Academy`,
          description: offer.aboutPoints?.[0] || `Claim ${heading} from Zeon Academy, Kochi.`,
          canonical: `/offers/${offer.slug}`,
          allowIndexing: true,
        };

        return buildAdminPageEntry({
          path: `/offers/${offer.slug}`,
          label: heading,
          group: 'Offers',
          source: 'offer',
          defaults,
          override: null,
          editUrl: '/admin/dashboard/offers',
          readOnly: true,
        });
      });
  } catch (error) {
    console.error('Failed to load offer pages for admin:', error.message);
    return [];
  }
}

export async function resolveAdminPage(pagePath) {
  const staticPage = getSitePage(pagePath);
  if (staticPage) {
    return { type: 'static', staticPage };
  }

  const galleryMatch = pagePath.match(/^\/gallery\/([^/]+)$/);
  if (galleryMatch) {
    const album = await prisma.galleryAlbum.findFirst({
      where: { slug: galleryMatch[1], status: 'published' },
      select: { id: true, slug: true },
    });
    if (album) return { type: 'gallery', id: album.id, slug: album.slug };
  }

  if (pagePath.startsWith('/') && pagePath.indexOf('/', 1) === -1 && pagePath.length > 1) {
    const slug = pagePath.slice(1);
    const page = await prisma.page.findFirst({
      where: { slug, status: 'published' },
      select: { id: true, slug: true },
    });
    if (page) return { type: 'site-page', id: page.id, slug: page.slug };
  }

  const offerMatch = pagePath.match(/^\/offers\/([^/]+)$/);
  if (offerMatch?.[1]) {
    const config = await readOffersConfig();
    const offer = config.offers.find(
      (item) => item.slug === offerMatch[1] && isOfferActive(item)
    );
    if (offer) return { type: 'offer', slug: offer.slug };
  }

  return null;
}

export async function saveAdminPageSeo(pagePath, override, { clear = false } = {}) {
  const resolved = await resolveAdminPage(pagePath);
  if (!resolved) {
    throw new Error(`Unknown page path: ${pagePath}`);
  }

  if (resolved.type === 'static') {
    const allOverrides = await readPageSeoOverrides();
    if (clear) {
      delete allOverrides[pagePath];
    } else {
      const sanitized = sanitizePageOverride(override || {});
      if (isEmptyOverride(sanitized)) {
        delete allOverrides[pagePath];
      } else {
        allOverrides[pagePath] = sanitized;
      }
    }
    await writePageSeoOverrides(allOverrides);
    try {
      revalidatePath(pagePath);
    } catch {
      // Non-fatal
    }
    return;
  }

  const sanitized = sanitizePageOverride(override || {});

  if (resolved.type === 'site-page') {
    await prisma.page.update({
      where: { id: resolved.id },
      data: clear
        ? { seoTitle: null, seoDescription: null, allowIndexing: true }
        : {
            seoTitle: sanitized.seoTitle || null,
            seoDescription: sanitized.seoDescription || null,
            allowIndexing: sanitized.allowIndexing !== false,
          },
    });
    try {
      revalidatePath(`/${resolved.slug}`);
      revalidatePath('/sitemap.xml');
    } catch {
      // Non-fatal
    }
    return;
  }

  if (resolved.type === 'gallery') {
    await prisma.galleryAlbum.update({
      where: { id: resolved.id },
      data: clear
        ? { seoTitle: null, seoDescription: null, allowIndexing: true }
        : {
            seoTitle: sanitized.seoTitle || null,
            seoDescription: sanitized.seoDescription || null,
            allowIndexing: sanitized.allowIndexing !== false,
          },
    });
    try {
      revalidatePath(`/gallery/${resolved.slug}`);
      revalidatePath('/sitemap.xml');
    } catch {
      // Non-fatal
    }
  }
}

export async function readPageSeoOverrides() {
  try {
    const raw = await fs.readFile(PAGE_SEO_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {};
  } catch {
    return {};
  }
}

export async function writePageSeoOverrides(overrides) {
  const dir = path.dirname(PAGE_SEO_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(PAGE_SEO_PATH, JSON.stringify({ overrides }, null, 2), 'utf-8');
}

export function sanitizePageOverride(input = {}) {
  return {
    seoTitle: String(input.seoTitle || '').trim(),
    seoDescription: String(input.seoDescription || '').trim(),
    allowIndexing: input.allowIndexing !== false,
    canonicalUrl: String(input.canonicalUrl || '').trim(),
    ogTitle: String(input.ogTitle || '').trim(),
    ogDescription: String(input.ogDescription || '').trim(),
    ogImage: String(input.ogImage || '').trim(),
  };
}

export function isEmptyOverride(override) {
  if (!override) return true;
  if (override.allowIndexing === false) return false;
  return !['seoTitle', 'seoDescription', 'canonicalUrl', 'ogTitle', 'ogDescription', 'ogImage'].some(
    (key) => Boolean(override[key])
  );
}

export function mergePageSeo(pagePath, defaults, override) {
  const title = override?.seoTitle || defaults.title;
  const description = override?.seoDescription || defaults.description;
  const canonical = override?.canonicalUrl || defaults.canonical;
  const allowIndexing =
    override && override.allowIndexing !== undefined ? override.allowIndexing : defaults.allowIndexing !== false;
  const ogTitle = override?.ogTitle || title;
  const ogDescription = override?.ogDescription || description;
  const ogImage = override?.ogImage || defaults.ogImage || '/zeon-banner-bg.webp';

  return {
    path: pagePath,
    title,
    description,
    canonical,
    allowIndexing,
    ogTitle,
    ogDescription,
    ogImage,
  };
}

export async function buildPageMetadata(pagePath, defaultsInput) {
  const sitePage = getSitePage(pagePath);
  const defaults = defaultsInput || sitePage?.defaults;
  if (!defaults) {
    throw new Error(`Unknown page path: ${pagePath}`);
  }

  const overrides = await readPageSeoOverrides();
  const override = overrides[pagePath] || null;
  const settings = await readSettings();
  const sitemapConfig = await readSitemapConfig();
  const baseUrl = getSitemapBaseUrl(sitemapConfig);

  const merged = mergePageSeo(pagePath, defaults, override);
  const allowIndexing = settings.universalNoIndex ? false : merged.allowIndexing;

  const canonical =
    merged.canonical.startsWith('http') ? merged.canonical : merged.canonical;

  const robots = allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      };

  const ogUrl = canonical.startsWith('http') ? canonical : `${baseUrl}${canonical === '/' ? '' : canonical}`;

  return {
    title: merged.title,
    description: merged.description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: ogUrl,
      siteName: 'Zeon Academy',
      title: merged.ogTitle,
      description: merged.ogDescription,
      images: [
        {
          url: merged.ogImage,
          width: 1200,
          height: 630,
          alt: 'Zeon Academy',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: merged.ogTitle,
      description: merged.ogDescription,
      images: [merged.ogImage],
    },
    robots,
  };
}

export async function getAdminPagesPayload() {
  const overrides = await readPageSeoOverrides();
  const [cmsPages, galleryPages, offerPages] = await Promise.all([
    getCmsSitePageEntries(),
    getGalleryPageEntries(),
    getOfferPageEntries(),
  ]);

  const staticPages = SITE_PAGES.map((page) => {
    const override = overrides[page.path] || null;
    return buildAdminPageEntry({
      path: page.path,
      label: page.label,
      group: page.group,
      source: 'static',
      defaults: page.defaults,
      override,
    });
  });

  const seen = new Set(staticPages.map((page) => page.path));
  const dynamicPages = [...cmsPages, ...galleryPages, ...offerPages].filter(
    (page) => !seen.has(page.path)
  );

  const allPages = [...staticPages, ...dynamicPages];
  allPages.sort((a, b) => {
    const groupA = ADMIN_PAGE_GROUP_ORDER.indexOf(a.group);
    const groupB = ADMIN_PAGE_GROUP_ORDER.indexOf(b.group);
    const orderA = groupA === -1 ? 999 : groupA;
    const orderB = groupB === -1 ? 999 : groupB;
    if (orderA !== orderB) return orderA - orderB;
    return a.label.localeCompare(b.label);
  });

  return allPages;
}
