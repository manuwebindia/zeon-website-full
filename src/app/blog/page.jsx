import Link from 'next/link';
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
import { ArrowRight, BookOpen } from 'lucide-react';

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

      <main className="bg-white">
        <InnerPageHero
          banner={INNER_HERO_BANNERS.listing}
          bannerAlt="Zeon Academy Blog"
          align="center"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Blog' },
          ]}
          tagline="Insights & Guides"
          title="Blog"
          subtitle="Expert insights on digital marketing, SEO, Google Ads, and career growth from Kerala's #1 digital marketing academy."
        />

        <section className={`${INNER_PAGE.section} bg-surface`}>
          <div className={INNER_PAGE.container}>
            <BlogArchiveToolbar
              params={archiveParams}
              categories={categories}
              total={total}
            />

            {total === 0 ? (
              <div className={`${INNER_PAGE.card} py-24 text-center`}>
                <BookOpen className="mx-auto mb-5 h-14 w-14 text-body/30" />
                <h2 className="mb-2 text-xl font-bold text-heading">No articles found</h2>
                <p className="mx-auto max-w-md text-sm font-medium text-body">
                  Try a different search term or clear your filters to browse all posts.
                </p>
                {(archiveParams.q || archiveParams.category) && (
                  <Link
                    href="/blog"
                    className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
                  >
                    View all blogs
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

            <section className="mt-16">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A4FD6] via-[#10309c] to-[#0a1a54] p-8 text-center shadow-xl md:p-14">
                <div className="relative z-10 mx-auto max-w-2xl">
                  <h2 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl">
                    Level Up Your Digital Marketing Career
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-slate-200 sm:text-base">
                    Practical training, real internships, and placement support at Zeon Academy — Kerala&apos;s #1 digital marketing institute.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                    >
                      Enroll Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                    >
                      Explore Courses
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
