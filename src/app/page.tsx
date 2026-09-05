'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Newspaper, Plus } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';

export default function Home() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('/api/v1/articles')
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        setItems(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (mounted) setError('Unable to load the local CTI database.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-cyan-400" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-100">NG-IDPS Security Portal</h1>
          </div>
          <Link
            href="/publish"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add News
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        {items.length === 0 && !error ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl text-slate-400">
            No news yet. Publish the first item from Add News.
          </div>
        ) : (
          items.map((item) => <NewsCard key={item.id} item={item} />)
        )}
      </main>
    </div>
  );
}
