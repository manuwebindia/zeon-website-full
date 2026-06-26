import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requirePermission } from '@/lib/auth';

const UPLOAD_DIR_PATH = path.join(process.cwd(), 'public', 'uploads', 'blog');

export async function GET(request) {
  try {
    const user = requirePermission(request, 'media.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      // Check if folder exists
      await fs.access(UPLOAD_DIR_PATH);
    } catch {
      // Return empty array if upload folder does not exist yet
      return NextResponse.json({ media: [] }, { status: 200 });
    }

    // Read files
    const filenames = await fs.readdir(UPLOAD_DIR_PATH);
    
    // Process only files, fetch stats
    const mediaFiles = [];
    for (const filename of filenames) {
      // Ignore hidden files like .DS_Store
      if (filename.startsWith('.')) continue;

      const filepath = path.join(UPLOAD_DIR_PATH, filename);
      const stat = await fs.stat(filepath);

      if (stat.isFile()) {
        mediaFiles.push({
          name: filename,
          url: `/uploads/blog/${filename}`,
          sizeBytes: stat.size,
          createdAt: stat.mtime, // use modification time as upload time
        });
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
