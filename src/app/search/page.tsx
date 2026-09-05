'use client';

import Layout from '@/components/Layout';
import CommandPageHeader from '@/components/CommandPageHeader';
import { IOC_REPUTATION, lookupIoc, type IocReputationRecord, type IocVerdict } from '@/data/cti-lab';
import { formatTimeAgo } from '@/lib/cti-format';
import { Copy, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';

function verdictStyles(verdict: IocVerdict) {
  if (verdict === 'malicious') return 'text-red-400 bg-red-500/10 border-red-500/30';
  if (verdict === 'suspicious') return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
  if (verdict === 'clean') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
}

function AnalyzerInner() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => lookupIoc(submitted), [submitted]);

  function runSearch(value: string) {
    setSubmitted(value.trim());
  }

  function copyValue(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Layout currentPage="/search">
      <CommandPageHeader
        kicker="IOC Analyzer"
        title="IOC Search & Analyzer"
        subtitle="Look up laboratory IPs, hashes, domains, URLs, and CVE identifiers against the demo reputation set"
        status="ACTIVE"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="mb-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 203.0.113.45, phish.example, CVE-2024-3400..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono text-sm"
              aria-label="IOC search"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-medium"
          >
            Analyze
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {IOC_REPUTATION.slice(0, 4).map((sample) => (
            <button
              key={sample.value}
              type="button"
              onClick={() => {
                setQuery(sample.value);
                runSearch(sample.value);
              }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700"
            >
              {sample.value}
            </button>
          ))}
        </div>
      </form>

      {submitted ? (
        result ? (
          <ReputationCard record={result} copied={copied} onCopy={() => copyValue(result.value)} />
        ) : (
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-300 font-medium mb-1">No reputation hit</p>
            <p className="text-sm text-slate-500 font-mono">Unknown indicator: {submitted}</p>
            <p className="text-sm text-slate-500 mt-2">This laboratory catalog only contains demonstration IOCs listed below.</p>
          </div>
        )
      ) : (
        <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400">
          Submit an indicator to generate a mock reputation report.
        </div>
      )}

      <h2 className="mt-10 mb-4 text-heading-sm text-slate-100">Catalogued laboratory IOCs</h2>
      <div className="space-y-3">
        {IOC_REPUTATION.map((row) => (
          <button
            key={row.value}
            type="button"
            onClick={() => {
              setQuery(row.value);
              runSearch(row.value);
            }}
            className="w-full text-left bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-slate-700"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-slate-700 text-slate-400">
                {row.type}
              </span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${verdictStyles(row.verdict)}`}>
                {row.verdict}
              </span>
            </div>
            <div className="font-mono text-sm text-cyan-300 break-all">{row.value}</div>
          </button>
        ))}
      </div>
    </Layout>
  );
}

function ReputationCard({
  record,
  copied,
  onCopy,
}: {
  record: IocReputationRecord;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-slate-700 text-slate-400">
              {record.type}
            </span>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${verdictStyles(record.verdict)}`}>
              {record.verdict}
            </span>
          </div>
          <div className="font-mono text-lg text-cyan-300 break-all">{record.value}</div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-cyan-300 text-xs"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Stat label="Confidence" value={`${record.confidence}%`} />
        <Stat label="First seen" value={formatTimeAgo(record.firstSeen)} />
        <Stat label="Actor" value={record.actor || 'n/a'} />
        <Stat label="Malware" value={record.malware || 'n/a'} />
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-5">
        <div
          className={`h-full ${record.confidence >= 90 ? 'bg-red-500' : record.confidence >= 75 ? 'bg-amber-500' : 'bg-cyan-400'}`}
          style={{ width: `${record.confidence}%` }}
        />
      </div>

      <p className="text-sm text-slate-400 mb-4">{record.notes}</p>
      <div className="flex flex-wrap gap-2">
        {record.sources.map((source) => (
          <span key={source} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
            {source}
          </span>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-mono text-slate-100">{value}</div>
    </div>
  );
}

export default function IocSearchPage() {
  return (
    <Suspense
      fallback={
        <Layout currentPage="/search">
          <div className="h-40 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        </Layout>
      }
    >
      <AnalyzerInner />
    </Suspense>
  );
}
