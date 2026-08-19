import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';
import { isFrozenSlug, shouldSkipPageImport } from '@/lib/migration/frozenRoutes';

function sanitizeContent(content) {
  if (!Array.isArray(content)) return [];
  return content.map((block) => {
    if (block.type === 'text') {
      return { ...block, html: sanitizeHtml(block.html || '') };
    }
    return block;
  });
}

function revalidateSitePage(slug) {
  try {
    revalidatePath(`/${slug}`);
    revalidatePath('/sitemap.xml');
  } catch {
    /* ignore */
  }
}

export async function GET(request) {
  try {
    const user = requirePermission(request, 'pages.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        allowIndexing: true,
        featuredImage: true,
        wpPostId: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error('[admin/site-pages] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = requirePermission(request, 'pages.create');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await request.json();
    const title = String(data.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let slug = slugify(data.slug || title, { lower: true, strict: true });
    if (shouldSkipPageImport(slug)) {
      return NextResponse.json({ error: 'Slug conflicts with a reserved site route' }, { status: 400 });
    }

    const existing = await prisma.page.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const canPublish = requirePermission(request, 'pages.publish');
    const status = data.status === 'published' && canPublish ? 'published' : (data.status || 'draft');

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        excerpt: data.excerpt?.trim() || null,
        content: sanitizeContent(data.content) || [{ id: '1', type: 'text', html: '' }],
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        featuredImage: data.featuredImage?.trim() || null,
        allowIndexing: data.allowIndexing !== false,
        status,
        publishedAt: status === 'published' ? new Date() : null,
      },
    });

    if (status === 'published') revalidateSitePage(page.slug);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('[admin/site-pages] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
