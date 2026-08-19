'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { buildBlogArchiveUrl, PER_PAGE_OPTIONS } from '@/lib/blogArchive';

export default function BlogArchiveToolbar({
  params,
  categories,
  total,
  showFilterPanel = false,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.q || '');
  const [filterOpen, setFilterOpen] = useState(showFilterPanel && Boolean(params.category));

  const navigate = useCallback(
    (overrides) => {
      const href = buildBlogArchiveUrl(params, { ...overrides, page: overrides.page ?? 1 });
      startTransition(() => router.push(href));
    },
    [params, router],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    navigate({ q: query.trim() });
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Search */}
      <div className="text-center">
        <p className="mb-4 text-lg font-bold text-heading sm:text-xl">
          Search blogs by keywords, category, or tag
        </p>
        <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-body/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border border-border bg-white py-4 pl-14 pr-6 text-base text-heading shadow-sm outline-none transition placeholder:text-body/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </form>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-y border-border py-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className={`inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            filterOpen || params.category
              ? 'border-primary/30 bg-primary-light text-primary'
              : 'border-border bg-white text-body hover:border-primary/20'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {params.category ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
              1
            </span>
          ) : null}
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-body">
            <span className="hidden sm:inline">Results per page</span>
            <select
              value={params.perPage}
              onChange={(e) => navigate({ perPage: parseInt(e.target.value, 10) })}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-heading outline-none focus:border-primary/40"
              disabled={isPending}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} Results
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-body">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={params.sort}
              onChange={(e) => navigate({ sort: e.target.value })}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-heading outline-none focus:border-primary/40"
              disabled={isPending}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>

          <div className="flex overflow-hidden rounded-lg border border-border bg-white">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => navigate({ view: 'grid' })}
              className={`p-2.5 transition ${
                params.view === 'grid'
                  ? 'bg-heading text-white'
                  : 'text-body hover:bg-surface'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => navigate({ view: 'list' })}
              className={`border-l border-border p-2.5 transition ${
                params.view === 'list'
                  ? 'bg-heading text-white'
                  : 'text-body hover:bg-surface'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-heading">Category</p>
            {params.category ? (
              <button
                type="button"
                onClick={() => navigate({ category: '' })}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.length ? (
              categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    navigate({ category: params.category === cat ? '' : cat })
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    params.category === cat
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-surface text-body hover:border-primary/30'
                  }`}
                >
                  {cat}
                </button>
              ))
            ) : (
              <p className="text-sm text-body">No categories yet.</p>
            )}
          </div>
        </div>
      )}

      <p className="text-sm text-body">
        {isPending ? 'Updating…' : `${total} article${total === 1 ? '' : 's'} found`}
        {params.q ? (
          <>
            {' '}
            for &ldquo;<span className="font-medium text-heading">{params.q}</span>&rdquo;
          </>
        ) : null}
      </p>
    </div>
  );
}
