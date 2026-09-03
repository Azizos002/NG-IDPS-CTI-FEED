"use client";
import React, { useState } from 'react';
import { IOC } from '@/models/actuality';

interface IOCCardProps {
  ioc: IOC;
}

export default function IOCCard({ ioc }: IOCCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ioc.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIOCTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      ip: 'IP Address',
      domain: 'Domain',
      url: 'URL',
      hash: 'Hash',
      email: 'Email',
      other: 'Indicator',
    };
    return labels[type] || type.toUpperCase();
  };

  const getIOCTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      ip: 'text-blue-400',
      domain: 'text-purple-400',
      url: 'text-cyan-400',
      hash: 'text-orange-400',
      email: 'text-green-400',
      other: 'text-gray-400',
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="bg-cti-800 border border-cti-600 rounded-lg p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-text-tertiary mb-2 uppercase tracking-wide">
          {getIOCTypeLabel(ioc.type)}
        </div>
        <div className={`font-mono text-sm break-all ${getIOCTypeColor(ioc.type)}`}>
          {ioc.value}
        </div>
        {ioc.firstSeen && (
          <div className="text-xs text-text-tertiary mt-2">
            First seen: {new Date(ioc.firstSeen).toLocaleDateString()}
          </div>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 px-3 py-2 rounded bg-cti-700 hover:bg-cti-600 text-text-secondary hover:text-foreground transition-base text-xs font-medium whitespace-nowrap"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}
