import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import {
  readRedirects,
  writeRedirects,
  validateRedirect,
  findMatchingRedirect,
  normalizePath,
} from '@/lib/redirects';

export async function GET(request) {
  try {
    const user =
      requirePermission(request, 'redirects.view') ||
      requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const redirects = await readRedirects();

    const stats = {
      total: redirects.length,
      active: redirects.filter((r) => r.isActive).length,
      inactive: redirects.filter((r) => !r.isActive).length,
      hits: redirects.reduce((acc, r) => acc + (r.hits || 0), 0),
      permanent: redirects.filter((r) => r.statusCode === 301).length,
      temporary: redirects.filter((r) => r.statusCode === 302).length,
    };

    return NextResponse.json({ redirects, stats }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch redirects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user =
      requirePermission(request, 'redirects.create') ||
      requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();

    // Testing a redirect match
    if (body.action === 'test') {
      const testPath = normalizePath(body.url || '');
      const redirects = await readRedirects();
      const match = findMatchingRedirect(testPath, redirects);
      return NextResponse.json({
        testedUrl: testPath,
        matched: Boolean(match),
        rule: match,
      });
    }

    const { source, destination, statusCode = 301, matchType = 'exact', notes = '', isActive = true } = body;

    const existingRedirects = await readRedirects();
    const validation = validateRedirect({
      source,
      destination,
      existingRedirects,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const code = Number(statusCode) === 302 ? 302 : 301;
    const type = matchType === 'prefix' ? 'prefix' : 'exact';

    const newRule = {
      id: `red_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      source: validation.source,
      destination: validation.destination,
      statusCode: code,
      matchType: type,
      isActive: Boolean(isActive),
      notes: String(notes || '').trim(),
      hits: 0,
      lastHitAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newRule, ...existingRedirects];
    await writeRedirects(updatedList);

    return NextResponse.json({ redirect: newRule, redirects: updatedList }, { status: 201 });
  } catch (error) {
    console.error('Failed to create redirect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
