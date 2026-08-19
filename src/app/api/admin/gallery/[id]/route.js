import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'gallery.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const album = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    console.error('[admin/gallery/id] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = requirePermission(request, 'gallery.edit');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = await request.json();
    const canPublish = requirePermission(request, 'gallery.publish');
    let status = data.status ?? existing.status;
    if (status === 'published' && !canPublish) status = 'draft';

    let slug = existing.slug;
    if (data.slug) {
      slug = slugify(data.slug, { lower: true, strict: true });
      const conflict = await prisma.galleryAlbum.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) {
        return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
      }
    }

    const publishedAt =
      status === 'published'
        ? existing.publishedAt || new Date()
        : status === 'draft'
          ? null
          : existing.publishedAt;

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        title: data.title?.trim() ?? existing.title,
        slug,
        description: data.description !== undefined ? (data.description?.trim() || null) : undefined,
        coverImage: data.coverImage !== undefined ? (data.coverImage?.trim() || null) : undefined,
        seoTitle: data.seoTitle !== undefined ? (data.seoTitle?.trim() || null) : undefined,
        seoDescription: data.seoDescription !== undefined ? (data.seoDescription?.trim() || null) : undefined,
        allowIndexing: data.allowIndexing !== undefined ? Boolean(data.allowIndexing) : undefined,
        status,
        sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
        eventDate: data.eventDate !== undefined ? (data.eventDate ? new Date(data.eventDate) : null) : undefined,
        publishedAt,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (Array.isArray(data.images)) {
      await prisma.galleryImage.deleteMany({ where: { albumId: id } });
      if (data.images.length) {
        await prisma.galleryImage.createMany({
          data: data.images.map((img, idx) => ({
            albumId: id,
            src: img.src,
            alt: img.alt?.trim() || null,
            caption: img.caption?.trim() || null,
            sortOrder: Number.isFinite(Number(img.sortOrder)) ? Number(img.sortOrder) : idx,
          })),
        });
      }
    }

    const refreshed = await prisma.galleryAlbum.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    revalidateGallery(existing.slug);
    if (slug !== existing.slug) revalidateGallery(slug);

    return NextResponse.json(refreshed, { status: 200 });
  } catch (error) {
    console.error('[admin/gallery/id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = requirePermission(request, 'gallery.delete');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.galleryAlbum.delete({ where: { id } });

    revalidateGallery(existing.slug);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[admin/gallery/id] DELETE error:', error);
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
