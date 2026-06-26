import { NextResponse } from 'next/server';
import slugify from 'slugify';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';
import { revalidatePath, revalidateTag } from 'next/cache';

// GET a single blog by ID
export async function GET(request, { params }) {
  try {
    const user = requirePermission(request, 'blogs.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Fetch single blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a blog
export async function PUT(request, { params }) {
  try {
    const user = requirePermission(request, 'blogs.edit');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
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
    } = data;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const oldSlug = blog.slug;
    const oldStatus = blog.status;

    // Handle slug update
    let slug = oldSlug;
    if (userSlug && userSlug !== oldSlug) {
      slug = slugify(userSlug, { lower: true, strict: true });
      const slugCollision = await prisma.blog.findFirst({ where: { slug, id: { not: id } } });
      if (slugCollision) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    } else if (title !== blog.title && !userSlug) {
      slug = slugify(title, { lower: true, strict: true });
      const slugCollision = await prisma.blog.findFirst({ where: { slug, id: { not: id } } });
      if (slugCollision) slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Sanitize HTML content
    let sanitizedContent = [];
    if (Array.isArray(content)) {
      sanitizedContent = content.map((block) => {
        if (block.type === 'text') return { ...block, html: sanitizeHtml(block.html || '') };
        return block;
      });
    }

    // Status transitions — check blogs.publish for publish action
    const isNewPublish = status === 'published' && oldStatus !== 'published';
    let resolvedStatus = status || 'draft';

    if (isNewPublish) {
      const canPublish = requirePermission(request, 'blogs.publish');
      if (!canPublish) {
        // Silently downgrade — do not publish
        resolvedStatus = 'draft';
      }
    }

    let publishedAt = blog.publishedAt;
    if (resolvedStatus === 'published' && oldStatus !== 'published') {
      publishedAt = new Date();
    } else if (resolvedStatus === 'draft') {
      publishedAt = null;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
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

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      if (oldSlug !== slug) revalidatePath(`/blog/${oldSlug}`);
      revalidateTag('blogs');
    } catch (err) {
      console.error('Revalidation failed after update:', err);
    }

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a blog
export async function DELETE(request, { params }) {
  try {
    const user = requirePermission(request, 'blogs.delete');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const blog = await prisma.blog.findUnique({ where: { id } });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const { slug } = blog;

    await prisma.blog.delete({ where: { id } });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
      revalidateTag('blogs');
    } catch (err) {
      console.error('Revalidation failed after deletion:', err);
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH update a blog partially (specifically for auto-save)
export async function PATCH(request, { params }) {
  try {
    const user = requirePermission(request, 'blogs.edit');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existingBlog = await prisma.blog.findUnique({ where: { id } });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const data = await request.json();
    
    // Status Guard: If existing record is published, auto-save / PATCH must not revert it to draft
    let targetStatus = data.status;
    if (existingBlog.status === 'published' && targetStatus && targetStatus !== 'published') {
      console.warn(`[Auto-Save Guard] Server-side check: Blocked status change from published -> ${targetStatus} for blog ID ${id}`);
      targetStatus = undefined; // Do not update status
    }

    const updateData = {};
    const allowedFields = [
      'title',
      'slug',
      'seoTitle',
      'seoDescription',
      'featuredImage',
      'featuredImageAlt',
      'content',
      'excerpt',
      'allowIndexing',
      'focusKeyword',
      'category',
      'tags',
      'ogTitle',
      'ogDescription',
      'ogImage',
      'canonicalUrl',
      'articleType',
      'schemaFaqItems',
      'schemaHowToSteps'
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    if (targetStatus !== undefined) {
      updateData.status = targetStatus;
      // Handle publishedAt
      if (targetStatus === 'published' && existingBlog.status !== 'published') {
        updateData.publishedAt = new Date();
      } else if (targetStatus === 'draft') {
        updateData.publishedAt = null;
      }
    }

    // Sanitize HTML in text blocks if present
    if (updateData.content && Array.isArray(updateData.content)) {
      updateData.content = updateData.content.map((block) => {
        if (block.type === 'text') return { ...block, html: sanitizeHtml(block.html || '') };
        return block;
      });
    }

    // Tag list trimming/formatting if tags are present
    if (updateData.tags && Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.map((t) => t.toLowerCase().trim());
    }

    // Slug check if slug is modified
    let oldSlug = existingBlog.slug;
    if (updateData.slug && updateData.slug !== oldSlug) {
      updateData.slug = slugify(updateData.slug, { lower: true, strict: true });
      const slugCollision = await prisma.blog.findFirst({ where: { slug: updateData.slug, id: { not: id } } });
      if (slugCollision) {
        if (data.isAutoDraft) {
          return NextResponse.json(
            { error: 'Slug conflict', code: 'SLUG_CONFLICT' },
            { status: 409 }
          );
        }
        updateData.slug = `${updateData.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    // Skip revalidation if isAutoDraft is true
    if (!data.isAutoDraft) {
      try {
        revalidatePath('/blog');
        revalidatePath(`/blog/${updatedBlog.slug}`);
        if (oldSlug !== updatedBlog.slug) {
          revalidatePath(`/blog/${oldSlug}`);
        }
        revalidateTag('blogs');
      } catch (err) {
        console.error('Revalidation failed after partial update:', err);
      }
    }

    return NextResponse.json({
      blog: {
        id: updatedBlog.id,
        title: updatedBlog.title,
        slug: updatedBlog.slug,
        status: updatedBlog.status,
        updatedAt: updatedBlog.updatedAt,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('PATCH blog error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
