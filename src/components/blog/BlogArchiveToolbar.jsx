'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState, useTransition, useRef } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, X, ChevronDown } from 'lucide-react';
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
  const [prevQ, setPrevQ] = useState(params.q);
  if (params.q !== prevQ) {
    setPrevQ(params.q);
    setQuery(params.q || '');
  }
  const [filterOpen, setFilterOpen] = useState(showFilterPanel && Boolean(params.category));
  const inputRef = useRef(null);

  const navigate = useCallback(
    (overrides) => {
      const href = buildBlogArchiveUrl(params, { ...overrides, page: overrides.page ?? 1 });
      startTransition(() => router.push(href));
    },
    [params, router],
  );

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    navigate({ q: trimmed });
  };

  const handleClearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (params.q) {
      navigate({ q: '' });
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    // If the input was completely cleared and a search filter is currently active, reset search
    if (val === '' && params.q) {
      navigate({ q: '' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  const hasActiveFilters = Boolean(params.q || params.category);

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="text-center">
        <p className="mb-4 text-lg font-bold text-heading sm:text-xl">
          Search blogs by keywords, category, or tag
        </p>
        <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-5 h-5 w-5 text-body/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search articles..."
              className="w-full rounded-full border border-border bg-white py-3.5 pl-14 pr-28 text-base text-heading shadow-sm outline-none transition placeholder:text-body/50 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              {query ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="rounded-full p-2 text-body/50 hover:bg-surface hover:text-heading transition"
                  title="Clear search (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-xs font-semibold text-body">Active filters:</span>
          {params.q ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Search: &ldquo;{params.q}&rdquo;
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-full p-0.5 hover:bg-primary/20 transition"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          {params.category ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Category: {params.category}
              <button
                type="button"
                onClick={() => navigate({ category: '' })}
                className="rounded-full p-0.5 hover:bg-primary/20 transition"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setQuery('');
              navigate({ q: '', category: '' });
            }}
            className="text-xs font-semibold text-body/70 underline underline-offset-2 hover:text-primary transition ml-1"
          >
            Clear all
          </button>
        </div>
      )}

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
            <div className="relative inline-flex items-center">
              <select
                value={params.perPage}
                onChange={(e) => navigate({ perPage: parseInt(e.target.value, 10) })}
                className="appearance-none rounded-lg border border-border bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-heading outline-none focus:border-primary/40 cursor-pointer shadow-sm transition"
                disabled={isPending}
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} Results
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-heading/70" />
            </div>
          </label>

          <label className="flex items-center gap-2 text-sm text-body">
            <span className="hidden sm:inline">Sort</span>
            <div className="relative inline-flex items-center">
              <select
                value={params.sort}
                onChange={(e) => navigate({ sort: e.target.value })}
                className="appearance-none rounded-lg border border-border bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-heading outline-none focus:border-primary/40 cursor-pointer shadow-sm transition"
                disabled={isPending}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title A–Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-heading/70" />
            </div>
          </label>

          <div className="hidden sm:flex overflow-hidden rounded-lg border border-border bg-white">
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
