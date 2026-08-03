import { NextResponse } from 'next/server';
import { getPublicOffersPayload, getPopupConfig } from '@/lib/offers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type === 'popup') {
      const popup = await getPopupConfig();
      return NextResponse.json({ popup }, { status: 200 });
    }

    const payload = await getPublicOffersPayload();
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('[api/offers] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
