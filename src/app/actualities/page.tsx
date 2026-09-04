'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import ArticleFeed from '@/components/ArticleFeed';
import CategoryNav from '@/components/CategoryNav';
import { Actuality } from '@/models/actuality';
import { useRouter } from 'next/navigation';

export default function ActualitiesPage() {
  const router = useRouter();

  const [q, setQ] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [items, setItems] = useState<Actuality[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Fetch when filters change
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (type) params.set('type', type);
        if (severity) params.set('severity', severity);
        const query = params.toString();
        const res = await fetch(`/api/v1/actualities${query ? `?${query}` : ''}`);
        const json = await res.json();
        if (!mounted) return;
        setItems(json.data || []);
        setPage(1);
        // Update URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          if (q) url.searchParams.set('q', q);
          else url.searchParams.delete('q');
          if (type) url.searchParams.set('type', type);
          else url.searchParams.delete('type');
          if (severity) url.searchParams.set('severity', severity);
          else url.searchParams.delete('severity');
          router.replace(url.pathname + url.search);
        }
      } catch (err) {
        console.error('Failed to fetch actualities', err);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [q, type, severity, router]);

  const visible = useMemo(() => items.slice(0, page * pageSize), [items, page]);

  function clearFilter(name?: string) {
    if (!name) {
      setQ('');
      setType('');
      setSeverity('');
    } else {
      if (name === 'q') setQ('');
      if (name === 'type') setType('');
      if (name === 'severity') setSeverity('');
    }
  }

  // Infinite scroll
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && items.length > visible.length) {
            setPage((p) => p + 1);
          }
        });
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, items.length, visible.length]);

  const categoryOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'TECHNICAL_THREAT', 'AWARENESS'];
  let selectedCategory = 'ALL';
  if (severity) selectedCategory = severity;
  if (type === 'TECHNICAL_THREAT') selectedCategory = 'TECHNICAL_THREAT';
  if (type === 'AWARENESS') selectedCategory = 'AWARENESS';

  const handleCategorySelect = (cat: string) => {
    if (cat === 'ALL') {
      setType('');
      setSeverity('');
    } else if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(cat)) {
      setSeverity(cat);
      setType('');
    } else if (['TECHNICAL_THREAT', 'AWARENESS'].includes(cat)) {
      setType(cat);
      setSeverity('');
    }
  };

  return (
    <Layout currentPage="/actualities">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-display text-foreground mb-2">Actualités Cybersécurité</h1>
        <p className="text-lg text-text-secondary">Cyber Threat Intelligence & Security Awareness</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
          <input
            aria-label="Search actualities"
            className="flex-1 px-4 py-3 rounded-lg bg-cti-800 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
            placeholder="Search intelligence by title, content, or keywords..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {(q || type || severity) && (
            <button
              onClick={() => clearFilter()}
              className="px-4 py-3 rounded-lg bg-cti-800 border border-cti-600 text-text-secondary hover:text-foreground transition-base font-medium"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Category Navigation */}
      <div className="mb-6">
        <CategoryNav
          categories={categoryOptions}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Additional Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {type === 'TECHNICAL_THREAT' && (
          <span className="inline-flex items-center gap-2 bg-cti-800 border border-cti-600 rounded-lg px-3 py-1 text-sm text-text-secondary">
            Type: Technical Threat
            <button
              onClick={() => setType('')}
              className="text-text-tertiary hover:text-foreground"
            >
              ✕
            </button>
          </span>
        )}
        {type === 'AWARENESS' && (
          <span className="inline-flex items-center gap-2 bg-cti-800 border border-cti-600 rounded-lg px-3 py-1 text-sm text-text-secondary">
            Type: Awareness
            <button
              onClick={() => setType('')}
              className="text-text-tertiary hover:text-foreground"
            >
              ✕
            </button>
          </span>
        )}
        {q && (
          <span className="inline-flex items-center gap-2 bg-cti-800 border border-cti-600 rounded-lg px-3 py-1 text-sm text-text-secondary">
            Search: {q}
            <button
              onClick={() => setQ('')}
              className="text-text-tertiary hover:text-foreground"
            >
              ✕
            </button>
          </span>
        )}
        {items.length > 0 && (
          <span className="inline-flex items-center px-3 py-1 text-sm text-text-tertiary">
            {items.length} result{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          <ArticleFeed
            articles={visible}
            loading={loading}
            emptyMessage={items.length === 0 && !loading ? 'No intelligence found. Try adjusting your filters.' : ''}
          />
          <div ref={sentinelRef}></div>
          {loading && items.length > 0 && (
            <div className="mt-8 text-center text-text-secondary">
              <div className="inline-block">
                <div className="w-6 h-6 border-2 border-text-tertiary border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-2">Loading more intelligence...</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Trending */}
        {items.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Trending Section */}
              <div className="bg-cti-800 border border-cti-600 rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-4">🔥 Trending Intelligence</h3>
                <div className="space-y-3">
                  {items
                    .slice(0, 5)
                    .map((article, idx) => (
                      <a
                        key={article.id}
                        href={`/actualities/${article.id}`}
                        className="block group"
                      >
                        <div className="flex gap-2">
                          <div className="text-xs font-bold text-text-tertiary mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-text-tertiary mt-1">{article.severity}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                </div>
              </div>

              {/* Feed Status */}
              <div className="bg-cti-800 border border-cti-600 rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-4">📊 Feed Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Status</span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-foreground">Operational</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Total Reports</span>
                    <span className="text-foreground font-semibold">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Last Updated</span>
                    <span className="text-foreground text-xs">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </Layout>
  );
}
