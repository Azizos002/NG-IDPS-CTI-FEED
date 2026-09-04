import React from 'react';
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
          <div key={i} className="h-32 rounded-lg bg-cti-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary mb-2">📭</div>
        <p className="text-text-secondary">{emptyMessage}</p>
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
