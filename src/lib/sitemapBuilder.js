import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/db';
import { readSettings } from '@/lib/settings';

const CONFIG_PATH = path.join(process.cwd(), 'src/data/sitemap-config.json');
const PAGE_SEO_PATH = path.join(process.cwd(), 'src/data/page-seo.json');

const NOINDEX_SITEMAP_PATHS = new Set(['/thank-you']);

export const DEFAULT_SITEMAP_CONFIG = {
  staticPages: [
    { path: '/', changeFrequency: 'weekly', priority: 1.0, enabled: true, canonical: '' },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8, enabled: true, canonical: '' },
    { path: '/courses', changeFrequency: 'monthly', priority: 0.8, enabled: true, canonical: '' },
    { path: '/blog', changeFrequency: 'daily', priority: 0.9, enabled: true, canonical: '' },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7, enabled: true, canonical: '' },
    { path: '/courses/seo-specialist', changeFrequency: 'monthly', priority: 0.75, enabled: true, canonical: '' },
    { path: '/courses/ads-specialist', changeFrequency: 'monthly', priority: 0.75, enabled: true, canonical: '' },
    { path: '/courses/advanced-digital-marketing', changeFrequency: 'monthly', priority: 0.75, enabled: true, canonical: '' },
    { path: '/placements', changeFrequency: 'monthly', priority: 0.7, enabled: true, canonical: '' },
    { path: '/testimonials', changeFrequency: 'monthly', priority: 0.6, enabled: true, canonical: '' },
    { path: '/post-your-job', changeFrequency: 'monthly', priority: 0.6, enabled: true, canonical: '' },
    { path: '/offers', changeFrequency: 'weekly', priority: 0.7, enabled: true, canonical: '' },
    { path: '/thank-you', changeFrequency: 'yearly', priority: 0.3, enabled: false, canonical: '' },
  ],
  blogDefaults: { changeFrequency: 'weekly', priority: 0.6 },
  globalSettings: { canonicalBaseUrl: 'https://admission.zeonacademy.com' },
};

export async function readSitemapConfig() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return mergeMissingStaticPages(parsed);
  } catch {
    return DEFAULT_SITEMAP_CONFIG;
  }
}

async function readPageSeoOverridesForSitemap() {
  try {
    const raw = await fs.readFile(PAGE_SEO_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {};
  } catch {
    return {};
  }
}

function mergeMissingStaticPages(config) {
  const existingPaths = new Set((config.staticPages || []).map((page) => page.path));
  const missingPages = DEFAULT_SITEMAP_CONFIG.staticPages.filter((page) => !existingPaths.has(page.path));
  if (!missingPages.length) return config;

  return {
    ...config,
    staticPages: [...(config.staticPages || []), ...missingPages],
  };
}

function isStaticPageIndexable(pagePath, pageSeoOverrides) {
  if (NOINDEX_SITEMAP_PATHS.has(pagePath)) return false;
  const override = pageSeoOverrides[pagePath];
  return !(override && override.allowIndexing === false);
}

export function getSitemapBaseUrl(config) {
  return (
    config?.globalSettings?.canonicalBaseUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://admission.zeonacademy.com'
  ).replace(/\/$/, '');
}

export async function getPublishedBlogEntries() {
  return prisma.blog.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      allowIndexing: true,
      canonicalUrl: true,
      publishedAt: true,
      updatedAt: true,
    },
  });
}

export function mapBlogToSitemapPreview(blog, config) {
  const baseUrl = getSitemapBaseUrl(config);
  const blogDefaults = config.blogDefaults || DEFAULT_SITEMAP_CONFIG.blogDefaults;
  const inSitemap = blog.allowIndexing !== false;

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    path: `/blog/${blog.slug}`,
    url: blog.canonicalUrl || `${baseUrl}/blog/${blog.slug}`,
    status: blog.status,
    allowIndexing: blog.allowIndexing !== false,
    inSitemap,
    changeFrequency: blogDefaults.changeFrequency,
    priority: blogDefaults.priority,
    lastModified: blog.updatedAt || blog.publishedAt || null,
  };
}

export async function buildSitemapEntries() {
  const [config, settings, blogs, pageSeoOverrides] = await Promise.all([
    readSitemapConfig(),
    readSettings(),
    getPublishedBlogEntries(),
    readPageSeoOverridesForSitemap(),
  ]);

  if (settings.universalNoIndex) {
    return [];
  }

  const baseUrl = getSitemapBaseUrl(config);
  const blogDefaults = config.blogDefaults || DEFAULT_SITEMAP_CONFIG.blogDefaults;

  const staticEntries = (config.staticPages || [])
    .filter((page) => page.enabled !== false && isStaticPageIndexable(page.path, pageSeoOverrides))
    .map((page) => ({
      url: page.canonical?.trim() || `${baseUrl}${page.path === '/' ? '' : page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: Number(page.priority),
    }));

  const blogEntries = blogs
    .filter((blog) => blog.allowIndexing !== false)
    .map((blog) => ({
      url: blog.canonicalUrl?.trim() || `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: blogDefaults.changeFrequency,
      priority: Number(blogDefaults.priority),
    }));

  return [...staticEntries, ...blogEntries];
}
