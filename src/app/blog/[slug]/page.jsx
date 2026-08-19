import Image from 'next/image';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InnerPageHero from '@/components/InnerPageHero';
import BlogContent from '@/components/BlogContent';
import TableOfContents from '@/components/TableOfContents';
import BlogTocSidebar from '@/components/BlogTocSidebar';
import SocialShare from '@/components/SocialShare';
import RelatedPostsCarousel from '@/components/RelatedPostsCarousel';
import prisma from '@/lib/db';
import { buildJsonLdList } from '@/lib/schemaBuilder';
import { extractHeadings } from '@/lib/tocUtils';
import { INNER_PAGE, INNER_HERO_BANNERS } from '@/lib/designLanguage';
import { Calendar, Clock } from 'lucide-react';

export const dynamicParams = true;
export const revalidate = 60;

async function getBlogBySlug(slug) {
  if (!slug) return null;
  try {
    return await prisma.blog.findFirst({
      where: { slug, status: 'published' },
    });
  } catch (error) {
    console.error(`Failed to fetch blog by slug ${slug}:`, error.message);
    return null;
  }
}

const calculateReadTime = (content) => {
  if (!content) return 3;
  try {
    const blocks = typeof content === 'string' ? JSON.parse(content) : content;
    let textContent = '';

    if (Array.isArray(blocks)) {
      blocks.forEach((block) => {
        if (block.type === 'text' && block.text) {
          textContent += `${block.text} `;
        } else if (block.content && Array.isArray(block.content)) {
          block.content.forEach((child) => {
            if (child.text) textContent += `${child.text} `;
          });
        }
      });
    }

    const wordCount = textContent.split(/\s+/).filter(Boolean).length || 100;
    return Math.max(1, Math.ceil(wordCount / 200));
  } catch {
    return 3;
  }
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
  const imageUrl = blog.featuredImage
    ? `${domain}${blog.featuredImage}`
    : blog.bannerImage
      ? `${domain}${blog.bannerImage}`
      : `${domain}/zeon-logo.png`;

  const ogTitle = blog.ogTitle || title;
  const ogDescription = blog.ogDescription || description;
  const ogImageUrl = blog.ogImage ? `${domain}${blog.ogImage}` : imageUrl;

  let universalNoIndex = false;
  try {
    const filePath = path.join(process.cwd(), 'src/data/settings.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const settings = JSON.parse(fileContent);
    universalNoIndex = Boolean(settings.universalNoIndex);
  } catch {
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
          alt: blog.featuredImageAlt || blog.bannerImageAlt || blog.title,
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

function AuthorAvatar({ name, image }) {
  if (image) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'Z';

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#CC2222] text-[12px] font-extrabold text-white shadow-sm ring-2 ring-white">
      {initials}
    </div>
  );
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

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
        bannerImage: true,
        bannerImageAlt: true,
        publishedAt: true,
        category: true,
        content: true,
      },
    });
  } catch (error) {
    console.error('Failed to fetch other published blogs:', error.message);
  }

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

  const jsonLdList = buildJsonLdList(blog);
  const tocHeadings = extractHeadings(Array.isArray(blog.content) ? blog.content : []);
  const readTime = calculateReadTime(blog.content);
  const hasToc = tocHeadings.length >= 3;

  const heroBanner =
    blog.bannerImage || blog.featuredImage || INNER_HERO_BANNERS.listing;

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ];
  if (blog.category) {
    breadcrumbs.push({ label: blog.category });
  }

  return (
    <>
      {jsonLdList.map((jsonLd, index) => (
        <script
          key={`blog-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      <Navbar />

      <main className="bg-white">
        <InnerPageHero
          banner={heroBanner}
          bannerAlt={blog.bannerImageAlt || blog.featuredImageAlt || blog.title}
          breadcrumbs={breadcrumbs}
          tagline={blog.category || 'Blog'}
          title={blog.title}
          subtitle={blog.excerpt || undefined}
        >
          <div className="mt-6 flex items-center justify-center gap-4 lg:justify-start">
            <AuthorAvatar name={authorName} image={authorImage} />
            <div className="text-left">
              <p className="mb-1.5 text-sm font-bold leading-none text-heading">{authorName}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-body">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary/70" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary/70" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </InnerPageHero>

        <section className={`${INNER_PAGE.section} bg-white`}>
          <div className={INNER_PAGE.container}>
            <div className="relative overflow-visible">
              <div className="absolute right-full top-0 mr-5 hidden lg:block xl:mr-10">
                <SocialShare title={blog.title} />
              </div>

              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  {hasToc && (
                    <div className={`mb-8 lg:hidden ${INNER_PAGE.contentPanel}`}>
                      <span className={INNER_PAGE.tagline}>Table of Contents</span>
                      <TableOfContents headings={tocHeadings} />
                    </div>
                  )}

                  <BlogContent content={blog.content} className="w-full max-w-none" />

                  <RelatedPostsCarousel
                    posts={otherBlogs}
                    authorName={authorName}
                    authorImage={authorImage}
                  />
                </div>

                <BlogTocSidebar headings={tocHeadings} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
