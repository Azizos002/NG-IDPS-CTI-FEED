import React from 'react';

interface CommandPageHeaderProps {
  kicker?: string;
  title: string;
  subtitle: string;
  status?: 'LIVE FEED' | 'ACTIVE' | 'SYNCED';
}

export default function CommandPageHeader({
  kicker,
  title,
  subtitle,
  status = 'ACTIVE',
}: CommandPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        {kicker ? (
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 mb-2">{kicker}</div>
        ) : null}
        <h1 className="text-display text-slate-100 mb-2">{title}</h1>
        <p className="text-slate-400">{subtitle}</p>
      </div>
      <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
        <span className="live-pulse inline-block w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-mono text-emerald-400">{status}</span>
      </div>
    </div>
  );
}
