import Image from 'next/image';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/db';
import { ArrowRight, Clock, Calendar, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Digital Marketing Blog | Tips, Guides & Insights | Zeon Academy',
  description:
    'Explore expert insights on digital marketing, SEO, Google Ads, Meta Ads, and career growth strategies from Kerala\'s #1 digital marketing academy — Zeon.',
};

const getPublishedBlogs = unstable_cache(
  async () => {
    try {
      return await prisma.blog.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          featuredImageAlt: true,
          publishedAt: true,
          category: true,
          tags: true,
          content: true,
        },
      });
    } catch (error) {
      console.error('Failed to fetch published blogs during build/render:', error.message);
      return [];
    }
  },
  ['published-blogs'],
  { tags: ['blogs'] }
);

const calculateReadTime = (content) => {
  if (!content) return 3;
  try {
    const blocks = typeof content === 'string' ? JSON.parse(content) : content;
    let textContent = '';
    if (Array.isArray(blocks)) {
      blocks.forEach((block) => {
        if (block.type === 'text' && block.text) {
          textContent += block.text + ' ';
        } else if (block.content && Array.isArray(block.content)) {
          block.content.forEach((child) => {
            if (child.text) textContent += child.text + ' ';
          });
        }
      });
    } else if (blocks && typeof blocks === 'object') {
      textContent = JSON.stringify(blocks);
    }
    const wordCount = textContent.split(/\s+/).filter(Boolean).length || 100;
    return Math.max(1, Math.ceil(wordCount / 200));
  } catch (e) {
    return 3;
  }
};

const getCategoryColors = (category) => {
  const cat = (category || '').toLowerCase().trim();
  if (cat.includes('wordpress'))
    return { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100' };
  if (cat.includes('seo') || cat.includes('marketing') || cat.includes('digital'))
    return { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100' };
  if (cat.includes('web design') || cat.includes('design') || cat.includes('branding'))
    return { bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100' };
  if (cat.includes('business') || cat.includes('tips') || cat.includes('kerala'))
    return { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-100' };
  return { bg: 'bg-slate-50/80', text: 'text-slate-600', border: 'border-slate-100' };
};

const AuthorAvatar = ({ name, image }) => {
  if (image) {
    return (
      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-100 shadow-sm">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'W';
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4444] to-[#CC2222] text-[11px] font-extrabold text-white shadow-sm ring-2 ring-white">
      {initials}
    </div>
  );
};

export default async function BlogListingPage() {
  const blogs = await getPublishedBlogs();

  const authorName = 'Zeon Academy';
  const authorImage = '/favicon.webp';

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const featuredPost = blogs[0] || null;
  const restBlogs = blogs.slice(1);

  return (
    <main className="relative flex min-h-screen flex-col bg-[#F9FBFC] antialiased">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-12 px-6 lg:pt-48 lg:pb-16 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-50 to-transparent -z-10" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex">
            <span className="rounded-full border border-[#FF4444]/20 bg-[#FF4444]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#FF4444]">
              Blogs
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-tight">
            Insights &amp; Guides for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#FF4444] to-[#CC2222] bg-clip-text text-transparent">
              Digital Growth
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl font-normal">
            Explore advanced strategies, hands-on digital marketing guides, and career tips curated by Zeon Academy — Kerala&apos;s #1 practical digital marketing institute.
          </p>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {blogs.length === 0 ? (
          <div className="text-center py-32 border border-slate-100 rounded-[32px] bg-white shadow-sm mt-12">
            <BookOpen className="mx-auto h-16 w-16 text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Articles Published Yet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              We are crafting amazing digital guides, tutorials, and success stories. Check back soon!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post Hero */}
            {featuredPost && (
              <section className="mt-8 mb-12">
                <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-[32px] p-6 lg:p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(255,68,68,0.06)] transition-all duration-500">
                  {/* Image */}
                  <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-50">
                    {featuredPost.featuredImage ? (
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.featuredImageAlt || featuredPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 700px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        priority
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                        <BookOpen className="h-16 w-16" strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="lg:col-span-5 flex flex-col justify-center lg:pl-4">
                    {featuredPost.category && (
                      <div className="mb-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getCategoryColors(featuredPost.category).bg} ${getCategoryColors(featuredPost.category).text} ${getCategoryColors(featuredPost.category).border}`}>
                          {featuredPost.category}
                        </span>
                      </div>
                    )}
                    <h2 className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.15] group-hover:text-[#FF4444] transition-colors duration-300">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="mb-6 text-slate-600 text-base sm:text-lg leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                      <AuthorAvatar name={authorName} image={authorImage} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{authorName}</p>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(featuredPost.publishedAt)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {calculateReadTime(featuredPost.content)} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Blog Grid */}
            {restBlogs.length > 0 && (
            <section className="mt-4 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restBlogs.map((blog) => {
                  const colors = getCategoryColors(blog.category);
                  return (
                    <article
                      key={blog.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.06)] hover:border-slate-200/50"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="block relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-50/50"
                      >
                        {blog.featuredImage ? (
                          <Image
                            src={blog.featuredImage}
                            alt={blog.featuredImageAlt || blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
                            <BookOpen className="h-10 w-10" strokeWidth={1} />
                          </div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-6 lg:p-8">
                        {/* Category */}
                        {blog.category && (
                          <div className="mb-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              {blog.category}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="mb-3 text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug group-hover:text-[#FF4444] transition-colors duration-300">
                          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                          {blog.excerpt}
                        </p>

                        {/* Author Footer */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                          <AuthorAvatar name={authorName} image={authorImage} />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 leading-none mb-1">
                              {authorName}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(blog.publishedAt)}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {calculateReadTime(blog.content)} min read
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            )}

            {/* CTA */}
            <section className="my-16">
              <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#1A4FD6] via-[#10309c] to-[#0a1a54] p-8 md:p-16 text-center shadow-2xl border border-white/5">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#17C653]/20 to-transparent blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#FF4444] border border-white/10 mb-6">
                    Ready to grow?
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                    Level Up Your Digital Marketing Career
                  </h2>
                  <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                    Partner with Zeon Academy. From expert-led SEO training to high-converting
                    digital marketing strategies, we build the skills that turn students into professionals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#FF4444] hover:bg-[#CC2222] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Enroll Now
                      <ArrowRight className="h-4 w-4 text-white transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 px-8 py-4 text-sm font-bold text-white border border-white/10 transition-all duration-300"
                    >
                      Explore Our Courses
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

      </div>

      <Footer />
    </main>
  );
}
