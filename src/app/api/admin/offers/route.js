import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { readOffersConfig, writeOffersConfig, getActiveOfferSlugs } from '@/lib/offers';

export async function GET(request) {
  try {
    const user = requirePermission(request, 'offers.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const config = await readOffersConfig();
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('[admin/offers] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = requirePermission(request, 'offers.manage');
    if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const config = await writeOffersConfig(body);

    try {
      revalidatePath('/offers');
      const slugs = await getActiveOfferSlugs();
      for (const slug of slugs) {
        revalidatePath(`/offers/${slug}`);
      }
      revalidatePath('/sitemap.xml');
    } catch {
      // non-fatal
    }

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('[admin/offers] POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
