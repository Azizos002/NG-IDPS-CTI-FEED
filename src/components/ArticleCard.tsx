import React from 'react';
import Link from 'next/link';
import { Actuality } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';
import { actorTags, formatTimeAgo, getThreatTypeLabel } from '@/lib/cti-format';

interface ArticleCardProps {
  article: Actuality;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const tags = actorTags(article);

  if (featured) {
    return (
      <Link href={`/actualities/${article.id}`}>
        <article className="group border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-base bg-slate-900/60 backdrop-blur-xl cursor-pointer">
          <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-red-500"></div>
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <SeverityBadge severity={article.severity} />
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-md">
                {getThreatTypeLabel(article.type)}
              </span>
            </div>
            <h2 className="text-heading-lg text-slate-100 group-hover:text-cyan-300 transition-colors mb-3">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                {article.summary}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-mono">
              {article.source && (
                <>
                  <span>{article.source.name || 'Unknown Source'}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatTimeAgo(article.publishedAt || article.createdAt)}</span>
              {article.iocs && article.iocs.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.iocs.length} IOC{article.iocs.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/actualities/${article.id}`}>
      <article className="group border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:bg-slate-900/80 transition-base bg-slate-900/60 backdrop-blur-xl cursor-pointer p-5">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <SeverityBadge severity={article.severity} />
              <span className="text-xs font-mono text-slate-400">
                {getThreatTypeLabel(article.type)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h3>
            {article.summary && (
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                {article.summary}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
              {article.source && (
                <>
                  <span className="font-medium text-slate-400">{article.source.name || 'Source'}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatTimeAgo(article.publishedAt || article.createdAt)}</span>
              {article.iocs && article.iocs.length > 0 && (
                <>
                  <span>•</span>
                  <span>{article.iocs.length} IOC{article.iocs.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-slate-950/70 text-slate-400 font-mono">
                    {tag}
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
