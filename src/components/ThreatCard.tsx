import React from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';
import { actorTags, formatTimeAgo } from '@/lib/cti-format';

export default function ThreatCard({ a }: { a: Actuality }) {
  const tags = actorTags(a);
  return (
    <article className="border border-slate-800 rounded-xl bg-slate-900/60 backdrop-blur-xl p-4 hover:border-slate-700 transition-base">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <a href={`/actualities/${a.id}`} className="text-lg font-semibold block hover:text-cyan-300">
            {a.title}
          </a>
          <p className="text-sm text-slate-400 mt-1">{a.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={a.severity} />
            <span className="text-xs font-mono text-slate-500">{a.type}</span>
            <span className="text-xs font-mono text-slate-500">{formatTimeAgo(a.publishedAt || a.createdAt)}</span>
          </div>
        </div>
        <div className="text-sm text-amber-400 mt-3 sm:mt-0 sm:text-right font-mono">{tags.join(', ')}</div>
      </div>
    </article>
  );
}
