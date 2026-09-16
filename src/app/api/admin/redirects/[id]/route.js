import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import {
  readRedirects,
  writeRedirects,
  validateRedirect,
  normalizePath,
} from '@/lib/redirects';

export async function PUT(request, { params }) {
  try {
    const user =
      requirePermission(request, 'redirects.edit') ||
      requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const redirects = await readRedirects();

    const existingIndex = redirects.findIndex((r) => r.id === id);
    if (existingIndex === -1) {
      return NextResponse.json({ error: 'Redirect rule not found' }, { status: 404 });
    }

    const currentRule = redirects[existingIndex];
    const source = body.source !== undefined ? body.source : currentRule.source;
    const destination = body.destination !== undefined ? body.destination : currentRule.destination;

    const validation = validateRedirect({
      source,
      destination,
      id,
      existingRedirects: redirects,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updatedRule = {
      ...currentRule,
      source: validation.source,
      destination: validation.destination,
      statusCode: body.statusCode ? (Number(body.statusCode) === 302 ? 302 : 301) : currentRule.statusCode,
      matchType: body.matchType ? (body.matchType === 'prefix' ? 'prefix' : 'exact') : currentRule.matchType,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : currentRule.isActive,
      notes: body.notes !== undefined ? String(body.notes).trim() : currentRule.notes,
      updatedAt: new Date().toISOString(),
    };

    redirects[existingIndex] = updatedRule;
    await writeRedirects(redirects);

    return NextResponse.json({ redirect: updatedRule, redirects }, { status: 200 });
  } catch (error) {
    console.error('Failed to update redirect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  // Alias to PUT for partial updates (e.g. toggling active status)
  return PUT(request, { params });
}

export async function DELETE(request, { params }) {
  try {
    const user =
      requirePermission(request, 'redirects.delete') ||
      requirePermission(request, 'seo.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const redirects = await readRedirects();

    const filtered = redirects.filter((r) => r.id !== id);
    if (filtered.length === redirects.length) {
      return NextResponse.json({ error: 'Redirect rule not found' }, { status: 404 });
    }

    await writeRedirects(filtered);
    return NextResponse.json({ success: true, redirects: filtered }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete redirect:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
