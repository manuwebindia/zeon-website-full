import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OfferCard from '../../components/OfferCard';
import ScrollReveal from '../../components/ScrollReveal';
import { buildPageMetadata } from '@/lib/pageSeo';
import { getPublicOffersPayload } from '@/lib/offers';
import { INNER_PAGE } from '@/lib/designLanguage';

const WhatsAppFloat = dynamic(() => import('../../components/WhatsAppFloat'));

export async function generateMetadata() {
  return buildPageMetadata('/offers');
}

export default async function OffersPage() {
  const { page, offers } = await getPublicOffersPayload();

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-white">
        <section className={INNER_PAGE.heroSection}>
          <Image
            src="/banner-white.svg"
            alt="Zeon Academy Offers Banner"
            sizes="1600px"
            fill
            priority
            className={INNER_PAGE.heroBannerClass}
          />
          <div className={INNER_PAGE.heroOverlay} />

          <div className={`${INNER_PAGE.heroContent} pb-0 md:pb-0`}>
            <div className="flex flex-col min-h-[380px] sm:min-h-[420px] md:min-h-0 md:grid md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-12 md:items-end">
              <div className={`${INNER_PAGE.heroInner} md:text-left md:mx-0 md:max-w-none md:pb-12 lg:pb-20 shrink-0`}>
                <nav className={`${INNER_PAGE.breadcrumb} md:justify-start`}>
                  <Link href="/" className={INNER_PAGE.breadcrumbLink}>Home</Link>
                  <span className={INNER_PAGE.breadcrumbSep}>/</span>
                  <span className={INNER_PAGE.breadcrumbCurrent}>Offers</span>
                </nav>
                <span className={`${INNER_PAGE.tagline} md:text-left`}>
                  {page.heroTagline || 'Exclusive Downloads'}
                </span>
                <h1 className={`${INNER_PAGE.title} md:text-left`}>
                  {page.title || 'Offers & Free Resources'}
                </h1>
                <p className={`${INNER_PAGE.subtitle} md:mx-0 md:text-left`}>
                  {page.subtitle || 'Download handbooks, guides, and exclusive resources from Zeon Academy.'}
                </p>
              </div>

              <div className="mt-auto md:mt-0 flex justify-end items-end relative z-[15]">
                <div className="relative w-[min(78vw,300px)] sm:w-[min(70vw,360px)] md:w-full md:max-w-[360px] lg:max-w-[420px] h-[240px] sm:h-[280px] md:h-[380px] lg:h-[440px]">
                  <Image
                    src="/offers/jk.png"
                    alt="Zeon Academy offers"
                    fill
                    priority
                    className="object-contain object-bottom"
                    sizes="(max-width: 1024px) 78vw, 420px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            {offers.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl">
                <p className="text-[1.1rem] font-bold text-heading mb-2">No active offers right now</p>
                <p className="text-body font-medium">Check back soon for new downloads and exclusive deals.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {offers.map((offer, idx) => (
                  <ScrollReveal key={offer.id} direction="up" distance={24} delay={idx * 0.05}>
                    <OfferCard offer={offer} />
                  </ScrollReveal>
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
