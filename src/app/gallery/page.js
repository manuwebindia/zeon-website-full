import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InnerPageHero from '../../components/InnerPageHero';
import GalleryAlbumCard from '../../components/gallery/GalleryAlbumCard';
import { buildPageMetadata } from '@/lib/pageSeo';
import { getPublishedAlbums } from '@/lib/gallery';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';

const WhatsAppFloat = dynamic(() => import('../../components/WhatsAppFloat'));

export async function generateMetadata() {
  return buildPageMetadata('/gallery');
}

export default async function GalleryIndexPage() {
  const albums = await getPublishedAlbums();

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-white">
        <InnerPageHero
          banner={INNER_HERO_BANNERS.listing}
          bannerAlt="Zeon Academy Gallery"
          align="center"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Gallery' },
          ]}
          tagline="Memories from the Lens"
          title="Gallery"
          subtitle="Celebrations, graduations, and moments from life at Zeon Academy — beyond the classroom."
        />

        <section className="py-14 md:py-20 bg-white">
          <div className={INNER_PAGE.container}>
            {albums.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl">
                <p className="text-[1.1rem] font-bold text-heading mb-2">Gallery coming soon</p>
                <p className="text-body font-medium">
                  Albums are being prepared. Check back shortly or{' '}
                  <Link href="/contact" className="text-primary font-semibold hover:underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.map((album, idx) => (
                  <GalleryAlbumCard key={album.id} album={album} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
