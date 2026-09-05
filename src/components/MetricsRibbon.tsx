import React from 'react';
import { Activity, Database, Globe, ShieldAlert } from 'lucide-react';

interface MetricsRibbonProps {
  totalIocs: number;
  maliciousIps: number;
  threatActors: number;
  avgConfidence: number;
}

function MetricCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-base">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
        <span className={accent}>{icon}</span>
      </div>
      <div className={`text-2xl font-semibold font-mono ${accent}`}>{value}</div>
    </div>
  );
}

export default function MetricsRibbon({ totalIocs, maliciousIps, threatActors, avgConfidence }: MetricsRibbonProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        label="Total IOCs Ingested"
        value={String(totalIocs)}
        icon={<Database className="h-4 w-4" />}
        accent="text-cyan-400"
      />
      <MetricCard
        label="Active Malicious IPs"
        value={String(maliciousIps)}
        icon={<Globe className="h-4 w-4" />}
        accent="text-red-500"
      />
      <MetricCard
        label="Known Threat Actors"
        value={String(threatActors)}
        icon={<ShieldAlert className="h-4 w-4" />}
        accent="text-amber-500"
      />
      <MetricCard
        label="Avg Confidence"
        value={`${avgConfidence}%`}
        icon={<Activity className="h-4 w-4" />}
        accent="text-emerald-400"
      />
    </div>
  );
}
