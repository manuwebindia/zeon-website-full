import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import fs from 'fs';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogContent from '@/components/BlogContent';
import TableOfContents from '@/components/TableOfContents';
import SocialShare from '@/components/SocialShare';
import RelatedPostsCarousel from '@/components/RelatedPostsCarousel';
import prisma from '@/lib/db';
import { buildJsonLd } from '@/lib/schemaBuilder';
import { extractHeadings } from '@/lib/tocUtils';
import { Calendar, Clock, ArrowLeft, ChevronRight, User } from 'lucide-react';

const getBlogBySlug = (slug) => {
  if (!slug) return Promise.resolve(null);
  return unstable_cache(
    async () => {
      try {
        return await prisma.blog.findUnique({
          where: { slug, status: 'published' },
        });
      } catch (error) {
        console.error(`Failed to fetch blog by slug ${slug} during build/render:`, error.message);
        return null;
      }
    },
    [`blog-by-slug-${slug}`],
    { tags: ['blogs', `blog-${slug}`] }
  )();
};

// Dynamic reading time calculator
const calculateReadTime = (content) => {
  if (!content) return 3;
  try {
    const blocks = typeof content === 'string' ? JSON.parse(content) : content;
    let textContent = '';

    if (Array.isArray(blocks)) {
      blocks.forEach(block => {
        if (block.type === 'text' && block.text) {
          textContent += block.text + ' ';
        } else if (block.content && Array.isArray(block.content)) {
          block.content.forEach(child => {
            if (child.text) textContent += child.text + ' ';
          });
        }
      });
    }

    const wordCount = textContent.split(/\s+/).filter(Boolean).length || 100;
    return Math.max(1, Math.ceil(wordCount / 200));
  } catch (e) {
    return 3;
  }
};

// Dynamic Category Pill Colors
const getCategoryColors = (category) => {
  const cat = (category || '').toLowerCase().trim();
  if (cat.includes('wordpress')) {
    return {
      bg: 'bg-blue-50/80 backdrop-blur-sm',
      text: 'text-blue-600',
      border: 'border-blue-100',
    };
  }
  if (cat.includes('seo') || cat.includes('marketing') || cat.includes('digital')) {
    return {
      bg: 'bg-emerald-50/80 backdrop-blur-sm',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    };
  }
  if (cat.includes('web design') || cat.includes('design')) {
    return {
      bg: 'bg-indigo-50/80 backdrop-blur-sm',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    };
  }
  return {
    bg: 'bg-slate-50/80 backdrop-blur-sm',
    text: 'text-slate-600',
    border: 'border-slate-100',
  };
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Post Not Found | Zeon Blog',
      robots: { index: false, follow: false },
    };
  }

  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || '';
  const domain = process.env.SITE_URL || 'https://admission.zeonacademy.com';
  const url = `${domain}/blog/${blog.slug}`;
  const canonical = blog.canonicalUrl || url;
  const imageUrl = blog.featuredImage ? `${domain}${blog.featuredImage}` : `${domain}/zeon-logo.png`;

  const ogTitle = blog.ogTitle || title;
  const ogDescription = blog.ogDescription || description;
  const ogImageUrl = blog.ogImage ? `${domain}${blog.ogImage}` : imageUrl;

  // Respect universalNoIndex global override setting
  let universalNoIndex = false;
  try {
    const filePath = path.join(process.cwd(), 'src/data/settings.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const settings = JSON.parse(fileContent);
    universalNoIndex = Boolean(settings.universalNoIndex);
  } catch (error) {
    // ignore
  }

  const finalIndexing = universalNoIndex ? false : blog.allowIndexing;

  return {
    title: `${title} | Zeon Academy`,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: 'Zeon Academy',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 675,
          alt: blog.featuredImageAlt || blog.title,
        },
      ],
      type: 'article',
      publishedTime: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: finalIndexing,
      follow: finalIndexing,
      nocache: !finalIndexing,
      googleBot: {
        index: finalIndexing,
        follow: finalIndexing,
      },
    },
  };
}

export async function generateStaticParams() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { slug: true },
    });
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error('Static params generation error:', error);
    return [];
  }
}

// Author initials fallback avatar
const AuthorAvatar = ({ name, image }) => {
  if (image) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-100 shadow-sm">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'W';

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4444] to-[#CC2222] text-[12px] font-extrabold text-white shadow-sm ring-2 ring-white">
      {initials}
    </div>
  );
};

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Fetch up to 6 other published blogs for the related carousel at the bottom
  let otherBlogs = [];
  try {
    otherBlogs = await prisma.blog.findMany({
      where: {
        status: 'published',
        id: { not: blog.id },
      },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        featuredImageAlt: true,
        publishedAt: true,
        category: true,
        content: true,
      },
    });
  } catch (error) {
    console.error('Failed to fetch other published blogs:', error.message);
  }

  // Load dynamic global settings server-side
  const authorName = 'Zeon Academy';
  const authorImage = '/favicon.webp';

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const jsonLd = buildJsonLd(blog);
  const tocHeadings = extractHeadings(Array.isArray(blog.content) ? blog.content : []);
  const readTime = calculateReadTime(blog.content);
  const hasToc = tocHeadings.length >= 3;

  return (
    <main className="relative flex min-h-screen flex-col bg-[#F9FBFC] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Main post body container */}
      <article className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-6xl">

        {/* Breadcrumb row & Back to blog */}
        <div className="mt-6 mb-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-[#FF4444] transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-[#FF4444] transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          {blog.category && (
            <>
              <span className="capitalize">{blog.category}</span>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-slate-600 line-clamp-1 max-w-[200px] sm:max-w-xs">{blog.title}</span>
        </div>

        {/* Back navigation pill */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#FF4444] transition-all hover:text-[#CC2222] group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>

        {/* 1. ARTICLE HEADER SECTION */}
        <header className="mb-12 max-w-4xl text-left">
          {/* Category indicator */}
          {blog.category && (
            <div className="mb-5">
              <span className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest border ${getCategoryColors(blog.category).bg} ${getCategoryColors(blog.category).text} ${getCategoryColors(blog.category).border}`}>
                {blog.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-4xl leading-[1.12] mb-6">
            {blog.title}
          </h1>

          {/* Dynamic Excerpt / Subtitle */}
          {/* {blog.excerpt && (
            <p className="text-lg md:text-xl text-slate-500 font-normal leading-relaxed font-inter mb-8">
              {blog.excerpt}
            </p>
          )} */}

          {/* Elegant Author Signature Card */}
          <div className="flex items-center gap-4 ">
            <AuthorAvatar name={authorName} image={authorImage} />
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none mb-1.5 flex items-center gap-1.5">
                {authorName}
              </p>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Big high resolution Featured Image */}
        {blog.featuredImage && (
          <div className="relative aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-100 shadow-lg mb-16 bg-slate-50">
            <Image
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* 2. THREE-COLUMN CONTENT GRID SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Column A: Left Sticky Social Share Bar (Span 1) */}
          <div className="lg:col-span-1 lg:h-full">
            <SocialShare title={blog.title} />
          </div>

          {/* Column B: Middle Content Reading Lane (Span 8) */}
          <div className={`lg:col-span-8 bg-white border border-slate-100 rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]`}>

            {/* Inline TOC on Mobile (Hidden on Desktop) */}
            {hasToc && (
              <div className="lg:hidden mb-8 bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A4FD6] mb-4 block">
                  Table of Contents
                </span>
                <TableOfContents headings={tocHeadings} />
              </div>
            )}

            {/* Core Rich Content blocks */}
            <BlogContent content={blog.content} />
          </div>

          {/* Column C: Right Sticky Table of Contents Sidebar (Span 3) (Hidden if not enough headings) */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-36 z-10">
            {hasToc ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A4FD6] mb-4 block">
                  Table of Contents
                </span>
                <TableOfContents headings={tocHeadings} />
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-100/70 border-dashed rounded-3xl p-6 text-center text-xs text-slate-400 font-inter">
                No subheadings found in this post guide. Scroll down to read.
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Related Blog Posts Carousel */}
        <RelatedPostsCarousel
          posts={otherBlogs}
          authorName={authorName}
          authorImage={authorImage}
        />

      </article>

      <Footer />
    </main>
  );
}
