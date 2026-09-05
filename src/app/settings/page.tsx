'use client';

import Layout from '@/components/Layout';
import CommandPageHeader from '@/components/CommandPageHeader';
import { FEED_INTEGRATIONS, type FeedIntegration } from '@/data/cti-lab';
import { formatTimeAgo } from '@/lib/cti-format';
import { Database, PlugZap } from 'lucide-react';
import { useMemo, useState } from 'react';

function statusStyles(status: FeedIntegration['status']) {
  if (status === 'connected') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (status === 'degraded') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
  return 'text-red-400 bg-red-500/10 border-red-500/30';
}

export default function SettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(FEED_INTEGRATIONS.map((feed) => [feed.id, feed.status !== 'disconnected']))
  );

  const connectedCount = useMemo(
    () => FEED_INTEGRATIONS.filter((feed) => enabled[feed.id] && feed.status !== 'disconnected').length,
    [enabled]
  );

  return (
    <Layout currentPage="/settings">
      <CommandPageHeader
        kicker="Feed Control"
        title="Feed Settings / Integrations"
        subtitle="Laboratory connectors for VirusTotal, OTX, AbuseIPDB, MISP, and TAXII collections"
        status="SYNCED"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Enabled feeds</div>
          <div className="text-2xl font-mono text-cyan-300">{connectedCount}</div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Catalog size</div>
          <div className="text-2xl font-mono text-slate-100">{FEED_INTEGRATIONS.length}</div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Mode</div>
          <div className="text-2xl font-mono text-emerald-400">LAB</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {FEED_INTEGRATIONS.map((feed) => (
          <article key={feed.id} className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-base">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Database className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">{feed.name}</h2>
                  <p className="text-[11px] font-mono text-slate-500">{feed.category}</p>
                </div>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${statusStyles(feed.status)}`}>
                {feed.status}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{feed.description}</p>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4">
              <span>Last sync {formatTimeAgo(feed.lastSync)}</span>
              <span className="text-cyan-300">{feed.items24h} items / 24h</span>
            </div>
            <button
              type="button"
              onClick={() => setEnabled((prev) => ({ ...prev, [feed.id]: !prev[feed.id] }))}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                enabled[feed.id]
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <PlugZap className="h-3.5 w-3.5" />
              {enabled[feed.id] ? 'Enabled' : 'Disabled'}
            </button>
          </article>
        ))}
      </div>
    </Layout>
  );
}
