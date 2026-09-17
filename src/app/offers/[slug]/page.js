import { notFound } from 'next/navigation';
import OfferDetailPage from '@/components/OfferDetailPage';
import { getOfferBySlug, getActiveOfferSlugs, getPublicOffersPayload } from '@/lib/offers';
import { buildPageMetadata } from '@/lib/pageSeo';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getActiveOfferSlugs();
    return (slugs || []).slice(0, 5).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: 'Offer Not Found' };

  const title = offer.text || offer.heading?.replace(/\n/g, ' ') || 'Offer';
  return buildPageMetadata('/offers', {
    title: `${title} | Offers | Zeon Academy`,
    description: offer.aboutPoints?.[0] || `Claim ${title} from Zeon Academy, Kochi.`,
    canonical: `/offers/${offer.slug}`,
    allowIndexing: true,
  });
}

export default async function OfferInnerPage({ params }) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  const { offers } = await getPublicOffersPayload();
  const otherOffers = offers.filter((item) => item.slug !== offer.slug);

  return <OfferDetailPage offer={offer} otherOffers={otherOffers} />;
}
