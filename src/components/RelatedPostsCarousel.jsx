'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Clock } from 'lucide-react';

export default function RelatedPostsCarousel({ posts = [], authorName = 'WDK Admin', authorImage = '' }) {
  const scrollRef = useRef(null);

  if (posts.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.85; // Scroll 85% of viewport width
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Dynamic reading time calculator
  const calculateReadTime = (content) => {
    if (!content) return 3;
    try {
      const blocks = typeof content === 'string' ? JSON.parse(content) : content;
      let textContent = '';
      
      if (Array.isArray(blocks)) {
        blocks.forEach(block => {
          if (block.type === 'text' && block.text) {
            textContent += block.text + ' ';
          } else if (block.content && Array.isArray(block.content)) {
            block.content.forEach(child => {
              if (child.text) textContent += child.text + ' ';
            });
          }
        });
      }
      
      const wordCount = textContent.split(/\s+/).filter(Boolean).length || 100;
      return Math.max(1, Math.ceil(wordCount / 200));
    } catch (e) {
      return 3;
    }
  };

  // Dynamic Category Pill Colors
  const getCategoryColors = (category) => {
    const cat = (category || '').toLowerCase().trim();
    if (cat.includes('wordpress')) {
      return 'bg-blue-50/80 text-blue-600 border-blue-100';
    }
    if (cat.includes('seo') || cat.includes('marketing') || cat.includes('digital')) {
      return 'bg-emerald-50/80 text-emerald-600 border-emerald-100';
    }
    if (cat.includes('web design') || cat.includes('design')) {
      return 'bg-indigo-50/80 text-indigo-600 border-indigo-100';
    }
    return 'bg-slate-50/80 text-slate-600 border-slate-100';
  };

  return (
    <section className="mt-16 pt-16 border-t border-slate-100 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A4FD6] mb-1.5 block">
            Continue Reading
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            More From WDK Blog
          </h3>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards List container with scrollbar hidden - Full Bleed on Mobile/Tablet */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-2 scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 xl:mx-0 xl:px-0 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 xl:scroll-pl-0"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.05)] hover:border-slate-200/50 w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
          >
            {/* Card Thumbnail */}
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-50/50">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                  <BookOpen className="h-10 w-10" strokeWidth={1} />
                </div>
              )}
            </Link>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-6">
              {/* Category */}
              <div className="mb-3">
                {post.category && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider border ${getCategoryColors(post.category)}`}>
                    {post.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 className="mb-2 text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-snug group-hover:text-[#1A4FD6] transition-colors duration-300 line-clamp-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h4>

              {/* Excerpt */}
              <p className="mb-5 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-3 font-normal font-inter">
                {post.excerpt}
              </p>

              {/* Author info footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                {authorImage ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-100">
                    <Image
                      src={authorImage}
                      alt={authorName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1A4FD6] to-[#17C653] text-[9px] font-extrabold text-white shadow-sm ring-2 ring-white">
                    {authorName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold text-slate-800 leading-none mb-1">
                    {authorName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{calculateReadTime(post.content)}m read</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
        {/* iOS Safari Right Padding Spacer */}
        <div className="shrink-0 w-px" aria-hidden="true"></div>
      </div>

      {/* Hide Scrollbar style utility */}
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
