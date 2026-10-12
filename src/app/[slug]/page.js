import { notFound, redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InnerPageHero from '@/components/InnerPageHero';
import BlogContent from '@/components/BlogContent';
import { getPublishedPageBySlug, getAllPublishedPagesForStaticParams } from '@/lib/pages';
import { INNER_HERO_BANNERS } from '@/lib/designLanguage';
import prisma from '@/lib/db';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const pages = await getAllPublishedPagesForStaticParams();
    return (pages || []).slice(0, 5).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getCachedPage(slug);
  if (!page) return { title: 'Page Not Found' };

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || page.excerpt || undefined;

  return {
    title,
    description,
    robots: page.allowIndexing === false ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/${page.slug}` },
    openGraph: {
      title,
      description,
      images: page.featuredImage ? [{ url: page.featuredImage }] : undefined,
    },
  };
}

function getCachedPage(slug) {
  return unstable_cache(
    () => getPublishedPageBySlug(slug),
    [`site-page-${slug}`],
    { tags: ['site-pages', `site-page-${slug}`] },
  )();
}

export default async function SitePage({ params }) {
  const { slug } = await params;
  const PLACEMENT_PAGE_SLUGS = new Set([
    'digital-marketing-specialist-and-graphic-designer',
    'digital-marketing-trainees',
    'digital-marketer-maad-concepts',
    'digital-marketing-intern-oppiatec-consulting-pvt-ltd',
    'junior-seo-analyst',
    'digital-marketing-intern',
    'digital-marketing-executive-2',
    'digital-marketer-black-onyx-international-llc-2',
    'digital-marketing-vintage-events-pvt-ltd',
    'digital-marketing-intern-infinity-ideas',
    'online-sales-personnel',
    'digital-marketer-whitesean-news',
    'digital-marketing-executive',
    'digital-marketer',
    'digital-marketer-ialim-edge',
    'digital-marketer-black-onyx-international-llc',
    'digital-marketer-ialm-edge',
    'digital-marketing-manager-thanima-farm-life',
    'digital-marketing-neuflo-solutions',
    'digital-marketing-trainee-adox-global-pvt-ltd',
    'digital-marketing-intern-classic-digital-solutions',
    'video-editor-ishkhan-aviation-academy',
    'digital-marketing-intern-global-visa-online',
    'digital-marketing-interns-peraka-media',
    'content-creator-evolux-solutions',
    'social-media-and-digital-marketing-intern-capsdata-technologies',
    'marketing-executive-ye-stack',
    'video-editor-social-media-content-creator-pepebbq',
    'digital-marketing-intern-find-my-hostel',
    'digital-marketing-trainee-indo-european-institute-of-engineering',
    'digital-marketing-trainee-indo-european-institute-of-engineering-2',
    'seo-junior-specialist',
  ]);

  if (PLACEMENT_PAGE_SLUGS.has(slug)) {
    redirect(`/placement-cell/${slug}`);
  }

  const page = await getCachedPage(slug);
  if (!page) {
    const blog = await prisma.blog.findFirst({
      where: { slug, status: 'published' },
      select: { slug: true },
    });
    if (blog) redirect(`/blog/${blog.slug}`);
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
