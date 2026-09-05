"use client";
import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { IOC } from '@/models/actuality';
import { iocTypeBadge } from '@/lib/cti-format';

interface IOCCardProps {
  ioc: IOC;
}

export default function IOCCard({ ioc }: IOCCardProps) {
  const [copied, setCopied] = useState(false);
  const badge = iocTypeBadge(ioc.type);

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-700 transition-base">
      <div className="flex-1 min-w-0">
        <div className={`inline-flex text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border mb-2 ${badge.className}`}>
          {badge.label}
        </div>
        <div className="font-mono text-sm break-all text-cyan-300">
          {ioc.value}
        </div>
        {ioc.firstSeen && (
          <div className="text-xs text-slate-500 mt-2 font-mono">
            First seen: {new Date(ioc.firstSeen).toLocaleDateString()}
          </div>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-300 transition-base text-xs font-medium whitespace-nowrap"
      >
        <Copy className="h-3.5 w-3.5" />
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
