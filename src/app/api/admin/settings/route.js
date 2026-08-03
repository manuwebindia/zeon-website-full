import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { readSettings, writeSettings, getDefaultAdminLoginUrl } from '@/lib/settings';

function normalizeAdminLoginUrl(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return getDefaultAdminLoginUrl();
  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return null;
  }
  return trimmed.replace(/\/$/, '');
}

export async function GET(request) {
  try {
    const user = requirePermission(request, 'settings.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await readSettings();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Fetch settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = requirePermission(request, 'settings.edit');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const { authorName, authorImage, universalNoIndex, adminLoginUrl } = data;

    const normalizedLoginUrl = normalizeAdminLoginUrl(adminLoginUrl);
    if (adminLoginUrl && !normalizedLoginUrl) {
      return NextResponse.json(
        { error: 'Admin login URL must start with http:// or https://' },
        { status: 400 }
      );
    }

    const newSettings = {
      authorName: (authorName || 'Zeon Academy').trim(),
      authorImage: (authorImage || '').trim(),
      universalNoIndex: Boolean(universalNoIndex),
      adminLoginUrl: normalizedLoginUrl || getDefaultAdminLoginUrl(),
    };

    await writeSettings(newSettings);

    return NextResponse.json(newSettings, { status: 200 });
  } catch (error) {
    console.error('Save settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
