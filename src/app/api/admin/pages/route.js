import { NextResponse } from 'next/server';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import {
  getAdminPagesPayload,
  saveAdminPageSeo,
  resolveAdminPage,
} from '@/lib/pageSeo';
import { shouldSkipPageImport } from '@/lib/migration/frozenRoutes';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
  try {
    const user =
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'pages.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const pages = await getAdminPagesPayload();
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error('Fetch pages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user =
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'pages.edit') ||
      requirePermission(request, 'pages.create');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();

    // Support creating a new site page directly
    if (body.action === 'create') {
      const rawTitle = String(body.title || '').trim();
      if (!rawTitle) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      let slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(rawTitle, { lower: true, strict: true });
      if (!slug) {
        return NextResponse.json({ error: 'Valid slug is required' }, { status: 400 });
      }

      if (shouldSkipPageImport(slug)) {
        return NextResponse.json({ error: 'Slug conflicts with a reserved site route' }, { status: 400 });
      }

      const existing = await prisma.page.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const page = await prisma.page.create({
        data: {
          title: rawTitle,
          slug,
          excerpt: body.excerpt?.trim() || null,
          content: Array.isArray(body.content) ? body.content : [{ id: '1', type: 'text', html: String(body.content || '') }],
          featuredImage: body.bannerImage?.trim() || body.featuredImage?.trim() || null,
          status: body.status || 'draft',
          seoTitle: body.seoTitle?.trim() || null,
          seoDescription: body.seoDescription?.trim() || null,
          allowIndexing: body.allowIndexing !== false,
          publishedAt: body.status === 'published' ? new Date() : null,
        },
      });

      try {
        revalidatePath(`/${page.slug}`);
        revalidatePath('/sitemap.xml');
      } catch {
        // Non-fatal
      }

      const pages = await getAdminPagesPayload();
      const createdEntry = pages.find((p) => p.path === `/${page.slug}`);
      return NextResponse.json({ page: createdEntry, pages }, { status: 201 });
    }

    const { path: pagePath, override, clear } = body;

    if (!pagePath || typeof pagePath !== 'string') {
      return NextResponse.json({ error: 'path is required' }, { status: 400 });
    }

    const sitePage = await resolveAdminPage(pagePath);
    if (!sitePage) {
      return NextResponse.json({ error: `Unknown page path: ${pagePath}` }, { status: 400 });
    }

    if (sitePage.type === 'offer') {
      return NextResponse.json(
        { error: 'Offer page SEO and content are managed under Admin → Offers.' },
        { status: 400 }
      );
    }

    await saveAdminPageSeo(pagePath, override, { clear: Boolean(clear) });

    const pages = await getAdminPagesPayload();
    const updated = pages.find((page) => page.path === pagePath);

    return NextResponse.json({ page: updated, pages }, { status: 200 });
  } catch (error) {
    console.error('Save page error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

