'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaImages, FaVideo } from 'react-icons/fa';
import ScrollReveal from '../ScrollReveal';
import { formatGalleryDate } from '@/lib/galleryFormat';

export default function GalleryAlbumCard({ album, index = 0 }) {
  const cover = album.coverImage || album.images?.[0]?.src || album.images?.[0]?.thumbnail;
  const rawImages = album.images || [];
  const videosCount = rawImages.filter((i) => i.type === 'video').length;
  const photosCount = (album._count?.images ?? rawImages.length) - videosCount;
  const totalCount = album._count?.images ?? rawImages.length;
  const dateLabel = formatGalleryDate(album.eventDate || album.publishedAt);

  return (
    <ScrollReveal direction="up" distance={24} delay={index * 0.04}>
      <Link
        href={`/gallery/${album.slug}`}
        className="group block bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {cover ? (
            <Image
              src={cover}
              alt={album.title}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 380px"
              unoptimized={cover.startsWith('http')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-body/40">
              <FaImages className="text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161B2A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {album.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-heading/80 backdrop-blur-sm text-white text-[0.7rem] font-bold tracking-wide uppercase shadow-sm">
              {album.category}
            </div>
          )}

          {videosCount > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-red-600/90 backdrop-blur-sm text-white text-[0.7rem] font-bold flex items-center gap-1 shadow-sm">
              <FaVideo className="text-[0.65rem]" />
              <span>Video</span>
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-[1.15rem] font-extrabold text-heading leading-snug mb-2 group-hover:text-primary transition-colors">
              {album.title}
            </h3>
            {album.description && (
              <p className="text-[0.85rem] text-body line-clamp-2 mb-3 leading-relaxed">
                {album.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-[0.8rem] font-medium text-body pt-2 border-t border-border/60">
            {dateLabel && <span>{dateLabel}</span>}
            {dateLabel && <span className="text-body/40">•</span>}
            <span>
              {videosCount > 0
                ? `${photosCount > 0 ? `${photosCount} photo${photosCount === 1 ? '' : 's'} · ` : ''}${videosCount} video${videosCount === 1 ? '' : 's'}`
                : `${totalCount} photo${totalCount === 1 ? '' : 's'}`}
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}
