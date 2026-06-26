import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { requirePermission } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = requirePermission(request, 'media.upload');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Process image with sharp: resize to max 1200px wide, convert to webp at 80 quality
    const processedBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Setup save paths
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
    
    // Ensure dir exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `blog-${uniqueSuffix}.webp`;
    const filepath = path.join(uploadDir, filename);

    // 3. Write file to filesystem
    await fs.writeFile(filepath, processedBuffer);

    // Return the relative URL path
    const url = `/uploads/blog/${filename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Image processing failed' }, { status: 500 });
  }
}
