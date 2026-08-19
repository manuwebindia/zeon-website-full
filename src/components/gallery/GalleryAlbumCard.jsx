'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaImages } from 'react-icons/fa';
import ScrollReveal from '../ScrollReveal';
import { formatGalleryDate } from '@/lib/galleryFormat';

export default function GalleryAlbumCard({ album, index = 0 }) {
  const cover = album.coverImage || album.images?.[0]?.src;
  const count = album._count?.images ?? album.images?.length ?? 0;
  const dateLabel = formatGalleryDate(album.eventDate || album.publishedAt);

  return (
    <ScrollReveal direction="up" distance={24} delay={index * 0.04}>
      <Link
        href={`/gallery/${album.slug}`}
        className="group block bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {cover ? (
            <Image
              src={cover}
              alt={album.title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 380px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-body/40">
              <FaImages className="text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161B2A]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5 md:p-6">
          <h3 className="text-[1.15rem] font-extrabold text-heading leading-snug mb-2 group-hover:text-primary transition-colors">
            {album.title}
          </h3>
          <div className="flex items-center justify-between gap-2 text-[0.82rem] font-medium text-body">
            {dateLabel && <span>{dateLabel}</span>}
            <span className="text-primary/80">{count} photo{count === 1 ? '' : 's'}</span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
