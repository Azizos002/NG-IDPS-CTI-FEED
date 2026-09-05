'use client';

import Layout from '@/components/Layout';
import CommandPageHeader from '@/components/CommandPageHeader';
import SeverityBadge from '@/components/SeverityBadge';
import { CVE_FEED } from '@/data/cti-lab';
import { formatTimeAgo } from '@/lib/cti-format';
import { useMemo, useState } from 'react';

export default function CveFeedPage() {
  const [query, setQuery] = useState('');
  const [exploitedOnly, setExploitedOnly] = useState(false);

  const rows = useMemo(() => {
    return CVE_FEED.filter((cve) => {
      const haystack = `${cve.id} ${cve.product} ${cve.vendor} ${cve.summary}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      const matchesExploit = !exploitedOnly || cve.exploited;
      return matchesQuery && matchesExploit;
    });
  }, [query, exploitedOnly]);

  return (
    <Layout currentPage="/cves">
      <CommandPageHeader
        kicker="Vulnerability Intelligence"
        title="CVE Feed & Vulnerabilities"
        subtitle="Recent high-impact CVEs, CVSS scoring, affected products, and mitigation guidance"
        status="LIVE FEED"
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search CVE ID, vendor, or product..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
          aria-label="Search CVEs"
        />
        <button
          type="button"
          onClick={() => setExploitedOnly((v) => !v)}
          className={`px-4 py-2.5 rounded-lg border text-sm font-mono ${
            exploitedOnly
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          {exploitedOnly ? 'KEV only' : 'All CVEs'}
        </button>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[860px]">
            <thead className="bg-slate-950/80 border-b border-slate-800">
              <tr>
                {['CVE', 'CVSS', 'Severity', 'Product', 'Exploited', 'Published', 'Mitigation'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wider text-slate-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((cve) => (
                <tr key={cve.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-4 font-mono text-cyan-300 text-sm">{cve.id}</td>
                  <td className="px-4 py-4 font-mono text-slate-100">{cve.cvss.toFixed(1)}</td>
                  <td className="px-4 py-4">
                    <SeverityBadge severity={cve.severity} size="sm" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-slate-100">{cve.product}</div>
                    <div className="text-xs text-slate-500 font-mono">{cve.vendor}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        cve.exploited
                          ? 'text-red-400 bg-red-500/10 border-red-500/30'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      }`}
                    >
                      {cve.exploited ? 'IN THE WILD' : 'NO KEV'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-mono text-slate-400">{formatTimeAgo(cve.publishedAt)}</td>
                  <td className="px-4 py-4 text-sm text-slate-400 max-w-xs">{cve.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No CVEs match the current filters.</div>
        ) : null}
      </div>
    </Layout>
  );
}
