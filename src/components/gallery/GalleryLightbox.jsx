'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function GalleryLightbox({ images = [], initialIndex = 0, open, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !images.length) return null;

  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#161B2A]/92 p-4 md:p-8 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <FaTimes />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 md:left-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 md:right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      <div
        className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[70vh]">
          <Image
            src={current.src}
            alt={current.alt || current.caption || 'Gallery photo'}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
        {(current.caption || current.alt) && (
          <p className="mt-4 text-center text-white/90 text-[0.95rem] font-medium max-w-2xl">
            {current.caption || current.alt}
          </p>
        )}
        {images.length > 1 && (
          <p className="mt-2 text-white/60 text-[0.82rem] font-semibold">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  );
}
