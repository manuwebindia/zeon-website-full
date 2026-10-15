'use client';

import GalleryAlbumCard from './GalleryAlbumCard';

export default function GalleryListingView({ albums = [] }) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white border border-border rounded-2xl max-w-lg mx-auto">
        <p className="text-[1.1rem] font-bold text-heading mb-2">No albums found</p>
        <p className="text-body font-medium">There are no albums published yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {albums.map((album, idx) => (
        <GalleryAlbumCard key={album.id} album={album} index={idx} />
      ))}
    </div>
  );
}
