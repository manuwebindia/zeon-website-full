import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import {
  getAdminPagesPayload,
  saveAdminPageSeo,
  resolveAdminPage,
} from '@/lib/pageSeo';

export async function GET(request) {
  try {
    const user = requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const pages = await getAdminPagesPayload();
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error('Fetch pages SEO error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
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
        { error: 'Offer page SEO is managed under Admin → Offers.' },
        { status: 400 }
      );
    }

    await saveAdminPageSeo(pagePath, override, { clear: Boolean(clear) });

    const pages = await getAdminPagesPayload();
    const updated = pages.find((page) => page.path === pagePath);

    return NextResponse.json({ page: updated, pages }, { status: 200 });
  } catch (error) {
    console.error('Save page SEO error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
