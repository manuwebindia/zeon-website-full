// src/lib/schemaBuilder.js
// Generates JSON-LD structured data objects for blog posts

import { normalizeSchemaBlocks } from './schemaBlocks';

const DOMAIN = process.env.SITE_URL || 'https://admission.zeonacademy.com';
const LOGO_URL = `${DOMAIN}/zeon-logo.png`;
const ORG_NAME = 'Zeon Academy';

function toISO(date) {
  if (!date) return undefined;
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

const PUBLISHER = {
  '@type': 'Organization',
  name: ORG_NAME,
  url: DOMAIN,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
};

export function buildArticleSchema(blog) {
  const articleUrl = `${DOMAIN}/blog/${blog.slug}`;
  const imageUrl = blog.featuredImage
    ? `${DOMAIN}${blog.featuredImage}`
    : LOGO_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blog.canonicalUrl || articleUrl,
    },
    headline: blog.title,
    description: blog.seoDescription || blog.excerpt || '',
    image: imageUrl,
    datePublished: toISO(blog.publishedAt),
    dateModified: toISO(blog.updatedAt),
    author: PUBLISHER,
    publisher: PUBLISHER,
  };
}

export function buildFaqSchema(blog, { fallbackToArticle = true } = {}) {
  const faqItems = Array.isArray(blog.schemaFaqItems) ? blog.schemaFaqItems : [];
  const validItems = faqItems.filter(
    (item) => item.question?.trim() && item.answer?.trim()
  );

  if (validItems.length === 0) {
    return fallbackToArticle ? buildArticleSchema(blog) : null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validItems.map((item) => ({
      '@type': 'Question',
      name: item.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.trim(),
      },
    })),
  };
}

export function buildHowToSchema(blog, { fallbackToArticle = true } = {}) {
  const steps = Array.isArray(blog.schemaHowToSteps) ? blog.schemaHowToSteps : [];
  const validSteps = steps.filter(
    (step) => step.name?.trim() && step.text?.trim()
  );

  if (validSteps.length === 0) {
    return fallbackToArticle ? buildArticleSchema(blog) : null;
  }

  const imageUrl = blog.featuredImage
    ? `${DOMAIN}${blog.featuredImage}`
    : LOGO_URL;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: blog.title,
    description: blog.seoDescription || blog.excerpt || '',
    image: imageUrl,
    step: validSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name.trim(),
      text: step.text.trim(),
    })),
  };
}

function buildSchemaForBlock(blog, block) {
  const blogWithBlock = {
    ...blog,
    articleType: block.type,
    schemaFaqItems: block.faqItems,
    schemaHowToSteps: block.howToSteps,
  };

  switch (block.type) {
    case 'FAQPage':
      return buildFaqSchema(blogWithBlock, { fallbackToArticle: false });
    case 'HowTo':
      return buildHowToSchema(blogWithBlock, { fallbackToArticle: false });
    case 'Article':
    default:
      return buildArticleSchema(blogWithBlock);
  }
}

export function buildJsonLdList(blog) {
  const blocks = normalizeSchemaBlocks(blog);
  const schemas = blocks
    .map((block) => buildSchemaForBlock(blog, block))
    .filter(Boolean);

  return schemas.length > 0 ? schemas : [buildArticleSchema(blog)];
}

export function buildJsonLd(blog) {
  return buildJsonLdList(blog)[0];
}
