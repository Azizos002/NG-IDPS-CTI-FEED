import React from 'react';

interface SeverityBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  const colorClasses =
    severity === 'CRITICAL'
      ? 'bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)] font-semibold'
      : severity === 'HIGH'
      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 font-semibold'
      : severity === 'MEDIUM'
      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold'
      : severity === 'LOW'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold';

  return (
    <span className={`rounded-md font-mono tracking-wide whitespace-nowrap ${sizeClasses} ${colorClasses}`}>
      {severity}
    </span>
  );
}
