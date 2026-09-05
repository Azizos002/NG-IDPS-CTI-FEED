'use client';

import Layout from '@/components/Layout';
import CommandPageHeader from '@/components/CommandPageHeader';
import SeverityBadge from '@/components/SeverityBadge';
import { THREAT_ACTORS, type ActorOrigin } from '@/data/cti-lab';
import { Globe, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';

const ORIGINS: Array<ActorOrigin | 'ALL'> = ['ALL', 'RU', 'KP', 'CN', 'IR', 'Unknown'];

export default function ThreatActorsPage() {
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState<ActorOrigin | 'ALL'>('ALL');

  const actors = useMemo(() => {
    return THREAT_ACTORS.filter((actor) => {
      const haystack = [actor.name, actor.originLabel, ...actor.aliases, ...actor.malware, ...actor.sectors]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      const matchesOrigin = origin === 'ALL' || actor.origin === origin;
      return matchesQuery && matchesOrigin;
    });
  }, [query, origin]);

  return (
    <Layout currentPage="/threat-actors">
      <CommandPageHeader
        kicker="Actor Intelligence"
        title="Threat Actors"
        subtitle="Tracked groups, origin, target sectors, and associated malware families"
        status="ACTIVE"
      />

      <div className="mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by actor, alias, malware, or sector..."
          className="w-full mb-3 px-4 py-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
          aria-label="Filter threat actors"
        />
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOrigin(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide border ${
                origin === item
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {actors.map((actor) => (
          <article
            key={actor.id}
            className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-base"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">{actor.name}</h2>
                  <p className="text-[11px] font-mono text-slate-500">{actor.aliases.join(' · ')}</p>
                </div>
              </div>
              <SeverityBadge severity={actor.severity} size="sm" />
            </div>

            <p className="text-sm text-slate-400 mb-4">{actor.summary}</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-xs">{actor.originLabel}</span>
                {actor.active ? (
                  <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                ) : null}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Target sectors</div>
                <div className="flex flex-wrap gap-1.5">
                  {actor.sectors.map((sector) => (
                    <span key={sector} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Associated malware</div>
                <div className="flex flex-wrap gap-1.5">
                  {actor.malware.map((family) => (
                    <span key={family} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {family}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {actor.mitreIds.map((id) => (
                  <span key={id} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {actors.length === 0 ? (
        <div className="mt-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl py-12">
          No actors match the current filters.
        </div>
      ) : null}
    </Layout>
  );
}
