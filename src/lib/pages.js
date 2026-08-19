import prisma from '@/lib/db';

export async function getPublishedPageBySlug(slug) {
  return prisma.page.findFirst({
    where: { slug, status: 'published' },
  });
}

export async function getPublishedPageSlugs() {
  const pages = await prisma.page.findMany({
    where: { status: 'published', allowIndexing: true },
    select: { slug: true },
    orderBy: { updatedAt: 'desc' },
  });
  return pages.map((p) => p.slug);
}

export async function getAllPublishedPagesForStaticParams() {
  return prisma.page.findMany({
    where: { status: 'published' },
    select: { slug: true },
  });
}
