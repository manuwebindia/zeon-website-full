import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'google-reviews.json');

const DEFAULT_DATA = {
  placeDetails: {
    placeId: process.env.GOOGLE_PLACE_ID || 'ChIJozWLCdhyCDsRC1aQKZ7HNB0',
    displayName: 'Zeon Academy',
    rating: 4.9,
    userRatingCount: 181,
    googleMapsUri: 'https://maps.google.com/?cid=2104526408004949515',
    reviewDialogUri: 'https://search.google.com/local/writereview?placeid=' + (process.env.GOOGLE_PLACE_ID || 'ChIJozWLCdhyCDsRC1aQKZ7HNB0'),
    formattedAddress: '46/2709 C, Ground Floor, Haritha Rd, Chakkaraparambu, Vennala, Kochi, Kerala 682028, India',
    lastSyncedAt: new Date().toISOString(),
  },
  settings: {
    minRating: 4,
    autoRotate: true,
    rotateInterval: 5000,
    showGoogleBadge: true,
    reviewsPerPage: 6,
  },
  reviews: [],
};

export function getGoogleReviewsData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      saveGoogleReviewsData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading google-reviews.json:', error);
    return DEFAULT_DATA;
  }
}

export function saveGoogleReviewsData(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving google-reviews.json:', error);
    return false;
  }
}

/**
 * Normalizes review from either Legacy Places API or Places API (New)
 */
function normalizeReview(r) {
  // Legacy Places API format
  if (r.author_name) {
    return {
      authorName: r.author_name,
      authorPhoto: r.profile_photo_url || '',
      authorInitial: (r.author_name[0] || 'G').toUpperCase(),
      authorUrl: r.author_url || '',
      rating: r.rating || 5,
      relativeTime: r.relative_time_description || 'recently',
      publishTime: r.time ? new Date(r.time * 1000).toISOString() : new Date().toISOString(),
      text: r.text || '',
      isLocalGuide: Boolean(r.author_name && r.rating >= 4),
    };
  }

  // Places API (New) format
  const authorName = r.authorAttribution?.displayName || 'Google Reviewer';
  const text = r.text?.text || r.originalText?.text || (typeof r.text === 'string' ? r.text : '');
  return {
    authorName,
    authorPhoto: r.authorAttribution?.photoUri || '',
    authorInitial: (authorName[0] || 'G').toUpperCase(),
    authorUrl: r.authorAttribution?.uri || '',
    rating: r.rating || 5,
    relativeTime: r.relativePublishTimeDescription || 'recently',
    publishTime: r.publishTime || new Date().toISOString(),
    text,
    isLocalGuide: true,
  };
}

export async function fetchFromGooglePlacesApi(apiKeyOverride, placeIdOverride) {
  const apiKey = (apiKeyOverride || process.env.GOOGLE_PLACES_API_KEY || '').trim();
  const placeId = (placeIdOverride || process.env.GOOGLE_PLACE_ID || 'ChIJozWLCdhyCDsRC1aQKZ7HNB0').trim();

  if (!apiKey) {
    throw new Error('Google Places API key is missing. Please check .env.local or settings.');
  }
  if (!placeId) {
    throw new Error('Google Place ID is missing.');
  }

  const currentData = getGoogleReviewsData();
  let placeName = currentData.placeDetails?.displayName || 'Zeon Academy';
  let rating = currentData.placeDetails?.rating || 4.9;
  let userRatingCount = currentData.placeDetails?.userRatingCount || 181;
  let googleMapsUri = currentData.placeDetails?.googleMapsUri || `https://maps.google.com/?cid=2104526408004949515`;
  let formattedAddress = currentData.placeDetails?.formattedAddress || '';
  let rawReviews = [];
  let apiUsed = 'legacy_places_api';

  // ── 1. Try Legacy Google Places API first ──────────────────────────────────
  try {
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,reviews,url,formatted_address&key=${encodeURIComponent(apiKey)}`;

    const legacyRes = await fetch(legacyUrl);
    if (legacyRes.ok) {
      const legacyData = await legacyRes.json();
      if (legacyData.status === 'OK' && legacyData.result) {
        const res = legacyData.result;
        placeName = res.name || placeName;
        if (typeof res.rating === 'number') rating = res.rating;
        if (typeof res.user_ratings_total === 'number') userRatingCount = res.user_ratings_total;
        if (res.url) googleMapsUri = res.url;
        if (res.formatted_address) formattedAddress = res.formatted_address;
        if (Array.isArray(res.reviews)) rawReviews = res.reviews;
        apiUsed = 'legacy_places_api';
      } else {
        console.warn('Legacy Places API status:', legacyData.status, legacyData.error_message);
        // Fallback to New Places API if legacy returned REQUEST_DENIED
        throw new Error(legacyData.error_message || legacyData.status);
      }
    } else {
      throw new Error(`HTTP ${legacyRes.status}`);
    }
  } catch (legacyErr) {
    console.log('Legacy Places API unavailable, falling back to Places API (New):', legacyErr.message);

    // ── 2. Fallback to Places API (New) ────────────────────────────────────
    const newApiUrl = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const fieldMask = [
      'id',
      'displayName',
      'rating',
      'userRatingCount',
      'googleMapsUri',
      'formattedAddress',
      'reviews',
    ].join(',');

    const newRes = await fetch(newApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
    });

    if (!newRes.ok) {
      const errText = await newRes.text();
      throw new Error(`Google Places API returned error: ${errText}`);
    }

    const newPlace = await newRes.json();
    placeName = newPlace.displayName?.text || placeName;
    if (typeof newPlace.rating === 'number') rating = newPlace.rating;
    if (typeof newPlace.userRatingCount === 'number') userRatingCount = newPlace.userRatingCount;
    if (newPlace.googleMapsUri) googleMapsUri = newPlace.googleMapsUri;
    if (newPlace.formattedAddress) formattedAddress = newPlace.formattedAddress;
    if (Array.isArray(newPlace.reviews)) rawReviews = newPlace.reviews;
    apiUsed = 'places_api_new';
  }

  // Update place details
  const updatedPlaceDetails = {
    ...currentData.placeDetails,
    placeId,
    displayName: placeName,
    rating,
    userRatingCount,
    googleMapsUri,
    reviewDialogUri: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    formattedAddress,
    lastSyncedAt: new Date().toISOString(),
  };

  // Merge any incoming reviews
  let newReviewsCount = 0;
  const existingReviews = [...(currentData.reviews || [])];

  for (const raw of rawReviews) {
    const normalized = normalizeReview(raw);
    if (!normalized.text || normalized.rating < 4) continue;

    const exists = existingReviews.some((er) => {
      if (er.authorName.toLowerCase() === normalized.authorName.toLowerCase()) return true;
      if (er.text && er.text.substring(0, 40) === normalized.text.substring(0, 40)) return true;
      return false;
    });

    if (!exists) {
      newReviewsCount++;
      existingReviews.unshift({
        id: `g-rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        ...normalized,
        reviewCount: 0,
        isActive: true,
        source: 'google_places_api',
      });
    }
  }

  const updatedData = {
    ...currentData,
    placeDetails: updatedPlaceDetails,
    reviews: existingReviews,
  };

  saveGoogleReviewsData(updatedData);

  return {
    success: true,
    apiUsed,
    placeDetails: updatedPlaceDetails,
    newReviewsCount,
    totalReviews: existingReviews.length,
    rawGoogleReviewsCount: rawReviews.length,
  };
}
