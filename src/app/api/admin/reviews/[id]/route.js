import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { getGoogleReviewsData, saveGoogleReviewsData } from '@/lib/google-reviews';

export async function PUT(request, { params }) {
  try {
    const user =
      requirePermission(request, 'reviews.edit') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.edit') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const data = getGoogleReviewsData();
    const index = (data.reviews || []).findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const current = data.reviews[index];
    const updatedReview = {
      ...current,
      ...body,
      id: current.id, // Immutable ID
    };

    if (body.authorName) {
      updatedReview.authorInitial = (body.authorName[0] || 'G').toUpperCase();
    }

    data.reviews[index] = updatedReview;
    saveGoogleReviewsData(data);

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user =
      requirePermission(request, 'reviews.delete') ||
      requirePermission(request, 'reviews.manage') ||
      requirePermission(request, 'settings.edit') ||
      requirePermission(request, 'seo.manage') ||
      requirePermission(request, 'dashboard.view');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const data = getGoogleReviewsData();

    const initialLength = (data.reviews || []).length;
    data.reviews = (data.reviews || []).filter((r) => r.id !== id);

    if (data.reviews.length === initialLength) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    saveGoogleReviewsData(data);
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
