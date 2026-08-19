import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';
import { shouldSkipPageImport } from '@/lib/migration/frozenRoutes';

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

export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'pages.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    return NextResponse.json({ page }, { status: 200 });
  } catch (error) {
    console.error('[admin/site-pages/id] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = requirePermission(request, 'pages.edit');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const data = await request.json();
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const title = String(data.title || page.title).trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let slug = page.slug;
    if (data.slug && data.slug !== page.slug) {
      slug = slugify(data.slug, { lower: true, strict: true });
      if (shouldSkipPageImport(slug)) {
        return NextResponse.json({ error: 'Slug conflicts with a reserved site route' }, { status: 400 });
      }
      const collision = await prisma.page.findFirst({ where: { slug, id: { not: id } } });
      if (collision) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const canPublish = requirePermission(request, 'pages.publish');
    let status = data.status ?? page.status;
    if (status === 'published' && !canPublish) status = page.status;

    const updated = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: data.excerpt?.trim() ?? page.excerpt,
        content: data.content ? sanitizeContent(data.content) : page.content,
        seoTitle: data.seoTitle?.trim() ?? page.seoTitle,
        seoDescription: data.seoDescription?.trim() ?? page.seoDescription,
        featuredImage: data.featuredImage?.trim() ?? page.featuredImage,
        allowIndexing: data.allowIndexing ?? page.allowIndexing,
        status,
        publishedAt: status === 'published' ? page.publishedAt || new Date() : null,
      },
    });

    revalidateSitePage(page.slug);
    if (slug !== page.slug) revalidateSitePage(slug);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('[admin/site-pages/id] PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = requirePermission(request, 'pages.delete');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    await prisma.page.delete({ where: { id } });
    revalidateSitePage(page.slug);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[admin/site-pages/id] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
