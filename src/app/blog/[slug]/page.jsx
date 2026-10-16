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
import { getSiteUrl } from "@/lib/siteUrl";

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
  const domain = getSiteUrl();
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
      take: 10,
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
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[12px] font-extrabold text-white shadow-sm ring-2 ring-white">
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
    breadcrumbs.push({
      label: blog.category,
      href: `/blog?category=${encodeURIComponent(blog.category)}`,
    });
  }
  if (blog.title) {
    breadcrumbs.push({ label: blog.title });
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
        {/* Article Header (Banner with Breadcrumbs inside, Category, Title) */}
        <header className="border-b border-slate-100 bg-slate-50/50 pt-16 pb-0 md:pt-20 md:pb-4">
          <div className={INNER_PAGE.container}>
            <div className="mx-auto max-w-7xl text-center">
              {/* Hero Banner Image with Breadcrumbs inside */}
              {heroBanner && (
                <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden aspect-[8/3] md:aspect-auto mb-6 md:mb-8 mt-3 md:mt-3">
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
                  {breadcrumbs.length > 0 && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className={`${INNER_PAGE.container} h-full flex items-start justify-start pt-3 sm:pt-4 md:pt-5`}>
                        <nav className="pointer-events-auto inline-flex items-center gap-2 flex-wrap rounded-full bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[0.82rem] sm:text-[0.85rem] font-medium text-slate-700 shadow-md border border-slate-100">
                          {breadcrumbs.map((crumb, idx) => (
                            <span key={`${crumb.label}-${idx}`} className="contents">
                              {idx > 0 && <span className="text-slate-400">/</span>}
                              {crumb.href ? (
                                <Link
                                  href={crumb.href}
                                  className="text-slate-600 hover:text-primary transition-colors shrink-0"
                                >
                                  {crumb.label}
                                </Link>
                              ) : (
                                <span
                                  title={crumb.label}
                                  className="text-slate-900 font-semibold truncate max-w-[160px] sm:max-w-[280px] md:max-w-[420px] lg:max-w-[550px]"
                                >
                                  {crumb.label}
                                </span>
                              )}
                            </span>
                          ))}
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Category Tag & Title */}
              <div className="text-left">
                {blog.category && (
                  <span className="mb-3 inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {blog.category}
                  </span>
                )}

                {/* Title */}
                <h1 className={`${INNER_PAGE.title} text-left`}>
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className={`${INNER_PAGE.section} bg-white pt-8 md:pt-12`}>
          <div className={INNER_PAGE.container}>
            <div className="relative overflow-visible">
              <div className="absolute right-full inset-y-0 mr-5 hidden lg:block xl:mr-10 pointer-events-none">
                <SocialShare title={blog.title} />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  {/* Author & Meta */}
                  <div className="flex items-start justify-start gap-3.5 pb-6">
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
