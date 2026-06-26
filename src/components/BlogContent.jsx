import Image from 'next/image';
import { sanitizeHtml } from '@/lib/sanitize';
import { addIdsToHtml } from '@/lib/tocUtils';

export default function BlogContent({ content }) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl font-inter">
      {content.map((block) => {
        if (block.type === 'text') {
          // Sanitize first, then inject heading anchor IDs for TOC scroll links
          const cleanHtml = addIdsToHtml(sanitizeHtml(block.html || ''));
          
          return (
            <div
              key={block.id}
              className="prose-custom text-base md:text-lg leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          );
        }

        if (block.type === 'image' && block.src) {
          return (
            <figure key={block.id} className="my-8 overflow-hidden rounded-2xl border border-slate-100 shadow-lg">
              <div className="relative aspect-video w-full">
                <Image
                  src={block.src}
                  alt={block.alt || 'WDK Blog content image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px"
                  className="object-cover transition-transform duration-500 hover:scale-102"
                  unoptimized
                />
              </div>
              {block.caption && (
                <figcaption className="bg-slate-50 border-t border-slate-100 py-3 px-4 text-center text-sm font-medium text-slate-500">
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
          color: #334155; /* slate-700 */
        }
        .prose-custom p:last-child {
          margin-bottom: 0;
        }
        .prose-custom h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a; /* slate-900 */
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.35;
          letter-spacing: -0.02em;
        }
        .prose-custom h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .prose-custom h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e293b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .prose-custom strong {
          font-weight: 700;
          color: #0f172a;
        }
        .prose-custom em {
          font-style: italic;
        }
        .prose-custom a {
          color: #1A4FD6;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        .prose-custom a:hover {
          color: #17C653;
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
          border-left: 4px solid #1A4FD6;
          padding-left: 1.5rem;
          font-style: italic;
          color: #475569; /* slate-600 */
          background-color: #f8fafc;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
        }
      ` }} />
    </div>
  );
}
