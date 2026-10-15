import { NextResponse } from 'next/server';
import { getGoogleReviewsData, optimizeGooglePhotoUrl } from '@/lib/google-reviews';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const data = getGoogleReviewsData();
    const minRating = data.settings?.minRating || 4;

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam === 'all' ? 0 : parseInt(limitParam || '30', 10);

    const activeReviews = (data.reviews || [])
      .filter((r) => r.isActive !== false && (r.rating || 5) >= minRating)
      .map((r) => ({
        id: r.id,
        authorName: r.authorName,
        authorPhoto: optimizeGooglePhotoUrl(r.authorPhoto || '', 80),
        authorInitial: r.authorInitial || (r.authorName ? r.authorName[0].toUpperCase() : 'G'),
        authorUrl: r.authorUrl || '',
        rating: r.rating || 5,
        relativeTime: r.relativeTime || 'recently',
        text: r.text || '',
        isLocalGuide: Boolean(r.isLocalGuide),
        reviewCount: r.reviewCount || 0,
      }));

    const outputReviews = limit > 0 ? activeReviews.slice(0, limit) : activeReviews;

    return NextResponse.json({
      placeDetails: data.placeDetails || {
        displayName: 'Zeon Academy',
        rating: 4.9,
        userRatingCount: 181,
        googleMapsUri: 'https://maps.google.com/?cid=2104526408004949515',
        reviewDialogUri: 'https://search.google.com/local/writereview?placeid=ChIJozWLCdhyCDsRC1aQKZ7HNB0',
      },
      settings: data.settings || {},
      reviews: outputReviews,
      totalCount: data.placeDetails?.userRatingCount || 181,
      averageRating: data.placeDetails?.rating || 4.9,
    });
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
