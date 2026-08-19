import prisma from '@/lib/db';
import { formatGalleryDate, humanizeSlug } from '@/lib/galleryFormat';

export { formatGalleryDate, humanizeSlug };

export async function getPublishedAlbums() {
  return prisma.galleryAlbum.findMany({
    where: { status: 'published' },
    orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }, { publishedAt: 'desc' }],
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      _count: { select: { images: true } },
    },
  });
}

export async function getAlbumBySlug(slug) {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized) return null;

  return prisma.galleryAlbum.findFirst({
    where: { slug: normalized, status: 'published' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function getPublishedAlbumSlugs() {
  try {
    const rows = await prisma.galleryAlbum.findMany({
      where: { status: 'published', allowIndexing: { not: false } },
      select: { slug: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getOtherAlbums(currentSlug, limit = 6) {
  return prisma.galleryAlbum.findMany({
    where: {
      status: 'published',
      slug: { not: currentSlug },
    },
    orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }],
    take: limit,
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      _count: { select: { images: true } },
    },
  });
}
