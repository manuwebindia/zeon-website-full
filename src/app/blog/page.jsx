import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InnerPageHero from '@/components/InnerPageHero';
import BlogPagination from '@/components/BlogPagination';
import BlogArchiveToolbar from '@/components/blog/BlogArchiveToolbar';
import { BlogArchiveCard } from '@/components/blog/BlogArchiveCard';
import {
  getBlogArchiveCategories,
  queryBlogArchive,
  parseArchiveParams,
} from '@/lib/blogArchive';
import { buildPageMetadata } from '@/lib/pageSeo';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';
import { BookOpen } from 'lucide-react';

const BookDemoModal = dynamic(() => import('@/components/BookDemoModal'));
const WhatsAppFloat = dynamic(() => import('@/components/WhatsAppFloat'));
import BottomCtaBanner from '@/components/BottomCtaBanner';

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const { page } = parseArchiveParams(params);
  const base = await buildPageMetadata('/blog');
  if (page <= 1) return base;
  return {
    ...base,
    title: `${base.title} — Page ${page}`,
  };
}

export default async function BlogListingPage({ searchParams }) {
  const params = await searchParams;
  const archiveParams = parseArchiveParams(params);
  const [archive, categories] = await Promise.all([
    queryBlogArchive(params),
    getBlogArchiveCategories(),
  ]);

  const { blogs, total, totalPages, currentPage, view } = archive;

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-white">
        <InnerPageHero
          banner={INNER_HERO_BANNERS.listing}
          bannerAlt="Zeon Academy Blog"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Blog' },
          ]}
          tagline="Insights & Guides"
          title={
            <>
              Blogs, Trends & <br /><span className="text-primary">Articles</span>
            </>
          }
          subtitle="Expert insights on digital marketing, SEO, Google Ads, and career growth from Kerala's #1 digital marketing academy."
        />

        <section className={`${INNER_PAGE.section} bg-surface`}>
          <div className={INNER_PAGE.container}>
            <BlogArchiveToolbar
              params={archiveParams}
              categories={categories}
              total={total}
            />

            {archive.dbError ? (
              <div className={`${INNER_PAGE.card} py-20 text-center`}>
                <BookOpen className="mx-auto mb-5 h-14 w-14 text-primary/40" />
                <h2 className="mb-2 text-xl font-bold text-heading">Connection issue</h2>
                <p className="mx-auto max-w-md text-sm font-medium text-body">
                  Unable to reach the database right now. Please try refreshing in a moment.
                </p>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover shadow-sm"
                >
                  Refresh Page
                </Link>
              </div>
            ) : total === 0 ? (
              <div className={`${INNER_PAGE.card} py-24 text-center`}>
                <BookOpen className="mx-auto mb-5 h-14 w-14 text-body/30" />
                <h2 className="mb-2 text-xl font-bold text-heading">No articles found</h2>
                <p className="mx-auto max-w-md text-sm font-medium text-body">
                  Try a different search term or clear your filters to browse all posts.
                </p>
                {(archiveParams.q || archiveParams.category) && (
                  <Link
                    href="/blog"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover shadow-sm"
                  >
                    Clear Filters & View All
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div
                  className={
                    view === 'list'
                      ? 'flex flex-col gap-5'
                      : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                  }
                >
                  {blogs.map((blog) => (
                    <BlogArchiveCard key={blog.id} blog={blog} view={view} />
                  ))}
                </div>

                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  archiveParams={archiveParams}
                />
              </>
            )}

            <BottomCtaBanner
              badge="ZEON BLOG & ACADEMY"
              headingMain="FIND YOUR PERFECT"
              headingSub="MARKETING CAREER"
              description="Learn practical skills with real campaigns, live client budgets, and placement support at Zeon Academy — Kerala's #1 digital marketing institute."
              primaryText="Book Free Demo"
              secondaryText="Explore Courses"
              secondaryHref="/course"
              className="py-6 md:py-8"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
