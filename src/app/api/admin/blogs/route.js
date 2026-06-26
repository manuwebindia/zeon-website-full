import { NextResponse } from 'next/server';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET all blogs for admin list
export async function GET(request) {
  try {
    const user = requirePermission(request, 'blogs.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        allowIndexing: true,
        featuredImage: true,
        featuredImageAlt: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        focusKeyword: true
      }
    });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Fetch blogs admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create a new blog
export async function POST(request) {
  try {
    const user = requirePermission(request, 'blogs.create');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const {
      title,
      slug: userSlug,
      seoTitle,
      seoDescription,
      featuredImage,
      featuredImageAlt,
      content,
      excerpt,
      status,
      allowIndexing,
      focusKeyword,
      category,
      tags,
      ogTitle,
      ogDescription,
      ogImage,
      canonicalUrl,
      articleType,
      schemaFaqItems,
      schemaHowToSteps,
      isAutoDraft,
    } = data;

    // Validation for title
    if (!title || (isAutoDraft && title.trim().length < 3)) {
      return NextResponse.json(
        { error: 'Title required', code: 'TITLE_REQUIRED' },
        { status: 400 }
      );
    }
    if (!isAutoDraft && !title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check publish permission — if user lacks it, silently downgrade to draft
    const canPublish = requirePermission(request, 'blogs.publish');
    const resolvedStatus = status === 'published' && !canPublish ? 'draft' : (status || 'draft');

    let slug = userSlug
      ? slugify(userSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    if (!slug) slug = 'untitled-' + Date.now();

    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      if (isAutoDraft) {
        return NextResponse.json(
          { error: 'Slug conflict', code: 'SLUG_CONFLICT' },
          { status: 409 }
        );
      }
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let sanitizedContent = [];
    if (Array.isArray(content)) {
      sanitizedContent = content.map((block) => {
        if (block.type === 'text') return { ...block, html: sanitizeHtml(block.html || '') };
        return block;
      });
    }

    const isPublished = resolvedStatus === 'published';
    const publishedAt = isPublished ? new Date() : null;

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        featuredImage: featuredImage || null,
        featuredImageAlt: featuredImageAlt || null,
        content: sanitizedContent,
        excerpt: excerpt || null,
        status: resolvedStatus,
        allowIndexing: allowIndexing !== undefined ? allowIndexing : true,
        publishedAt,
        focusKeyword: focusKeyword || null,
        category: category || null,
        tags: Array.isArray(tags) ? tags.map((t) => t.toLowerCase().trim()) : null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        articleType: articleType || 'Article',
        schemaFaqItems: schemaFaqItems || null,
        schemaHowToSteps: schemaHowToSteps || null,
      }
    });

    if (isPublished && !isAutoDraft) {
      try {
        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        revalidateTag('blogs');
      } catch (err) {
        console.error('Revalidation failed after creation:', err);
      }
    }

    return NextResponse.json({
      blog: {
        id: newBlog.id,
        title: newBlog.title,
        slug: newBlog.slug,
        status: newBlog.status,
        createdAt: newBlog.createdAt,
        updatedAt: newBlog.updatedAt,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
