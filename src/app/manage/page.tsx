"use client";
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from '@/components/SeverityBadge';
import { Database } from 'lucide-react';

export default function ManagePage() {
  const [actualities, setActualities] = useState<Actuality[]>([]);

  useEffect(() => {
    fetch('/api/v1/actualities')
      .then((r) => r.json())
      .then((d) => setActualities(d.data || []))
      .catch(() => setActualities([]));
  }, []);

  async function publish(id: string) {
    const res = await fetch(`/api/v1/actualities/${id}/publish`, { method: 'POST' });
    if (res.ok) {
      const body = await res.json();
      setActualities((prev) => prev.map((p) => (p.id === id ? body.data : p)));
    } else {
      alert('Failed to publish');
    }
  }

  const getThreatTypeLabel = (type: string) => {
    if (type === 'TECHNICAL_THREAT') return 'Technical Threat';
    if (type === 'AWARENESS') return 'Awareness';
    return type;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout currentPage="/manage">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">
          <Database className="h-3.5 w-3.5" />
          Intelligence Queue
        </div>
        <h1 className="text-heading-lg text-slate-100 mb-2">Manage Intelligence Reports</h1>
        <p className="text-slate-400">Review, publish, and manage threat intelligence content</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden">
        {actualities.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>No actualities found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-slate-950/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {actualities.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`/actualities/${a.id}`}
                        className="text-slate-100 hover:text-cyan-300 transition-colors font-medium line-clamp-1"
                      >
                        {a.title}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{getThreatTypeLabel(a.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={a.severity} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${
                        a.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : a.status === 'DRAFT'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : a.status === 'REVIEW'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 font-mono">{formatDate(a.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/actualities/${a.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-100 text-sm font-medium transition-colors"
                        >
                          View
                        </a>
                        {a.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => publish(a.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-sm font-medium transition-colors"
                          >
                            Publish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
