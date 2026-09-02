"use client";
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Actuality } from '@/models/actuality';

export default function Page() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'TECHNICAL_THREAT' | 'AWARENESS'>('TECHNICAL_THREAT');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'>('MEDIUM');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const item: Partial<Actuality> = {
      title,
      summary,
      content,
      type,
      severity,
      status: 'DRAFT',
      tags: [],
      iocs: [],
      references: [],
      createdAt: now,
      createdBy: 'local-user'
    };

    const res = await fetch('/api/v1/actualities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (res.ok) {
      setTitle('');
      setSummary('');
      setContent('');
      alert('Saved as draft via API.');
    } else {
      alert('Failed to save');
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Publish Actuality</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
                    <label className="block text-sm">Title</label>
                    <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>
        <div>
                    <label className="block text-sm">Summary</label>
                    <input value={summary} onChange={(e)=>setSummary(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>
        <div>
                    <label className="block text-sm">Content</label>
                    <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={6} className="w-full rounded bg-white/5 p-2" />
        </div>
        <div className="flex gap-2">
                    <select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setType(e.target.value as 'TECHNICAL_THREAT'|'AWARENESS')} className="rounded bg-white/5 p-2">
                      <option>TECHNICAL_THREAT</option>
                      <option>AWARENESS</option>
          </select>
                    <select value={severity} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setSeverity(e.target.value as 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO')} className="rounded bg-white/5 p-2">
                      <option>CRITICAL</option>
                      <option>HIGH</option>
                      <option>MEDIUM</option>
                      <option>LOW</option>
                      <option>INFO</option>
                    </select>
        </div>
        <div>
                    <button className="px-4 py-2 rounded bg-foreground text-background">Save Draft</button>
        </div>
      </form>
    </Layout>
  );
}
