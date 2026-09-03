"use client";
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from '@/components/SeverityBadge';

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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-lg text-foreground mb-2">Manage Intelligence Reports</h1>
        <p className="text-text-secondary">Review, publish, and manage threat intelligence content</p>
      </div>

      {/* Content Table */}
      <div className="bg-cti-800 border border-cti-600 rounded-lg overflow-hidden">
        {actualities.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <div className="text-4xl mb-3">📭</div>
            <p>No actualities found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cti-900 border-b border-cti-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cti-600">
                {actualities.map((a) => (
                  <tr key={a.id} className="hover:bg-cti-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`/actualities/${a.id}`}
                        className="text-foreground hover:text-blue-400 transition-colors font-medium line-clamp-1"
                      >
                        {a.title}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-secondary">{getThreatTypeLabel(a.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={a.severity} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        a.status === 'PUBLISHED'
                          ? 'bg-green-600/20 text-green-300 border border-green-600/30'
                          : a.status === 'DRAFT'
                          ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30'
                          : a.status === 'REVIEW'
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                          : 'bg-red-600/20 text-red-300 border border-red-600/30'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-tertiary">{formatDate(a.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/actualities/${a.id}`}
                          className="px-3 py-1.5 rounded-lg bg-cti-700 hover:bg-cti-600 text-foreground text-sm font-medium transition-colors"
                        >
                          View
                        </a>
                        {a.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => publish(a.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
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
