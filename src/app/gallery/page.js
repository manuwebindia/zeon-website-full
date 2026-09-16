import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InnerPageHero from '../../components/InnerPageHero';
import GalleryListingView from '../../components/gallery/GalleryListingView';
import { buildPageMetadata } from '@/lib/pageSeo';
import { getPublishedAlbums, getGalleryCategories } from '@/lib/gallery';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';

const WhatsAppFloat = dynamic(() => import('../../components/WhatsAppFloat'));

export async function generateMetadata() {
  return buildPageMetadata('/gallery');
}

export default async function GalleryIndexPage() {
  const [albums, categories] = await Promise.all([
    getPublishedAlbums(),
    getGalleryCategories(),
  ]);

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-white">
        <InnerPageHero
          banner={INNER_HERO_BANNERS.listing}
          bannerAlt="Zeon Academy Gallery"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Gallery' },
          ]}
          tagline="Memories from the Lens"
          title={
            <>
              Photo & Video
              <br />
              <span className="text-primary">Gallery</span>
            </>
          }
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
              <GalleryListingView albums={albums} categories={categories} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
