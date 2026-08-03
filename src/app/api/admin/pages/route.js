import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import {
  getSitePage,
  getAdminPagesPayload,
  readPageSeoOverrides,
  writePageSeoOverrides,
  sanitizePageOverride,
  isEmptyOverride,
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

    const sitePage = getSitePage(pagePath);
    if (!sitePage) {
      return NextResponse.json({ error: `Unknown page path: ${pagePath}` }, { status: 400 });
    }

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

    const pages = await getAdminPagesPayload();
    const updated = pages.find((page) => page.path === pagePath);

    return NextResponse.json({ page: updated, pages }, { status: 200 });
  } catch (error) {
    console.error('Save page SEO error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
