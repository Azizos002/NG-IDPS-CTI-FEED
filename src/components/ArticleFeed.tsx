import React from 'react';
import { Database } from 'lucide-react';
import { Actuality } from '@/models/actuality';
import ArticleCard from './ArticleCard';

interface ArticleFeedProps {
  articles: Actuality[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ArticleFeed({
  articles,
  loading = false,
  emptyMessage = 'No intelligence found.',
}: ArticleFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
        <Database className="h-6 w-6 mx-auto mb-2 text-slate-500" />
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
