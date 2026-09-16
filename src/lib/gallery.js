import prisma from '@/lib/db';
import { formatGalleryDate, humanizeSlug } from '@/lib/galleryFormat';

export { formatGalleryDate, humanizeSlug };

export async function getPublishedAlbums(category = null) {
  const where = { status: 'published' };
  if (category && category !== 'all') {
    where.category = category;
  }

  return prisma.galleryAlbum.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { eventDate: 'desc' }, { publishedAt: 'desc' }],
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          type: true,
          src: true,
          videoUrl: true,
          thumbnail: true,
        },
      },
      _count: { select: { images: true } },
    },
  });
}

export async function getGalleryCategories() {
  try {
    const rows = await prisma.galleryAlbum.findMany({
      where: { status: 'published', category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });
    return rows.map((r) => r.category).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getAlbumBySlug(slug) {
  const normalized = String(slug || '').trim().toLowerCase();
  if (!normalized) return null;

  return prisma.galleryAlbum.findFirst({
    where: { slug: normalized, status: 'published' },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
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
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: {
          id: true,
          type: true,
          src: true,
          videoUrl: true,
          thumbnail: true,
        },
      },
      _count: { select: { images: true } },
    },
  });
}
