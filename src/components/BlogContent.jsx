import Image from 'next/image';
import { sanitizeHtml } from '@/lib/sanitize';
import { addIdsToHtml } from '@/lib/tocUtils';

export default function BlogContent({ content, className = 'mx-auto max-w-3xl' }) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <div className={`font-sans ${className}`}>
      {content.map((block) => {
        if (block.type === 'text') {
          // Sanitize first, then inject heading anchor IDs for TOC scroll links
          const cleanHtml = addIdsToHtml(sanitizeHtml(block.html || ''));
          
          return (
            <div
              key={block.id}
              className="prose-custom text-[1.05rem] leading-relaxed text-body md:text-[1.1rem]"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          );
        }

        if (block.type === 'image' && block.src) {
          return (
            <figure key={block.id} className="my-8 overflow-hidden rounded-2xl border border-border shadow-card">
              <div className="relative aspect-video w-full">
                <Image
                  src={block.src}
                  alt={block.alt || 'Zeon Blog content image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px"
                  className="object-cover transition-transform duration-500 hover:scale-102"
                  unoptimized
                />
              </div>
              {block.caption && (
                <figcaption className="border-t border-border bg-surface px-4 py-3 text-center text-sm font-medium text-body">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
      
      {/* Dynamic styles injected manually to avoid tailwind typography heavy bundle */}
      <style dangerouslySetInnerHTML={{ __html: `
        .prose-custom p {
          margin-bottom: 1rem;
          color: var(--color-body);
        }
        .prose-custom p:last-child {
          margin-bottom: 0;
        }
        .prose-custom h2 {
          font-size: clamp(1.5rem, 2.5vw, 1.85rem);
          font-weight: 800;
          color: var(--color-heading);
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.35;
          letter-spacing: -0.02em;
          scroll-margin-top: 7rem;
        }
        .prose-custom h3 {
          font-size: clamp(1.25rem, 2vw, 1.45rem);
          font-weight: 700;
          color: var(--color-heading);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          scroll-margin-top: 7rem;
        }
        .prose-custom h4 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-heading);
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          scroll-margin-top: 7rem;
        }
        .prose-custom strong {
          font-weight: 700;
          color: var(--color-heading);
        }
        .prose-custom em {
          font-style: italic;
        }
        .prose-custom a {
          color: var(--color-primary);
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        .prose-custom a:hover {
          color: var(--color-primary-hover);
        }
        .prose-custom ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose-custom ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose-custom li {
          margin-bottom: 0.375rem;
        }
        .prose-custom blockquote {
          border-left: 4px solid var(--color-primary);
          padding-left: 1.5rem;
          font-style: italic;
          color: var(--color-body);
          background-color: var(--color-surface);
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
        }
      ` }} />
    </div>
  );
}
