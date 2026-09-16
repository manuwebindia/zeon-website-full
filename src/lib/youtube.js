/**
 * Utility functions for parsing YouTube URLs, extracting IDs, generating thumbnails and embed URLs.
 */

export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Handle youtu.be/<id>
  const shortMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com/embed/<id>
  const embedMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];

  // Handle youtube.com/shorts/<id>
  const shortsMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];

  // Handle raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function getYouTubeThumbnail(videoIdOrUrl, quality = 'hq') {
  const id = getYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  if (!id) return '';
  // qualities: 'maxres' (1280x720), 'hq' (480x360), 'mq' (320x180), 'default' (120x90)
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoIdOrUrl, { autoplay = true, rel = 0 } = {}) {
  const id = getYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  if (!id) return '';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: String(rel),
    enablejsapi: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
