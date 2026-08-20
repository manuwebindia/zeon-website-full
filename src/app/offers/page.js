import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FaChevronRight } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OfferCard from '../../components/OfferCard';
import ScrollReveal from '../../components/ScrollReveal';
import { buildPageMetadata } from '@/lib/pageSeo';
import { getPublicOffersPayload } from '@/lib/offers';

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
        <section className="relative pt-24 pb-0 md:pt-28 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-1">
            <Image
              src="/courses/courss.webp"
              alt="Zeon Academy Offers Banner"
              sizes="1600px"
              fill
              priority
              className="object-cover object-center opacity-100 pointer-events-none"
            />
          </div>
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 animate-fade-in-up">
            <div className="flex flex-col min-h-[380px] sm:min-h-[420px] md:min-h-0 md:grid md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-12 md:items-end">
              <div className="text-center md:text-left md:pb-12 lg:pb-20 shrink-0">
                <nav className="flex items-center justify-center md:justify-start gap-2 mb-5 text-[0.88rem] font-semibold text-body">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <FaChevronRight className="text-body/30 text-[0.65rem]" />
                  <span className="text-primary font-bold">Offers</span>
                </nav>
                <span className="inline-block text-primary text-[0.82rem] font-bold mb-3 tracking-[0.22em] uppercase">
                  {page.heroTagline || 'Exclusive Downloads'}
                </span>
                <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1.15] text-heading mb-5 tracking-tight">
                  {page.title || 'Offers & Free Resources'}
                </h1>
                <p className="text-[1.05rem] text-body leading-relaxed font-medium max-w-2xl mx-auto md:mx-0">
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
