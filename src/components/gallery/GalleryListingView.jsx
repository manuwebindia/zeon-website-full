'use client';

import { useState, useMemo } from 'react';
import GalleryAlbumCard from './GalleryAlbumCard';

export default function GalleryListingView({ albums = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Compute available filter tabs
  const hasVideos = useMemo(() => {
    return (
      categories.some((c) => c && c.toLowerCase().includes('video')) ||
      albums.some(
        (a) =>
          (a.videosCount ?? 0) > 0 ||
          (a.images || []).some((img) => img.type === 'video' || Boolean(img.videoUrl)) ||
          a.category?.toLowerCase() === 'videos' ||
          a.category?.toLowerCase() === 'video' ||
          a.title?.toLowerCase().includes('video') ||
          a.slug?.toLowerCase().includes('video') ||
          a.slug?.toLowerCase().includes('q-and-a')
      )
    );
  }, [albums, categories]);

  const hasGraduations = useMemo(() => {
    return (
      categories.some((c) => c && c.toLowerCase().includes('graduation')) ||
      albums.some(
        (a) =>
          a.category?.toLowerCase() === 'graduations' ||
          a.category?.toLowerCase() === 'graduation' ||
          a.title?.toLowerCase().includes('graduation') ||
          a.slug?.toLowerCase().includes('graduation')
      )
    );
  }, [albums, categories]);

  const tabs = useMemo(() => {
    const list = [{ id: 'all', label: 'All' }];

    // Ensure Graduations tab is added if present
    if (hasGraduations) {
      list.push({ id: 'graduations', label: 'Graduations' });
    }

    // Add other explicit categories from DB
    categories.forEach((cat) => {
      if (
        cat &&
        !cat.toLowerCase().includes('graduation') &&
        !cat.toLowerCase().includes('video') &&
        !list.some((t) => t.id.toLowerCase() === cat.toLowerCase())
      ) {
        list.push({ id: cat.toLowerCase(), label: cat });
      }
    });

    // Ensure Videos tab is added
    if (hasVideos) {
      list.push({ id: 'videos', label: 'Videos' });
    }

    return list;
  }, [categories, hasGraduations, hasVideos]);

  const filteredAlbums = useMemo(() => {
    if (selectedCategory === 'all') return albums;

    if (selectedCategory.toLowerCase() === 'graduations') {
      return albums.filter((a) => {
        const cat = (a.category || '').toLowerCase();
        const title = (a.title || '').toLowerCase();
        const slug = (a.slug || '').toLowerCase();
        return (
          cat === 'graduations' ||
          cat === 'graduation' ||
          title.includes('graduation') ||
          slug.includes('graduation')
        );
      });
    }

    if (selectedCategory.toLowerCase() === 'videos') {
      return albums.filter((a) => {
        const cat = (a.category || '').toLowerCase();
        const title = (a.title || '').toLowerCase();
        const slug = (a.slug || '').toLowerCase();
        const hasVideoImages = (a.images || []).some(
          (img) => img.type === 'video' || Boolean(img.videoUrl)
        );
        return (
          cat === 'videos' ||
          cat === 'video' ||
          (a.videosCount ?? 0) > 0 ||
          hasVideoImages ||
          title.includes('video') ||
          slug.includes('video') ||
          slug.includes('q-and-a')
        );
      });
    }

    return albums.filter(
      (a) => a.category && a.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [albums, selectedCategory]);

  return (
    <div>
      {/* Category Tabs */}
      {tabs.length > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3 mb-10 md:mb-12">
          {tabs.map((tab) => {
            const active = selectedCategory.toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 sm:px-6 py-2 rounded-full text-[0.88rem] sm:text-[0.92rem] font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                    : 'bg-surface border border-border text-body hover:border-primary/40 hover:text-heading'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl max-w-lg mx-auto">
          <p className="text-[1.1rem] font-bold text-heading mb-2">No albums found</p>
          <p className="text-body font-medium mb-4">
            There are no albums in this category yet.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            View all albums
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album, idx) => (
            <GalleryAlbumCard key={album.id} album={album} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
