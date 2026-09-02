import React from 'react';

export default function SeverityBadge({ severity }: { severity: string }) {
  const cls =
    severity === 'CRITICAL'
      ? 'bg-red-600 text-white'
      : severity === 'HIGH'
      ? 'bg-orange-500 text-white'
      : severity === 'MEDIUM'
      ? 'bg-yellow-400 text-neutral-900'
      : severity === 'LOW'
      ? 'bg-emerald-500 text-white'
      : 'bg-sky-500 text-white';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{severity}</span>;
}
