import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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

      <main className="bg-surface">
        <section className="relative pt-24 pb-14 md:pt-28 md:pb-18 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0" />
          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10 text-center">
            <div className="flex items-center justify-center gap-2.5 text-[0.88rem] font-semibold text-body mb-5">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-border">/</span>
              <span className="text-primary font-bold">Offers</span>
            </div>
            <span className="inline-block text-primary text-[0.85rem] font-semibold mb-4 tracking-[0.2em] uppercase">
              {page.heroTagline || 'Exclusive Downloads'}
            </span>
            <h1 className="text-[clamp(2.2rem,4.5vw,3.2rem)] font-extrabold text-heading mb-4 leading-tight">
              {page.title || 'Offers & Free Resources'}
            </h1>
            <p className="text-[1.05rem] text-body font-medium max-w-2xl mx-auto">
              {page.subtitle || 'Download handbooks, guides, and exclusive resources from Zeon Academy.'}
            </p>
          </div>
        </section>

        <section className="py-14 md:py-20">
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
