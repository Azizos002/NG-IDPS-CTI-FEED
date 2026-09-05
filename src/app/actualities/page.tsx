'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import ArticleFeed from '@/components/ArticleFeed';
import CategoryNav from '@/components/CategoryNav';
import MetricsRibbon from '@/components/MetricsRibbon';
import IocFeedRow from '@/components/IocFeedRow';
import { Actuality } from '@/models/actuality';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';
import { collectMetrics, flattenIocs } from '@/lib/cti-format';

type FeedScope = 'all' | 'ip' | 'hash' | 'url' | 'mitre';

export default function ActualitiesPage() {
  const router = useRouter();

  const [q, setQ] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [items, setItems] = useState<Actuality[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [feedScope, setFeedScope] = useState<FeedScope>('all');
  const pageSize = 12;

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

  const scopedItems = useMemo(() => {
    if (feedScope === 'all') return items;
    if (feedScope === 'ip') return items.filter((a) => a.iocs?.some((i) => i.type === 'ip'));
    if (feedScope === 'hash') return items.filter((a) => a.iocs?.some((i) => i.type === 'hash'));
    if (feedScope === 'url') {
      return items.filter(
        (a) =>
          a.iocs?.some((i) => i.type === 'url' || i.type === 'domain') ||
          a.tags?.some((t) => /phish/i.test(t))
      );
    }
    return items.filter((a) => a.tags?.some((t) => /t\d{4}|mitre|attack/i.test(t)));
  }, [items, feedScope]);

  const visible = useMemo(() => scopedItems.slice(0, page * pageSize), [scopedItems, page]);
  const iocRows = useMemo(() => flattenIocs(visible), [visible]);
  const metrics = useMemo(() => collectMetrics(items), [items]);

  function clearFilter(name?: string) {
    if (!name) {
      setQ('');
      setType('');
      setSeverity('');
      setFeedScope('all');
    } else {
      if (name === 'q') setQ('');
      if (name === 'type') setType('');
      if (name === 'severity') setSeverity('');
    }
  }

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && scopedItems.length > visible.length) {
            setPage((p) => p + 1);
          }
        });
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, scopedItems.length, visible.length]);

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

  const pills: { id: FeedScope; label: string }[] = [
    { id: 'all', label: 'All Feeds' },
    { id: 'ip', label: 'IP Reputation' },
    { id: 'hash', label: 'Malware Hashes' },
    { id: 'url', label: 'Phishing URLs' },
    { id: 'mitre', label: 'MITRE ATT&CK Mapping' },
  ];

  return (
    <Layout currentPage="/actualities">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-display text-slate-100 mb-2">Cyber Threat Intelligence Feed (CTI)</h1>
          <p className="text-lg text-slate-400">Live IOC ingest, actor mapping, and analyst actions</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
          <span className="live-pulse inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-emerald-400">LIVE FEED / SYNCED</span>
        </div>
      </div>

      <div className="mb-6">
        <MetricsRibbon
          totalIocs={metrics.totalIocs}
          maliciousIps={metrics.maliciousIps}
          threatActors={metrics.threatActors}
          avgConfidence={metrics.avgConfidence}
        />
      </div>

      <div className="mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              aria-label="Search actualities"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-base font-mono text-sm"
              placeholder="Search by IP, Hash, Domain, or CVE..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {(q || type || severity || feedScope !== 'all') && (
            <button
              onClick={() => clearFilter()}
              className="px-4 py-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-base font-medium"
            >
              Clear
            </button>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {pills.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFeedScope(pill.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide border transition-base ${
                feedScope === pill.id
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <CategoryNav
          categories={categoryOptions}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {type === 'TECHNICAL_THREAT' && (
          <span className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-400">
            Type: Technical Threat
            <button onClick={() => setType('')} className="text-slate-500 hover:text-slate-100">✕</button>
          </span>
        )}
        {type === 'AWARENESS' && (
          <span className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-400">
            Type: Awareness
            <button onClick={() => setType('')} className="text-slate-500 hover:text-slate-100">✕</button>
          </span>
        )}
        {q && (
          <span className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-400 font-mono">
            Search: {q}
            <button onClick={() => setQ('')} className="text-slate-500 hover:text-slate-100">✕</button>
          </span>
        )}
        {items.length > 0 && (
          <span className="inline-flex items-center px-3 py-1 text-sm text-slate-500 font-mono">
            {scopedItems.length} result{scopedItems.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {iocRows.length > 0 && (
            <div className="space-y-3">
              {iocRows.map(({ article, ioc }, idx) => (
                <IocFeedRow key={`${article.id}-${ioc.value}-${idx}`} article={article} ioc={ioc} />
              ))}
            </div>
          )}
          <ArticleFeed
            articles={iocRows.length > 0 ? visible.filter((a) => !a.iocs?.length) : visible}
            loading={loading}
            emptyMessage={items.length === 0 && !loading ? 'No intelligence found. Try adjusting your filters.' : ''}
          />
          <div ref={sentinelRef}></div>
          {loading && items.length > 0 && (
            <div className="mt-8 text-center text-slate-400">
              <div className="inline-block">
                <div className="w-6 h-6 border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
              <p className="mt-2 font-mono text-xs">Loading more intelligence...</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-slate-100 mb-4 font-mono text-sm tracking-wide">Trending Intelligence</h3>
                <div className="space-y-3">
                  {items.slice(0, 5).map((article, idx) => (
                    <a key={article.id} href={`/actualities/${article.id}`} className="block group">
                      <div className="flex gap-2">
                        <div className="text-xs font-mono text-cyan-400 mt-0.5">{idx + 1}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 font-mono">{article.severity}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-slate-100 mb-4 font-mono text-sm tracking-wide">Feed Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="flex items-center gap-2">
                      <span className="live-pulse w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="text-emerald-400 font-mono text-xs">SYNCED</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Reports</span>
                    <span className="text-slate-100 font-semibold font-mono">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-slate-300 text-xs font-mono">{new Date().toLocaleTimeString()}</span>
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
