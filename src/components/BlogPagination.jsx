import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildBlogArchiveUrl } from '@/lib/blogArchive';

export default function BlogPagination({ currentPage, totalPages, archiveParams = {} }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  const hrefFor = (page) => buildBlogArchiveUrl(archiveParams, { page });

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#FF4444]/30 hover:text-[#FF4444]"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-300">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </span>
      )}

      {pages.map((page, index) =>
        page === '…' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-bold transition ${
              page === currentPage
                ? 'bg-[#FF4444] text-white shadow-md'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF4444]/30 hover:text-[#FF4444]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#FF4444]/30 hover:text-[#FF4444]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-300">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
