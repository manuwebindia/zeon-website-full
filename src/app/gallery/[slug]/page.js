import { notFound } from 'next/navigation';
import GalleryAlbumPage from '@/components/gallery/GalleryAlbumPage';
import { getAlbumBySlug, getPublishedAlbumSlugs, getOtherAlbums } from '@/lib/gallery';
import { buildPageMetadata } from '@/lib/pageSeo';

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedAlbumSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return { title: 'Album Not Found' };

  return buildPageMetadata('/gallery', {
    title: album.seoTitle || `${album.title} | Gallery | Zeon Academy`,
    description: album.seoDescription || album.description || `Photos from ${album.title} at Zeon Academy.`,
    canonical: `/gallery/${album.slug}`,
    allowIndexing: album.allowIndexing !== false,
  });
}

export default async function GallerySlugPage({ params }) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const otherAlbums = await getOtherAlbums(album.slug);

  return <GalleryAlbumPage album={album} otherAlbums={otherAlbums} />;
}
