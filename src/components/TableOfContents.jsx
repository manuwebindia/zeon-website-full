// Server component — no 'use client' needed
// Smooth scroll handled by CSS scroll-behavior

export default function TableOfContents({ headings = [] }) {
  if (headings.length < 3) return null; // Only show if 3+ headings

  return (
    <nav
      aria-label="Table of contents"
      className="toc-box"
    >
      {/* Heading list */}
      <ol className="space-y-2">
        {headings.map((h, index) => {
          const indent =
            h.level === 2 ? '' : h.level === 3 ? 'ml-4' : 'ml-8';

          const textStyle =
            h.level === 2
              ? 'font-semibold text-slate-800 text-sm'
              : h.level === 3
              ? 'font-medium text-slate-600 text-sm'
              : 'font-normal text-slate-500 text-xs';

          const bullet =
            h.level === 2 ? '→' : h.level === 3 ? '·' : '–';

          return (
            <li key={index} className={`${indent} flex items-start gap-2`}>
              <span
                className="mt-0.5 shrink-0 text-[#1A4FD6] font-bold"
                style={{ fontSize: h.level === 2 ? '0.75rem' : '0.65rem' }}
              >
                {bullet}
              </span>
              <a
                href={`#${h.id}`}
                className={`toc-link ${textStyle} transition-colors duration-150 hover:text-[#1A4FD6]`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>

      <style dangerouslySetInnerHTML={{
        __html: `
          html { scroll-behavior: smooth; }
          .toc-link { text-decoration: none; }
          .toc-link:hover { text-decoration: underline; }
        `
      }} />
    </nav>
  );
}
