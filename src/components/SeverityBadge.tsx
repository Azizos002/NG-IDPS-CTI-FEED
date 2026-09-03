import React from 'react';

interface SeverityBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

export default function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  const colorClasses =
    severity === 'CRITICAL'
      ? 'bg-red-600/20 text-red-300 border border-red-600/30 font-semibold'
      : severity === 'HIGH'
      ? 'bg-orange-600/20 text-orange-300 border border-orange-600/30 font-semibold'
      : severity === 'MEDIUM'
      ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30 font-semibold'
      : severity === 'LOW'
      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 font-semibold'
      : 'bg-sky-600/20 text-sky-300 border border-sky-600/30 font-semibold';

  return (
    <span className={`rounded-md font-medium whitespace-nowrap ${sizeClasses} ${colorClasses}`}>
      {severity}
    </span>
  );
}
