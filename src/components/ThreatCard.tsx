import React from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';

export default function ThreatCard({ a }: { a: Actuality }) {
  return (
    <article className="border border-white/6 rounded bg-white/2 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <a href={`/actualities/${a.id}`} className="text-lg font-semibold block hover:underline">
            {a.title}
          </a>
          <p className="text-sm text-zinc-300 mt-1">{a.summary}</p>
          <div className="mt-2 flex items-center gap-2">
            <SeverityBadge severity={a.severity} />
            <span className="text-xs text-zinc-400">{a.type}</span>
            <span className="text-xs text-zinc-400">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : a.createdAt}</span>
          </div>
        </div>
        <div className="text-right text-sm text-zinc-400">{a.tags?.slice(0,3).join(', ')}</div>
      </div>
    </article>
  );
}
