import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requirePermission } from '@/lib/auth';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src/data/settings.json');

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      authorName: parsed.authorName || 'Zeon Academy',
      authorImage: parsed.authorImage || '',
      universalNoIndex: Boolean(parsed.universalNoIndex),
    };
  } catch {
    return { authorName: 'Zeon Academy', authorImage: '', universalNoIndex: false };
  }
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
    const { authorName, authorImage, universalNoIndex } = data;

    const newSettings = {
      authorName: (authorName || 'Zeon Academy').trim(),
      authorImage: (authorImage || '').trim(),
      universalNoIndex: Boolean(universalNoIndex),
    };

    const dir = path.dirname(SETTINGS_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(newSettings, null, 2), 'utf-8');

    return NextResponse.json(newSettings, { status: 200 });
  } catch (error) {
    console.error('Save settings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
