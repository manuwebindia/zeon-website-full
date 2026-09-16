'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import GalleryAlbumCard from './GalleryAlbumCard';

export default function GalleryListingView({ albums = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Compute available filter tabs
  const hasVideos = useMemo(() => {
    return albums.some((a) => (a.videosCount ?? 0) > 0 || (a.images || []).some((img) => img.type === 'video'));
  }, [albums]);

  const tabs = useMemo(() => {
    const list = [{ id: 'all', label: 'All' }];
    categories.forEach((cat) => {
      if (cat && !list.some((t) => t.id.toLowerCase() === cat.toLowerCase())) {
        list.push({ id: cat, label: cat });
      }
    });
    if (hasVideos && !list.some((t) => t.id.toLowerCase() === 'videos')) {
      list.push({ id: 'videos', label: 'Videos' });
    }
    return list;
  }, [categories, hasVideos]);

  const filteredAlbums = useMemo(() => {
    if (selectedCategory === 'all') return albums;
    if (selectedCategory.toLowerCase() === 'videos') {
      return albums.filter((a) => (a.videosCount ?? 0) > 0 || (a.images || []).some((img) => img.type === 'video') || (a.category && a.category.toLowerCase() === 'videos'));
    }
    return albums.filter((a) => a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [albums, selectedCategory]);

  return (
    <div>
      {/* Category Tabs */}
      {tabs.length > 1 && (
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {tabs.map((tab) => {
            const active = selectedCategory.toLowerCase() === tab.id.toLowerCase();
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2 rounded-full text-[0.88rem] font-bold transition-all duration-200 cursor-pointer ${
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
            There are no albums in the &quot;{selectedCategory}&quot; category yet.
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
