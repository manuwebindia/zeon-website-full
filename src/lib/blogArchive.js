import prisma from '@/lib/db';

export const PER_PAGE_OPTIONS = [10, 20, 30];
export const DEFAULT_PER_PAGE = 10;

const blogSelect = {
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
  tags: true,
  content: true,
};

export const BLOG_AUTHOR = {
  name: 'Zeon Academy',
  image: '/favicon.webp',
};

export function formatPublishedDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Card/listing image: prefer inner banner, fall back to cover thumbnail. */
export function getBlogCardImage(blog) {
  if (blog.bannerImage) {
    return { src: blog.bannerImage, alt: blog.bannerImageAlt || blog.title };
  }
  if (blog.featuredImage) {
    return { src: blog.featuredImage, alt: blog.featuredImageAlt || blog.title };
  }
  return null;
}

export function parseArchiveParams(searchParams = {}) {
  const q = String(searchParams.q || '').trim();
  const category = String(searchParams.category || '').trim();
  const sort =
    searchParams.sort === 'oldest'
      ? 'oldest'
      : searchParams.sort === 'title'
        ? 'title'
        : 'latest';
  const view = searchParams.view === 'list' ? 'list' : 'grid';
  const perPageRaw = parseInt(searchParams.perPage || String(DEFAULT_PER_PAGE), 10);
  const perPage = PER_PAGE_OPTIONS.includes(perPageRaw) ? perPageRaw : DEFAULT_PER_PAGE;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);

  return { q, category, sort, view, perPage, page };
}

function buildOrderBy(sort) {
  if (sort === 'oldest') return { publishedAt: 'asc' };
  if (sort === 'title') return { title: 'asc' };
  return { publishedAt: 'desc' };
}

function buildWhere({ q, category }) {
  const where = { status: 'published' };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { category: { contains: q } },
      { focusKeyword: { contains: q } },
    ];
  }
  return where;
}

export function buildBlogArchiveUrl(params, overrides = {}) {
  const merged = { ...params, ...overrides };
  const sp = new URLSearchParams();

  if (merged.q) sp.set('q', merged.q);
  if (merged.category) sp.set('category', merged.category);
  if (merged.sort && merged.sort !== 'latest') sp.set('sort', merged.sort);
  if (merged.view && merged.view !== 'grid') sp.set('view', merged.view);
  if (merged.perPage && merged.perPage !== DEFAULT_PER_PAGE) {
    sp.set('perPage', String(merged.perPage));
  }
  if (merged.page && merged.page > 1) sp.set('page', String(merged.page));

  const qs = sp.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export async function getBlogArchiveCategories() {
  try {
    const rows = await prisma.blog.findMany({
      where: { status: 'published', category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category).filter(Boolean);
  } catch {
    return [];
  }
}

export async function queryBlogArchive(params) {
  const parsed = parseArchiveParams(params);
  const where = buildWhere(parsed);
  const orderBy = buildOrderBy(parsed.sort);
  const skip = (parsed.page - 1) * parsed.perPage;

  try {
    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        orderBy,
        skip,
        take: parsed.perPage,
        select: blogSelect,
      }),
    ]);

    return {
      ...parsed,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsed.perPage)),
      currentPage: Math.min(parsed.page, Math.max(1, Math.ceil(total / parsed.perPage) || 1)),
      blogs,
    };
  } catch (error) {
    console.error('Failed to query blog archive:', error.message);
    return {
      ...parsed,
      total: 0,
      totalPages: 1,
      currentPage: 1,
      blogs: [],
    };
  }
}

export function calculateReadTime(content) {
  if (!content) return 3;
  try {
    const blocks = typeof content === 'string' ? JSON.parse(content) : content;
    let textContent = '';
    if (Array.isArray(blocks)) {
      blocks.forEach((block) => {
        if (block.type === 'text' && block.html) {
          textContent += block.html.replace(/<[^>]+>/g, ' ') + ' ';
        } else if (block.type === 'text' && block.text) {
          textContent += block.text + ' ';
        }
      });
    }
    const wordCount = textContent.split(/\s+/).filter(Boolean).length || 100;
    return Math.max(1, Math.ceil(wordCount / 200));
  } catch {
    return 3;
  }
}

export function getCategoryColors(category) {
  const cat = (category || '').toLowerCase().trim();
  if (cat.includes('wordpress')) return 'text-blue-600';
  if (cat.includes('seo') || cat.includes('marketing') || cat.includes('digital')) {
    return 'text-emerald-600';
  }
  if (cat.includes('design') || cat.includes('branding')) return 'text-indigo-600';
  if (cat.includes('career') || cat.includes('kerala')) return 'text-amber-700';
  return 'text-slate-600';
}
