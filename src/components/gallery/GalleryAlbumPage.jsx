'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '../Navbar';
import Footer from '../Footer';
import InnerPageHero from '../InnerPageHero';
import GalleryAlbumCard from './GalleryAlbumCard';
import GalleryLightbox from './GalleryLightbox';
import ScrollReveal from '../ScrollReveal';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';

const WhatsAppFloat = dynamic(() => import('../WhatsAppFloat'));

export default function GalleryAlbumPage({ album, otherAlbums = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="bg-surface pb-20">
        <InnerPageHero
          banner={INNER_HERO_BANNERS.default}
          bannerAlt="Zeon Academy Gallery"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Gallery', href: '/gallery' },
            { label: album.title },
          ]}
          title={album.title}
          subtitle={album.description}
        />

        <section className={INNER_PAGE.section}>
          <div className={INNER_PAGE.container}>
            {album.images?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {album.images.map((img, idx) => {
                  const isVid = img.type === 'video' || !!img.videoUrl;
                  const displayImg = isVid ? (img.thumbnail || img.src) : img.src;

                  return (
                    <ScrollReveal key={img.id || idx} direction="up" distance={20} delay={idx * 0.02}>
                      <button
                        type="button"
                        onClick={() => openLightbox(idx)}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-card hover:border-primary/30 transition-all duration-300 cursor-pointer w-full text-left"
                      >
                        {displayImg && (
                          <Image
                            src={displayImg}
                            alt={img.alt || album.title}
                            fill
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 280px"
                            unoptimized={displayImg.startsWith('http')}
                          />
                        )}

                        {/* Video Play Overlay */}
                        {isVid && (
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[0.68rem] font-bold shadow">
                              Video
                            </span>
                          </div>
                        )}

                        {img.alt && (
                          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-[0.78rem] font-medium line-clamp-1">
                              {img.alt}
                            </p>
                          </div>
                        )}
                      </button>
                    </ScrollReveal>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl">
                <p className="text-[1.1rem] font-bold text-heading mb-2">Photos coming soon</p>
                <p className="text-body font-medium">This album is being updated.</p>
              </div>
            )}
          </div>
        </section>

        {otherAlbums.length > 0 && (
          <section className="py-16 bg-white border-t border-border">
            <div className={INNER_PAGE.container}>
              <h2 className="text-[2rem] font-extrabold text-heading mb-10 text-center">More Albums</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherAlbums.map((item, idx) => (
                  <GalleryAlbumCard key={item.id} album={item} index={idx} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <GalleryLightbox
        images={album.images || []}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </>
  );
}
