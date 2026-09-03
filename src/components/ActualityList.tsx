import React from 'react';
import { Actuality } from '@/models/actuality';
import ThreatCard from './ThreatCard';

export default function ActualityList({ items }: { items: Actuality[] }) {
  if (!items || items.length === 0) return <div className="text-zinc-400">No actualities found.</div>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((a) => (
        <ThreatCard key={a.id} a={a} />
      ))}
    </div>
  );
}
