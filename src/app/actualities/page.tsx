'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import ActualityList from '@/components/ActualityList';
import { Actuality } from '@/models/actuality';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [q, setQ] = useState<string>(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') ?? '' : ''));
  const [type, setType] = useState<string>(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('type') ?? '' : ''));
  const [severity, setSeverity] = useState<string>(() => (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('severity') ?? '' : ''));
  const [items, setItems] = useState<Actuality[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // fetch when filters change
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
        // update URL (replace to avoid history spam)
        const url = new URL(window.location.href);
        if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
        if (type) url.searchParams.set('type', type); else url.searchParams.delete('type');
        if (severity) url.searchParams.set('severity', severity); else url.searchParams.delete('severity');
        router.replace(url.pathname + url.search);
      } catch (err) {
        console.error('Failed to fetch actualities', err);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [q, type, severity, router]);

  const visible = useMemo(() => items.slice(0, page * pageSize), [items, page]);

  function clearFilter(name?: string) {
    if (!name) {
      setQ(''); setType(''); setSeverity('');
    } else {
      if (name === 'q') setQ('');
      if (name === 'type') setType('');
      if (name === 'severity') setSeverity('');
    }
  }

  // infinite scroll sentinel
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
  }, [loading, items, visible.length]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Actualities</h2>

      <div className="mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            aria-label="Search actualities"
            className="flex-1 px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
            placeholder="Search title or content..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select className="px-3 py-2 rounded bg-zinc-900 border border-zinc-700" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="TECHNICAL_THREAT">Technical threat</option>
            <option value="AWARENESS">Awareness</option>
          </select>

          <select className="px-3 py-2 rounded bg-zinc-900 border border-zinc-700" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">All severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>

          <button className="px-3 py-2 rounded bg-zinc-800 border border-zinc-600" onClick={() => clearFilter()}>Clear</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {q ? (
            <span className="text-sm px-2 py-1 rounded bg-white/5">Search: {q} <button aria-label="clear q" className="ml-2 text-xs" onClick={() => clearFilter('q')}>✕</button></span>
          ) : null}
          {type ? (
            <span className="text-sm px-2 py-1 rounded bg-white/5">Type: {type} <button aria-label="clear type" className="ml-2 text-xs" onClick={() => clearFilter('type')}>✕</button></span>
          ) : null}
          {severity ? (
            <span className="text-sm px-2 py-1 rounded bg-white/5">Severity: {severity} <button aria-label="clear severity" className="ml-2 text-xs" onClick={() => clearFilter('severity')}>✕</button></span>
          ) : null}
        </div>
      </div>

      {loading && items.length === 0 ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <ActualityList items={visible} />
      )}

      <div ref={sentinelRef}></div>

      {loading && items.length > 0 && (
        <div className="mt-4 text-center text-zinc-400">Loading more...</div>
      )}

    </Layout>
  );
}
