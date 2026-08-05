'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import BrochureDownloadButton from './BrochureDownloadButton';
import FreeDemoForm from './FreeDemoForm';
import OfferCard from './OfferCard';
import { formatOfferDate } from '@/lib/offerFormat';

const WhatsAppFloat = dynamic(() => import('./WhatsAppFloat'));

export default function OfferDetailPage({ offer, otherOffers = [] }) {
  const displayTitle = offer.text || offer.heading?.replace(/\n/g, ' ') || 'Offer';
  const validLabel = offer.validUntil ? formatOfferDate(offer.validUntil) : '';
  const brochureName = displayTitle;

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-surface pb-20">
        <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 bg-surface bg-grid-pattern overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-1">
            <Image
              src="/courses/courses-fin.webp"
              alt="Zeon Academy Offers Banner"
              sizes="100vw"
              fill
              priority
              className="object-cover object-center opacity-100 pointer-events-none"
            />
          </div>
          <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-primary/10 rounded-full blur-3xl z-0 animate-pulse-glow" />
          <div className="absolute -bottom-10 right-10 w-[250px] h-[250px] bg-[#ff8c4a]/10 rounded-full blur-3xl z-0 animate-pulse-glow" />

          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
            <div className="animate-fade-in-up text-center lg:text-left">
              <nav className="flex items-center justify-center lg:justify-start gap-2 flex-wrap text-[0.88rem] font-semibold text-body my-6">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <FaChevronRight className="text-body/30 text-[0.65rem]" />
                <Link href="/offers" className="hover:text-primary transition-colors">Offers</Link>
                <FaChevronRight className="text-body/30 text-[0.65rem]" />
                <span className="text-primary font-bold">{displayTitle}</span>
              </nav>

              {offer.tagline && (
                <span className="inline-block text-primary text-[0.82rem] font-bold mb-3 tracking-[0.22em] uppercase">
                  {offer.tagline}
                </span>
              )}
              <h1 className="text-[2rem] md:text-[2.8rem] font-extrabold text-heading leading-tight mb-4 whitespace-pre-line">
                {offer.heading}
              </h1>
              {validLabel && (
                <p className="text-[0.95rem] text-body font-medium">
                  {offer.validUntilLabel}{' '}
                  <span className="font-bold text-heading">{validLabel}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 relative">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 lg:w-2/3">
                {offer.aboutPoints?.length > 0 && (
                  <ScrollReveal direction="up" distance={30}>
                    <div className="bg-white border border-border rounded-[20px] p-6 md:p-8 mb-8 shadow-sm">
                      <h2 className="text-[1.5rem] font-extrabold text-heading mb-6">
                        {offer.aboutTitle}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        {offer.aboutPoints.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <FaCheckCircle className="text-blue-600 mt-1 shrink-0" />
                            <span className="text-body font-medium leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {offer.howToAvailSteps?.length > 0 && (
                  <ScrollReveal direction="up" distance={30}>
                    <div className="mb-10">
                      <h2 className="text-[1.5rem] font-extrabold text-heading mb-4">
                        {offer.howToAvailTitle}
                      </h2>
                      <ol className="list-decimal pl-5 space-y-3 text-body font-medium leading-relaxed">
                        {offer.howToAvailSteps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </ScrollReveal>
                )}
              </div>

              <div className="w-full lg:w-1/3 lg:max-w-[400px]">
                <div className="sticky top-28 space-y-6">
                  {offer.showBrochureForm && offer.downloadUrl && (
                    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-card">
                      <div className="h-[5px] w-full bg-gradient-to-r from-primary via-[#ff4a4a] to-[#ff8c4a]" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <polyline points="14 2 14 8 20 8" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              <text x="6" y="19" fontSize="5.5" fontWeight="800" fill="#ef4444" fontFamily="sans-serif">PDF</text>
                            </svg>
                          </div>
                          <div>
                            <p className="text-[0.95rem] font-extrabold text-heading leading-tight">
                              {displayTitle}
                            </p>
                            <p className="text-[0.78rem] text-body mt-0.5">Free Download</p>
                          </div>
                        </div>
                        <p className="text-[0.82rem] text-body mb-4 leading-relaxed">
                          Enter your details to download the handbook instantly — free for a limited time.
                        </p>
                        <BrochureDownloadButton
                          brochureUrl={offer.downloadUrl}
                          courseName={brochureName}
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-[#ff4a4a] text-white font-bold text-[0.9rem] hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          {offer.downloadButtonText || 'Download Now'}
                        </BrochureDownloadButton>
                      </div>
                    </div>
                  )}

                  {offer.showDemoForm && <FreeDemoForm />}
                </div>
              </div>
            </div>
          </div>
        </section>

        {otherOffers.length > 0 && (
          <section className="py-16 bg-white border-t border-border">
            <div className="w-full max-w-[1200px] mx-auto px-6">
              <h2 className="text-[2rem] font-extrabold text-heading mb-10 text-center">More Offers</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {otherOffers.map((item, idx) => (
                  <ScrollReveal key={item.id} direction="up" distance={24} delay={idx * 0.05}>
                    <OfferCard offer={item} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
