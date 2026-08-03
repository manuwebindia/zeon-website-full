import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requirePermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
  DEFAULT_SITEMAP_CONFIG,
  getPublishedBlogEntries,
  mapBlogToSitemapPreview,
  readSitemapConfig,
} from '@/lib/sitemapBuilder';

const CONFIG_PATH = path.join(process.cwd(), 'src/data/sitemap-config.json');
const VALID_FREQUENCIES = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

// GET — return sitemap config + dynamic published blog entries
export async function GET(request) {
  try {
    const user = requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const config = await readSitemapConfig();
    const publishedBlogs = await getPublishedBlogEntries();

    return NextResponse.json(
      {
        ...config,
        publishedBlogs: publishedBlogs.map((blog) => mapBlogToSitemapPreview(blog, config)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch sitemap config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — save sitemap config
export async function POST(request) {
  try {
    const user = requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { staticPages, blogDefaults, globalSettings } = body;

    if (!Array.isArray(staticPages)) {
      return NextResponse.json({ error: 'staticPages must be an array' }, { status: 400 });
    }

    for (const page of staticPages) {
      if (!page.path || !page.path.startsWith('/')) {
        return NextResponse.json(
          { error: `Invalid page path: "${page.path}" — must start with /` },
          { status: 400 }
        );
      }
      if (!VALID_FREQUENCIES.includes(page.changeFrequency)) {
        return NextResponse.json(
          { error: `Invalid changeFrequency: "${page.changeFrequency}"` },
          { status: 400 }
        );
      }
      const p = Number(page.priority);
      if (Number.isNaN(p) || p < 0 || p > 1) {
        return NextResponse.json({ error: 'Priority must be between 0 and 1' }, { status: 400 });
      }
      if (page.canonical && typeof page.canonical !== 'string') {
        return NextResponse.json({ error: 'Canonical URL must be a string' }, { status: 400 });
      }
    }

    if (blogDefaults) {
      if (!VALID_FREQUENCIES.includes(blogDefaults.changeFrequency)) {
        return NextResponse.json({ error: 'Invalid blogDefaults.changeFrequency' }, { status: 400 });
      }
      const bp = Number(blogDefaults.priority);
      if (Number.isNaN(bp) || bp < 0 || bp > 1) {
        return NextResponse.json({ error: 'blogDefaults.priority must be between 0 and 1' }, { status: 400 });
      }
    }

    if (globalSettings?.canonicalBaseUrl && typeof globalSettings.canonicalBaseUrl !== 'string') {
      return NextResponse.json({ error: 'canonicalBaseUrl must be a string' }, { status: 400 });
    }

    const newConfig = {
      staticPages: staticPages.map((p) => ({
        path: p.path,
        changeFrequency: p.changeFrequency,
        priority: Number(Number(p.priority).toFixed(1)),
        enabled: p.enabled !== false,
        canonical: p.canonical || '',
      })),
      blogDefaults: {
        changeFrequency: blogDefaults?.changeFrequency || DEFAULT_SITEMAP_CONFIG.blogDefaults.changeFrequency,
        priority: Number(Number(blogDefaults?.priority ?? DEFAULT_SITEMAP_CONFIG.blogDefaults.priority).toFixed(1)),
      },
      globalSettings: {
        canonicalBaseUrl:
          globalSettings?.canonicalBaseUrl || DEFAULT_SITEMAP_CONFIG.globalSettings.canonicalBaseUrl,
      },
    };

    const dir = path.dirname(CONFIG_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');

    try {
      revalidatePath('/sitemap.xml');
    } catch {
      // Non-fatal
    }

    const publishedBlogs = await getPublishedBlogEntries();

    return NextResponse.json(
      {
        ...newConfig,
        publishedBlogs: publishedBlogs.map((blog) => mapBlogToSitemapPreview(blog, newConfig)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Save sitemap config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
