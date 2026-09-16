import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { getGoogleReviewsData, saveGoogleReviewsData } from '@/lib/google-reviews';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user =
      requirePermission(request, 'reviews.view') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.view') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const data = getGoogleReviewsData();
    const reviews = data.reviews || [];

    const stats = {
      total: reviews.length,
      active: reviews.filter((r) => r.isActive !== false).length,
      inactive: reviews.filter((r) => r.isActive === false).length,
      fiveStar: reviews.filter((r) => (r.rating || 5) === 5).length,
      googleRating: data.placeDetails?.rating || 4.9,
      googleReviewCount: data.placeDetails?.userRatingCount || 181,
      lastSyncedAt: data.placeDetails?.lastSyncedAt || null,
    };

    return NextResponse.json({
      placeDetails: data.placeDetails,
      settings: data.settings,
      reviews,
      stats,
    });
  } catch (error) {
    console.error('Failed to get admin reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user =
      requirePermission(request, 'reviews.create') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.edit') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { authorName, authorPhoto, rating, text, relativeTime, isLocalGuide } = body;

    if (!authorName || !text) {
      return NextResponse.json(
        { error: 'Author name and review text are required.' },
        { status: 400 }
      );
    }

    const data = getGoogleReviewsData();
    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      authorName: authorName.trim(),
      authorPhoto: authorPhoto || '',
      authorInitial: (authorName.trim()[0] || 'G').toUpperCase(),
      rating: Number(rating) || 5,
      relativeTime: relativeTime?.trim() || 'Recently',
      publishTime: new Date().toISOString(),
      text: text.trim(),
      isLocalGuide: Boolean(isLocalGuide),
      reviewCount: 0,
      isActive: true,
      source: 'manual',
    };

    data.reviews = [newReview, ...(data.reviews || [])];
    saveGoogleReviewsData(data);

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user =
      requirePermission(request, 'reviews.edit') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.edit') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { settings, placeDetails } = body;

    const data = getGoogleReviewsData();

    if (settings) {
      data.settings = {
        ...data.settings,
        ...settings,
      };
    }

    if (placeDetails) {
      data.placeDetails = {
        ...data.placeDetails,
        ...placeDetails,
      };
    }

    saveGoogleReviewsData(data);

    return NextResponse.json({ success: true, settings: data.settings, placeDetails: data.placeDetails });
  } catch (error) {
    console.error('Failed to update review settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
