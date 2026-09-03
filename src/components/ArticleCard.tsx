import React from 'react';
import Link from 'next/link';
import { Actuality } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';

interface ArticleCardProps {
  article: Actuality;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getThreatTypeLabel = (type: string) => {
    if (type === 'TECHNICAL_THREAT') return 'Technical Threat';
    if (type === 'AWARENESS') return 'Awareness';
    return type;
  };

  if (featured) {
    return (
      <Link href={`/actualities/${article.id}`}>
        <article className="group border border-cti-600 rounded-lg overflow-hidden hover:border-blue-500/50 transition-base bg-cti-800 cursor-pointer">
          {/* Visual accent bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

          <div className="p-8">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SeverityBadge severity={article.severity} />
              <span className="text-xs font-medium text-text-secondary bg-cti-700 px-3 py-1 rounded">
                {getThreatTypeLabel(article.type)}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-heading-lg text-foreground group-hover:text-blue-400 transition-colors mb-3">
              {article.title}
            </h2>

            {/* Summary */}
            {article.summary && (
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                {article.summary}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
              {article.source && (
                <>
                  <span>{article.source.name || 'Unknown Source'}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              {article.iocs && article.iocs.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.iocs.length} IOC{article.iocs.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-cti-700 text-text-secondary">
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded text-text-tertiary">
                    +{article.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  // Standard article card (non-featured)
  return (
    <Link href={`/actualities/${article.id}`}>
      <article className="group border border-cti-600 rounded-lg overflow-hidden hover:border-blue-500/50 hover:bg-cti-700/50 transition-base bg-cti-900 cursor-pointer p-5">
        <div className="flex gap-4">
          {/* Left: Content */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <SeverityBadge severity={article.severity} />
              <span className="text-xs font-medium text-text-secondary">
                {getThreatTypeLabel(article.type)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>

            {/* Summary */}
            {article.summary && (
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {article.summary}
              </p>
            )}

            {/* Footer metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
              {article.source && (
                <>
                  <span className="font-medium text-text-secondary">{article.source.name || 'Source'}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              {article.iocs && article.iocs.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.iocs.length} IOC{article.iocs.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {article.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-cti-800 text-text-tertiary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
