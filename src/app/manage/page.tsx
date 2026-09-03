"use client";
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Actuality } from '@/models/actuality';

export default function Page() {
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
      alert('Failed');
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Manage Actualities</h2>
      <div className="space-y-3">
        {actualities.map((a) => (
          <div key={a.id} className="flex items-center justify-between bg-white/2 p-3 rounded">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-zinc-400">{a.status} • {a.createdAt}</div>
            </div>
            <div className="flex items-center gap-2">
              <a className="text-sm px-3 py-1 rounded hover:bg-white/5" href={`/actualities/${a.id}`}>View</a>
              {a.status !== 'PUBLISHED' && (
                <button className="px-3 py-1 rounded bg-foreground text-background" onClick={() => publish(a.id)}>Publish</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
