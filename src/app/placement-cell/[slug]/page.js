import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InnerPageHero from '@/components/InnerPageHero';
import BlogContent from '@/components/BlogContent';
import { getPublishedPageBySlug } from '@/lib/pages';
import { INNER_HERO_BANNERS } from '@/lib/designLanguage';

export const dynamicParams = true;
export const revalidate = 60;

function getCachedPage(slug) {
  return unstable_cache(
    () => getPublishedPageBySlug(slug),
    [`placement-page-${slug}`],
    { tags: ['site-pages', `site-page-${slug}`, `placement-page-${slug}`] },
  )();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getCachedPage(slug);
  if (!page) return { title: 'Placement Vacancy Not Found' };

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || page.excerpt || undefined;

  return {
    title: `${title} | Placement Cell | Zeon Academy`,
    description,
    robots: page.allowIndexing === false ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/placement-cell/${page.slug}` },
    openGraph: {
      title: `${title} | Placement Cell | Zeon Academy`,
      description,
      images: page.featuredImage ? [{ url: page.featuredImage }] : undefined,
    },
  };
}

export default async function PlacementSlugPage({ params }) {
  const { slug } = await params;
  const page = await getCachedPage(slug);
  if (!page) {
    notFound();
  }

  const banner = page.featuredImage || INNER_HERO_BANNERS.default;

  return (
    <>
      <Navbar />
      <main>
        <InnerPageHero
          banner={banner}
          bannerAlt={page.title}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Placement Cell', href: '/placement-cell' },
            { label: page.title },
          ]}
          title={page.title}
          subtitle={page.excerpt || undefined}
        />
        <section className="py-12 md:py-16 bg-white">
          <BlogContent content={page.content} />
        </section>
      </main>
      <Footer />
    </>
  );
}
