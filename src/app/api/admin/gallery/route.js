import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = requirePermission(request, 'gallery.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const albums = await prisma.galleryAlbum.findMany({
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      include: {
        _count: { select: { images: true } },
      },
    });

    return NextResponse.json({ albums }, { status: 200 });
  } catch (error) {
    console.error('[admin/gallery] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = requirePermission(request, 'gallery.create');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = await request.json();
    const title = String(data.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const canPublish = requirePermission(request, 'gallery.publish');
    const status = data.status === 'published' && canPublish ? 'published' : (data.status || 'draft');

    let slug = slugify(data.slug || title, { lower: true, strict: true });
    const existing = await prisma.galleryAlbum.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        slug,
        description: data.description?.trim() || null,
        coverImage: data.coverImage?.trim() || null,
        seoTitle: data.seoTitle?.trim() || null,
        seoDescription: data.seoDescription?.trim() || null,
        allowIndexing: data.allowIndexing !== false,
        status,
        sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        publishedAt: status === 'published' ? new Date() : null,
        images: Array.isArray(data.images)
          ? {
              create: data.images.map((img, idx) => ({
                src: img.src,
                alt: img.alt?.trim() || null,
                caption: img.caption?.trim() || null,
                sortOrder: Number.isFinite(Number(img.sortOrder)) ? Number(img.sortOrder) : idx,
              })),
            }
          : undefined,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    revalidateGallery(album.slug);
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('[admin/gallery] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function revalidateGallery(slug) {
  try {
    revalidatePath('/gallery');
    if (slug) revalidatePath(`/gallery/${slug}`);
    revalidatePath('/sitemap.xml');
  } catch {
    // non-fatal
  }
}
