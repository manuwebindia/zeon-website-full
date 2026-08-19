import TableOfContents from '@/components/TableOfContents';
import { INNER_PAGE } from '@/lib/designLanguage';

export default function BlogTocSidebar({ headings = [] }) {
  const hasToc = headings.length >= 3;

  return (
    <aside className="hidden lg:col-span-4 lg:block">
      <div className="blog-toc-sticky sticky top-28 z-10 max-h-[calc(100vh-7rem)] self-start overflow-y-auto overscroll-contain rounded-2xl border border-border bg-white p-6 shadow-card">
        {hasToc ? (
          <>
            <span className={`${INNER_PAGE.tagline} mb-4 block`}>Table of Contents</span>
            <TableOfContents headings={headings} />
          </>
        ) : (
          <p className="text-center text-xs text-body">No subheadings found in this post. Scroll down to read.</p>
        )}
      </div>
    </aside>
  );
}
