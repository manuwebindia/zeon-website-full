import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogContent from "@/components/BlogContent";
import TableOfContents from "@/components/TableOfContents";
import BlogTocSidebar from "@/components/BlogTocSidebar";
import SocialShare from "@/components/SocialShare";
import RelatedPostsCarousel from "@/components/RelatedPostsCarousel";
import prisma from "@/lib/db";
import { buildJsonLdList } from "@/lib/schemaBuilder";
import { extractHeadings } from "@/lib/tocUtils";
import { INNER_PAGE, INNER_HERO_BANNERS } from "@/lib/designLanguage";
import { Calendar, Clock } from "lucide-react";

export const dynamicParams = true;
export const revalidate = 60;

async function getBlogBySlug(slug) {
  if (!slug) return null;
  try {
    return await prisma.blog.findFirst({
      where: { slug, status: "published" },
    });
  } catch (error) {
    console.error(`Failed to fetch blog by slug ${slug}:`, error.message);
    return null;
  }
}

const calculateReadTime = (content) => {
  if (!content) return 3;
  try {
    const blocks = typeof content === "string" ? JSON.parse(content) : content;
    let textContent = "";

    if (Array.isArray(blocks)) {
      blocks.forEach((block) => {
        if (block.type === "text" && block.text) {
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
      title: "Post Not Found | Zeon Blog",
      robots: { index: false, follow: false },
    };
  }

  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || "";
  const domain = process.env.SITE_URL || "https://admission.zeonacademy.com";
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
    const filePath = path.join(process.cwd(), "src/data/settings.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
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
      siteName: "Zeon Academy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 675,
          alt: blog.featuredImageAlt || blog.bannerImageAlt || blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      modifiedTime: blog.updatedAt
        ? new Date(blog.updatedAt).toISOString()
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
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
      where: { status: "published" },
      select: { slug: true },
    });
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch (error) {
    console.error("Static params generation error:", error);
    return [];
  }
}

function AuthorAvatar({ name, image }) {
  if (image) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm">
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
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "Z";

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
        status: "published",
        id: { not: blog.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
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
    console.error("Failed to fetch other published blogs:", error.message);
  }

  const authorName = "Zeon Academy";
  const authorImage = "/favicon.webp";

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const jsonLdList = buildJsonLdList(blog);
  const tocHeadings = extractHeadings(
    Array.isArray(blog.content) ? blog.content : [],
  );
  const readTime = calculateReadTime(blog.content);
  const hasToc = tocHeadings.length >= 3;

  const heroBanner =
    blog.bannerImage || blog.featuredImage || INNER_HERO_BANNERS.listing;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
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
        {/* Article Header (Breadcrumbs, Category, Title, Excerpt, Author Meta) */}
        <header className="border-b border-slate-100 bg-slate-50/50 pt-28 pb-8 md:pt-32 md:pb-10">
          <div className={INNER_PAGE.container}>
            <div className="mx-auto max-w-7xl text-center">
              {/* Breadcrumbs */}
              {breadcrumbs.length > 0 && (
                <nav className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500 md:text-sm">
                  {breadcrumbs.map((crumb, idx) => (
                    <span key={`${crumb.label}-${idx}`} className="contents">
                      {idx > 0 && <span className="text-slate-300">/</span>}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="transition-colors hover:text-primary"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-slate-700">{crumb.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}

              {/* Hero Banner Image (Clean standalone, NO text/content on the image) */}
              {heroBanner && (
                <div className={`${INNER_PAGE.container} my-8 md:my-10`}>
                  <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden aspect-[8/3] md:aspect-auto">
                    <Image
                      src={heroBanner}
                      alt={
                        blog.bannerImageAlt ||
                        blog.featuredImageAlt ||
                        blog.title
                      }
                      width={1200}
                      height={290}
                      priority
                      sizes="100vw"
                      className="w-full h-full object-cover object-right md:h-auto md:object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* Category Tag */}
              {blog.category && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {blog.category}
                </span>
              )}

              {/* Title */}
              <h1 className="sm:mb-0 mb-2 md:mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.2]">
                {blog.title}
              </h1>

              {/* Excerpt / Subtitle */}
              {/* {blog.excerpt && (
                <p className="mx-auto mb-6 max-w-3xl text-base font-normal leading-relaxed text-slate-600 md:text-lg">
                  {blog.excerpt}
                </p>
              )} */}

              {/* Author & Meta */}
              {/* <div className="flex items-center justify-center gap-3.5 pt-2">
                <AuthorAvatar name={authorName} image={authorImage} />
                <div className="text-left">
                  <p className="text-sm font-bold leading-tight text-slate-900">
                    {authorName}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {formatDate(blog.publishedAt)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {readTime} min read
                    </span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </header>

        {/* Hero Banner Image (Clean standalone, NO text/content on the image) */}
        {/* {heroBanner && (
          <div className={`${INNER_PAGE.container} mt-8 md:mt-10`}>
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm md:rounded-3xl">
              <Image
                src={heroBanner}
                alt={blog.bannerImageAlt || blog.featuredImageAlt || blog.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )} */}

        {/* Content Section */}
        <section className={`${INNER_PAGE.section} bg-white pt-8 md:pt-12`}>
          <div className={INNER_PAGE.container}>
            <div className="relative overflow-visible">
              <div className="absolute right-full top-0 mr-5 hidden lg:block xl:mr-10">
                <SocialShare title={blog.title} />
              </div>

              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  {hasToc && (
                    <div
                      className={`mb-8 lg:hidden ${INNER_PAGE.contentPanel}`}
                    >
                      <span className={INNER_PAGE.tagline}>
                        Table of Contents
                      </span>
                      <TableOfContents headings={tocHeadings} />
                    </div>
                  )}
                  {/* Author & Meta */}
                  <div className="flex items-start justify-left gap-3.5 pb-6">
                    <AuthorAvatar name={authorName} image={authorImage} />
                    <div className="text-left">
                      <p className="text-sm font-bold leading-tight text-slate-900">
                        {authorName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(blog.publishedAt)}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                  <BlogContent
                    content={blog.content}
                    className="w-full max-w-none"
                  />
                </div>

                <BlogTocSidebar headings={tocHeadings} />
              </div>

              {otherBlogs.length > 0 && (
                <RelatedPostsCarousel
                  posts={otherBlogs}
                  authorName={authorName}
                  authorImage={authorImage}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
