import React from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';

export default function ThreatCard({ a }: { a: Actuality }) {
  return (
    <article className="border border-white/6 rounded bg-white/2 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <a href={`/actualities/${a.id}`} className="text-lg font-semibold block hover:underline">
            {a.title}
          </a>
          <p className="text-sm text-zinc-300 mt-1">{a.summary}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <SeverityBadge severity={a.severity} />
            <span className="text-xs text-zinc-400">{a.type}</span>
            <span className="text-xs text-zinc-400">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : a.createdAt}</span>
          </div>
        </div>
        <div className="text-sm text-zinc-400 mt-3 sm:mt-0 sm:text-right">{a.tags?.slice(0,3).join(', ')}</div>
      </div>
    </article>
  );
}
