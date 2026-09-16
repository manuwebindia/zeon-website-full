import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requirePermission } from '@/lib/auth';

const UPLOADS_ROOT = path.join(process.cwd(), 'public', 'uploads');
const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.avif']);

export async function GET(request) {
  try {
    const user = requirePermission(request, 'media.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const folderParam = searchParams.get('folder')?.trim().toLowerCase();

    try {
      // Check if uploads folder exists
      await fs.access(UPLOADS_ROOT);
    } catch {
      return NextResponse.json({ media: [] }, { status: 200 });
    }

    const mediaFiles = [];
    const entries = await fs.readdir(UPLOADS_ROOT, { withFileTypes: true });

    const foldersToScan = [];
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        foldersToScan.push(entry.name);
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          if (!folderParam || folderParam === 'all' || folderParam === 'uploads') {
            const filepath = path.join(UPLOADS_ROOT, entry.name);
            try {
              const stat = await fs.stat(filepath);
              mediaFiles.push({
                name: entry.name,
                url: `/uploads/${entry.name}`,
                folder: 'uploads',
                sizeBytes: stat.size,
                createdAt: stat.mtime,
              });
            } catch {
              // Ignore stat error
            }
          }
        }
      }
    }

    // Ensure 'gallery', 'blog', 'pages' are checked even if empty or just created
    for (const folderName of foldersToScan) {
      if (folderParam && folderParam !== 'all' && folderParam !== folderName) {
        continue;
      }

      const folderPath = path.join(UPLOADS_ROOT, folderName);
      try {
        const files = await fs.readdir(folderPath, { withFileTypes: true });
        for (const file of files) {
          if (!file.isFile() || file.name.startsWith('.')) continue;

          const ext = path.extname(file.name).toLowerCase();
          if (!IMAGE_EXTENSIONS.has(ext)) continue;

          const filepath = path.join(folderPath, file.name);
          try {
            const stat = await fs.stat(filepath);
            mediaFiles.push({
              name: file.name,
              url: `/uploads/${folderName}/${file.name}`,
              folder: folderName,
              sizeBytes: stat.size,
              createdAt: stat.mtime,
            });
          } catch {
            // Ignore stat error for individual file
          }
        }
      } catch (err) {
        console.error(`Error reading upload folder ${folderName}:`, err);
      }
    }

    // Sort by upload date descending (newest first)
    mediaFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ media: mediaFiles }, { status: 200 });
  } catch (error) {
    console.error('Fetch media API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

