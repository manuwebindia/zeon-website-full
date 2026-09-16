import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { fetchFromGooglePlacesApi } from '@/lib/google-reviews';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user =
      requirePermission(request, 'reviews.edit') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.edit') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    let apiKeyOverride;
    let placeIdOverride;

    try {
      const body = await request.json();
      apiKeyOverride = body.apiKey;
      placeIdOverride = body.placeId;
    } catch {
      // Empty body is fine, will use env defaults
    }

    const result = await fetchFromGooglePlacesApi(apiKeyOverride, placeIdOverride);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized with Google Places API! Rating: ${result.placeDetails.rating}★ (${result.placeDetails.userRatingCount} reviews)`,
      ...result,
    });
  } catch (error) {
    console.error('Google Places API sync failed:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to sync with Google Places API',
      },
      { status: 500 }
    );
  }
}
