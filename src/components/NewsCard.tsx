import { NewsItem } from '@/types/news';
import { ShieldAlert, Newspaper } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const isAttack = item.category === 'CRITICAL_ATTACK';

  return (
    <article className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
            isAttack
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isAttack ? <ShieldAlert className="h-3.5 w-3.5" /> : <Newspaper className="h-3.5 w-3.5" />}
          {isAttack ? '[CRITICAL ATTACK]' : '[AWARENESS]'}
        </span>
        <time className="text-xs font-mono text-slate-500">{formatDate(item.createdAt)}</time>
      </div>

      <h2 className="text-xl font-semibold text-slate-100 mb-2">{item.title}</h2>
      <p className="text-slate-300 mb-3">{item.summary}</p>
      <p className="text-slate-400 text-sm whitespace-pre-wrap mb-4">{item.content}</p>

      {item.iocs.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.iocs.map((ioc) => (
            <span key={ioc} className="font-mono bg-slate-800 text-cyan-400 text-xs px-2.5 py-1 rounded-md">
              {ioc}
            </span>
          ))}
        </div>
      )}

      {item.proposed_suricata_rule ? (
        <div className="rounded-lg border border-cyan-500/20 bg-slate-950/80 p-3">
          <div className="text-[10px] uppercase tracking-wider text-cyan-400 mb-2 font-mono">Proposed Suricata rule</div>
          <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap break-all">{item.proposed_suricata_rule}</pre>
        </div>
      ) : null}
    </article>
  );
}
