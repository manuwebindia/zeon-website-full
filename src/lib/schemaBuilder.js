// src/lib/schemaBuilder.js
// Generates JSON-LD structured data objects for blog posts
// Conditionally outputs Article, FAQPage, or HowTo schema based on articleType

const DOMAIN = process.env.SITE_URL || 'https://admission.zeonacademy.com';
const LOGO_URL = `${DOMAIN}/zeon-logo.png`;
const ORG_NAME = 'Zeon Academy';

/**
 * Safely converts a date value (string or Date) to ISO string.
 * Returns undefined if null/invalid.
 */
function toISO(date) {
  if (!date) return undefined;
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Shared publisher/author block used across all schema types.
 */
const PUBLISHER = {
  '@type': 'Organization',
  name: ORG_NAME,
  url: DOMAIN,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
};

/**
 * Standard BlogPosting / Article schema.
 * Used when articleType is 'Article' (default).
 */
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

/**
 * FAQPage schema.
 * Used when articleType is 'FAQPage'.
 * schemaFaqItems: [{ question: string, answer: string }]
 */
export function buildFaqSchema(blog) {
  const faqItems = Array.isArray(blog.schemaFaqItems) ? blog.schemaFaqItems : [];

  // Filter out incomplete items
  const validItems = faqItems.filter(
    (item) => item.question?.trim() && item.answer?.trim()
  );

  if (validItems.length === 0) {
    // Fallback to article schema if no valid FAQ items
    return buildArticleSchema(blog);
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

/**
 * HowTo schema.
 * Used when articleType is 'HowTo'.
 * schemaHowToSteps: [{ name: string, text: string }]
 */
export function buildHowToSchema(blog) {
  const steps = Array.isArray(blog.schemaHowToSteps) ? blog.schemaHowToSteps : [];

  // Filter incomplete steps
  const validSteps = steps.filter(
    (step) => step.name?.trim() && step.text?.trim()
  );

  if (validSteps.length === 0) {
    // Fallback to article schema if no valid steps
    return buildArticleSchema(blog);
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

/**
 * Main entry point — selects the correct schema builder based on articleType.
 */
export function buildJsonLd(blog) {
  switch (blog.articleType) {
    case 'FAQPage':
      return buildFaqSchema(blog);
    case 'HowTo':
      return buildHowToSchema(blog);
    case 'Article':
    default:
      return buildArticleSchema(blog);
  }
}
