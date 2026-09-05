"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Ban, Copy, Send } from 'lucide-react';
import { Actuality, IOC } from '@/models/actuality';
import SeverityBadge from './SeverityBadge';
import { actorTags, confidenceFromSeverity, formatTimeAgo, iocTypeBadge } from '@/lib/cti-format';

interface IocFeedRowProps {
  article: Actuality;
  ioc: IOC;
}

export default function IocFeedRow({ article, ioc }: IocFeedRowProps) {
  const [copied, setCopied] = useState(false);
  const [queued, setQueued] = useState<'block' | 'soar' | null>(null);
  const badge = iocTypeBadge(ioc.type);
  const confidence = confidenceFromSeverity(article.severity);
  const tags = actorTags(article);
  const isIp = ioc.type === 'ip';

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="group bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-base">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${badge.className}`}>
              {badge.label}
            </span>
            <SeverityBadge severity={article.severity} size="sm" />
            <span className="text-[11px] font-mono text-slate-500">{formatTimeAgo(ioc.firstSeen || article.publishedAt || article.createdAt)}</span>
          </div>
          <div className="flex items-start gap-2">
            <code className="font-mono text-sm text-cyan-300 break-all">{ioc.value}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 p-1.5 rounded-md border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700"
              aria-label="Copy indicator"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            {copied ? <span className="text-[11px] text-emerald-400 font-mono">copied</span> : null}
          </div>
          <Link href={`/actualities/${article.id}`} className="mt-2 block text-sm text-slate-300 hover:text-cyan-300 line-clamp-1">
            {article.title}
          </Link>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-44">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>Confidence</span>
            <span className="text-slate-200">{confidence}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${confidence >= 90 ? 'bg-red-500' : confidence >= 75 ? 'bg-amber-500' : 'bg-cyan-400'}`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isIp ? (
            <button
              type="button"
              onClick={() => setQueued('block')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:border-red-400"
            >
              <Ban className="h-3.5 w-3.5" />
              {queued === 'block' ? 'Queued' : 'Block IP'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setQueued('soar')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400"
          >
            <Send className="h-3.5 w-3.5" />
            {queued === 'soar' ? 'Sent' : 'Send to SOAR'}
          </button>
        </div>
      </div>
    </article>
  );
}
