import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import {
  BLOG_AUTHOR,
  calculateReadTime,
  formatPublishedDate,
  getBlogCardImage,
  getCategoryColors,
} from '@/lib/blogArchive';

function AuthorAvatar({ name, image }) {
  if (image) {
    return (
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'Z';
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-[10px] font-extrabold text-white">
      {initials}
    </div>
  );
}

function TagRow({ blog }) {
  const tags = Array.isArray(blog.tags) ? blog.tags.slice(0, 2) : [];
  const items = [blog.category, ...tags].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1">
      {items.map((item) => (
        <span
          key={`${blog.id}-${item}`}
          className={`text-xs font-semibold ${getCategoryColors(item)}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function CardMeta({ blog }) {
  const readTime = calculateReadTime(blog.content);
  const published = formatPublishedDate(blog.publishedAt);

  return (
    <div className="mt-4 flex items-center gap-3 border-t border-border/70 pt-4">
      <AuthorAvatar name={BLOG_AUTHOR.name} image={BLOG_AUTHOR.image} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-heading">{BLOG_AUTHOR.name}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-body/70">
          {published && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {published}
            </span>
          )}
          <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            {readTime} min read
          </span>
        </div>
      </div>
    </div>
  );
}

function CardImage({ blog, sizes, className = '' }) {
  const image = getBlogCardImage(blog);

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`relative block overflow-hidden bg-surface ${className}`}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          unoptimized
        />
      ) : (
        <div className="flex h-full min-h-[160px] items-center justify-center text-body/30">
          <BookOpen className="h-10 w-10" strokeWidth={1} />
        </div>
      )}
    </Link>
  );
}

export function BlogArchiveCard({ blog, view = 'grid' }) {
  if (view === 'list') {
    return (
      <article className="group flex flex-col sm:flex-row items-center gap-5 sm:gap-6 overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-5 transition hover:shadow-md">
        <CardImage
          blog={blog}
          sizes="(max-width: 640px) 100vw, 380px"
          className="aspect-[2/1] w-full sm:w-72 md:w-80 lg:w-[380px] shrink-0 rounded-xl"
        />
        <div className="flex flex-1 flex-col justify-between self-stretch py-1">
          <div>
            <TagRow blog={blog} />
            <h2 className="mb-2 text-lg font-bold leading-snug text-heading group-hover:text-primary">
              <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
            </h2>
            <p className="line-clamp-2 text-sm leading-relaxed text-body mb-3">
              {blog.excerpt}
            </p>
          </div>
          <CardMeta blog={blog} />
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <CardImage
        blog={blog}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="aspect-[2/1] w-full"
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <TagRow blog={blog} />
        <h2 className="mb-2 text-base font-bold leading-snug text-heading group-hover:text-primary sm:text-lg">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-body">
          {blog.excerpt}
        </p>
        <CardMeta blog={blog} />
      </div>
    </article>
  );
}
